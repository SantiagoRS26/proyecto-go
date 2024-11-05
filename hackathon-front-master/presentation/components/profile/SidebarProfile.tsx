"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const SidebarProfile = ({
  currentPath,
  isMobile = false,
}: {
  currentPath: string;
  isMobile?: boolean;
}) => {
  const sidebarItems = [
    { name: "Notificaciones", path: "/dashboard/profile/notifications" }
  ];

  if (isMobile) {
    // Dropdown para pantallas móviles
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full flex justify-between items-center transition-colors duration-300 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2">
            Menu <FiChevronDown className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DropdownMenuContent className="w-64 bg-white transition-colors duration-300 dark:bg-gray-800 shadow-lg rounded-md">
            {sidebarItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link
                  href={item.path}
                  className={`block py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    currentPath === item.path
                      ? "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </motion.div>
      </DropdownMenu>
    );
  }

  // Sidebar normal para pantallas grandes
  return (
    <motion.aside
      initial={{ x: -50 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="w-64 bg-gray-50 h-full dark:bg-gray-800 p-5 border-r border-gray-200 dark:border-gray-700"
    >
      <ul className="space-y-2">
        {sidebarItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`block py-2 px-4 text-sm font-medium rounded-lg ${
                currentPath === item.path
                  ? "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
};

export default SidebarProfile;
