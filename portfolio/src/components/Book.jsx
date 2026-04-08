import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { BookOpen, ExternalLink, Feather, Star } from 'lucide-react'
import { fadeUp, slideLeft, slideRight, stagger } from '../utils/animations'

const BOOK = {
  title:       'Your Novel Title Here',
  genre:       'Epic Fantasy',
  wordCount:   '250,000',
  pages:       '~700',
  description: `A sweeping epic fantasy set in a world where [brief premise]. Featuring multiple POV characters, an intricate magic system, and a plot that spans continents and centuries.`,
  longDescription: `Writing this book was the hardest and most rewarding project I've ever completed. 250,000 words. Months of daily writing, world-building, outlining, and revising. Three full editing passes. A self-designed cover. And then — publication.

The process taught me more about discipline, long-form structure, and shipping a creative work than anything else I've done. The same principles apply to software: design before you code, maintain consistency across the whole system, and don't stop until you can say "this is done."`,
  publishUrl:  '',   // ← Add your Amazon/Kindle/Gumroad URL here
  coverImage:  '',   // ← Add path to cover image in /public/
}

const STATS = [
  { value: '250K',    label: 'Words',         icon: Feather },
  { value: '~700',    label: 'Pages',         icon: BookOpen },
  { value: 'Self',    label: 'Published',     icon: Star },
]

export default function Book() {
  const [headRef, headInView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="book" className="section-padding">
      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={headRef}
          variants={stagger}
          initial="hidden"
          animate={headInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="section-label">Beyond Code</motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            I also wrote a book
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Before writing React components, I wrote worlds. A 250,000-word fantasy novel — fully outlined, drafted, edited, and self-published.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Book cover */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Book 3D effect */}
              <div className="relative w-56 sm:w-64">
                {/* Shadow pages */}
                <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-r-lg rounded-l-sm bg-slate-200 dark:bg-slate-700" />
                <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-r-lg rounded-l-sm bg-slate-300 dark:bg-slate-600" />

                {/* Cover */}
                <div className="relative aspect-[2/3] rounded-r-lg rounded-l-sm overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
                  {BOOK.coverImage ? (
                    <img src={BOOK.coverImage} alt={BOOK.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-500 via-brand-600 to-slate-800 flex flex-col items-center justify-center p-6 text-white text-center">
                      <BookOpen size={40} className="mb-4 opacity-70" />
                      <p className="text-xs font-mono opacity-60 mb-3 tracking-widest uppercase">{BOOK.genre}</p>
                      <p className="font-bold text-lg leading-tight">{BOOK.title}</p>
                      <div className="mt-4 w-8 h-0.5 bg-white/40" />
                      <p className="text-xs mt-3 opacity-50">Dinesh S</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats floating around */}
              {STATS.map(({ value, label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className={`absolute card px-3 py-2 flex items-center gap-2 shadow-lg ${
                    i === 0 ? '-top-4 -right-8' :
                    i === 1 ? 'top-1/2 -right-12 -translate-y-1/2' :
                    '-bottom-4 -right-6'
                  }`}
                >
                  <Icon size={14} className="text-brand-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{value}</div>
                    <div className="text-xs text-slate-400">{label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Description */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/20 mb-4">
              {BOOK.genre}
            </span>

            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {BOOK.title}
            </h3>

            <p className="text-slate-500 dark:text-slate-500 font-mono text-sm mb-6">
              {BOOK.wordCount} words · {BOOK.pages} pages · Self-published
            </p>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {BOOK.description}
            </p>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mb-8">
              {BOOK.longDescription.split('\n\n').map((para, i) => (
                <p key={i} className={`text-slate-600 dark:text-slate-400 leading-relaxed text-sm ${i > 0 ? 'mt-3' : ''}`}>
                  {para}
                </p>
              ))}
            </div>

            {/* The engineering parallel */}
            <div className="p-4 rounded-xl border-l-4 border-brand-500 bg-brand-50 dark:bg-brand-950/30 mb-8">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-brand-600 dark:text-brand-400">Why does this matter for software?</span>
                {' '}Writing 250K words requires the same skills as building large codebases: structure, consistency, managing complexity at scale, and finishing what you start.
              </p>
            </div>

            {BOOK.publishUrl ? (
              <a
                href={BOOK.publishUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <ExternalLink size={16} />
                Read the Book
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 font-medium text-sm cursor-default">
                <BookOpen size={16} />
                Publishing link coming soon
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
