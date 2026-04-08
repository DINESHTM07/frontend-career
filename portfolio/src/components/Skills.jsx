import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { fadeUp, stagger, scaleIn } from '../utils/animations'

const SKILLS = [
  // Core
  { name: 'JavaScript',    category: 'Core',      level: 90, color: '#F7DF1E', emoji: 'JS' },
  { name: 'TypeScript',    category: 'Core',      level: 80, color: '#3178C6', emoji: 'TS' },
  { name: 'HTML5',         category: 'Core',      level: 95, color: '#E34F26', emoji: 'H5' },
  { name: 'CSS3',          category: 'Core',      level: 90, color: '#1572B6', emoji: 'C3' },
  // Framework
  { name: 'React',         category: 'Framework', level: 88, color: '#61DAFB', emoji: '⚛️' },
  { name: 'Next.js',       category: 'Framework', level: 75, color: '#000000', emoji: 'N'  },
  // Styling
  { name: 'Tailwind CSS',  category: 'Styling',   level: 92, color: '#06B6D4', emoji: 'TW' },
  { name: 'Framer Motion', category: 'Styling',   level: 78, color: '#0055FF', emoji: 'FM' },
  { name: 'Shadcn/UI',     category: 'Styling',   level: 72, color: '#18181B', emoji: 'SH' },
  // Tools
  { name: 'Git',           category: 'Tools',     level: 85, color: '#F05032', emoji: 'G'  },
]

const CATEGORIES = ['Core', 'Framework', 'Styling', 'Tools']

const CATEGORY_COLORS = {
  Core:      'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Framework: 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  Styling:   'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Tools:     'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
}

function SkillBar({ name, level, color, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>
        <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay: index * 0.07, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function SkillChip({ name, emoji, color, category }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.05, y: -2 }}
      className={`card px-4 py-3 flex items-center gap-3 cursor-default border ${CATEGORY_COLORS[category]}`}
    >
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ backgroundColor: color === '#000000' ? '#374151' : color, color: color === '#F7DF1E' ? '#000' : '#fff' }}
      >
        {emoji.length <= 2 ? emoji : '✦'}
      </span>
      <span className="font-medium text-sm">{name}</span>
    </motion.div>
  )
}

export default function Skills() {
  const [headRef, headInView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="skills" className="section-padding">
      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={headRef}
          variants={stagger}
          initial="hidden"
          animate={headInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="section-label">Skills</motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            What I work with
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Built through months of deliberate practice — not just tutorials, but real projects with real decisions.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Skill chips by category */}
          <div className="space-y-8">
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-3">{cat}</h3>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {SKILLS.filter((s) => s.category === cat).map((skill) => (
                    <SkillChip key={skill.name} {...skill} />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-6">Proficiency</h3>
            {SKILLS.map((skill, i) => (
              <SkillBar key={skill.name} {...skill} index={i} />
            ))}
          </div>
        </div>

        {/* Also comfortable with */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">Also comfortable with</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Zustand', 'TanStack Query', 'React Router', 'Vite', 'Recharts', 'Zod', 'React Hook Form', 'ESLint', 'Prettier', 'Figma'].map((tool) => (
              <span
                key={tool}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
