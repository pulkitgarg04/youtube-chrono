import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getToastColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "info":
        return "bg-purple-500"
      default:
        return "bg-purple-500"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-20 right-4 z-50 max-w-md"
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className={`flex items-center p-4 rounded-lg shadow-lg ${getToastColor()} text-white`}>
            <div className="flex-1 mr-2">{message}</div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}