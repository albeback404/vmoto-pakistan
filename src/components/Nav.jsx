import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { label: 'Models', href: '/#models' },
  { label: 'About', href: '/#about' },
  { label: 'Dealers', href: '/dealers' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-panel/95 backdrop-blur-sm border-b border-border-def' : 'bg-transparent'
      }`}
    >
      <div className="max-w-content mx-auto px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/vmoto-logo.png"
            alt="VMOTO"
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-sans font-medium text-xs tracking-widest uppercase text-muted hover:text-white transition-colors duration-150 relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-sky group-hover:w-full transition-all duration-200" />
            </a>
          ))}
          <a
            href="/#contact-cta"
            className="font-sans font-medium text-xs tracking-widest uppercase text-black bg-sky px-5 py-2 hover:bg-sky-deep transition-colors duration-200 whitespace-nowrap"
          >
            Book Test Ride
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`block w-6 h-px bg-white transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-px bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-panel border-t border-border-def px-12 py-6 flex flex-col gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-sans font-medium text-xs tracking-widest uppercase text-muted hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/contact"
            className="font-sans font-medium text-xs tracking-widest uppercase text-black bg-sky px-5 py-3 text-center hover:bg-sky-deep transition-colors"
          >
            Book Test Ride
          </a>
        </div>
      )}
    </nav>
  )
}
