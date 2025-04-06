import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains("glow-element")) {
        setCursorVariant("glow")
      } else {
        setCursorVariant("default")
      }
    }

    window.addEventListener("mousemove", mouseMove)
    document.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      document.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(147, 51, 234, 0.1)",
      borderColor: "rgba(147, 51, 234, 0.3)",
      mixBlendMode: "normal" as const,
      scale: [1, 1.05, 1],
      transition: {
        scale: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
        },
      },
    },
    glow: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: "rgba(147, 51, 234, 0.15)",
      borderColor: "rgba(236, 72, 153, 0.5)",
      mixBlendMode: "screen" as const,
      scale: [1, 1.1, 1],
      transition: {
        scale: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
        },
      },
    },
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-50 hidden md:block"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <style>{`
        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
        }
        
        .glow-element {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  )
}