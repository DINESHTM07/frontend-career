import { useDarkMode } from './hooks/useDarkMode'
import Navbar   from './components/Navbar'
import Hero     from './components/Hero'
import About    from './components/About'
import Skills   from './components/Skills'
import Projects from './components/Projects'
import Book     from './components/Book'
import Contact  from './components/Contact'
import Footer   from './components/Footer'

export default function App() {
  const [isDark, setIsDark] = useDarkMode()

  return (
    <div className="min-h-screen">
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Book />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
