import requests
import math
import time
import re
from typing import List, Dict, Tuple, Optional

OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving"
AVERAGE_SPEED_MPH = 60
FUEL_STOP_INTERVAL_MILES = 1000


def parse_coordinates(address: str) -> Optional[Tuple[float, float]]:
    coords_pattern = r'(-?\d+\.?\d*),\s*(-?\d+\.?\d*)'
    match = re.search(coords_pattern, address)
    if match:
        try:
            val1 = float(match.group(1))
            val2 = float(match.group(2))
            
            if -90 <= val1 <= 90 and -180 <= val2 <= 180:
                return (val2, val1)
            elif -180 <= val1 <= 180 and -90 <= val2 <= 90:
                return (val1, val2)
            elif abs(val1) <= 180 and abs(val2) <= 90:
                if abs(val1) > abs(val2):
                    return (val1, val2)
                else:
                    return (val2, val1)
        except ValueError:
            pass
    return None


def geocode_address(address: str) -> Optional[Tuple[float, float]]:
    if not address or not address.strip():
        return None
    
    coords = parse_coordinates(address)
    if coords:
        lon, lat = coords
        if -180 <= lon <= 180 and -90 <= lat <= 90:
            return coords
        else:
            return None
    
    try:
        time.sleep(1)
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                "q": address.strip(),
                "format": "json",
                "limit": 1,
                "addressdetails": 0
            },
            headers={
                "User-Agent": "ELD-Log-Generator/1.0",
                "Accept-Language": "en"
            },
            timeout=15
        )
        response.raise_for_status()
        data = response.json()
        if data and len(data) > 0:
            lon = float(data[0]["lon"])
            lat = float(data[0]["lat"])
            return (lon, lat)
    except requests.exceptions.RequestException as e:
        pass
    except (ValueError, KeyError, IndexError):
        pass
    except Exception:
        pass
    return None


def calculate_distance_haversine(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    R = 3959
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c


def get_route_from_osrm(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> Optional[Dict]:
    try:
        url = f"{OSRM_BASE_URL}/{coord1[0]},{coord1[1]};{coord2[0]},{coord2[1]}"
        params = {"overview": "full", "geometries": "geojson", "steps": "true"}
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        if data.get("code") == "Ok" and data.get("routes"):
            return data["routes"][0]
    except Exception:
        pass
    return None


def estimate_driving_time(distance_miles: float) -> float:
    return distance_miles / AVERAGE_SPEED_MPH


def calculate_route(current: str, pickup: str, dropoff: str) -> Dict:
    current_coords = geocode_address(current)
    pickup_coords = geocode_address(pickup)
    dropoff_coords = geocode_address(dropoff)

    failed_addresses = []
    if not current_coords:
        failed_addresses.append(f"Current location: '{current}'")
    if not pickup_coords:
        failed_addresses.append(f"Pickup location: '{pickup}'")
    if not dropoff_coords:
        failed_addresses.append(f"Dropoff location: '{dropoff}'")
    
    if failed_addresses:
        error_msg = "Unable to geocode the following addresses:\n" + "\n".join(failed_addresses)
        error_msg += "\n\nPlease try:\n- Using more specific addresses (include city and state)\n- Using coordinates in format 'longitude, latitude'\n- Checking spelling"
        raise ValueError(error_msg)

    segments = []
    total_distance = 0
    waypoints = [current_coords]
    polylines = []

    leg1_route = get_route_from_osrm(current_coords, pickup_coords)
    if leg1_route:
        distance_km = leg1_route.get("distance", 0) / 1000
        distance_miles = distance_km * 0.621371
        total_distance += distance_miles
        segments.append({
            "from": current,
            "to": pickup,
            "distance_miles": distance_miles,
            "driving_time_hours": estimate_driving_time(distance_miles),
            "coordinates": [current_coords, pickup_coords],
            "geometry": leg1_route.get("geometry", {})
        })
        polylines.append(leg1_route.get("geometry", {}))
        waypoints.append(pickup_coords)
    else:
        distance_miles = calculate_distance_haversine(
            current_coords[0], current_coords[1],
            pickup_coords[0], pickup_coords[1]
        )
        total_distance += distance_miles
        segments.append({
            "from": current,
            "to": pickup,
            "distance_miles": distance_miles,
            "driving_time_hours": estimate_driving_time(distance_miles),
            "coordinates": [current_coords, pickup_coords],
            "geometry": None
        })
        waypoints.append(pickup_coords)

    leg2_route = get_route_from_osrm(pickup_coords, dropoff_coords)
    if leg2_route:
        distance_km = leg2_route.get("distance", 0) / 1000
        distance_miles = distance_km * 0.621371
        total_distance += distance_miles
        segments.append({
            "from": pickup,
            "to": dropoff,
            "distance_miles": distance_miles,
            "driving_time_hours": estimate_driving_time(distance_miles),
            "coordinates": [pickup_coords, dropoff_coords],
            "geometry": leg2_route.get("geometry", {})
        })
        polylines.append(leg2_route.get("geometry", {}))
        waypoints.append(dropoff_coords)
    else:
        distance_miles = calculate_distance_haversine(
            pickup_coords[0], pickup_coords[1],
            dropoff_coords[0], dropoff_coords[1]
        )
        total_distance += distance_miles
        segments.append({
            "from": pickup,
            "to": dropoff,
            "distance_miles": distance_miles,
            "driving_time_hours": estimate_driving_time(distance_miles),
            "coordinates": [pickup_coords, dropoff_coords],
            "geometry": None
        })
        waypoints.append(dropoff_coords)

    fuel_stops = calculate_fuel_stops(segments)

    return {
        "segments": segments,
        "total_distance_miles": total_distance,
        "total_driving_time_hours": estimate_driving_time(total_distance),
        "waypoints": waypoints,
        "polylines": polylines,
        "fuel_stops": fuel_stops
    }


def get_point_along_geometry(geometry: Dict, ratio: float) -> Optional[Tuple[float, float]]:
    """Get a point along the route geometry at the given ratio (0.0 to 1.0)."""
    if not geometry or "coordinates" not in geometry:
        return None
    
    coords = geometry["coordinates"]
    if not coords or len(coords) < 2:
        return None
    
    total_distance = 0
    segment_distances = []
    
    for i in range(len(coords) - 1):
        lon1, lat1 = coords[i]
        lon2, lat2 = coords[i + 1]
        dist = calculate_distance_haversine(lon1, lat1, lon2, lat2)
        segment_distances.append(dist)
        total_distance += dist
    
    if total_distance == 0:
        return None
    
    target_distance = total_distance * ratio
    current_distance = 0
    
    for i, seg_dist in enumerate(segment_distances):
        if current_distance + seg_dist >= target_distance:
            seg_ratio = (target_distance - current_distance) / seg_dist if seg_dist > 0 else 0
            lon1, lat1 = coords[i]
            lon2, lat2 = coords[i + 1]
            lon = lon1 + seg_ratio * (lon2 - lon1)
            lat = lat1 + seg_ratio * (lat2 - lat1)
            return (lon, lat)
        current_distance += seg_dist
    
    return tuple(coords[-1])


def calculate_fuel_stops(segments: List[Dict]) -> List[Dict]:
    fuel_stops = []
    cumulative_distance = 0

    for seg_idx, segment in enumerate(segments):
        segment_distance = segment["distance_miles"]
        segment_start_distance = cumulative_distance
        cumulative_distance += segment_distance

        stops_needed = math.floor(cumulative_distance / FUEL_STOP_INTERVAL_MILES) - math.floor(segment_start_distance / FUEL_STOP_INTERVAL_MILES)

        for i in range(stops_needed):
            stop_mile = (math.floor(cumulative_distance / FUEL_STOP_INTERVAL_MILES)) * FUEL_STOP_INTERVAL_MILES
            distance_into_segment = stop_mile - segment_start_distance

            if 0 < distance_into_segment <= segment_distance:
                ratio = distance_into_segment / segment_distance if segment_distance > 0 else 0
                
                geometry = segment.get("geometry")
                if geometry and "coordinates" in geometry:
                    point = get_point_along_geometry(geometry, ratio)
                    if point:
                        lon, lat = point
                        fuel_stops.append({
                            "location": {"lon": lon, "lat": lat},
                            "mile_marker": stop_mile,
                            "segment_index": seg_idx
                        })
                        continue
                
                coords = segment["coordinates"]
                if len(coords) == 2:
                    lon = coords[0][0] + ratio * (coords[1][0] - coords[0][0])
                    lat = coords[0][1] + ratio * (coords[1][1] - coords[0][1])
                    fuel_stops.append({
                        "location": {"lon": lon, "lat": lat},
                        "mile_marker": stop_mile,
                        "segment_index": seg_idx
                    })

    return fuel_stops

