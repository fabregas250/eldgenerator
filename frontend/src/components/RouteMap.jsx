import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import './RouteMap.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function FitBounds({ bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds && bounds.length === 2) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, bounds])
  return null
}

function RouteMapComponent({ mapData, stops, route }) {
  const waypoints = useMemo(() => {
    if (!mapData?.waypoints) return []
    
    return mapData.waypoints.map(wp => {
      if (Array.isArray(wp)) {
        return [wp[1] || wp[0], wp[0] || wp[1]] // Convert [lon, lat] to [lat, lon] for Leaflet
      }
      return [wp.lat || wp[1], wp.lng || wp.lon || wp[0]]
    }).filter(wp => wp[0] && wp[1])
  }, [mapData])

  const routePolylines = useMemo(() => {
    if (!mapData?.polylines) return []
    
    return mapData.polylines
      .filter(polyline => polyline && polyline.coordinates)
      .map(polyline => {
        const coords = polyline.coordinates.map(coord => {
          if (Array.isArray(coord)) {
            return [coord[1] || coord[0], coord[0] || coord[1]]
          }
          return [coord.lat || coord[1], coord.lng || coord.lon || coord[0]]
        })
        return coords
      })
  }, [mapData])

  const bounds = useMemo(() => {
    const allPoints = [...waypoints]
    
    if (stops) {
      stops.forEach(stop => {
        if (stop.location) {
          const lat = stop.location.lat || stop.location[1]
          const lng = stop.location.lon || stop.location.lng || stop.location[0]
          if (lat && lng) {
            allPoints.push([lat, lng])
          }
        }
      })
    }

    routePolylines.forEach(polyline => {
      allPoints.push(...polyline)
    })

    if (allPoints.length === 0) return null

    const lats = allPoints.map(p => p[0]).filter(lat => !isNaN(lat))
    const lngs = allPoints.map(p => p[1]).filter(lng => !isNaN(lng))

    if (lats.length === 0 || lngs.length === 0) return null

    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ]
  }, [waypoints, stops, routePolylines])

  const getMarkerIcon = (type) => {
    const iconColors = {
      start: { color: '#10b981', size: [25, 41] },
      pickup: { color: '#3b82f6', size: [25, 41] },
      dropoff: { color: '#8b5cf6', size: [25, 41] },
      fuel: { color: '#f59e0b', size: [25, 41] },
      rest: { color: '#ef4444', size: [25, 41] }
    }

    const config = iconColors[type] || { color: '#6b7280', size: [25, 41] }

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${config.color}; width: ${config.size[0]}px; height: ${config.size[1]}px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: config.size,
      iconAnchor: [config.size[0] / 2, config.size[1] / 2]
    })
  }

  const getStopTypeLabel = (type) => {
    const labels = {
      fuel: '⛽ Fuel Stop',
      rest: '🛑 Rest Stop',
      start: '📍 Start',
      pickup: '📦 Pickup',
      dropoff: '📥 Dropoff'
    }
    return labels[type] || `📍 ${type}`
  }

  const mapCenter = waypoints.length > 0 
    ? waypoints[0] 
    : [20, 0]

  return (
    <div className="route-map-container">
      <div className="route-map-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          className="route-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {bounds && <FitBounds bounds={bounds} />}

          {routePolylines.map((polyline, idx) => (
            <Polyline
              key={`route-${idx}`}
              positions={polyline}
              color="#6366f1"
              weight={5}
              opacity={0.8}
            />
          ))}

          {mapData?.markers?.map((marker, idx) => {
            if (!marker.location) return null
            
            const location = marker.location
            const lat = Array.isArray(location) ? (location[1] || location[0]) : location.lat
            const lng = Array.isArray(location) ? (location[0] || location[1]) : location.lng
            
            if (!lat || !lng) return null

            return (
              <Marker
                key={`marker-${idx}`}
                position={[lat, lng]}
                icon={getMarkerIcon(marker.type)}
              >
                <Popup>
                  <div className="marker-popup">
                    <strong>{marker.label || getStopTypeLabel(marker.type)}</strong>
                    <div className="marker-coords">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {stops?.map((stop, idx) => {
            if (!stop.location) return null
            const lat = stop.location.lat || stop.location[1]
            const lng = stop.location.lon || stop.location.lng || stop.location[0]
            if (!lat || !lng) return null

            const stopTime = stop.time ? new Date(stop.time).toLocaleTimeString() : ''
            const stopDuration = stop.duration ? `${stop.duration.toFixed(1)}h` : ''

            return (
              <Marker
                key={`stop-${idx}`}
                position={[lat, lng]}
                icon={getMarkerIcon(stop.type)}
              >
                <Popup>
                  <div className="marker-popup">
                    <strong>{getStopTypeLabel(stop.type)}</strong>
                    {stop.reason && <div className="marker-reason">{stop.reason}</div>}
                    {stopTime && <div className="marker-time">Time: {stopTime}</div>}
                    {stopDuration && <div className="marker-duration">Duration: {stopDuration}</div>}
                    <div className="marker-coords">{lat.toFixed(4)}, {lng.toFixed(4)}</div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      <div className="route-info-panel">
        <div className="route-summary-card">
          <h3>Route Summary</h3>
          {route && (
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Distance</span>
                <span className="stat-value">{route.total_distance?.toFixed(1) || '0'} mi</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Driving Time</span>
                <span className="stat-value">{route.total_driving_time?.toFixed(1) || '0'}h</span>
              </div>
            </div>
          )}
        </div>

        {waypoints.length >= 2 && (
          <div className="waypoints-card">
            <h3>Route Points</h3>
            <div className="waypoints-list">
              <div className="waypoint-item">
                <span className="waypoint-icon">📍</span>
                <span className="waypoint-label">Start</span>
                <span className="waypoint-coords">
                  {waypoints[0][0]?.toFixed(4)}, {waypoints[0][1]?.toFixed(4)}
                </span>
              </div>
              {waypoints.length > 1 && (
                <div className="waypoint-item">
                  <span className="waypoint-icon">📦</span>
                  <span className="waypoint-label">Pickup</span>
                  <span className="waypoint-coords">
                    {waypoints[1][0]?.toFixed(4)}, {waypoints[1][1]?.toFixed(4)}
                  </span>
                </div>
              )}
              {waypoints.length > 2 && (
                <div className="waypoint-item">
                  <span className="waypoint-icon">📥</span>
                  <span className="waypoint-label">Dropoff</span>
                  <span className="waypoint-coords">
                    {waypoints[waypoints.length - 1][0]?.toFixed(4)}, {waypoints[waypoints.length - 1][1]?.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {stops && stops.length > 0 && (
          <div className="stops-card">
            <h3>Stops & Rest Points</h3>
            <div className="stops-list">
              {stops.map((stop, idx) => {
                if (!stop.location) return null
                const lat = stop.location.lat || stop.location[1]
                const lng = stop.location.lon || stop.location.lng || stop.location[0]
                if (!lat || !lng) return null

                const stopTime = stop.time ? new Date(stop.time).toLocaleTimeString() : ''
                return (
                  <div key={idx} className="stop-item">
                    <span className="stop-icon">
                      {stop.type === 'fuel' ? '⛽' : stop.type === 'rest' ? '🛑' : '📍'}
                    </span>
                    <div className="stop-details">
                      <span className="stop-label">{getStopTypeLabel(stop.type)}</span>
                      {stop.reason && <span className="stop-reason">{stop.reason}</span>}
                      {stopTime && <span className="stop-time">{stopTime}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RouteMapComponent

