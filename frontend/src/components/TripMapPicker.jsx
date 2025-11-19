import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import './TripMapPicker.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function LocationPickerMap({ onLocationSelect, selectedLocation }) {
  const [position, setPosition] = useState(selectedLocation || [20, 0])

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setPosition([lat, lng])
        onLocationSelect(lat, lng)
      }
    },
  })

  useEffect(() => {
    if (selectedLocation) {
      setPosition(selectedLocation)
    }
  }, [selectedLocation])

  return position ? <Marker position={position} /> : null
}

function TripMapPicker({ center, onLocationSelect, label }) {
  const [markerPosition, setMarkerPosition] = useState(
    center ? [center.lat, center.lng] : [20, 0]
  )

  const handleMapClick = (lat, lng) => {
    setMarkerPosition([lat, lng])
    if (onLocationSelect) {
      onLocationSelect(lat, lng)
    }
  }

  const handleCoordinatesChange = (e) => {
    const input = e.target.value.trim()
    const coordsMatch = input.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/)
    
    if (coordsMatch) {
      const val1 = parseFloat(coordsMatch[1])
      const val2 = parseFloat(coordsMatch[2])
      
      let lat, lng
      
      if (-90 <= val2 && val2 <= 90 && -180 <= val1 && val1 <= 180) {
        lng = val1
        lat = val2
      } else if (-180 <= val1 && val1 <= 180 && -90 <= val2 && val2 <= 90) {
        lng = val1
        lat = val2
      } else if (Math.abs(val1) <= 180 && Math.abs(val2) <= 90) {
        if (Math.abs(val1) > Math.abs(val2)) {
          lng = val1
          lat = val2
        } else {
          lng = val2
          lat = val1
        }
      } else {
        return
      }
      
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const newPosition = [lat, lng]
        setMarkerPosition(newPosition)
        if (onLocationSelect) {
          onLocationSelect(lat, lng)
        }
      }
    }
  }

  return (
    <div className="map-picker-container">
      <div className="leaflet-picker-wrapper">
        <MapContainer
          center={markerPosition}
          zoom={markerPosition[0] === 20 && markerPosition[1] === 0 ? 2 : 6}
          style={{ height: '300px', width: '100%' }}
          minZoom={1}
          maxZoom={18}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPickerMap
            onLocationSelect={handleMapClick}
            selectedLocation={markerPosition}
          />
        </MapContainer>
      </div>
      <div className="map-picker-controls">
        <div className="coordinates-input-group">
          <label>Or enter coordinates manually:</label>
          <input
            type="text"
            placeholder="Longitude, Latitude (e.g., -74.0060, 40.7128)"
            onChange={handleCoordinatesChange}
            className="coordinates-input"
          />
        </div>
        <small className="map-help-text">
          Click on the map to select {label}, or enter coordinates manually
        </small>
      </div>
    </div>
  )
}

export default TripMapPicker
