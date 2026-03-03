'use client'

import { Navigation } from '@/components/Navigation'
import { MapPin, AlertCircle, Users, Navigation2, Heart, Phone, Linkedin, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / scrollHeight) * 100
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      id: 'emergency-map',
      icon: MapPin,
      title: 'Emergency Services Map',
      description: 'Find nearest hospitals, police, and fire stations with real-time routing',
      href: '/map',
      color: 'bg-red-100 text-red-600',
      details: 'Interactive map showing all nearby emergency services within your area',
    },
    {
      id: 'accessible-routes',
      icon: Navigation2,
      title: 'Accessible Routes',
      description: 'Navigate barrier-free routes with wheelchair accessibility information',
      href: '/accessibility',
      color: 'bg-blue-100 text-blue-600',
      details: 'Community-verified routes that are wheelchair accessible',
    },
    {
      id: 'local-resources',
      icon: Users,
      title: 'Local Resources',
      description: 'Discover pharmacies, shelters, food banks, and community services',
      href: '/resources',
      color: 'bg-green-100 text-green-600',
      details: 'Find resources and services available in your community',
    },
    {
      id: 'disaster-dashboard',
      icon: AlertCircle,
      title: 'Disaster Dashboard',
      description: 'Real-time disaster tracking, safe zones, and resource distribution',
      href: '/disasters',
      color: 'bg-orange-100 text-orange-600',
      details: 'Track ongoing disasters and find safe zones near you',
    },
    {
      id: 'sos-emergency',
      icon: Heart,
      title: 'SOS Emergency',
      description: 'Share your emergency location with contacts and nearby responders',
      href: '/sos',
      color: 'bg-pink-100 text-pink-600',
      details: 'One-tap emergency alert system for instant help',
    },
  ]

  const steps = [
    { step: '1', title: 'Enable Location', desc: 'Allow ResQMap to access your location' },
    { step: '2', title: 'Find Services', desc: 'Discover nearby emergency services & resources' },
    { step: '3', title: 'Get Directions', desc: 'Navigate with turn-by-turn directions' },
    { step: '4', title: 'Share Alert', desc: 'Send SOS to emergency contacts' },
  ]

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 z-50" style={{ width: `${scrollProgress}%` }} />

      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Emergency Response & Resource Navigation
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-delayed">
              ResQMap connects you with emergency services, accessible routes, local resources, and disaster support in real-time. Get help when you need it most.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/map"
                className="group px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition transform hover:scale-105 flex items-center gap-2"
              >
                Open Map
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/sos"
                className="group px-8 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition transform hover:scale-105 flex items-center gap-2"
              >
                Emergency SOS
                <Heart className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              const isHovered = hoveredFeature === feature.id
              
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="p-6 rounded-lg border border-gray-200 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 group transform hover:-translate-y-2"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-125 transition-transform duration-300 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                  {isHovered && (
                    <p className="text-xs text-red-500 font-semibold animate-fade-in">{feature.details}</p>
                  )}
                </Link>
              )
            })}
          </div>
        </section>

        {/* Interactive How It Works */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <div 
                  key={item.step} 
                  className="text-center cursor-pointer transition-transform duration-300"
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(-1)}
                >
                  <div 
                    className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 transition-all duration-300 transform ${
                      activeStep === index ? 'bg-red-600 scale-125' : 'bg-red-500'
                    }`}
                  >
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                  {activeStep === index && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg animate-fade-in">
                      <p className="text-xs text-red-600">This step helps ensure fast access to emergency services</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Quick Access Buttons */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button className="p-8 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 hover:shadow-lg transition-all transform hover:scale-105 text-center group">
              <Phone className="w-8 h-8 text-red-600 mx-auto mb-4 group-hover:scale-125 transition-transform" />
              <h3 className="font-semibold text-gray-900">Emergency (911)</h3>
              <p className="text-sm text-gray-600 mt-2">Call emergency services directly</p>
            </button>
            <button className="p-8 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 hover:border-green-400 hover:shadow-lg transition-all transform hover:scale-105 text-center group">
              <Navigation2 className="w-8 h-8 text-green-600 mx-auto mb-4 group-hover:scale-125 transition-transform" />
              <h3 className="font-semibold text-gray-900">Safe Route</h3>
              <p className="text-sm text-gray-600 mt-2">Find barrier-free paths</p>
            </button>
            <button className="p-8 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-400 hover:shadow-lg transition-all transform hover:scale-105 text-center group">
              <Heart className="w-8 h-8 text-blue-600 mx-auto mb-4 group-hover:scale-125 transition-transform" />
              <h3 className="font-semibold text-gray-900">Send SOS</h3>
              <p className="text-sm text-gray-600 mt-2">Alert emergency contacts</p>
            </button>
          </div>
        </section>

        {/* Founder Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">About Our Founder</h2>
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center py-8 md:py-0">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <span className="text-3xl font-bold text-blue-600">PS</span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Pawan Singh</h3>
                  <p className="text-lg text-blue-600 font-semibold mb-4">Founder & Lead Developer</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Passionate about building innovative solutions that make emergency response and accessibility services more efficient and accessible. With expertise in full-stack development, Pawan created ResQMap to bridge the gap between people in need and available resources during emergencies.
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <a
                      href="mailto:pawan9140582015@gmail.com"
                      className="group inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105 font-semibold"
                    >
                      <Mail className="w-5 h-5" />
                      Email
                    </a>
                    <a
                      href="https://www.linkedin.com/in/pawan-singh-555423322/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 font-semibold"
                    >
                      <Linkedin className="w-5 h-5" />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <p>&copy; 2024 ResQMap. Founded by Pawan Singh.</p>
              <div className="flex gap-6 text-sm">
                <Link href="/about" className="hover:text-white transition">About</Link>
                <Link href="#" className="hover:text-white transition">Privacy</Link>
                <Link href="#" className="hover:text-white transition">Terms</Link>
                <Link href="#" className="hover:text-white transition">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fadeIn 0.5s ease-out 0.2s both;
        }
      `}</style>
    </>
  )
}
