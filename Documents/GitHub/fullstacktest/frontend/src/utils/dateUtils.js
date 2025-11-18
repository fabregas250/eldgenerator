export const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const getHoursBetween = (startStr, endStr) => {
  const start = new Date(startStr)
  const end = new Date(endStr)
  return (end - start) / (1000 * 60 * 60)
}

export const getHourOfDay = (dateTimeStr) => {
  const date = new Date(dateTimeStr)
  return date.getHours()
}

export const getMinutesOfDay = (dateTimeStr) => {
  const date = new Date(dateTimeStr)
  return date.getHours() * 60 + date.getMinutes()
}

