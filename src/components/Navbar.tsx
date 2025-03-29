import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Moon, Sun, Youtube, Github } from "lucide-react"

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark", !darkMode)
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-zinc-900/80 backdrop-blur-md text-white border-b border-zinc-800 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-lg font-semibold flex items-center glow-element"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        <Youtube className="text-red-500 mr-2" />
        <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          YouTube Chrono
        </span>
      </motion.div>

      <div className="flex items-center space-x-4">
        <motion.button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-zinc-800 transition-colors duration-200 glow-element"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
        <motion.a
          href="https://github.com/pulkitgarg04/youtube-chrono"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-zinc-800 transition-colors duration-200 glow-element"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Github size={20} />
        </motion.a>
      </div>
    </motion.nav>
  )
}