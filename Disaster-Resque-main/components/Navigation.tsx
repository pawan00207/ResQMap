'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, AlertCircle, Accessibility, MapIcon, Heart, Info } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState('en')

  const menuItems = [
    { href: '/map', label: 'Emergency Map', icon: MapPin },
    { href: '/accessibility', label: 'Accessible Routes', icon: Accessibility },
    { href: '/resources', label: 'Resources', icon: MapIcon },
    { href: '/disasters', label: 'Disasters', icon: AlertCircle },
    { href: '/sos', label: 'SOS Alert', icon: Heart },
    { href: '/about', label: 'About', icon: Info },
    { href: '/admin', label: 'Admin', icon: AlertCircle },
  ]

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <MapPin className="w-6 h-6 text-red-500" />
            ResQMap
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-4 items-center">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1 hover:text-red-500 transition text-sm"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex gap-3 items-center">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value)
                localStorage.setItem('language', e.target.value)
              }}
              className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 hover:bg-gray-800 rounded flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
            <div className="px-4 py-2 flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value)
                  localStorage.setItem('language', e.target.value)
                }}
                className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
