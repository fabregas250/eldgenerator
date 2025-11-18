import React from 'react'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { formatDate, getMinutesOfDay, formatTime } from '../utils/dateUtils'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoSection: {
    marginBottom: 15,
    border: 1,
    padding: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 200,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  gridContainer: {
    border: 1,
    marginBottom: 15,
  },
  gridHeader: {
    flexDirection: 'row',
    borderBottom: 1,
    backgroundColor: '#f0f0f0',
  },
  gridHeaderLabel: {
    width: 150,
    padding: 5,
    borderRight: 1,
  },
  gridHeaderHours: {
    flexDirection: 'row',
    flex: 1,
  },
  gridHourLabel: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
    fontSize: 8,
    borderRight: 1,
  },
  gridRow: {
    flexDirection: 'row',
    borderBottom: 1,
  },
  gridRowLabel: {
    width: 150,
    padding: 5,
    borderRight: 1,
    fontSize: 9,
  },
  gridRowContent: {
    flexDirection: 'row',
    flex: 1,
  },
  gridHourColumn: {
    flex: 1,
    flexDirection: 'row',
    borderRight: 1,
  },
  gridCell: {
    flex: 1,
    minHeight: 15,
    borderRight: 0.5,
  },
  totalsSection: {
    marginBottom: 15,
    padding: 10,
    border: 1,
  },
  totalsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottom: 0.5,
  },
  recapSection: {
    marginBottom: 15,
    padding: 10,
    border: 1,
  },
  recapTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 9,
  },
  remarksSection: {
    marginBottom: 15,
    padding: 10,
    border: 1,
  },
  remarksTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  remarksText: {
    fontSize: 9,
    lineHeight: 1.4,
  },
})

function LogSheetPDFDocument({ dailyLog }) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getStatusForHour = (hour, minute = 0) => {
    const targetMinutes = hour * 60 + minute
    
    for (const entry of dailyLog.entries) {
      const startDate = new Date(entry.start_time)
      const endDate = new Date(entry.end_time)
      const entryDate = new Date(dailyLog.date)
      
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
        return '#ffffff'
    }
  }

  const renderGridRow = (statusType) => {
    const statusLabel = 
      statusType === 'off_duty' ? '1. Off Duty' :
      statusType === 'sleeper_berth' ? '2. Sleeper Berth' :
      statusType === 'driving' ? '3. Driving' :
      '4. On Duty (not driving)'

    return (
      <View key={statusType} style={styles.gridRow}>
        <View style={styles.gridRowLabel}>
          <Text>{statusLabel}</Text>
        </View>
        <View style={styles.gridRowContent}>
          {hours.map((hour) => (
            <View key={hour} style={styles.gridHourColumn}>
              {Array.from({ length: 4 }, (_, i) => {
                const minute = i * 15
                const currentStatus = getStatusForHour(hour, minute)
                const isActive = currentStatus === statusType
                
                return (
                  <View
                    key={`${hour}-${minute}`}
                    style={[
                      styles.gridCell,
                      { backgroundColor: isActive ? getStatusColor(statusType) : '#ffffff' }
                    ]}
                  />
                )
              })}
            </View>
          ))}
          <View style={styles.gridCell}>
            <Text style={{ textAlign: 'center', fontSize: 8 }}>
              {dailyLog.totals[statusType]?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Drivers Daily Log (24 hours)</Text>
          <Text>Date: {formatDate(dailyLog.date)}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{dailyLog.from || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{dailyLog.to || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Miles Driving Today:</Text>
            <Text style={styles.value}>{dailyLog.total_miles_driving?.toFixed(1) || '0.0'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Mileage Today:</Text>
            <Text style={styles.value}>{dailyLog.total_mileage?.toFixed(1) || '0.0'}</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridHeader}>
            <View style={styles.gridHeaderLabel}>
              <Text>Duty Status</Text>
            </View>
            <View style={styles.gridHeaderHours}>
              {hours.map((hour) => (
                <View key={hour} style={styles.gridHourLabel}>
                  <Text>
                    {hour === 0 ? 'Mid' : hour === 12 ? 'Noon' : hour > 12 ? hour - 12 : hour}
                  </Text>
                </View>
              ))}
              <View style={styles.gridHourLabel}>
                <Text>Total</Text>
              </View>
            </View>
          </View>
          {['off_duty', 'sleeper_berth', 'driving', 'on_duty_not_driving'].map(renderGridRow)}
        </View>

        <View style={styles.totalsSection}>
          <Text style={styles.totalsTitle}>Total Hours</Text>
          <View style={styles.totalItem}>
            <Text>Off Duty:</Text>
            <Text>{dailyLog.totals.off_duty?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.totalItem}>
            <Text>Sleeper Berth:</Text>
            <Text>{dailyLog.totals.sleeper_berth?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.totalItem}>
            <Text>Driving:</Text>
            <Text>{dailyLog.totals.driving?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.totalItem}>
            <Text>On Duty (not driving):</Text>
            <Text>{dailyLog.totals.on_duty_not_driving?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={[styles.totalItem, { borderTop: 1, paddingTop: 5, marginTop: 5 }]}>
            <Text style={{ fontWeight: 'bold' }}>Total On Duty (Lines 3 & 4):</Text>
            <Text style={{ fontWeight: 'bold' }}>{dailyLog.totals.total_on_duty?.toFixed(2) || '0.00'}</Text>
          </View>
        </View>

        <View style={styles.remarksSection}>
          <Text style={styles.remarksTitle}>Remarks</Text>
          <Text style={styles.remarksText}>
            {dailyLog.entries
              .filter(e => e.reason)
              .map((entry, idx) => (
                `${formatTime(entry.start_time)}: ${entry.reason} (${entry.location})\n`
              ))
              .join('') || 'No remarks'}
          </Text>
        </View>

        <View style={styles.recapSection}>
          <Text style={styles.recapTitle}>Recap: Complete at end of day</Text>
          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>70 Hour/8 Day Drivers</Text>
          <View style={styles.recapItem}>
            <Text>On duty hours today (Total lines 3 & 4):</Text>
            <Text>{dailyLog.totals.total_on_duty?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.recapItem}>
            <Text>A. Total hours on duty last 7 days including today:</Text>
            <Text>{dailyLog.recap.total_on_duty_last_7_days?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.recapItem}>
            <Text>B. Total hours available tomorrow (70 hr. minus A*):</Text>
            <Text>{dailyLog.recap.hours_available_tomorrow_70hr?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.recapItem}>
            <Text>C. Total hours on duty last 5 days including today:</Text>
            <Text>{dailyLog.recap.total_on_duty_last_5_days?.toFixed(2) || '0.00'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

function LogSheetPDF({ dailyLog }) {
  const fileName = `eld-log-${dailyLog.date}.pdf`

  return (
    <div className="pdf-download-container">
      <PDFDownloadLink
        document={<LogSheetPDFDocument dailyLog={dailyLog} />}
        fileName={fileName}
        className="pdf-download-button"
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Generating PDF...' : 'Download PDF'
        }
      </PDFDownloadLink>
    </div>
  )
}

export default LogSheetPDF

