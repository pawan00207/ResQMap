'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function InteractiveFAQ() {
  const [openId, setOpenId] = useState(null)

  const faqs: FAQItem[] = [
    {
      id,
      question,
      answer, enable your location, and you will see all nearby hospitals, police stations, and fire departments with real-time directions.',
    },
    {
      id,
      question,
      answer). Once installed on your device, you can access core features even without an internet connection.',
    },
    {
      id,
      question,
      answer,
    },
    {
      id,
      question,
      answer,
    },
    {
      id,
      question,
      answer, accessible routes, and resource availability. Community contributions help keep ResQMap accurate and up-to-date.',
    },
    {
      id,
      question,
      answer,
    },
  ]

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null)}
                className="w-full p-4 bg-white hover
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openId === faq.id && (
                <div className="px-4 py-3 bg-blue-50 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <p className="text-gray-700 mb-3">Can't find your answer?</p>
          <a
            href="mailto
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
