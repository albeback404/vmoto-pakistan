import { useState } from 'react'

const ENQUIRY_TYPES = ['Book a Test Ride', 'Fleet / B2B Proposal', 'General Enquiry', 'Service & Support']
const MODELS = ['Stash', 'Wanderer', 'TC Max', 'Not Sure Yet']

export default function Contact() {
  const [form, setForm] = useState({
    type: '',
    name: '',
    email: '',
    phone: '',
    model: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="pt-16 min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-28 bg-panel border-b border-border-def grid-overlay overflow-hidden">
        <div className="max-w-content mx-auto px-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-8 h-px bg-sky" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase">Get in Touch</span>
          </div>
          <h1 className="font-display font-black text-[clamp(60px,9vw,120px)] uppercase leading-none text-white">
            Contact<br />
            <span className="text-sky">VMOTO</span>
          </h1>
        </div>
        <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-sky/30" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-sky/30" />
      </section>

      {/* Form + info */}
      <section className="py-24 bg-black">
        <div className="max-w-content mx-auto px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Info panel */}
            <div className="lg:col-span-2">
              <div className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase mb-8">Reach Us</div>

              <div className="space-y-8">
                {[
                  { label: 'General Enquiries', value: 'info@vmoto.com', mono: true },
                  { label: 'Fleet & B2B', value: 'fleet@vmoto.com', mono: true },
                  { label: 'Media', value: 'press@vmoto.com', mono: true },
                  { label: 'Headquarters', value: 'Perth, Western Australia', mono: false },
                ].map((item) => (
                  <div key={item.label} className="border-b border-border-def pb-6">
                    <div className="font-mono text-[9px] tracking-widest text-sky uppercase mb-2">{item.label}</div>
                    <div className={`${item.mono ? 'font-mono' : 'font-sans font-light'} text-sm text-white`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* HUD readout */}
              <div className="mt-12 border border-border-def p-6">
                <div className="font-mono text-[9px] tracking-widest text-sky uppercase mb-4">Response Time</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-5xl text-white">24</span>
                  <span className="font-mono text-[10px] text-sky uppercase tracking-widest">HR</span>
                </div>
                <div className="font-mono text-[9px] text-muted mt-2 tracking-widest uppercase">Business Days</div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="border border-sky p-16 text-center">
                  <div className="w-12 h-12 border-2 border-sky flex items-center justify-center mx-auto mb-6">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10l4 4 8-8" stroke="#9FDDEA" strokeWidth="2" strokeLinecap="square" />
                    </svg>
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.4em] text-sky uppercase mb-4">Transmission Received</div>
                  <h3 className="font-display font-black text-4xl uppercase text-white mb-4">Message Sent</h3>
                  <p className="font-sans font-light text-sm text-muted">
                    We'll be in touch within 24 hours on business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Enquiry type */}
                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-sky uppercase mb-3">
                      Enquiry Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {ENQUIRY_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, type: t }))}
                          className={`font-mono text-[10px] tracking-widest uppercase py-3 px-4 text-left border transition-all duration-150 ${
                            form.type === t
                              ? 'border-sky text-sky bg-sky/5'
                              : 'border-border-def text-muted hover:border-white/40 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-widest text-sky uppercase mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border-def focus:border-sky text-white font-sans text-sm px-4 py-3 outline-none transition-colors duration-150 placeholder:text-white/20"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-widest text-sky uppercase mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border-def focus:border-sky text-white font-sans text-sm px-4 py-3 outline-none transition-colors duration-150 placeholder:text-white/20"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Phone + Model */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-widest text-sky uppercase mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border-def focus:border-sky text-white font-mono text-sm px-4 py-3 outline-none transition-colors duration-150 placeholder:text-white/20"
                        placeholder="+1 000 000 0000"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] tracking-widest text-sky uppercase mb-2">
                        Model Interest
                      </label>
                      <select
                        name="model"
                        value={form.model}
                        onChange={handleChange}
                        className="w-full bg-surface border border-border-def focus:border-sky text-white font-mono text-sm px-4 py-3 outline-none transition-colors duration-150 appearance-none"
                      >
                        <option value="" className="bg-surface">Select Model</option>
                        {MODELS.map((m) => (
                          <option key={m} value={m} className="bg-surface">{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-mono text-[9px] tracking-widest text-sky uppercase mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full bg-surface border border-border-def focus:border-sky text-white font-sans text-sm px-4 py-3 outline-none transition-colors duration-150 resize-none placeholder:text-white/20"
                      placeholder="Describe your enquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full font-mono text-xs tracking-widest uppercase text-black bg-sky py-4 hover:bg-sky-deep transition-colors duration-200"
                  >
                    Send Enquiry
                  </button>

                  <p className="font-mono text-[9px] tracking-widest text-muted uppercase text-center">
                    Response within 24 hours on business days
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
