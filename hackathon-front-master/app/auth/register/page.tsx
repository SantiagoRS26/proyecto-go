"use client";

import { RegisterUseCase } from "@/core/usecases/RegisterUseCase";
import { RegisterForm } from "@/presentation/components/RegisterForm";
import { useRouter } from "next/navigation";
import { FiUserPlus } from "react-icons/fi";
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
import { LoginUseCase } from "@/core/usecases/LoginUseCase";
import { useDispatch } from "react-redux";

export default function RegisterPage() {
	const router = useRouter();
	const dispatch = useDispatch();

	const authRepository = new AuthRepository();
	const registerUseCase = new RegisterUseCase(authRepository);
	const loginUseCase = new LoginUseCase(authRepository);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
	const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

	const handleRegister = async (
		name: string,
		email: string,
		password: string
	) => {
		try {
			await registerUseCase.execute(name, email, password);

			await loginUseCase.execute(email, password, dispatch);

			router.push("/dashboard");
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMessage(
					error.message || "Error desconocido al registrar el usuario"
				);
			} else {
				setErrorMessage("Error desconocido al registrar el usuario");
			}
			setIsErrorDialogOpen(true);
		}
	};

	const closeSuccessDialog = () => {
		setIsSuccessDialogOpen(false);
		router.push("/auth/login");
	};

	const closeErrorDialog = () => {
		setIsErrorDialogOpen(false);
		setErrorMessage(null);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-t from-white to-green-200 dark:from-gray-900 dark:to-gray-800">
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -50 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col gap-y-6 w-full max-w-md p-8 bg-white/30 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-lg">
				<div className="flex justify-center">
					<div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-3xl shadow-md">
						<FiUserPlus className="h-10 w-10 text-green-500 dark:text-green-400" />
					</div>
				</div>
				<h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
					Registro
				</h1>
				<RegisterForm onSubmit={handleRegister} />
				<p className="text-center text-gray-600 dark:text-gray-400">
					¿Ya tienes una cuenta?{" "}
					<Link
						href="/auth/login"
						className="text-green-500 dark:text-green-400 hover:underline">
						Inicia sesión aquí
					</Link>
					.
				</p>
			</motion.div>

			{/* Dialog para mostrar el mensaje de error */}
			<Dialog
				open={isErrorDialogOpen}
				onOpenChange={setIsErrorDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Error de Registro</DialogTitle>
						<DialogDescription className="text-gray-800 dark:text-gray-300">
							{errorMessage}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={closeErrorDialog}>Cerrar</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Dialog para mostrar el mensaje de registro exitoso */}
			<Dialog
				open={isSuccessDialogOpen}
				onOpenChange={setIsSuccessDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Registro Exitoso</DialogTitle>
						<DialogDescription className="text-gray-800 dark:text-gray-300">
							Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar
							sesión.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={closeSuccessDialog}>Ir al Login</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
