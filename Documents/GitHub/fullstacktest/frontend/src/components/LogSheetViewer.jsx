import React, { useState } from 'react'
import LogSheetPDF from './LogSheetPDF'
import './LogSheetViewer.css'
import { formatDate, getHourOfDay, getMinutesOfDay, formatTime } from '../utils/dateUtils'

function LogSheetGrid({ entries, date }) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const getStatusForHour = (hour, minute = 0) => {
    const targetMinutes = hour * 60 + minute
    
    for (const entry of entries) {
      const startDate = new Date(entry.start_time)
      const endDate = new Date(entry.end_time)
      const entryDate = new Date(date)
      
      if (startDate.toDateString() !== entryDate.toDateString() && 
          endDate.toDateString() !== entryDate.toDateString()) {
        continue
      }
      
      const startMinutes = startDate.toDateString() === entryDate.toDateString() 
        ? getMinutesOfDay(entry.start_time)
        : 0
      
      const endMinutes = endDate.toDateString() === entryDate.toDateString()
        ? getMinutesOfDay(entry.end_time)
        : 1440
      
      if (targetMinutes >= startMinutes && targetMinutes < endMinutes) {
        return entry.duty_status
      }
    }
    
    return null
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'driving':
        return '#ef4444'
      case 'on_duty_not_driving':
        return '#f59e0b'
      case 'off_duty':
        return '#10b981'
      case 'sleeper_berth':
        return '#3b82f6'
      default:
        return '#e5e7eb'
    }
  }

  const renderGridRow = (statusType) => {
    return (
      <div key={statusType} className="grid-row">
        <div className="grid-row-label">
          {statusType === 'off_duty' && '1. Off Duty'}
          {statusType === 'sleeper_berth' && '2. Sleeper Berth'}
          {statusType === 'driving' && '3. Driving'}
          {statusType === 'on_duty_not_driving' && '4. On Duty (not driving)'}
        </div>
        <div className="grid-row-content">
          {hours.map((hour) => (
            <div key={hour} className="hour-column">
              {Array.from({ length: 4 }, (_, i) => {
                const minute = i * 15
                const currentStatus = getStatusForHour(hour, minute)
                const isActive = currentStatus === statusType
                
                return (
                  <div
                    key={`${hour}-${minute}`}
                    className="time-cell"
                    style={{
                      backgroundColor: isActive ? getStatusColor(statusType) : '#ffffff',
                      borderRight: minute === 45 ? '1px solid #333' : '1px solid #e5e7eb'
                    }}
                    title={`${hour}:${minute.toString().padStart(2, '0')} - ${currentStatus || 'N/A'}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="log-sheet-grid">
      <div className="grid-header">
        <div className="grid-header-label"></div>
        <div className="grid-header-hours">
          {hours.map((hour) => (
            <div key={hour} className="hour-label">
              {hour === 0 ? 'Mid' : hour === 12 ? 'Noon' : hour > 12 ? hour - 12 : hour}
            </div>
          ))}
          <div className="hour-label">Total</div>
        </div>
      </div>
      {['off_duty', 'sleeper_berth', 'driving', 'on_duty_not_driving'].map(renderGridRow)}
    </div>
  )
}

function LogSheetViewer({ dailyLogs }) {
  const [selectedLogIndex, setSelectedLogIndex] = useState(0)

  if (!dailyLogs || dailyLogs.length === 0) {
    return null
  }

  const currentLog = dailyLogs[selectedLogIndex]

  return (
    <div className="log-sheet-viewer-container">
      <h2>Daily Log Sheets</h2>
      
      {dailyLogs.length > 1 && (
        <div className="log-sheet-tabs">
          {dailyLogs.map((log, index) => (
            <button
              key={index}
              className={`log-tab ${index === selectedLogIndex ? 'active' : ''}`}
              onClick={() => setSelectedLogIndex(index)}
            >
              Day {index + 1} - {formatDate(log.date)}
            </button>
          ))}
        </div>
      )}

      <div className="log-sheet">
        <div className="log-sheet-header">
          <div className="log-sheet-title">
            <h3>Drivers Daily Log (24 hours)</h3>
            <div className="log-sheet-date">
              Date: {formatDate(currentLog.date)}
            </div>
          </div>
        </div>

        <div className="log-sheet-info">
          <div className="info-row">
            <label>From:</label>
            <span>{currentLog.from || 'N/A'}</span>
          </div>
          <div className="info-row">
            <label>To:</label>
            <span>{currentLog.to || 'N/A'}</span>
          </div>
          <div className="info-row">
            <label>Total Miles Driving Today:</label>
            <span>{currentLog.total_miles_driving?.toFixed(1) || '0.0'}</span>
          </div>
          <div className="info-row">
            <label>Total Mileage Today:</label>
            <span>{currentLog.total_mileage?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        <LogSheetGrid entries={currentLog.entries} date={currentLog.date} />

        <div className="log-sheet-totals">
          <h4>Total Hours</h4>
          <div className="totals-grid">
            <div className="total-item">
              <label>Off Duty:</label>
              <span>{currentLog.totals.off_duty?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="total-item">
              <label>Sleeper Berth:</label>
              <span>{currentLog.totals.sleeper_berth?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="total-item">
              <label>Driving:</label>
              <span>{currentLog.totals.driving?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="total-item">
              <label>On Duty (not driving):</label>
              <span>{currentLog.totals.on_duty_not_driving?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="total-item total">
              <label>Total On Duty (Lines 3 & 4):</label>
              <span>{currentLog.totals.total_on_duty?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div className="log-sheet-remarks">
          <h4>Remarks</h4>
          <div className="remarks-content">
            {currentLog.entries
              .filter(e => e.reason)
              .map((entry, idx) => (
                <div key={idx}>
                  {formatTime(entry.start_time)}: {entry.reason} ({entry.location})
                </div>
              ))}
            {currentLog.entries.filter(e => e.reason).length === 0 && (
              <div>No remarks</div>
            )}
          </div>
        </div>

        <div className="log-sheet-recap">
          <h4>Recap: Complete at end of day</h4>
          <div className="recap-grid">
            <div className="recap-section">
              <h5>70 Hour/8 Day Drivers</h5>
              <div className="recap-item">
                <label>On duty hours today (Total lines 3 & 4):</label>
                <span>{currentLog.totals.total_on_duty?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="recap-item">
                <label>A. Total hours on duty last 7 days including today:</label>
                <span>{currentLog.recap.total_on_duty_last_7_days?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="recap-item">
                <label>B. Total hours available tomorrow (70 hr. minus A*):</label>
                <span>{currentLog.recap.hours_available_tomorrow_70hr?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="recap-item">
                <label>C. Total hours on duty last 5 days including today:</label>
                <span>{currentLog.recap.total_on_duty_last_5_days?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="log-sheet-actions">
          <LogSheetPDF dailyLog={currentLog} />
        </div>
      </div>
    </div>
  )
}

export default LogSheetViewer

