const REGIONS = [
  {
    region: 'Middle East',
    dealers: [
      { name: 'VMOTO Dubai', address: 'Sheikh Zayed Rd, Dubai, UAE', phone: '+971 4 000 0000', hours: 'SAT–THU 09:00–18:00' },
      { name: 'VMOTO Abu Dhabi', address: 'Hamdan Street, Abu Dhabi, UAE', phone: '+971 2 000 0000', hours: 'SAT–THU 09:00–18:00' },
      { name: 'VMOTO Riyadh', address: 'King Fahd Road, Riyadh, KSA', phone: '+966 11 000 0000', hours: 'SUN–THU 09:00–20:00' },
    ],
  },
  {
    region: 'Europe',
    dealers: [
      { name: 'VMOTO Rome', address: 'Via del Corso 1, Rome, Italy', phone: '+39 06 000 0000', hours: 'MON–SAT 09:00–19:00' },
      { name: 'VMOTO Amsterdam', address: 'Damrak 1, Amsterdam, NL', phone: '+31 20 000 0000', hours: 'MON–SAT 10:00–18:00' },
      { name: 'VMOTO Paris', address: 'Avenue des Champs-Élysées, Paris', phone: '+33 1 00 00 00 00', hours: 'TUE–SAT 10:00–19:00' },
    ],
  },
  {
    region: 'Asia Pacific',
    dealers: [
      { name: 'VMOTO Sydney', address: '1 George Street, Sydney, AU', phone: '+61 2 0000 0000', hours: 'MON–SAT 09:00–17:00' },
      { name: 'VMOTO Singapore', address: 'Orchard Road 1, Singapore', phone: '+65 0000 0000', hours: 'MON–SUN 10:00–20:00' },
    ],
  },
]

export default function Dealers() {
  return (
    <main className="pt-16 min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-28 bg-panel border-b border-border-def grid-overlay overflow-hidden">
        <div className="max-w-content mx-auto px-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-8 h-px bg-sky" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase">Dealer Network</span>
          </div>
          <h1 className="font-display font-black text-[clamp(60px,9vw,120px)] uppercase leading-none text-white">
            Find a<br />
            <span className="text-sky">Dealer</span>
          </h1>
          <p className="font-sans font-light text-sm text-muted max-w-md mt-6 leading-relaxed">
            Locate your nearest VMOTO authorised dealer for test rides, service, and fleet enquiries.
          </p>
        </div>
        {/* Corner marks */}
        <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-sky/30" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-sky/30" />
      </section>

      {/* Dealer list */}
      <section className="py-24 bg-black">
        <div className="max-w-content mx-auto px-12">
          {REGIONS.map((r) => (
            <div key={r.region} className="mb-20">
              {/* Region header */}
              <div className="flex items-center gap-6 mb-10">
                <span className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase">{r.region}</span>
                <div className="flex-1 h-px bg-border-def" />
                <span className="font-mono text-[9px] tracking-widest text-muted">{r.dealers.length} LOCATIONS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {r.dealers.map((d) => (
                  <div key={d.name} className="card-circuit bg-panel p-8 group">
                    <div className="font-display font-bold text-2xl uppercase text-white mb-6 group-hover:text-sky transition-colors duration-150">
                      {d.name}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="font-mono text-[9px] tracking-widest text-sky uppercase mb-1">Address</div>
                        <div className="font-sans text-sm text-muted">{d.address}</div>
                      </div>
                      <div className="h-px bg-border-def" />
                      <div>
                        <div className="font-mono text-[9px] tracking-widest text-sky uppercase mb-1">Phone</div>
                        <div className="font-mono text-sm text-white">{d.phone}</div>
                      </div>
                      <div className="h-px bg-border-def" />
                      <div>
                        <div className="font-mono text-[9px] tracking-widest text-sky uppercase mb-1">Hours</div>
                        <div className="font-mono text-sm text-white">{d.hours}</div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border-def flex gap-3">
                      <a
                        href="/contact"
                        className="flex-1 font-mono text-[10px] tracking-widest uppercase text-black bg-sky py-3 text-center hover:bg-sky-deep transition-colors duration-200"
                      >
                        Book Ride
                      </a>
                      <a
                        href="#"
                        className="flex-1 font-mono text-[10px] tracking-widest uppercase text-white border border-border-def py-3 text-center hover:border-sky hover:text-sky transition-all duration-200"
                      >
                        Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet CTA */}
      <section className="py-24 bg-panel border-t border-border-def">
        <div className="max-w-content mx-auto px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase mb-4">For Businesses</div>
              <h2 className="font-display font-black text-5xl uppercase text-white mb-6">
                Fleet &amp;<br />B2B Solutions
              </h2>
              <p className="font-sans font-light text-sm text-muted leading-relaxed max-w-sm">
                Outfitting a delivery fleet, corporate mobility program, or last-mile operation?
                VMOTO's fleet division handles everything from specification to ongoing service contracts.
              </p>
            </div>
            <div className="border border-border-def p-10">
              <div className="grid grid-cols-2 gap-8 mb-8">
                {[
                  { num: '10+', label: 'Min Fleet Size' },
                  { num: '5 YR', label: 'Service Plans' },
                  { num: '24/7', label: 'Fleet Support' },
                  { num: 'TCO', label: 'Analysis Included' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display font-black text-3xl text-white">{s.num}</div>
                    <div className="font-mono text-[9px] tracking-widest text-sky uppercase mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <a
                href="/contact"
                className="block w-full font-mono text-xs tracking-widest uppercase text-black bg-sky py-4 text-center hover:bg-sky-deep transition-colors duration-200"
              >
                Request Fleet Proposal
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
