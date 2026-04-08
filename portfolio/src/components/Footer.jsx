import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

const SOCIALS = [
  { icon: Github,   href: 'https://github.com/DINESHTM07',  label: 'GitHub'   },
  { icon: Linkedin, href: 'https://linkedin.com/in/',        label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:dinesh@example.com',       label: 'Email'    },
]

const NAV = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Book',     href: '#book'     },
  { label: 'Contact',  href: '#contact'  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="font-mono font-semibold text-brand-500 text-lg mb-2">
              dinesh<span className="text-slate-300 dark:text-slate-700">.</span>dev
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed max-w-xs">
              Frontend developer. Published author. Building things that matter, one component at a time.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-4">Navigation</p>
            <ul className="space-y-2">
              {NAV.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-slate-500 dark:text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-4">Find me on</p>
            <div className="flex flex-col gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  <Icon size={15} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-600 flex items-center gap-1.5">
            © {year} Dinesh S · Built with React + Tailwind + Framer Motion
            <Heart size={11} className="text-rose-400 fill-rose-400" />
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-slate-400 dark:text-slate-600 hover:text-brand-500 dark:hover:text-brand-400 transition-colors font-mono"
          >
            ↑ back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
