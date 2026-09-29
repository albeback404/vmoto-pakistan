import { useState, useEffect, useRef } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'framer-motion'

/* ─── DATA ──────────────────────────────────────────────────────── */
const MODELS = [
  {
    id: 'stash',
    name: 'Stash',
    tagline: 'Long-Range Flagship',
    range: '180',
    topSpeed: '120',
    charge: '5.5',
    power: '9.0',
    weight: '153',
    color: 'Jet Black / Electric Blue',
    battery: '74V 97Ah NCM Lithium',
    description:
      'VMOTO\'s long-range flagship. The Stash delivers 180 km on a single charge with a 9 kW motor and 125 km/h boost mode — engineered for riders who refuse to stop.',
    image: '/images/stash.png',
  },
  {
    id: 'ts-street-hunter',
    name: 'TS Street Hunter S',
    tagline: 'Street Dominance',
    range: '107',
    topSpeed: '105',
    charge: '3.0',
    power: '4.0',
    weight: '124',
    color: 'Black / White',
    battery: '74V 30Ah ×2 NCM Lithium',
    description:
      'Dual-battery street aggressor. The TS Street Hunter S pushes 105 km/h with a 10 kW peak motor and swappable battery architecture built for riders who live in the city.',
    image: '/images/ts-street-hunter.webp',
  },
  {
    id: 'tc-wanderer',
    name: 'TC Wanderer Pro',
    tagline: 'Heritage Endurance',
    range: '91',
    topSpeed: '90',
    charge: '3.5',
    power: '4.1',
    weight: '89',
    color: 'Forest Green / Jet Black / Silver',
    battery: '60V 32Ah ×2 Polymer Lithium',
    description:
      'Classic silhouette, electric soul. The TC Wanderer Pro pairs dual polymer batteries with a neo-retro stance tuned for the long way round.',
    image: '/images/tc-wanderer.webp',
  },
  {
    id: 'tc',
    name: 'TC',
    tagline: 'Retro Electric',
    range: '102',
    topSpeed: '72',
    charge: '3.0',
    power: '2.0',
    weight: '73',
    color: 'Multiple Retro Colorways',
    battery: '72V 24Ah ×2 LMFP Aluminum Shell',
    description:
      'Retro geometry with zero emissions. The TC brings L3e-class commuting into the electric age — lightweight, efficient, and effortlessly stylish.',
    image: '/images/tc.webp',
  },
  {
    id: 'cu',
    name: 'CU',
    tagline: 'Urban Scooter',
    range: '75',
    topSpeed: '55',
    charge: '4.0',
    power: '2.2',
    weight: '75',
    color: 'Matte Black / White / Red',
    battery: '60V 30Ah Lithium',
    description:
      'Effortless urban mobility. The CU strips commuting down to its essentials — clean, quiet, and ready on demand.',
    image: '/images/cu.webp',
    imageScale: 1.32,
  },
  {
    id: 'cu-mini',
    name: 'CU Mini',
    tagline: 'Compact Urban',
    range: '57',
    topSpeed: '45',
    charge: '3.5',
    power: '1.2',
    weight: '60',
    color: 'White / Red / Jet Black',
    battery: '48V 20–30Ah Lithium',
    description:
      'Maximum city, minimum footprint. The CU Mini is agile, lightweight, and built for riders who see every gap as an opportunity.',
    image: '/images/cu-mini.webp',
    imageScale: 1.10,
  },
]

const METRICS = [
  { value: '90+', unit: '', label: 'Operating in 90 countries worldwide' },
  { value: '100+', unit: '', label: 'Vast Product Range' },
  { value: '#1', unit: '', label: "World's No.1 EV 2-Wheeler Brand" },
]

const PRESS = [
  {
    quote: 'The TC Max is the most complete electric motorcycle we have tested.',
    source: 'ELECTRIC RIDER MAGAZINE',
    year: '2024',
  },
  {
    quote: "VMOTO's engineering philosophy is uncompromising — and it shows in every detail.",
    source: 'MOTO TECH REVIEW',
    year: '2024',
  },
  {
    quote: 'Stash rewrites what urban electric mobility means.',
    source: 'THE DAILY COMMUTER',
    year: '2023',
  },
]

const NEWS_ARTICLES = [
  {
    title: 'Micromobility: CU & CUmini — A New Perspective on City Mobility',
    date: '2025',
    summary: 'Vmoto unveils a new video exploring urban mobility evolution, presenting the CU and CUmini as practical responses to modern city transportation needs.',
    image: '/images/news-micromobility.webp',
    url: 'https://vmoto.com/news/micromobility-cu-cumini-a-new-perspective-on-city-mobility',
    tag: 'Product',
  },
  {
    title: 'Vmoto Meeting Boat 2026: From the Circuit to the Electric Cruise',
    date: 'Mar 2026',
    summary: 'Following MotoGP at Chang International Circuit, Vmoto hosted an exclusive electric cruise in Bangkok featuring five-time champion Jorge Lorenzo.',
    image: '/images/news-meeting-boat.webp',
    url: 'https://vmoto.com/news/vmoto-meeting-boat-2026-from-the-circuit-to-the-electric-cruise',
    tag: 'Events',
  },
  {
    title: 'Vmoto Padel Cup',
    date: 'Jul 2025',
    summary: 'Vmoto partnered with ProDay 2025 in Misano to launch the Vmoto Padel Cup, showcasing its commitment to sustainable mobility and active lifestyle.',
    image: '/images/news-padel-cup.webp',
    url: 'https://vmoto.com/news/vmoto-padel-cup',
    tag: 'Events',
  },
  {
    title: 'Vmoto at Thailand MotoGP 2026 — Relive the Best Moments',
    date: 'Mar 2026',
    summary: 'Vmoto showcased its full electric lineup at Chang International Circuit alongside MotoGP legend Jorge Lorenzo, featuring the Stash, CPX, CITI and CU.',
    image: '/images/news-thailand-motogp.webp',
    url: 'https://vmoto.com/news/vmoto-at-thailand-motogp-2026-relive-the-best-moments-with-us',
    tag: 'Racing',
  },
  {
    title: 'Thailand GP 2026: Vmoto Showcases Electric Mobility',
    date: 'Feb 2026',
    summary: 'Vmoto set up in the Official Fan Zone at Chang International Circuit, highlighting next-generation electric scooters and 100% electric technology.',
    image: '/images/news-thailand-gp-fanzone.webp',
    url: 'https://vmoto.com/news/thailand-gp-2026-vmoto-showcases-electric-mobility',
    tag: 'Racing',
  },
  {
    title: 'Porsche Carrera Cup Night 2025',
    date: '2025',
    summary: 'Vmoto celebrates its Porsche Carrera Cup Italia partnership, showcasing the CUx mopeds used across race weekends — efficiency and innovation in motorsport.',
    image: '/images/news-porsche-carrera.webp',
    url: 'https://vmoto.com/news/porsche-carrera-cup-night-2025-2',
    tag: 'Motorsport',
  },
  {
    title: 'Vmoto Opens a New Chapter for E-Mobility in Asia with ProDay China 2025',
    date: 'Sep 2025',
    summary: 'Vmoto hosted ProDay China 2025 at Jiangsu Wantrack International Circuit, with Jorge Lorenzo riding the Stash and institutional partners from across Asia.',
    image: '/images/news-proday-china.webp',
    url: 'https://vmoto.com/news/vmoto-opens-a-new-chapter-for-e-mobility-in-asia-with-proday-china-2025',
    tag: 'Global',
  },
  {
    title: 'EICMA 2025',
    date: 'Nov 2025',
    summary: 'VMOTO presented its latest electric innovations at EICMA 2025, unveiling new B2B and B2C solutions across 90+ countries worldwide.',
    image: '/images/news-eicma.webp',
    url: 'https://vmoto.com/news/eicma-2025',
    tag: 'Industry',
  },
]

/* ─── ANIMATION VARIANTS ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const slideRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

/* ─── REVEAL WRAPPER ─────────────────────────────────────────────── */
function Reveal({ children, variants = fadeUp, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/* ─── SPEED LINES SVG ────────────────────────────────────────────── */
function SpeedLines() {
  const lines = [
    { y: '28%', w: '38%', delay: 0.6, opacity: 0.18 },
    { y: '36%', w: '55%', delay: 0.65, opacity: 0.28 },
    { y: '42%', w: '70%', delay: 0.7, opacity: 0.35 },
    { y: '48%', w: '80%', delay: 0.72, opacity: 0.4 },
    { y: '53%', w: '75%', delay: 0.74, opacity: 0.35 },
    { y: '58%', w: '60%', delay: 0.76, opacity: 0.28 },
    { y: '63%', w: '42%', delay: 0.78, opacity: 0.18 },
    { y: '68%', w: '28%', delay: 0.8, opacity: 0.1 },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          className="absolute right-0"
          style={{ top: l.y, width: l.w, height: '1px', background: `rgba(159,221,234,${l.opacity})` }}
          initial={{ scaleX: 0, originX: 1 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: l.delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {/* Stronger center streak */}
      <motion.div
        className="absolute right-0"
        style={{ top: '50%', width: '65%', height: '2px', background: 'linear-gradient(to left, rgba(159,221,234,0.5), transparent)' }}
        initial={{ scaleX: 0, originX: 1 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.68, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

/* ─── STICKY MODELS SECTION ─────────────────────────────────────── */
function ModelsSection() {
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(MODELS.length - 1, Math.floor(v * MODELS.length))
      setActiveIndex(idx)
    })
    return unsub
  }, [scrollYProgress])

  const model = MODELS[activeIndex]

  const SPECS = [
    { label: 'Range', value: `${model.range} KM` },
    { label: 'Top Speed', value: `${model.topSpeed} KM/H` },
    { label: 'Motor Power', value: `${model.power} KW` },
    { label: 'Battery', value: model.battery },
    { label: 'Charge Time', value: `${model.charge} HR` },
    { label: 'Kerb Weight', value: `${model.weight} KG` },
    { label: 'Colorway', value: model.color },
  ]

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="models" ref={containerRef} style={{ height: `${MODELS.length * 100}vh` }}>
      {/* Sticky panel */}
      <div className="sticky top-0 h-screen bg-black overflow-hidden flex flex-col">

        {/* Top bar */}
        <div className="max-w-content mx-auto w-full px-4 md:px-12 pt-20 md:pt-24 flex items-center gap-4 md:gap-6 shrink-0">
          <div className="w-6 md:w-8 h-px bg-sky shrink-0" />
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] text-sky uppercase whitespace-nowrap">
            Model Lineup — {activeIndex + 1} / {MODELS.length}
          </span>
          <div className="flex-1 h-px bg-border-def relative ml-2 md:ml-4">
            <motion.div className="absolute left-0 top-0 h-full bg-sky" style={{ width: progressWidth }} />
          </div>
        </div>

        {/* Mobile horizontal model pills */}
        <div className="flex md:hidden overflow-x-auto gap-2 px-4 pt-3 pb-1 shrink-0 scrollbar-none">
          {MODELS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 px-3 py-1.5 border font-mono text-[8px] tracking-widest uppercase whitespace-nowrap transition-colors duration-150 ${
                activeIndex === i ? 'border-sky text-sky bg-sky/10' : 'border-border-def text-muted'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Main content — mobile: flex-col | desktop: 3-col grid */}
        <div className="flex-1 max-w-content mx-auto w-full px-4 md:px-12 flex flex-col md:grid md:grid-cols-[180px_1fr_1fr] gap-3 md:gap-6 items-start md:items-center pb-4 md:pb-12 mt-3 md:mt-6 overflow-y-auto md:overflow-visible">

          {/* COL 1 — vertical model selector (desktop only) */}
          <div className="hidden md:flex flex-col gap-1 border-r border-border-def pr-6 h-full justify-center">
            {MODELS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setActiveIndex(i)}
                className="text-left group flex items-center gap-3 py-2.5 transition-all duration-150"
              >
                <motion.div
                  className="w-px h-5 bg-sky shrink-0"
                  animate={{ scaleY: activeIndex === i ? 1 : 0, opacity: activeIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
                <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-150 ${
                  activeIndex === i ? 'text-sky' : 'text-muted group-hover:text-white'
                }`}>
                  {m.name}
                </span>
              </button>
            ))}
          </div>

          {/* COL 2 — bike image */}
          <div className="relative flex items-center justify-center w-full" style={{ minHeight: '35vw' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={model.id + '-glow'}
                className="absolute inset-0 bike-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.img
                key={model.id}
                src={model.image}
                alt={model.name}
                className="relative z-10 w-full max-h-[38vw] md:max-h-[52vh] object-contain drop-shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 * (model.imageScale ?? 1), x: -30 }}
                animate={{ opacity: 1, scale: model.imageScale ?? 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.05 * (model.imageScale ?? 1), x: 30 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </AnimatePresence>

            <div className="absolute top-2 left-2 w-3 h-3 md:w-4 md:h-4 border-l border-t border-sky/40" />
            <div className="absolute top-2 right-2 w-3 h-3 md:w-4 md:h-4 border-r border-t border-sky/40" />
            <div className="absolute bottom-2 left-2 w-3 h-3 md:w-4 md:h-4 border-l border-b border-sky/40" />
            <div className="absolute bottom-2 right-2 w-3 h-3 md:w-4 md:h-4 border-r border-b border-sky/40" />
          </div>

          {/* COL 3 — content + specs */}
          <div className="flex flex-col justify-center md:pl-4 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={model.id + '-content'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-sky uppercase mb-1 md:mb-2">
                  {model.tagline}
                </div>
                <h2 className="font-display font-black text-4xl md:text-6xl uppercase tracking-wider text-white mb-2 md:mb-4">
                  {model.name}
                </h2>
                <p className="font-sans font-light text-xs md:text-sm text-muted leading-relaxed mb-4 md:mb-8 max-w-sm">
                  {model.description}
                </p>

                {/* Specs — 2-col grid on mobile, single col on desktop */}
                <motion.div
                  className="border-t border-border-def"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="grid grid-cols-2 md:grid-cols-1">
                    {SPECS.map((spec) => (
                      <motion.div
                        key={spec.label}
                        variants={fadeUp}
                        className="flex flex-col md:flex-row md:items-center md:justify-between py-2 md:py-3 border-b border-border-def pr-2 md:pr-0"
                      >
                        <span className="font-mono text-[8px] md:text-[10px] tracking-widest text-sky uppercase">
                          {spec.label}
                        </span>
                        <span className="font-mono text-[10px] md:text-sm text-white mt-0.5 md:mt-0">{spec.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <div className="flex gap-3 md:gap-4 mt-5 md:mt-8">
                  <a
                    href="/contact"
                    className="font-mono text-[9px] md:text-xs tracking-widest uppercase text-black bg-sky px-5 md:px-8 py-2.5 md:py-3 hover:bg-sky-deep transition-colors duration-200"
                  >
                    Book Test Ride
                  </a>
                  <a
                    href="#"
                    className="font-mono text-[9px] md:text-xs tracking-widest uppercase text-white border border-white/20 px-5 md:px-8 py-2.5 md:py-3 hover:border-sky hover:text-sky transition-all duration-200"
                  >
                    Full Specs
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <div className="font-mono text-[8px] tracking-widest text-muted uppercase">Scroll to explore</div>
          <div className="w-px h-6 bg-gradient-to-b from-sky/60 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}

/* ─── COUNTER ────────────────────────────────────────────────────── */
function Counter({ value, duration = 1.5 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const isDecimal = String(value).includes('.')
    const start = performance.now()
    const tick = (now) => {
      const elapsed = (now - start) / (duration * 1000)
      const progress = Math.min(elapsed, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * value
      setDisplay(isDecimal ? current.toFixed(1) : Math.round(current))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value, duration])

  return <span ref={ref}>{display}</span>
}


/* ─── HERO ───────────────────────────────────────────────────────── */
function Hero() {
  const [active, setActive] = useState(0)
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])

  const model = MODELS[active]

  function switchModel(i) {
    if (i === active) return
    setActive(i)
  }

  const HUD_SPECS = [
    { label: 'Range', value: model.range, unit: 'KM' },
    { label: 'Top Speed', value: model.topSpeed, unit: 'KM/H' },
    { label: 'Motor', value: model.power, unit: 'KW' },
  ]

  return (
    <section ref={heroRef} className="relative w-full h-screen bg-black overflow-hidden">

      {/* ── FULL-SCREEN BACKGROUND IMAGE ── */}
      <div className="absolute inset-0">
        <img
          src="/images/stash-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />
        {/* Left gradient so text stays readable */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.10) 65%, rgba(0,0,0,0.25) 100%)'
        }} />
        {/* Bottom fade into model rail */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 12%, transparent 28%)'
        }} />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />

      {/* Watermark model name */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={model.id + '-wm'}
            className="font-display font-black uppercase text-white/[0.035] select-none text-center leading-none"
            style={{ fontSize: 'clamp(100px, 18vw, 240px)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 40, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 1.04 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {model.name.toUpperCase()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Corner HUD brackets */}
      {[
        'top-20 left-8 border-l border-t',
        'top-20 right-8 border-r border-t',
        'bottom-28 left-8 border-l border-b',
        'bottom-28 right-8 border-r border-b',
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute w-8 h-8 border-sky/25 ${cls}`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
        />
      ))}

      {/* ── OVERLAY CONTENT ── */}
      <motion.div
        className="absolute inset-0 flex flex-col"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        {/* Top spacer for nav */}
        <div className="h-20 shrink-0" />

        {/* Middle row: left text | spacer | right HUD */}
        <div className="flex-1 flex items-end pb-4 md:pb-6 px-5 md:px-12 gap-6 md:gap-8">

          {/* LEFT — brand + name + tagline + CTAs */}
          <div className="flex flex-col w-full md:max-w-xs">
            <motion.div
              className="font-mono text-[9px] tracking-[0.35em] text-sky uppercase mb-4 md:mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Electric Mobility — 2025
            </motion.div>

            <div className="overflow-hidden mb-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={model.id + '-name'}
                  className="font-display font-black uppercase leading-none text-white"
                  style={{ fontSize: 'clamp(38px, 9vw, 92px)', letterSpacing: '-0.01em' }}
                  initial={{ y: '108%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-108%' }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                >
                  {model.name}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={model.id + '-tag'}
                className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-sky uppercase mb-3 md:mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                {model.tagline}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={model.id + '-desc'}
                className="hidden md:block font-sans font-light text-xs text-muted leading-relaxed mb-8"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                {model.description}
              </motion.p>
            </AnimatePresence>

            <motion.div
              className="flex gap-2 md:gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
            >
              <a
                href="/contact"
                className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-black bg-sky px-4 md:px-6 py-2.5 md:py-3 hover:bg-sky-deep transition-colors duration-200 whitespace-nowrap"
              >
                Book Test Ride
              </a>
              <a
                href="#models"
                className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-sky border border-sky/30 px-4 md:px-6 py-2.5 md:py-3 hover:border-sky transition-colors duration-200 whitespace-nowrap"
              >
                Explore All
              </a>
            </motion.div>
          </div>

          {/* CENTER spacer — desktop only */}
          <div className="hidden md:flex flex-1" />

          {/* RIGHT — HUD panel (desktop only) */}
          <motion.div
            className="hidden md:flex flex-col gap-0 bg-black/50 backdrop-blur-sm border border-border-def min-w-[180px]"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="font-mono text-[8px] tracking-[0.3em] text-sky uppercase px-5 py-3 border-b border-border-def hud-pulse">
              Live Readout
            </div>
            {HUD_SPECS.map((s, i) => (
              <div key={s.label} className="px-5 py-4 border-b border-border-def last:border-b-0">
                <div className="font-mono text-[8px] tracking-widest text-sky uppercase mb-0.5">{s.label}</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={model.id + s.label}
                    className="font-display font-black text-white leading-none"
                    style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {s.value}
                  </motion.div>
                </AnimatePresence>
                <div className="font-mono text-[8px] tracking-widest text-muted mt-0.5">{s.unit}</div>
              </div>
            ))}
            <div className="px-5 py-3">
              <div className="font-mono text-[7px] tracking-wider text-white/30 uppercase">PWR — NOMINAL</div>
              <div className="font-mono text-[7px] tracking-wider text-white/30 uppercase mt-0.5">BMS — ACTIVE</div>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </section>
  )
}

/* ─── ABOUT VMOTO ────────────────────────────────────────────────── */

// ISO 3166-1 numeric IDs for 90+ countries where VMOTO operates
const VMOTO_COUNTRY_IDS = new Set([
  // Europe
  380, // Italy
  724, // Spain
  250, // France
  276, // Germany
  826, // United Kingdom
  620, // Portugal
  528, // Netherlands
  56,  // Belgium
  756, // Switzerland
  40,  // Austria
  616, // Poland
  203, // Czech Republic
  348, // Hungary
  642, // Romania
  752, // Sweden
  578, // Norway
  208, // Denmark
  246, // Finland
  300, // Greece
  792, // Turkey
  56,  // Belgium
  191, // Croatia
  705, // Slovenia
  703, // Slovakia
  100, // Bulgaria
  688, // Serbia
  807, // North Macedonia
  499, // Montenegro
  70,  // Bosnia & Herzegovina
  8,   // Albania
  442, // Luxembourg
  372, // Ireland
  440, // Lithuania
  428, // Latvia
  233, // Estonia
  112, // Belarus
  804, // Ukraine
  498, // Moldova
  // Middle East
  784, // UAE
  682, // Saudi Arabia
  634, // Qatar
  414, // Kuwait
  48,  // Bahrain
  400, // Jordan
  376, // Israel
  422, // Lebanon
  512, // Oman
  275, // Palestine
  368, // Iraq
  // Africa
  504, // Morocco
  788, // Tunisia
  12,  // Algeria
  818, // Egypt
  710, // South Africa
  566, // Nigeria
  404, // Kenya
  231, // Ethiopia
  288, // Ghana
  646, // Rwanda
  800, // Uganda
  716, // Zimbabwe
  508, // Mozambique
  // Asia Pacific
  156, // China
  392, // Japan
  410, // South Korea
  158, // Taiwan
  36,  // Australia
  554, // New Zealand
  356, // India
  764, // Thailand
  704, // Vietnam
  458, // Malaysia
  360, // Indonesia
  702, // Singapore
  608, // Philippines
  344, // Hong Kong
  446, // Macau
  116, // Cambodia
  418, // Laos
  104, // Myanmar
  524, // Nepal
  50,  // Bangladesh
  144, // Sri Lanka
  586, // Pakistan
  // Americas
  840, // USA
  124, // Canada
  76,  // Brazil
  484, // Mexico
  152, // Chile
  32,  // Argentina
  170, // Colombia
  604, // Peru
  218, // Ecuador
  858, // Uruguay
  68,  // Bolivia
  600, // Paraguay
  188, // Costa Rica
  320, // Guatemala
  340, // Honduras
  214, // Dominican Republic
  // Central Asia / Caucasus
  643, // Russia
  398, // Kazakhstan
  792, // Turkey
  268, // Georgia
  31,  // Azerbaijan
  51,  // Armenia
])


function AboutVmoto() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="bg-black border-b border-border-def overflow-hidden">
      <div className="max-w-content mx-auto px-6 md:px-12 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* ── LEFT: Copy ── */}
        <div>
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-px bg-sky" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase">Who We Are</span>
          </motion.div>

          <motion.h2
            className="font-display font-black uppercase text-white leading-[0.92] mb-8"
            style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            Global Leader<br />
            in Electric<br />
            <span className="text-sky">Mobility</span>
          </motion.h2>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            <p className="font-sans font-light text-sm md:text-base text-muted leading-relaxed">
              VMOTO is a world-leading manufacturer of electric two-wheel vehicles, engineering premium e-mobility solutions trusted by fleets, riders, and iconic global brands across more than 90 countries.
            </p>
            <p className="font-sans font-light text-sm md:text-base text-muted leading-relaxed">
              From MotoGP paddocks to city delivery fleets, our machines are built on one principle — that electric performance and real-world reliability are not a compromise. Every model we produce carries 25 years of precision engineering.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-3 mt-10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {['MotoGP Partner', 'Uber Fleet', 'Porsche Cup', 'VR46 Racing', 'Ducati Supplier'].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-widest uppercase text-sky border border-sky/30 px-3 py-1.5"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: Globe map ── */}
        <motion.div
          className="relative w-full"
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 120, center: [15, 20] }}
            style={{ width: '100%', height: 'auto' }}
          >
            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: VMOTO_COUNTRY_IDS.has(Number(geo.id))
                          ? '#9FDDEA'
                          : '#1a1a1c',
                        stroke: '#2a2a2e',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: VMOTO_COUNTRY_IDS.has(Number(geo.id))
                          ? '#b8eaf3'
                          : '#242426',
                        stroke: '#2a2a2e',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
          {/* Legend */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm bg-sky" />
            <span className="font-mono text-[9px] tracking-widest text-muted uppercase">VMOTO Present</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <Hero />

      {/* ── ABOUT VMOTO ──────────────────────────────────────── */}
      <AboutVmoto />

      {/* ── STICKY MODELS ────────────────────────────────────── */}
      <ModelsSection />

      {/* ── METRICS BAND ─────────────────────────────────────── */}
      <section className="py-20 bg-panel border-y border-border-def">
        <div className="max-w-content mx-auto px-12">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border-def"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
          >
            {METRICS.map((m) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                className="flex flex-col items-center py-10 md:py-0"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-display font-black text-7xl text-white leading-none">
                    {m.value}
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase text-center px-4">{m.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BRAND STORY ──────────────────────────────────────── */}
      <section id="about" className="py-32 bg-black grid-overlay">
        <div className="max-w-content mx-auto px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal variants={slideLeft}>
              <div className="flex items-center gap-6 mb-10">
                <div className="w-8 h-px bg-sky" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase">Brand Philosophy</span>
              </div>
              <h2 className="font-display font-black text-6xl uppercase leading-none text-white mb-8">
                Precision<br />Is Not<br />Optional.
              </h2>
              <p className="font-sans font-light text-sm text-muted leading-relaxed mb-6 max-w-sm">
                VMOTO was founded on a single premise: that electric mobility should not require compromise. Not in range. Not in performance. Not in the feel of the machine beneath you.
              </p>
              <p className="font-sans font-light text-sm text-muted leading-relaxed max-w-sm">
                Every motorcycle we build is engineered with aerospace discipline — validated by data, refined by riders, and built for the road that exists, not the one we imagine.
              </p>
              <div className="mt-10 flex items-center gap-6">
                <div className="h-px flex-1 bg-border-def" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-muted uppercase">Est. 2010</span>
              </div>
            </Reveal>

            <Reveal variants={slideRight}>
              <div className="grid grid-cols-2 gap-px bg-border-def border border-border-def">
                {[
                  { num: '50+', label: 'Countries' },
                  { num: '200K', label: 'Units Delivered' },
                  { num: '14', label: 'Years Engineering' },
                  { num: '3', label: 'Active Platforms' },
                ].map((s) => (
                  <div key={s.label} className="bg-panel p-10 flex flex-col items-center justify-center">
                    <div className="font-display font-black text-5xl text-white mb-2">{s.num}</div>
                    <div className="font-mono text-[9px] tracking-widest text-sky uppercase">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── VIDEO REEL ───────────────────────────────────────── */}
      <VideoSection />

      {/* ── LINEUP GRID ──────────────────────────────────────── */}
      <section className="py-24 bg-panel">
        <div className="max-w-content mx-auto px-12">
          <Reveal>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <div className="w-8 h-px bg-sky" />
                <span className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase">Full Lineup</span>
              </div>
              <a href="/#models" className="font-mono text-[10px] tracking-widest text-muted hover:text-sky uppercase transition-colors duration-150">
                View All ——
              </a>
            </div>
          </Reveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
          >
            {MODELS.map((m) => (
              <motion.div
                key={m.id}
                variants={fadeUp}
                className="card-circuit bg-black group cursor-pointer"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <div className="relative aspect-[4/3] bg-surface overflow-hidden">
                  <div className="absolute inset-0 bike-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-contain p-8"
                    style={m.imageScale ? { transform: `scale(${m.imageScale})` } : undefined}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
                <div className="p-6">
                  <div className="font-mono text-[9px] tracking-widest text-sky uppercase mb-2">{m.tagline}</div>
                  <div className="font-display font-black text-3xl uppercase text-white mb-4">{m.name}</div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-sky">RANGE</span>
                    <span className="text-muted">———</span>
                    <span className="text-white">{m.range} KM</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono mt-2">
                    <span className="text-sky">TOP SPEED</span>
                    <span className="text-muted">———</span>
                    <span className="text-white">{m.topSpeed} KM/H</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRESS ────────────────────────────────────────────── */}
      <section className="py-32 bg-sky border-t border-sky">
        <div className="max-w-content mx-auto px-12">
          <Reveal>
            <div className="flex items-center gap-6 mb-16">
              <div className="w-8 h-px bg-black/30" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-black/60 uppercase">What Our Customers Say About Us</span>
            </div>
          </Reveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 border border-black/10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-5%' }}
          >
            {PRESS.map((p) => (
              <motion.div
                key={p.source}
                variants={fadeUp}
                className="bg-sky p-10 flex flex-col justify-between"
              >
                <p className="font-sans font-light text-base text-black leading-relaxed mb-8">
                  &ldquo;{p.quote}&rdquo;
                </p>
                <div>
                  <div className="h-px bg-black/15 mb-6" />
                  <div className="font-mono text-[9px] tracking-widest text-black/70 uppercase">{p.source}</div>
                  <div className="font-mono text-[9px] tracking-widest text-black/50 mt-1">{p.year}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PARTNERSHIPS SLIDER ───────────────────────────────── */}
      <PartnershipsSlider />

      {/* ── NEWS & MEDIA ─────────────────────────────────────── */}
      <NewsSection />

      {/* ── VIDEO GALLERY ────────────────────────────────────── */}
      <VideoGallery />

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section id="contact-cta" className="py-24 bg-panel border-t border-sky">
        <Reveal className="max-w-content mx-auto px-12 text-center">
          <div className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase mb-6">Ready to Ride</div>
          <h2 className="font-display font-black text-6xl uppercase text-white mb-6">Book a Test Ride</h2>
          <p className="font-sans font-light text-sm text-muted max-w-md mx-auto mb-10">
            Experience the machine in person. Find your nearest VMOTO dealer and schedule a session.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.a
              href="/contact"
              className="font-mono text-xs tracking-widest uppercase text-black bg-sky px-10 py-4 hover:bg-sky-deep transition-colors duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Book Test Ride
            </motion.a>
            <motion.a
              href="/dealers"
              className="font-mono text-xs tracking-widest uppercase text-white border border-white/20 px-10 py-4 hover:border-sky hover:text-sky transition-all duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Find Dealers
            </motion.a>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

/* ─── PARTNERSHIPS SLIDER ────────────────────────────────────────── */
const PARTNERS = [
  {
    image: '/images/partner-uber-eats.jpg',
    label: 'Uber Eats',
    caption: 'Official Electric Fleet Partner',
  },
  {
    image: '/images/partner-porsche.jpg',
    label: 'Porsche Carrera Cup Italia',
    caption: 'Official Electric Scooter Supplier 2025–2026',
  },
  {
    image: '/images/partner-vr46.jpg',
    label: 'Pertamina Enduro VR46 Racing Team',
    caption: 'Official Electric Scooter Supplier',
  },
  {
    image: '/images/partner-motogp.jpg',
    label: 'MotoGP',
    caption: 'Official Electric Scooter Supplier',
  },
]

function PartnershipsSlider() {
  const [current, setCurrent] = useState(0)
  const count = PARTNERS.length

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % count), 5000)
    return () => clearInterval(timer)
  }, [count])

  const prev = () => setCurrent((c) => (c - 1 + count) % count)
  const next = () => setCurrent((c) => (c + 1) % count)

  return (
    <section className="relative bg-black border-t border-border-def overflow-hidden" style={{ height: 'clamp(320px, 55vw, 640px)' }}>
      {/* Header label */}
      <div className="absolute top-6 left-6 md:top-8 md:left-12 z-20 flex items-center gap-4">
        <div className="w-6 h-px bg-sky" />
        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-sky uppercase">Global Partnerships</span>
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            src={PARTNERS[current].image}
            alt={PARTNERS[current].label}
            className="w-full h-full object-cover"
          />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Caption */}
      <div className="absolute bottom-8 left-6 md:bottom-10 md:left-12 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-caption'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="font-display font-black text-lg md:text-2xl uppercase text-white tracking-tight leading-none mb-1">
              {PARTNERS[current].label}
            </div>
            <div className="font-mono text-[9px] md:text-[10px] tracking-widest text-sky uppercase">
              {PARTNERS[current].caption}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <div className="absolute bottom-8 right-6 md:bottom-10 md:right-12 z-20 flex items-center gap-3">
        {[prev, next].map((fn, i) => (
          <button
            key={i}
            onClick={fn}
            className="w-9 h-9 border border-white/25 hover:border-sky hover:text-sky text-white/60 flex items-center justify-center transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d={i === 0 ? 'M9 2L4 7l5 5' : 'M5 2l5 5-5 5'}
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {PARTNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-5 h-1.5 bg-sky' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

/* ─── NEWS & MEDIA ───────────────────────────────────────────────── */
function NewsSection() {
  const [featured, ...rest] = NEWS_ARTICLES

  return (
    <section id="news" className="py-24 bg-panel border-t border-border-def">
      <div className="max-w-content mx-auto px-6 md:px-12">

        {/* Header */}
        <Reveal className="mb-12">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-8 h-px bg-sky" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase">VMOTO Global</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl uppercase text-white tracking-tight">
            News &amp; Media
          </h2>
        </Reveal>

        {/* Featured article */}
        <Reveal className="mb-6">
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col md:flex-row overflow-hidden border border-border-def hover:border-sky/50 transition-colors duration-300 bg-black"
          >
            <div className="w-full md:w-3/5 aspect-[16/9] md:aspect-auto md:h-80 overflow-hidden shrink-0">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-between p-6 md:p-8 flex-1">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[9px] tracking-widest uppercase text-sky border border-sky/40 px-2 py-0.5">
                    {featured.tag}
                  </span>
                  <span className="font-mono text-[9px] tracking-widest text-muted uppercase">{featured.date}</span>
                </div>
                <h3 className="font-display font-black text-xl md:text-2xl uppercase text-white leading-tight mb-4 group-hover:text-sky transition-colors duration-200">
                  {featured.title}
                </h3>
                <p className="font-sans text-sm text-muted leading-relaxed">{featured.summary}</p>
              </div>
              <div className="flex items-center gap-2 mt-6 font-mono text-[10px] tracking-widest text-sky uppercase">
                Read More
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </a>
        </Reveal>

        {/* Grid of remaining articles */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-8%' }}
        >
          {rest.map((article) => (
            <motion.a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              className="group flex flex-col overflow-hidden border border-border-def hover:border-sky/50 transition-colors duration-300 bg-black"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[8px] tracking-widest uppercase text-sky border border-sky/40 px-1.5 py-0.5">
                    {article.tag}
                  </span>
                  <span className="font-mono text-[8px] tracking-widest text-muted uppercase">{article.date}</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-white leading-snug group-hover:text-sky transition-colors duration-200 line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <p className="font-sans text-xs text-muted leading-relaxed line-clamp-2 flex-1">{article.summary}</p>
                <div className="flex items-center gap-1.5 mt-4 font-mono text-[9px] tracking-widest text-sky uppercase">
                  Read More
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

/* ─── VIDEO GALLERY ──────────────────────────────────────────────── */
const GALLERY_VIDEOS = [
  { id: 'RP9Tf4aCfmY', title: 'CU & CUmini' },
  { id: 'OByaO2JyiNg', title: 'TC Wanderer' },
  { id: '6L-KLUHkUKE', title: 'Vmoto × Pininfarina' },
  { id: 'A1IN1soG8Wg', title: 'TS Street Hunter S' },
  { id: '_E61yuaNn-U', title: 'Circuit Experience' },
  { id: '1iBe5j5CzmU', title: 'Stash' },
]

function VideoGallery() {
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    document.body.style.overflow = activeVideo ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeVideo])

  return (
    <>
      <section className="py-24 bg-black border-t border-border-def">
        <div className="max-w-content mx-auto px-12">
          <Reveal>
            <div className="flex items-center gap-6 mb-12">
              <div className="w-8 h-px bg-sky" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase">VMOTO Films</span>
            </div>
          </Reveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
          >
            {GALLERY_VIDEOS.map((v, i) => (
              <motion.div
                key={v.id}
                variants={fadeUp}
                className="relative group cursor-pointer overflow-hidden"
                onClick={() => setActiveVideo(v.id)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-surface">
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-14 h-14 border border-sky/60 flex items-center justify-center bg-black/40 group-hover:border-sky group-hover:bg-black/60 transition-all duration-300"
                      animate={{ boxShadow: ['0 0 0px rgba(159,221,234,0)', '0 0 20px rgba(159,221,234,0.25)', '0 0 0px rgba(159,221,234,0)'] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: i * 0.3 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#9FDDEA">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* HUD corner marks */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-sky/40" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-sky/40" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-sky/40" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-sky/40" />
                </div>

                {/* Label strip */}
                <div className="bg-panel border border-border-def border-t-0 px-4 py-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-widest text-white uppercase">{v.title}</span>
                  <span className="font-mono text-[8px] tracking-widest text-sky uppercase">Play</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveVideo(null)}
          >
            <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-sky/50" />
            <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-sky/50" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-sky/50" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-sky/50" />

            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-8 right-8 font-mono text-[10px] tracking-widest text-muted uppercase hover:text-sky transition-colors z-10 flex items-center gap-2"
            >
              <span>Close</span>
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>

            <motion.div
              className="w-full max-w-5xl mx-8 aspect-video"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1&color=white`}
                title="VMOTO Film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── VIDEO SECTION ──────────────────────────────────────────────── */
const VIDEO_ID = 'jDO-MARlBvs'

function VideoSection() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <section id="video" ref={ref} className="relative h-[70vh] bg-black overflow-hidden flex items-center justify-center cursor-pointer group" onClick={() => setOpen(true)}>
        {/* YouTube thumbnail as background — parallax */}
        <motion.div className="absolute inset-0" style={{ y }}>
          <img
            src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
            alt="VMOTO Film"
            className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500 scale-105"
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
        {/* Subtle grid on top */}
        <div className="absolute inset-0 grid-overlay opacity-40" />

        <Reveal className="relative z-10 text-center pointer-events-none">
          {/* Animated play button */}
          <motion.div
            className="w-24 h-24 border-2 border-sky flex items-center justify-center mx-auto mb-8 relative"
            animate={{ boxShadow: ['0 0 0px rgba(159,221,234,0)', '0 0 30px rgba(159,221,234,0.3)', '0 0 0px rgba(159,221,234,0)'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            {/* Corner accents on play button */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-sky" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-sky" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-sky" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-sky" />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#9FDDEA">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>

          <div className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase mb-3">Film</div>
          <h3 className="font-display font-black text-5xl uppercase text-white mb-3">The VMOTO Film</h3>
          <p className="font-sans font-light text-sm text-muted">Click to watch</p>
        </Reveal>
      </section>

      {/* ── MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
          >
            {/* Corner HUD marks on modal */}
            <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-sky/50" />
            <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-sky/50" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-sky/50" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-sky/50" />

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-8 right-8 font-mono text-[10px] tracking-widest text-muted uppercase hover:text-sky transition-colors z-10 flex items-center gap-2"
            >
              <span>Close</span>
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>

            {/* Video frame */}
            <motion.div
              className="w-full max-w-5xl mx-8 aspect-video"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&color=white`}
                title="VMOTO Film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
