from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dateutil import tz

MAX_DRIVING_HOURS = 11
MAX_14_HOUR_WINDOW = 14
MIN_OFF_DUTY_HOURS = 10
MAX_CYCLE_HOURS = 70
REQUIRED_BREAK_MINUTES = 30
BREAK_REQUIRED_AFTER_HOURS = 8
PICKUP_DROPOFF_DURATION_HOURS = 1


def parse_datetime(dt_str: str) -> datetime:
    try:
        dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=tz.UTC)
        return dt
    except Exception:
        return datetime.now(tz.UTC)


def format_datetime(dt: datetime) -> str:
    return dt.isoformat().replace('+00:00', 'Z')


def calculate_eld_entries(route_data: Dict, current_cycle_used: float, start_time_str: str) -> List[Dict]:
    start_time = parse_datetime(start_time_str)
    current_time = start_time
    
    log_entries = []
    fuel_stops = route_data.get("fuel_stops", [])
    segments = route_data.get("segments", [])
    
    driving_hours_today = 0
    window_start_time = current_time
    cycle_used = current_cycle_used
    last_break_time = None
    cumulative_distance = 0
    fuel_stop_index = 0
    
    for seg_idx, segment in enumerate(segments):
        segment_distance = segment["distance_miles"]
        segment_driving_time = segment["driving_time_hours"]
        segment_start_location = segment.get("from", "")
        segment_end_location = segment.get("to", "")
        
        segment_start_time = current_time
        segment_distance_remaining = segment_distance
        segment_time_remaining = segment_driving_time
        
        while segment_time_remaining > 0:
            hours_since_window_start = (current_time - window_start_time).total_seconds() / 3600
            hours_since_last_break = None
            if last_break_time:
                hours_since_last_break = (current_time - last_break_time).total_seconds() / 3600
            
            needs_30min_break = (driving_hours_today >= BREAK_REQUIRED_AFTER_HOURS and 
                                (hours_since_last_break is None or 
                                 (driving_hours_today - (hours_since_last_break or 0)) >= BREAK_REQUIRED_AFTER_HOURS))
            
            needs_10hr_rest = False
            rest_reason = None
            
            if hours_since_window_start >= MAX_14_HOUR_WINDOW:
                needs_10hr_rest = True
                rest_reason = "14-hour window exceeded"
            elif driving_hours_today >= MAX_DRIVING_HOURS:
                needs_10hr_rest = True
                rest_reason = "11-hour driving limit reached"
            
            if cycle_used >= MAX_CYCLE_HOURS:
                log_entries.append({
                    "start_time": format_datetime(current_time),
                    "end_time": format_datetime(current_time),
                    "duty_status": "on_duty_not_driving",
                    "location": segment_end_location if seg_idx == len(segments) - 1 else segment_start_location,
                    "miles": 0,
                    "reason": "70-hour cycle limit reached - cannot continue"
                })
                return log_entries
            
            if needs_10hr_rest:
                rest_duration = MIN_OFF_DUTY_HOURS
                rest_distance_ratio = 1 - (segment_distance_remaining / segment_distance) if segment_distance > 0 else 0
                
                rest_coords = None
                geometry = segment.get("geometry")
                if geometry and "coordinates" in geometry:
                    from .route_calculator import get_point_along_geometry
                    point = get_point_along_geometry(geometry, rest_distance_ratio)
                    if point:
                        rest_coords = {"lon": point[0], "lat": point[1]}
                
                if not rest_coords:
                    coords = segment.get("coordinates", [])
                    if len(coords) == 2:
                        lon = coords[0][0] + rest_distance_ratio * (coords[1][0] - coords[0][0])
                        lat = coords[0][1] + rest_distance_ratio * (coords[1][1] - coords[0][1])
                        rest_coords = {"lon": lon, "lat": lat}
                
                log_entries.append({
                    "start_time": format_datetime(current_time),
                    "end_time": format_datetime(current_time + timedelta(hours=rest_duration)),
                    "duty_status": "off_duty",
                    "location": segment_start_location if segment_distance_remaining == segment_distance else 
                               f"{segment_start_location} to {segment_end_location}",
                    "miles": 0,
                    "reason": rest_reason,
                    "coordinates": rest_coords
                })
                current_time += timedelta(hours=rest_duration)
                driving_hours_today = 0
                window_start_time = current_time
                last_break_time = None
                continue
            
            if needs_30min_break and driving_hours_today >= BREAK_REQUIRED_AFTER_HOURS:
                break_duration = REQUIRED_BREAK_MINUTES / 60
                break_distance_ratio = 1 - (segment_distance_remaining / segment_distance) if segment_distance > 0 else 0
                
                break_coords = None
                geometry = segment.get("geometry")
                if geometry and "coordinates" in geometry:
                    from .route_calculator import get_point_along_geometry
                    point = get_point_along_geometry(geometry, break_distance_ratio)
                    if point:
                        break_coords = {"lon": point[0], "lat": point[1]}
                
                if not break_coords:
                    coords = segment.get("coordinates", [])
                    if len(coords) == 2:
                        lon = coords[0][0] + break_distance_ratio * (coords[1][0] - coords[0][0])
                        lat = coords[0][1] + break_distance_ratio * (coords[1][1] - coords[0][1])
                        break_coords = {"lon": lon, "lat": lat}
                
                log_entries.append({
                    "start_time": format_datetime(current_time),
                    "end_time": format_datetime(current_time + timedelta(hours=break_duration)),
                    "duty_status": "off_duty",
                    "location": segment_start_location if segment_distance_remaining == segment_distance else
                               f"{segment_start_location} to {segment_end_location}",
                    "miles": 0,
                    "reason": "30-minute break required",
                    "coordinates": break_coords
                })
                current_time += timedelta(hours=break_duration)
                last_break_time = current_time
                continue
            
            while (fuel_stop_index < len(fuel_stops) and 
                   fuel_stops[fuel_stop_index]["mile_marker"] <= cumulative_distance + segment_distance_remaining):
                fuel_stop = fuel_stops[fuel_stop_index]
                stop_mile = fuel_stop["mile_marker"]
                distance_to_stop = stop_mile - cumulative_distance
                
                if 0 < distance_to_stop <= segment_distance_remaining:
                    time_to_stop = (distance_to_stop / segment_distance) * segment_time_remaining if segment_distance > 0 else 0
                    
                    if time_to_stop > 0:
                        log_entries.append({
                            "start_time": format_datetime(current_time),
                            "end_time": format_datetime(current_time + timedelta(hours=time_to_stop)),
                            "duty_status": "driving",
                            "location": segment_start_location if distance_to_stop < segment_distance else segment_end_location,
                            "miles": distance_to_stop,
                            "reason": None
                        })
                        driving_hours_today += time_to_stop
                        cycle_used += time_to_stop
                        current_time += timedelta(hours=time_to_stop)
                        segment_distance_remaining -= distance_to_stop
                        segment_time_remaining -= time_to_stop
                        cumulative_distance += distance_to_stop
                    
                    fuel_stop_duration = 0.5
                    log_entries.append({
                        "start_time": format_datetime(current_time),
                        "end_time": format_datetime(current_time + timedelta(hours=fuel_stop_duration)),
                        "duty_status": "on_duty_not_driving",
                        "location": f"Fuel Stop at {stop_mile:.0f} miles",
                        "miles": 0,
                        "reason": "Fueling"
                    })
                    cycle_used += fuel_stop_duration
                    current_time += timedelta(hours=fuel_stop_duration)
                
                fuel_stop_index += 1
            
            if segment_time_remaining > 0:
                segment_entry = {
                    "start_time": format_datetime(current_time),
                    "end_time": format_datetime(current_time + timedelta(hours=segment_time_remaining)),
                    "duty_status": "driving",
                    "location": segment_end_location,
                    "miles": segment_distance_remaining,
                    "reason": None
                }
                log_entries.append(segment_entry)
                driving_hours_today += segment_time_remaining
                cycle_used += segment_time_remaining
                current_time += timedelta(hours=segment_time_remaining)
                cumulative_distance += segment_distance_remaining
                segment_time_remaining = 0
                segment_distance_remaining = 0
        
        if seg_idx == 0:
            pickup_location = segment_end_location
            log_entries.append({
                "start_time": format_datetime(current_time),
                "end_time": format_datetime(current_time + timedelta(hours=PICKUP_DROPOFF_DURATION_HOURS)),
                "duty_status": "on_duty_not_driving",
                "location": pickup_location,
                "miles": 0,
                "reason": "Pickup"
            })
            cycle_used += PICKUP_DROPOFF_DURATION_HOURS
            current_time += timedelta(hours=PICKUP_DROPOFF_DURATION_HOURS)
        
        elif seg_idx == len(segments) - 1:
            dropoff_location = segment_end_location
            log_entries.append({
                "start_time": format_datetime(current_time),
                "end_time": format_datetime(current_time + timedelta(hours=PICKUP_DROPOFF_DURATION_HOURS)),
                "duty_status": "on_duty_not_driving",
                "location": dropoff_location,
                "miles": 0,
                "reason": "Dropoff"
            })
            cycle_used += PICKUP_DROPOFF_DURATION_HOURS
            current_time += timedelta(hours=PICKUP_DROPOFF_DURATION_HOURS)
    
    return log_entries


def check_hos_compliance(driving_hours: float, window_hours: float, cycle_used: float) -> Dict:
    violations = []
    
    if driving_hours > MAX_DRIVING_HOURS:
        violations.append("Exceeds 11-hour driving limit")
    if window_hours > MAX_14_HOUR_WINDOW:
        violations.append("Exceeds 14-hour driving window")
    if cycle_used > MAX_CYCLE_HOURS:
        violations.append("Exceeds 70-hour/8-day cycle limit")
    
    return {
        "compliant": len(violations) == 0,
        "violations": violations,
        "remaining_driving_hours": max(0, MAX_DRIVING_HOURS - driving_hours),
        "remaining_window_hours": max(0, MAX_14_HOUR_WINDOW - window_hours),
        "remaining_cycle_hours": max(0, MAX_CYCLE_HOURS - cycle_used)
    }


def calculate_required_rest(driving_hours: float, window_hours: float, cycle_used: float) -> Optional[Dict]:
    if driving_hours >= MAX_DRIVING_HOURS or window_hours >= MAX_14_HOUR_WINDOW:
        return {
            "type": "off_duty",
            "duration_hours": MIN_OFF_DUTY_HOURS,
            "reason": "Required 10-hour rest period"
        }
    
    if driving_hours >= BREAK_REQUIRED_AFTER_HOURS:
        return {
            "type": "off_duty",
            "duration_hours": REQUIRED_BREAK_MINUTES / 60,
            "reason": "Required 30-minute break"
        }
    
    return None

