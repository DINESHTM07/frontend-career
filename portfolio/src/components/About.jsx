import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GraduationCap, BookOpen, Heart, Code2, Sparkles } from 'lucide-react'
import { fadeUp, slideLeft, slideRight, stagger } from '../utils/animations'

const STORY_CARDS = [
  {
    icon: GraduationCap,
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    title: 'ECE Graduate',
    body: 'Studied Electronics & Communication Engineering at GCE Thanjavur. Graduated with a foundation in systems thinking, signal flow, and state machines — mental models that turned out to map beautifully onto React.',
  },
  {
    icon: BookOpen,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    title: 'Published Author',
    body: 'Wrote and self-published a 250,000-word fantasy novel — roughly the length of two normal books. That project taught me more about discipline, long-form structure, and finishing hard things than anything else I\'ve done.',
  },
  {
    icon: Heart,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
    title: 'Recovery & Pivot',
    body: 'A medical recovery period forced me to slow down and rethink my path. I used that time intentionally — writing the novel, discovering frontend development, and making a deliberate choice to go deep on React.',
  },
  {
    icon: Code2,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    title: 'Self-Taught with AI',
    body: 'I learned React, TypeScript, and the full modern frontend ecosystem through structured self-study — using AI tools as a learning accelerator, not a shortcut. I built real projects, not tutorial clones.',
  },
  {
    icon: Sparkles,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    title: 'Why Frontend?',
    body: 'The feedback loop hooked me. Write a component in the morning, show it to someone that afternoon. Every decision I make directly affects how a real person\'s day goes. That kind of impact — I\'m not letting it go.',
  },
]

function StoryCard({ icon: Icon, color, title, body, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.1 }}
      className="card p-6 flex gap-4"
    >
      <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{body}</p>
      </div>
    </motion.div>
  )
}

export default function About() {
  const [headRef, headInView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="about" className="section-padding bg-slate-50/50 dark:bg-slate-900/30">
      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={headRef}
          variants={stagger}
          initial="hidden"
          animate={headInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="section-label">About Me</motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            The story behind the code
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            I'm not a developer who fell into this accidentally. I chose it — after trying other paths, discovering where I genuinely come alive, and going all-in.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — personal paragraph */}
          <div>
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="prose prose-slate dark:prose-invert max-w-none"
            >
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg mb-6">
                My path to frontend development wasn't a straight line — and I think that's exactly what makes me a better engineer.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                I graduated in Electronics & Communication Engineering from{' '}
                <span className="text-slate-900 dark:text-white font-medium">GCE Thanjavur</span>.
                While my peers were entering traditional engineering roles, I spent a period in medical recovery — and decided not to waste it. I wrote a <span className="text-slate-900 dark:text-white font-medium">250,000-word fantasy novel</span>, self-published it, and simultaneously discovered that frontend development was where my skills and passion actually overlapped.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                The ECE background isn't wasted — it shows up in how I think. Systems, state machines, signal flow, feedback loops. React makes intuitive sense when you already understand those concepts at a hardware level.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                I'm <span className="text-slate-900 dark:text-white font-medium">self-taught</span>, which means I learned by building real things, reading source code, studying the why behind patterns, and being deeply intentional about what I chose to understand versus skim. The interview vault I built — 160+ questions with full explanations — is the clearest evidence I can offer that I take depth seriously.
              </p>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.2 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              {[
                { value: '250K', label: 'Words written', sub: 'published novel' },
                { value: '160+', label: 'Q&As built', sub: 'interview vault' },
                { value: '∞',   label: 'Curiosity',     sub: 'still going' },
              ].map(({ value, label, sub }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-2xl font-bold text-brand-500 mb-0.5">{value}</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-600">{sub}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — story cards */}
          <div className="flex flex-col gap-4">
            {STORY_CARDS.map((card, i) => (
              <StoryCard key={card.title} {...card} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
