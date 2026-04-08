import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Github, Linkedin, Send, CheckCircle, AlertCircle, MapPin } from 'lucide-react'
import { fadeUp, slideLeft, slideRight, stagger } from '../utils/animations'

// ─── Replace with your Formspree endpoint ─────────────────────────────────────
// Sign up free at https://formspree.io, create a form, copy the endpoint.
// Example: 'https://formspree.io/f/xyzabcde'
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'
// ──────────────────────────────────────────────────────────────────────────────

const SOCIALS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'dinesh@example.com',   // ← replace
    href:  'mailto:dinesh@example.com',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/DINESHTM07',
    href:  'https://github.com/DINESHTM07',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/dinesh',  // ← replace
    href:  'https://linkedin.com/in/',
  },
]

export default function Contact() {
  const [headRef, headInView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(formState),
      })
      if (res.ok) {
        setStatus('success')
        setFormState({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all duration-200 text-sm'

  return (
    <section id="contact" className="section-padding bg-slate-50/50 dark:bg-slate-900/30">
      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={headRef}
          variants={stagger}
          initial="hidden"
          animate={headInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="section-label">Contact</motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            Let's build something together
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Whether it's a job opportunity, a project, or just a conversation about frontend — I'm all ears. I reply to everything.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left — contact info */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Location */}
            <div className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-brand-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Location</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">Thanjavur, Tamil Nadu, India</p>
                <p className="text-slate-400 dark:text-slate-600 text-xs mt-0.5">Open to remote roles worldwide</p>
              </div>
            </div>

            {/* Social links */}
            {SOCIALS.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="card p-5 flex items-center gap-4 hover:border-brand-200 dark:hover:border-brand-800 group transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center shrink-0 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                  <Icon size={18} className="text-brand-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{label}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 group-hover:text-brand-500 transition-colors">{value}</p>
                </div>
              </a>
            ))}

            {/* Availability badge */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                Available for new opportunities
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell me about the role, project, or what you'd like to discuss..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm"
                >
                  <CheckCircle size={16} />
                  Message sent! I'll get back to you soon.
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm"
                >
                  <AlertCircle size={16} />
                  Something went wrong. Email me directly instead.
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'sending' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-xs text-center text-slate-400 dark:text-slate-600">
                Powered by Formspree · I reply within 24 hours
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
