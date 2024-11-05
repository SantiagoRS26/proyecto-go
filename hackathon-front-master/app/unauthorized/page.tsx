"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-t from-white to-blue-200 dark:from-gray-900 dark:to-gray-800">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 100 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col gap-y-6 w-full max-w-md p-8 bg-white/30 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-lg">
				<div className="flex justify-center">
					<div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-3xl shadow-md">
						<FiAlertCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
					</div>
				</div>
				<h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-200">
					Acceso no autorizado
				</h1>
				<p className="text-center text-gray-600 dark:text-gray-400">
					No tienes permiso para acceder a esta página.
				</p>
				<p className="text-center text-gray-600 dark:text-gray-400">
					Si crees que esto es un error, por favor, contacta con el
					administrador.
				</p>
				<Link href="/">
					<Button className="mt-4 w-full bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300">
						Volver al inicio
					</Button>
				</Link>
			</motion.div>
		</div>
	);
}
