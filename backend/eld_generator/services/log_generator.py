from datetime import datetime, timedelta
from typing import List, Dict
from dateutil import tz
from .eld_calculator import parse_datetime, format_datetime

MAX_CYCLE_HOURS = 70
CYCLE_DAYS = 8


def group_entries_by_day(log_entries: List[Dict]) -> Dict[str, List[Dict]]:
    entries_by_day = {}
    
    for entry in log_entries:
        start_time = parse_datetime(entry["start_time"])
        day_key = start_time.date().isoformat()
        
        if day_key not in entries_by_day:
            entries_by_day[day_key] = []
        
        entries_by_day[day_key].append(entry)
        
        end_time = parse_datetime(entry["end_time"])
        end_day_key = end_time.date().isoformat()
        
        if end_day_key != day_key:
            split_entry = entry.copy()
            split_entry["start_time"] = format_datetime(end_time.replace(hour=0, minute=0, second=0, microsecond=0))
            split_entry["miles"] = 0
            
            if end_day_key not in entries_by_day:
                entries_by_day[end_day_key] = []
            entries_by_day[end_day_key].append(split_entry)
    
    return entries_by_day


def calculate_daily_totals(entries_for_day: List[Dict]) -> Dict[str, float]:
    totals = {
        "off_duty": 0,
        "sleeper_berth": 0,
        "driving": 0,
        "on_duty_not_driving": 0,
        "total_miles": 0
    }
    
    for entry in entries_for_day:
        status = entry.get("duty_status", "")
        
        start_time = parse_datetime(entry["start_time"])
        end_time = parse_datetime(entry["end_time"])
        duration = (end_time - start_time).total_seconds() / 3600
        
        if status == "off_duty":
            totals["off_duty"] += duration
        elif status == "sleeper_berth":
            totals["sleeper_berth"] += duration
        elif status == "driving":
            totals["driving"] += duration
            totals["total_miles"] += entry.get("miles", 0)
        elif status == "on_duty_not_driving":
            totals["on_duty_not_driving"] += duration
    
    totals["total_on_duty"] = totals["driving"] + totals["on_duty_not_driving"]
    totals["total_hours"] = totals["off_duty"] + totals["sleeper_berth"] + totals["driving"] + totals["on_duty_not_driving"]
    
    return totals


def calculate_recap(all_entries: List[Dict], current_date_str: str) -> Dict:
    current_date = datetime.fromisoformat(current_date_str).date()
    cutoff_date_7 = current_date - timedelta(days=7)
    cutoff_date_5 = current_date - timedelta(days=4)
    
    total_last_7_days = 0
    total_last_5_days = 0
    
    for entry in all_entries:
        entry_date = parse_datetime(entry["start_time"]).date()
        
        if entry_date >= cutoff_date_7:
            start_time = parse_datetime(entry["start_time"])
            end_time = parse_datetime(entry["end_time"])
            duration = (end_time - start_time).total_seconds() / 3600
            
            status = entry.get("duty_status", "")
            if status in ["driving", "on_duty_not_driving"]:
                total_last_7_days += duration
        
        if entry_date >= cutoff_date_5:
            start_time = parse_datetime(entry["start_time"])
            end_time = parse_datetime(entry["end_time"])
            duration = (end_time - start_time).total_seconds() / 3600
            
            status = entry.get("duty_status", "")
            if status in ["driving", "on_duty_not_driving"]:
                total_last_5_days += duration
    
    return {
        "total_on_duty_last_7_days": round(total_last_7_days, 2),
        "total_on_duty_last_5_days": round(total_last_5_days, 2),
        "hours_available_tomorrow_70hr": max(0, MAX_CYCLE_HOURS - total_last_7_days),
        "hours_available_tomorrow_60hr": max(0, 60 - total_last_7_days)
    }


def generate_daily_logs(log_entries: List[Dict], current_location: str, pickup_location: str, 
                        dropoff_location: str) -> List[Dict]:
    if not log_entries:
        return []
    
    entries_by_day = group_entries_by_day(log_entries)
    daily_logs = []
    
    sorted_days = sorted(entries_by_day.keys())
    
    for day_key in sorted_days:
        day_entries = entries_by_day[day_key]
        day_date = datetime.fromisoformat(day_key).date()
        
        first_entry = day_entries[0]
        last_entry = day_entries[-1]
        
        from_location = first_entry.get("location", current_location)
        to_location = last_entry.get("location", dropoff_location)
        
        totals = calculate_daily_totals(day_entries)
        recap = calculate_recap(log_entries, day_key)
        
        sorted_entries = sorted(day_entries, key=lambda x: parse_datetime(x["start_time"]))
        
        daily_log = {
            "date": day_key,
            "from": from_location,
            "to": to_location,
            "total_miles_driving": round(totals["total_miles"], 1),
            "total_mileage": round(totals["total_miles"], 1),
            "entries": sorted_entries,
            "totals": {
                "off_duty": round(totals["off_duty"], 2),
                "sleeper_berth": round(totals["sleeper_berth"], 2),
                "driving": round(totals["driving"], 2),
                "on_duty_not_driving": round(totals["on_duty_not_driving"], 2),
                "total_on_duty": round(totals["total_on_duty"], 2),
                "total_hours": round(totals["total_hours"], 2)
            },
            "recap": recap
        }
        
        daily_logs.append(daily_log)
    
    return daily_logs

