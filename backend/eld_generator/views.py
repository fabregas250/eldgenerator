from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from datetime import datetime
from dateutil import tz
import json

from .serializers import TripRequestSerializer
from .services.route_calculator import calculate_route
from .services.eld_calculator import calculate_eld_entries
from .services.log_generator import generate_daily_logs


@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
@csrf_exempt
def calculate_route_view(request):
    # Handle CORS preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = Response(status=status.HTTP_200_OK)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept'
        response['Access-Control-Max-Age'] = '86400'
        return response
    
    serializer = TripRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {"error": "Invalid input", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    data = serializer.validated_data
    
    current_location = data["current_location"]
    pickup_location = data["pickup_location"]
    dropoff_location = data["dropoff_location"]
    current_cycle_used = data["current_cycle_used"]
    
    start_time_str = data.get("start_time")
    if not start_time_str:
        start_time = datetime.now(tz.UTC)
    else:
        try:
            start_time = datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=tz.UTC)
        except Exception:
            start_time = datetime.now(tz.UTC)
    
    start_time_str = start_time.isoformat().replace('+00:00', 'Z')
    
    try:
        route_data = calculate_route(current_location, pickup_location, dropoff_location)
        
        log_entries = calculate_eld_entries(
            route_data,
            current_cycle_used,
            start_time_str
        )
        
        daily_logs = generate_daily_logs(
            log_entries,
            current_location,
            pickup_location,
            dropoff_location
        )
        
        stops = []
        
        for entry in log_entries:
            if entry.get("reason"):
                stop_type = "rest" if "rest" in entry.get("reason", "").lower() or "break" in entry.get("reason", "").lower() else "other"
                if stop_type == "rest" or entry.get("duty_status") == "off_duty":
                    entry_coords = None
                    
                    if "coordinates" in entry and entry["coordinates"]:
                        entry_coords = entry["coordinates"]
                    elif "location" in entry:
                        location_str = entry["location"]
                        try:
                            from .services.route_calculator import geocode_address
                            geocode_attempt = geocode_address(location_str)
                            if geocode_attempt:
                                entry_coords = {"lon": geocode_attempt[0], "lat": geocode_attempt[1]}
                        except Exception:
                            pass
                    
                    if entry_coords:
                        stops.append({
                            "type": stop_type,
                            "location": entry_coords,
                            "time": entry["start_time"],
                            "duration": (datetime.fromisoformat(entry["end_time"].replace('Z', '+00:00')) - 
                                       datetime.fromisoformat(entry["start_time"].replace('Z', '+00:00'))).total_seconds() / 3600,
                            "duty_status": entry["duty_status"],
                            "reason": entry.get("reason", "")
                        })
        
        for fuel_stop in route_data.get("fuel_stops", []):
            fuel_entry = None
            for entry in log_entries:
                if "Fuel" in entry.get("location", "") and str(int(fuel_stop["mile_marker"])) in entry.get("location", ""):
                    fuel_entry = entry
                    break
            
            if fuel_entry:
                stops.append({
                    "type": "fuel",
                    "location": fuel_stop["location"],
                    "time": fuel_entry["start_time"],
                    "duration": (datetime.fromisoformat(fuel_entry["end_time"].replace('Z', '+00:00')) - 
                               datetime.fromisoformat(fuel_entry["start_time"].replace('Z', '+00:00'))).total_seconds() / 3600,
                    "duty_status": "on_duty_not_driving",
                    "reason": "Fueling"
                })
        
        route_segments = []
        for segment in route_data.get("segments", []):
            route_segments.append({
                "from": segment.get("from", ""),
                "to": segment.get("to", ""),
                "distance_miles": round(segment.get("distance_miles", 0), 2),
                "driving_time_hours": round(segment.get("driving_time_hours", 0), 2),
                "coordinates": segment.get("coordinates", [])
            })
        
        response_data = {
            "route": {
                "total_distance": round(route_data.get("total_distance_miles", 0), 2),
                "total_driving_time": round(route_data.get("total_driving_time_hours", 0), 2),
                "segments": route_segments
            },
            "stops": stops,
            "log_entries": log_entries,
            "daily_logs": daily_logs,
            "map_data": {
                "waypoints": route_data.get("waypoints", []),
                "polylines": route_data.get("polylines", []),
                "markers": [
                    {
                        "type": "start",
                        "location": route_data["waypoints"][0] if route_data.get("waypoints") else None,
                        "label": "Current Location"
                    },
                    {
                        "type": "pickup",
                        "location": route_data["waypoints"][1] if len(route_data.get("waypoints", [])) > 1 else None,
                        "label": "Pickup"
                    },
                    {
                        "type": "dropoff",
                        "location": route_data["waypoints"][-1] if route_data.get("waypoints") else None,
                        "label": "Dropoff"
                    }
                ] + [
                    {
                        "type": stop["type"],
                        "location": stop["location"],
                        "label": stop.get("reason", stop["type"]).title()
                    }
                    for stop in stops
                ]
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    except ValueError as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": "An error occurred processing your request", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

