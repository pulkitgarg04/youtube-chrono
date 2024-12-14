import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { FaYoutube, FaGithub } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-900 text-black dark:text-white shadow-md z-50">
      <div className="text-lg font-semibold flex items-center">
        <FaYoutube className="text-red-500 text-2xl" />
        <span className="mx-2">YouTube Chrono</span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? <IoMoonOutline size={24} /> : <IoSunnyOutline size={24} />}
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FaGithub size={24} />
        </a>
      </div>
    </nav>
  );
}