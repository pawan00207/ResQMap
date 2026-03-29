'use client'

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useGeolocation } from '@/hooks/useGeolocation'
import { memo, useEffect } from 'react'

let defaultIcon: any;
let emergencyIcon: any;

if (typeof window !== 'undefined') {
  // Fix leaflet icons
  defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize, 41],
    iconAnchor, 41],
    popupAnchor, -34],
    shadowSize, 41],
  })

  emergencyIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHBhdGggZD0iTTExIDJDNi40OCAyIDIuNSA2LjQ4IDIuNSAxMnM0IDEwIDguNSAxMCAxMC00IDEwLTEwUzE1LjUyIDIgMTEgMnptMCA4aDJ2M2gtMnptMCAyaC0ybC0zLTNoNHptMi0yaDJ2M2gtMnptLTQgMGg2djR6bTYgNGgtMnYtNWgtMnYtNGMwLS41LjUtMS4wMjMuNS0xeiIgZmlsbD0iI0ZGMDAwMCIvPjwvc3ZnPg==',
    iconSize, 41],
    iconAnchor, 41],
    popupAnchor, -41],
  })
}

interface MapProps {
  center
  zoom
  markers
    position
    title
    type
    description
  }[]
  disasters
    position
    radius
    title
    severity
  }[]
  flyTo
}

function MapController({ flyTo }: { flyTo) {
  const map = useMap()
  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo, 15, { duration)
    }
  }, [flyTo, map])
  return null
}

function ResQMapContent({
  center = [40.7128, -74.006],
  zoom = 13,
  markers = [],
  disasters = [],
  flyTo = null,
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
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapController flyTo={flyTo} />

      {/* User location */}
      {location && (
        <>
          <Marker position={userLocation} icon={defaultIcon}>
            Your Location</Popup>
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
          
            <div>
              <h3 className="font-bold">{disaster.title}</h3>
              <p className="text-sm">Severity{disaster.severity}</p>
            </div>
          </Popup>
        </Circle>
      ))}

      {/* Markers for services and resources */}
      {markers.map((marker, idx) => (
        <Marker
          key={`marker-${idx}`}
          position={marker.position}
          icon={marker.type === 'emergency' ? emergencyIcon
        >
          
            <div className="w-48">
              <h3 className="font-bold text-sm">{marker.title}</h3>
              {marker.description && (
                <p className="text-xs text-gray-600">{marker.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Type).toUpperCase() + marker.type.slice(1)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export const ResQMap = memo(ResQMapContent)
