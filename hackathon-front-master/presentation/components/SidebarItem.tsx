// SidebarItem.tsx

"use client";

import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/infrastructure/store";
import Link from "next/link";

interface SidebarItemProps {
	icon: ReactNode;
	text: string;
	href: string;
	active?: boolean;
	alert?: boolean;
	onClick?: () => void; // Nueva prop opcional
}

const SidebarItem: React.FC<SidebarItemProps> = ({
	icon,
	text,
	href,
	active,
	alert,
	onClick, // Desestructurar la nueva prop
}) => {
	const expanded = useSelector((state: RootState) => state.ui.expanded);
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Link href={href}>
			<motion.li
				onClick={onClick} // Adjuntar la función al clic
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
				className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors
          ${
						active
							? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 dark:from-indigo-700 dark:to-indigo-600 dark:text-indigo-100"
							: "hover:bg-indigo-50 dark:hover:bg-indigo-800 text-gray-600 dark:text-gray-300"
					}
        `}>
				{icon}
				<motion.span
					animate={{
						width: expanded ? "13rem" : "0rem",
						marginLeft: expanded ? "0.75rem" : "0rem",
					}}
					className="overflow-hidden truncate">
					{text}
				</motion.span>
				{alert && (
					<div
						className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 dark:bg-indigo-300 ${
							expanded ? "" : "top-2"
						}`}
					/>
				)}

				{!expanded && (
					<AnimatePresence>
						{isHovered && (
							<motion.div
								key="tooltip"
								initial={{ opacity: 0, x: -12 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -12 }}
								transition={{ duration: 0.2 }}
								className={`
                  absolute left-full rounded-md px-2 py-1 ml-6
                  bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 text-sm
                  shadow-lg
                `}>
								{text}
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</motion.li>
		</Link>
	);
};

export default SidebarItem;
