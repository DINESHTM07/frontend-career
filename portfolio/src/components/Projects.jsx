import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Layers } from 'lucide-react'
import { projects } from '../data/projects'
import { fadeUp, stagger, scaleIn } from '../utils/animations'

const TAG_COLORS = {
  'React':          'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300',
  'TypeScript':     'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
  'JavaScript':     'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300',
  'Tailwind CSS':   'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300',
  'Next.js':        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  'Vite':           'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
  'Framer Motion':  'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
  'Zustand':        'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300',
  'TanStack Query': 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
  'Recharts':       'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
  'React Router':   'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300',
}

function getTagColor(tag) {
  return TAG_COLORS[tag] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
}

function ProjectCard({ project, index, featured }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.article
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`card overflow-hidden flex flex-col group ${featured ? 'lg:col-span-1' : ''}`}
    >
      {/* Screenshot / Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-300 dark:text-slate-600">
            <Layers size={40} strokeWidth={1} />
            <span className="text-xs font-medium font-mono">screenshot coming soon</span>
          </div>
        )}

        {/* Featured badge */}
        {project.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-500 text-white shadow">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-1 text-xs font-medium rounded-md ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 mt-auto">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Github size={15} />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              <ExternalLink size={15} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [headRef, headInView] = useInView({ triggerOnce: true, threshold: 0.2 })

  const featured = projects.filter((p) => p.featured)
  const rest     = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="section-padding bg-slate-50/50 dark:bg-slate-900/30">
      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={headRef}
          variants={stagger}
          initial="hidden"
          animate={headInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="section-label">Projects</motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            Things I've built
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Real projects, real decisions. Not tutorial clones — each one designed from scratch to solve a specific problem.
          </motion.p>
        </motion.div>

        {/* Featured projects */}
        {featured.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {featured.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} featured />
            ))}
          </div>
        )}

        {/* Rest of projects */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Data file hint */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-xs font-mono text-slate-400 dark:text-slate-600 mt-12"
        >
          ← projects are defined in <code className="text-brand-400">src/data/projects.js</code> — edit that file to add more →
        </motion.p>
      </div>
    </section>
  )
}
