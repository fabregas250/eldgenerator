import React, { useState, useEffect } from 'react'
import RouteMapComponent from './RouteMap'
import LogSheetViewer from './LogSheetViewer'
import './MultiStepForm.css'

const steps = [
  { id: 1, title: 'Trip Details', icon: '📍' },
  { id: 2, title: 'Route Map', icon: '🗺️' },
  { id: 3, title: 'Log Sheets', icon: '📋' },
]

function MultiStepForm({ onSubmit, routeData, loading, error }) {
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (routeData && currentStep === 1) {
      setCurrentStep(2)
    }
  }, [routeData, currentStep])

  const canGoNext = () => {
    if (currentStep === 1) return !!routeData
    if (currentStep === 2) return !!routeData
    return false
  }

  const canGoBack = () => {
    return currentStep > 1
  }

  const handleNext = () => {
    if (canGoNext() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (canGoBack()) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSelectedStop(null)
  }

  return (
    <div className="multi-step-container">
      <div className="steps-indicator">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`step-item ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              onClick={() => {
                if (step.id === 1 || (step.id === 2 && routeData) || (step.id === 3 && routeData)) {
                  setCurrentStep(step.id)
                }
              }}
            >
              <div className="step-icon">
                {currentStep > step.id ? '✓' : step.icon}
              </div>
              <div className="step-title">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-connector ${currentStep > step.id ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="step-content">
        {currentStep === 1 && (
          <div className="step-panel">
            {onSubmit}
          </div>
        )}

        {currentStep === 2 && routeData && (
          <div className="step-panel map-panel">
            <div className="panel-header">
              <h2>Route Overview</h2>
              {routeData.route && (
                <div className="route-summary">
                  <div className="summary-item">
                    <span className="summary-label">Total Distance:</span>
                    <span className="summary-value">{routeData.route.total_distance.toFixed(1)} mi</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Driving Time:</span>
                    <span className="summary-value">{routeData.route.total_driving_time.toFixed(1)}h</span>
                  </div>
                </div>
              )}
            </div>
            <div className="map-container">
              <RouteMapComponent
                mapData={routeData.map_data}
                stops={routeData.stops}
                route={routeData.route}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && routeData && (
          <div className="step-panel">
            <LogSheetViewer dailyLogs={routeData.daily_logs} />
          </div>
        )}

        {error && currentStep === 1 && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="step-actions">
        {canGoBack() && (
          <button className="btn btn-secondary" onClick={handleBack}>
            ← Back
          </button>
        )}
        <div className="step-actions-right">
          {currentStep === 1 && (
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          )}
          {canGoNext() && currentStep < steps.length && (
            <button className="btn btn-primary" onClick={handleNext}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MultiStepForm

