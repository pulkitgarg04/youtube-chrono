import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      className="hidden md:flex fixed bottom-0 left-0 w-full h-16 bg-zinc-900/80 backdrop-blur-md text-zinc-400 border-t border-zinc-800 items-center justify-center"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-center text-sm font-medium">
        © {new Date().getFullYear()} YouTube Chrono. All Rights Reserved.
        <br className="hidden md:block" />
        <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Made with ❤️ by Pulkit Garg
        </span>
      </p>
    </motion.footer>
  )
}