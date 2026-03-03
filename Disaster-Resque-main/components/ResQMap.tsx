'use client'

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useGeolocation } from '@/hooks/useGeolocation'
import { memo } from 'react'

// Fix leaflet icons
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const emergencyIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTExIDJDNi40OCAyIDIuNSA2LjQ4IDIuNSAxMnM0IDEwIDguNSAxMCAxMC00IDEwLTEwUzE1LjUyIDIgMTEgMnptMCA4aDJ2M2gtMnptMCAyaC0ybC0zLTNoNHptMi0yaDJ2M2gtMnptLTQgMGg2djR6bTYgNGgtMnYtNWgtMnYtNGMwLS41LjUtMS4wMjMuNS0xeiIgZmlsbD0iI0ZGMDAwMCIvPjwvc3ZnPg==',
  iconSize: [32, 41],
  iconAnchor: [16, 41],
  popupAnchor: [0, -41],
})

interface MapProps {
  center?: LatLngExpression
  zoom?: number
  markers?: {
    position: LatLngExpression
    title: string
    type: 'emergency' | 'resource' | 'default'
    description?: string
  }[]
  disasters?: {
    position: LatLngExpression
    radius: number
    title: string
    severity: 'low' | 'medium' | 'high'
  }[]
}

function ResQMapContent({
  center = [40.7128, -74.006],
  zoom = 13,
  markers = [],
  disasters = [],
}: MapProps) {
  const { location } = useGeolocation()

  const userLocation: LatLngExpression = location
    ? [location.latitude, location.longitude]
    : center

  return (
    <MapContainer
      center={userLocation}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg z-0"
      key="map-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User location */}
      {location && (
        <>
          <Marker position={userLocation} icon={defaultIcon}>
            <Popup>Your Location</Popup>
          </Marker>
          <Circle
            center={userLocation}
            radius={location.accuracy || 50}
            color="blue"
            fillOpacity={0.1}
          />
        </>
      )}

      {/* Disaster zones */}
      {disasters.map((disaster, idx) => (
        <Circle
          key={`disaster-${idx}`}
          center={disaster.position}
          radius={disaster.radius * 1000}
          color={
            disaster.severity === 'high'
              ? '#FF0000'
              : disaster.severity === 'medium'
                ? '#FFA500'
                : '#FFD700'
          }
          fillOpacity={0.2}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{disaster.title}</h3>
              <p className="text-sm">Severity: {disaster.severity}</p>
            </div>
          </Popup>
        </Circle>
      ))}

      {/* Markers for services and resources */}
      {markers.map((marker, idx) => (
        <Marker
          key={`marker-${idx}`}
          position={marker.position}
          icon={marker.type === 'emergency' ? emergencyIcon : defaultIcon}
        >
          <Popup>
            <div className="w-48">
              <h3 className="font-bold text-sm">{marker.title}</h3>
              {marker.description && (
                <p className="text-xs text-gray-600">{marker.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Type: {marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export const ResQMap = memo(ResQMapContent)
