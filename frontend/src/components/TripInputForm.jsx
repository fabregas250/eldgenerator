import React, { useState, useEffect } from 'react'
import TripMapPicker from './TripMapPicker'
import './TripInputForm.css'

function TripInputForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: '',
    start_time: new Date().toISOString().slice(0, 16)
  })

  const [currentLocationCoords, setCurrentLocationCoords] = useState(null)
  const [pickupCoords, setPickupCoords] = useState(null)
  const [dropoffCoords, setDropoffCoords] = useState(null)
  const [activeMap, setActiveMap] = useState(null)
  const [errors, setErrors] = useState({})
  const [gettingLocation, setGettingLocation] = useState(false)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors({ current_location: 'Geolocation is not supported by your browser' })
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocationCoords({ lat: latitude, lng: longitude })
        
        try {
          const address = await reverseGeocode(latitude, longitude)
          setFormData(prev => ({
            ...prev,
            current_location: address
          }))
        } catch {
          setFormData(prev => ({
            ...prev,
            current_location: `${longitude.toFixed(6)}, ${latitude.toFixed(6)}`
          }))
        }
        setGettingLocation(false)
        setErrors(prev => ({ ...prev, current_location: '' }))
      },
      () => {
        setErrors({ current_location: 'Unable to retrieve your location. Please allow location access or enter manually.' })
        setGettingLocation(false)
      }
    )
  }

  const reverseGeocode = async (lat, lng) => {
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return `${lng.toFixed(6)}, ${lat.toFixed(6)}`
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'ELD-Log-Generator/1.0'
          }
        }
      )
      const data = await response.json()
      
      if (data.address) {
        const parts = []
        if (data.address.road) parts.push(data.address.road)
        if (data.address.city || data.address.town || data.address.village) {
          parts.push(data.address.city || data.address.town || data.address.village)
        }
        if (data.address.state) parts.push(data.address.state)
        if (data.address.postcode) parts.push(data.address.postcode)
        
        return parts.join(', ') || data.display_name || `${lng.toFixed(6)}, ${lat.toFixed(6)}`
      }
      return `${lng.toFixed(6)}, ${lat.toFixed(6)}`
    } catch {
      return `${lng.toFixed(6)}, ${lat.toFixed(6)}`
    }
  }

  const handleMapClick = async (field, lat, lng) => {
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setErrors(prev => ({
        ...prev,
        [field === 'pickup' ? 'pickup_location' : 'dropoff_location']: 'Invalid coordinates. Please click on a valid location on the map.'
      }))
      return
    }

    const address = await reverseGeocode(lat, lng)
    
    if (field === 'pickup') {
      setPickupCoords([lat, lng])
      setFormData(prev => ({ ...prev, pickup_location: address }))
      setErrors(prev => ({ ...prev, pickup_location: '' }))
    } else if (field === 'dropoff') {
      setDropoffCoords([lat, lng])
      setFormData(prev => ({ ...prev, dropoff_location: address }))
      setErrors(prev => ({ ...prev, dropoff_location: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.current_location.trim()) {
      newErrors.current_location = 'Current location is required'
    }
    if (!formData.pickup_location.trim()) {
      newErrors.pickup_location = 'Pickup location is required'
    }
    if (!formData.dropoff_location.trim()) {
      newErrors.dropoff_location = 'Dropoff location is required'
    }
    if (formData.current_cycle_used === '' || isNaN(formData.current_cycle_used)) {
      newErrors.current_cycle_used = 'Current cycle used must be a number'
    } else {
      const cycleUsed = parseFloat(formData.current_cycle_used)
      if (cycleUsed < 0 || cycleUsed > 70) {
        newErrors.current_cycle_used = 'Current cycle used must be between 0 and 70 hours'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const submitData = {
      ...formData,
      current_cycle_used: parseFloat(formData.current_cycle_used),
      start_time: new Date(formData.start_time).toISOString()
    }

    onSubmit(submitData)
  }

  return (
    <div className="trip-input-form-container">
      <form onSubmit={handleSubmit} className="trip-input-form">
        <div className="form-header">
          <h2>Enter Trip Information</h2>
          <p className="form-subtitle">Fill in the details below to generate your ELD logs</p>
        </div>
        
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="current_location" className="form-label">
              <span>
                Current Location <span className="required">*</span>
              </span>
              <button 
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="btn-icon"
              >
                {gettingLocation ? (
                  <>
                    <span className="spinner"></span>
                    Getting...
                  </>
                ) : (
                  <>
                    <span>📍</span>
                    Get My Location
                  </>
                )}
              </button>
            </label>
            <input
              type="text"
              id="current_location"
              name="current_location"
              value={formData.current_location}
              onChange={handleChange}
              placeholder="e.g., New York, NY or Click 'Get My Location'"
              className={`form-input ${errors.current_location ? 'error' : ''}`}
              readOnly={!!currentLocationCoords}
            />
            {errors.current_location && (
              <span className="error-message">{errors.current_location}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="pickup_location" className="form-label">
              <span>
                Pickup Location <span className="required">*</span>
              </span>
              <button 
                type="button"
                onClick={() => setActiveMap(activeMap === 'pickup' ? null : 'pickup')}
                className="btn-icon"
              >
                {activeMap === 'pickup' ? (
                  <>
                    <span>✖️</span>
                    Close Map
                  </>
                ) : (
                  <>
                    <span>🗺️</span>
                    Pick on Map
                  </>
                )}
              </button>
            </label>
            {activeMap === 'pickup' && (
              <div className="map-picker-wrapper">
                <TripMapPicker
                  center={pickupCoords ? { lat: pickupCoords[0] || pickupCoords.lat, lng: pickupCoords[1] || pickupCoords.lng } : null}
                  onLocationSelect={(lat, lng) => {
                    handleMapClick('pickup', lat, lng)
                    setActiveMap(null)
                  }}
                  label="pickup location"
                />
              </div>
            )}
            <input
              type="text"
              id="pickup_location"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="e.g., Philadelphia, PA or Click 'Pick on Map'"
              className={`form-input ${errors.pickup_location ? 'error' : ''}`}
            />
            {errors.pickup_location && (
              <span className="error-message">{errors.pickup_location}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dropoff_location" className="form-label">
              <span>
                Dropoff Location <span className="required">*</span>
              </span>
              <button 
                type="button"
                onClick={() => setActiveMap(activeMap === 'dropoff' ? null : 'dropoff')}
                className="btn-icon"
              >
                {activeMap === 'dropoff' ? (
                  <>
                    <span>✖️</span>
                    Close Map
                  </>
                ) : (
                  <>
                    <span>🗺️</span>
                    Pick on Map
                  </>
                )}
              </button>
            </label>
            {activeMap === 'dropoff' && (
              <div className="map-picker-wrapper">
                <TripMapPicker
                  center={dropoffCoords ? { lat: dropoffCoords[0] || dropoffCoords.lat, lng: dropoffCoords[1] || dropoffCoords.lng } : null}
                  onLocationSelect={(lat, lng) => {
                    handleMapClick('dropoff', lat, lng)
                    setActiveMap(null)
                  }}
                  label="dropoff location"
                />
              </div>
            )}
            <input
              type="text"
              id="dropoff_location"
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              placeholder="e.g., Washington, DC or Click 'Pick on Map'"
              className={`form-input ${errors.dropoff_location ? 'error' : ''}`}
            />
            {errors.dropoff_location && (
              <span className="error-message">{errors.dropoff_location}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="current_cycle_used" className="form-label">
                Current Cycle Used (Hours) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="current_cycle_used"
                name="current_cycle_used"
                value={formData.current_cycle_used}
                onChange={handleChange}
                min="0"
                max="70"
                step="0.1"
                placeholder="0.0"
                className={`form-input ${errors.current_cycle_used ? 'error' : ''}`}
              />
              {errors.current_cycle_used && (
                <span className="error-message">{errors.current_cycle_used}</span>
              )}
              <small className="help-text">Hours used in the current 70-hour/8-day cycle (0-70)</small>
            </div>

            <div className="form-group">
              <label htmlFor="start_time" className="form-label">
                Trip Start Time
              </label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Calculating Route...
            </>
          ) : (
            <>
              <span>🚀</span>
              Calculate Route & Generate Logs
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default TripInputForm
