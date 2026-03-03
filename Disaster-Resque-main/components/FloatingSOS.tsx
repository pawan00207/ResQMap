import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useGeolocation } from '@/hooks/useGeolocation'

export function FloatingSOS() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { location } = useGeolocation()

  const handleSOS = async () => {
    if (!location) {
      alert('Getting your location...')
      return
    }

    setIsLoading(true)
    try {
      // Play sound notification
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 1000
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)

      // Send SOS alert
      const response = await fetch('/api/sos-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'current-user', // Will be set from session
          latitude: location.latitude,
          longitude: location.longitude,
          emergency_type: 'emergency_button',
          severity: 'high',
          description: 'Emergency SOS button pressed',
        }),
      })

      if (response.ok) {
        alert('SOS alert sent! Help is on the way.')
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Error sending SOS:', error)
      alert('Failed to send SOS alert')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-4 w-48">
          <p className="text-sm font-semibold mb-4">Confirm Emergency Alert?</p>
          <div className="flex gap-2">
            <button
              onClick={handleSOS}
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Yes, Help!
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 text-gray-800 px-3 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 animate-pulse"
        title="Emergency SOS"
      >
        <AlertCircle className="w-8 h-8" />
      </button>
    </div>
  )
}
