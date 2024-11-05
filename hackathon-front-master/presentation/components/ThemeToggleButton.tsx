// src/presentation/components/ThemeToggleButton.tsx

"use client";

import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
      aria-label="Cambiar tema"
    >
      <motion.div
        key={theme}
        initial={{ rotate: 0, opacity: 0 }}
        animate={{ rotate: 360, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        {theme === "dark" ? (
          <FiSun className="text-yellow-500" size={20} />
        ) : (
          <FiMoon className="text-gray-800" size={20} />
        )}
      </motion.div>
      <span className="ml-2 text-gray-700 dark:text-gray-200">
        {theme === "dark" ? "Claro" : "Oscuro"}
      </span>
    </button>
  );
};

export default ThemeToggleButton;
