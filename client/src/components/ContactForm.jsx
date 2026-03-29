'use client'

import { useState } from 'react'
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name,
    email,
    phone,
    subject,
    message,
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required')
      setIsLoading(false)
      return
    }
    if (!validateEmail(formData.email)) {
      setError('Invalid email address')
      setIsLoading(false)
      return
    }
    if (!formData.subject.trim()) {
      setError('Subject is required')
      setIsLoading(false)
      return
    }
    if (!formData.message.trim()) {
      setError('Message is required')
      setIsLoading(false)
      return
    }

    // Simulate submission
    setTimeout(() => {
      setSubmitted(true)
      setFormData({ name, email, phone, subject, message)
      setIsLoading(false)
      setTimeout(() => setSubmitted(false), 3000)
    }, 1500)
  }

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <div className="grid md
        {/* Info Section */}
        <div className="md
          <div>
            <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Phone className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Phone</p>
                  <p className="opacity-90">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Email</p>
                  <p className="opacity-90">support@resqmap.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Location</p>
                  <p className="opacity-90">India</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm opacity-75">
            <p>Response time: Within 24 hours</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="md
          {submitted ? (
            <div className="text-center py-12 animate-in fade-in">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">We've received your message and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="grid md
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject*</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus
                >
                  <option value="">Select a subject...</option>
                  <option value="support">Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="bug-report">Bug Report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message*</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 disabled
              >
                <Send className="w-4 h-4" />
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. Your information will never be shared.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
