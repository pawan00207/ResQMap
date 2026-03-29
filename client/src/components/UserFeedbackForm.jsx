'use client'

import { useState } from 'react'
import { Send, Smile, CheckCircle } from 'lucide-react'

export function UserFeedbackForm() {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating > 0 && feedback.trim()) {
      setSubmitted(true)
      setTimeout(() => {
        setRating(0)
        setFeedback('')
        setSubmitted(false)
      }, 2000)
    }
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Feedback</h3>
      
      {submitted ? (
        <div className="text-center py-4 animate-pulse">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="text-green-600 font-medium">Thank you for your feedback!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 block mb-2">How would you rate ResQMap?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition transform hover
                >
                  <Smile
                    className={`w-8 h-8 transition ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-2">Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || !feedback.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled
          >
            <Send className="w-4 h-4" />
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  )
}
