import { motion } from "framer-motion"
import { Youtube, Github } from "lucide-react"
import ThemeToggle from "../ui/theme-toggle"

export default function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 
                 bg-zinc-900/80 text-white border-b border-zinc-800 
                 backdrop-blur-md z-50 
                 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-200"
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
        <ThemeToggle />
        <motion.a
          href="https://github.com/pulkitgarg04/youtube-chrono"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full transition-colors duration-200 glow-element
                     hover:bg-zinc-800 dark:hover:bg-zinc-200 dark:text-zinc-800"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Github size={20} />
        </motion.a>
      </div>
    </motion.nav>
  )
}
