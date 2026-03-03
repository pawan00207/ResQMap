'use client'

import { useState, useEffect } from 'react'

interface Location {
  latitude: number
  longitude: number
  accuracy?: number
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setLoading(false)
      return
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      })
      setLoading(false)
    }

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message)
      setLoading(false)
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    })

    // Watch for continuous updates
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 1000,
    })

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return { location, error, loading }
}

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = lon2 - lon1
  const y = Math.sin(dLon * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
  const x =
    Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
    Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon * Math.PI / 180)
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}
