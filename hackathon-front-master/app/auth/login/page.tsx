"use client";

import { LoginUseCase } from "@/core/usecases/LoginUseCase";
import { LoginForm } from "@/presentation/components/LoginForm";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthRepository } from "@/infrastructure/repositories/AuthRepository";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";

export default function LoginPage() {
	const router = useRouter();
	const dispatch = useDispatch();
	const authRepository = new AuthRepository();
	const loginUseCase = new LoginUseCase(authRepository);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleLogin = async (email: string, password: string) => {
		try {
			await loginUseCase.execute(email, password, dispatch);

			router.push("/dashboard");
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMessage(error.message || "Error desconocido al iniciar sesión");
			} else {
				setErrorMessage("Error desconocido al iniciar sesión");
			}
			setIsDialogOpen(true);
		}
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
		setErrorMessage(null);
	};

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
						<FiUser className="h-10 w-10 text-blue-500 dark:text-blue-400" />
					</div>
				</div>
				<h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
					Iniciar Sesión
				</h1>
				<LoginForm onSubmit={handleLogin} />
				<p className="text-center text-gray-600 dark:text-gray-400">
					¿No tienes cuenta?{" "}
					<Link
						href="/auth/register"
						className="text-blue-500 dark:text-blue-400 hover:underline">
						Regístrate aquí
					</Link>
					.
				</p>
			</motion.div>

			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Error de Inicio de Sesión</DialogTitle>
						<DialogDescription>{errorMessage}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={closeDialog}>Cerrar</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
