import { Link } from 'react-router-dom'

const models = ['Stash', 'Wanderer', 'TC Max']
const pages = [
  { label: 'Home', href: '/' },
  { label: 'Dealers', href: '/dealers' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-sky">
      <div className="max-w-content mx-auto px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <img
                src="/images/vmoto-logo.png"
                alt="VMOTO"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="font-sans text-sm text-muted leading-relaxed max-w-xs mt-6">
              Precision-engineered electric motorcycles. Every line has a purpose.
            </p>
            <p className="font-mono text-[10px] tracking-widest text-muted mt-6 uppercase">
              Happiness is a journey
            </p>
          </div>

          {/* Models */}
          <div>
            <h4 className="font-mono text-[10px] tracking-widest text-sky uppercase mb-6">Models</h4>
            <ul className="flex flex-col gap-3">
              {models.map((m) => (
                <li key={m}>
                  <a
                    href={`/#models`}
                    className="font-sans text-sm text-muted hover:text-white transition-colors duration-150 uppercase tracking-wider"
                  >
                    {m}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-[10px] tracking-widest text-sky uppercase mb-6">Navigation</h4>
            <ul className="flex flex-col gap-3">
              {pages.map((p) => (
                <li key={p.label}>
                  <Link
                    to={p.href}
                    className="font-sans text-sm text-muted hover:text-white transition-colors duration-150 uppercase tracking-wider"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-def mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-widest text-muted uppercase">
            © {new Date().getFullYear()} VMOTO Electric Mobility. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Use'].map((t) => (
              <a key={t} href="#" className="font-mono text-[10px] tracking-widest text-muted hover:text-sky uppercase transition-colors duration-150">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
