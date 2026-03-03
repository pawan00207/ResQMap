import { Navigation } from '@/components/Navigation'
import { Linkedin, Mail, MapPin, Award, Code2, Target } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">About ResQMap</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              A mission-driven platform connecting people with emergency services and resources when they need it most.
            </p>
          </div>
        </section>

        {/* Founder Profile */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Profile Image Side */}
              <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center py-12 md:py-0">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-xl mx-auto mb-4">
                    <span className="text-6xl font-bold text-blue-600">PS</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Pawan Singh</h2>
                  <p className="text-blue-100 text-lg">Founder & Lead Developer</p>
                </div>
              </div>

              {/* Profile Info */}
              <div className="md:w-2/3 p-8 md:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Meet the Founder</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pawan Singh is a passionate full-stack developer and innovator dedicated to building impactful solutions that bridge the gap between emergency response systems and community members. With years of experience in web development and a commitment to accessibility, Pawan founded ResQMap to address the critical need for a unified platform that connects people with life-saving emergency services and local resources.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <Code2 className="w-6 h-6 text-blue-600 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Expertise</h4>
                    <p className="text-sm text-gray-600">Full-stack development with modern frameworks and geospatial technologies</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <Target className="w-6 h-6 text-green-600 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Mission-Driven</h4>
                    <p className="text-sm text-gray-600">Committed to creating solutions that improve lives and emergency response</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <Award className="w-6 h-6 text-purple-600 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Innovation Focus</h4>
                    <p className="text-sm text-gray-600">Building scalable, production-ready platforms with cutting-edge technologies</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <MapPin className="w-6 h-6 text-orange-600 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Accessibility Champion</h4>
                    <p className="text-sm text-gray-600">Dedicated to ensuring technology is accessible to everyone, especially vulnerable populations</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Get in Touch</h4>
                  <div className="flex gap-4 flex-wrap">
                    <a
                      href="mailto:pawan9140582015@gmail.com"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                    >
                      <Mail className="w-5 h-5" />
                      Email: pawan9140582015@gmail.com
                    </a>
                    <a
                      href="https://www.linkedin.com/in/pawan-singh-555423322/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      <Linkedin className="w-5 h-5" />
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Values */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Vision</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency Response</h3>
                <p className="text-gray-600">Connecting people with emergency services instantly through intelligent mapping and real-time data</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility First</h3>
                <p className="text-gray-600">Ensuring everyone, regardless of ability, can access critical information and resources</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Technology Innovation</h3>
                <p className="text-gray-600">Using modern technology to create scalable solutions that save lives and connect communities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Explore ResQMap?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start using our platform today to find emergency services, resources, and get help when you need it most.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/map"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Open Map
              </Link>
              <Link
                href="/"
                className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition"
              >
                Back Home
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <p>&copy; 2024 ResQMap. Founded by Pawan Singh.</p>
              <div className="flex gap-6 text-sm">
                <Link href="/" className="hover:text-white">Home</Link>
                <Link href="/about" className="hover:text-white">About</Link>
                <Link href="#" className="hover:text-white">Privacy</Link>
                <Link href="#" className="hover:text-white">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
