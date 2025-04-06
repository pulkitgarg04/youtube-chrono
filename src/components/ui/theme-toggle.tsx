import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem('theme') === 'dark'
    );

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <motion.button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-200 glow-element"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
        >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
    );
}
