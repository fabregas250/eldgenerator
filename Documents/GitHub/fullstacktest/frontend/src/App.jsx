import React, { useState } from 'react'
import TripInputForm from './components/TripInputForm'
import MultiStepForm from './components/MultiStepForm'
import { calculateRoute } from './services/api'
import './App.css'

function App() {
  const [routeData, setRouteData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleRouteCalculation = async (formData) => {
    setLoading(true)
    setError(null)
    setRouteData(null)

    try {
      const data = await calculateRoute(formData)
      setRouteData(data)
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>ELD Log Generator</h1>
          <p>Calculate routes and generate ELD-compliant daily log sheets</p>
        </div>
      </header>
      
      <main className="app-main">
        <MultiStepForm 
          onSubmit={<TripInputForm onSubmit={handleRouteCalculation} loading={loading} />}
          routeData={routeData}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  )
}

export default App
