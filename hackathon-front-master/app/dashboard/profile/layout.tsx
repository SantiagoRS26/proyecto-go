"use client";

import React from "react";
import SidebarProfile from "@/presentation/components/profile/SidebarProfile";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const currentPath = usePathname();

	return (
		<div className="flex flex-col items-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 pb-4 pt-5">
			<motion.div
				className="w-full max-w-7xl"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}>
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
					Configuración
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Administre la configuración de su cuenta y establezca sus preferencias
					de correo electrónico.
				</p>
				<Separator className="my-4" />
			</motion.div>
			<motion.div
				className="flex w-full max-w-7xl flex-1 p-8 bg-white dark:bg-gray-800 shadow-sm rounded-lg flex-col md:flex-row transition-colors duration-300"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, ease: "easeOut" }}>
				<div className="block md:hidden mb-4 w-full">
					<SidebarProfile
						currentPath={currentPath}
						isMobile
					/>
				</div>
				<div className="hidden md:block min-w-[250px] max-w-[300px] flex-shrink-0">
					<SidebarProfile currentPath={currentPath} />
				</div>
				<div className="flex-1 p-6 overflow-auto">{children}</div>
			</motion.div>

			<Toaster />
		</div>
	);
}
