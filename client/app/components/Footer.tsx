import Link from 'next/link'
import React from 'react'
import { Youtube, Instagram, Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#030014] border-t border-purple-500/10 pt-16 pb-8 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              BBEdits
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Empowering creators with AI-driven tools and professional video editing resources. Join the future of content creation.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="https://www.youtube.com/@BBEDITS4567" target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-purple-600/20 hover:text-purple-400 transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </Link>
              <Link href="https://www.instagram.com/bb_edits00/" target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-purple-600/20 hover:text-purple-400 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/courses" className="hover:text-purple-400 transition-colors">Courses</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/our-works" className="hover:text-purple-400 transition-colors">Our Works</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-400 transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-purple-400 transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-500 mt-0.5" />
                <span>Vizag, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-500" />
                <a href="mailto:support@bbedits.in" className="hover:text-purple-400 transition-colors">support@bbedits.in</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-purple-500" />
                <a href="tel:+919110772715" className="hover:text-purple-400 transition-colors">+91 9110772715</a>
              </li>
            </ul>
          </div>

          {/* Newsletter (Visual Only) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest AI tools and editing tips.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
              />
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} BBEdits. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/policy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer