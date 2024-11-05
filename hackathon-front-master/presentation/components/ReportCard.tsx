"use client";

import React, { useState, useEffect } from "react";
import { Report } from "@/core/entities/Report";
import { FiThumbsUp, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { ToggleLikeUseCase } from "@/core/usecases/ToggleLikeUseCase";
import { ReportRepository } from "@/infrastructure/repositories/ReportRepository";
import { useSelector } from "react-redux";
import { RootState } from "@/infrastructure/store";
import { useToast } from "@/presentation/hooks/use-toast";
import axios from "axios";
import { hasRole } from "@/lib/authorization";

interface ReportCardProps {
	report: Report;
	staticMapUrl: string;
	onImageClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
	report,
	staticMapUrl,
	onImageClick,
}) => {
	const [likes, setLikes] = useState<number>(report.likedBy.length);
	const [userHasLiked, setUserHasLiked] = useState<boolean>(false);
	const [isLiking, setIsLiking] = useState<boolean>(false);
	const [isVerified, setIsVerified] = useState<boolean>(report.isVerified);
	const [isVerifying, setIsVerifying] = useState<boolean>(false);
	const user = useSelector((state: RootState) => state.auth.user);
	const { toast } = useToast();

	const userId = useSelector((state: RootState) => state.auth.user?._id);

	const formattedCreatedAt = formatDistanceToNow(new Date(report.createdAt), {
		addSuffix: true,
		locale: es,
	});

	useEffect(() => {
		if (userId) {
			setUserHasLiked(report.likedBy.includes(userId));
		}
	}, [report.likedBy, userId]);

	const handleLikeToggle = async () => {
		if (hasRole(user, ["guest"])) {
			toast({
				description: (
					<div className="flex items-center justify-center">
						<FiAlertCircle
							className="mr-2 text-white"
							size={24}
						/>
						<div>
							<strong className="text-white">Acción no permitida</strong>
							<p>Debes estar registrado para realizar esta acción.</p>
						</div>
					</div>
				),
				variant: "destructive",
				duration: 3000,
			});
			return;
		}

		if (!userId || isLiking) return; // No permitir interacción mientras ya está en proceso

		setIsLiking(true);

		// Optimistic UI: Actualizar el estado antes de esperar la respuesta del servidor
		const newLikes = userHasLiked ? likes - 1 : likes + 1;
		setLikes(newLikes);
		setUserHasLiked(!userHasLiked);

		try {
			const toggleLikeUseCase = new ToggleLikeUseCase(new ReportRepository());
			await toggleLikeUseCase.execute(userHasLiked, report.id, userId);
		} catch (error: any) {
			// Revertir el cambio si hubo un error
			console.error("Error al reaccionar al reporte:", error.message);
			setLikes(userHasLiked ? likes + 1 : likes - 1); // Revertir likes
			setUserHasLiked(userHasLiked); // Revertir el estado del like
			toast({
				description: "Hubo un error al actualizar el like",
				variant: "destructive",
				duration: 3000,
			});
		} finally {
			setIsLiking(false); // Permitir nuevas interacciones
		}
	};

	const handleVerifyToggle = async () => {
		setIsVerifying(true);

		try {
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-report`,
				{
					reportId: report.id,
					isVerified: !isVerified,
				}
			);

			setIsVerified(response.data.report.isVerified);
			toast({
				description: `Reporte ${response.data.report.isVerified ? "verificado" : "desverificado"} con éxito`,
				variant: "default",
			});
		} catch (error: any) {
			console.error(
				"Error al verificar el reporte:",
				error.response?.data?.error || error.message
			);
			toast({
				description: "Hubo un error al verificar el reporte",
				variant: "destructive",
			});
		} finally {
			setIsVerifying(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.5 }}
			className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out w-full max-w-lg mx-auto min-h-[450px] flex flex-col justify-between">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center">
					<img
						src={report.type.icons.icon_normal}
						alt={`Icono de ${report.type.type}`}
						className="w-8 h-8 mr-2 rounded-full"
					/>
					<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
						{report.type.type}
					</h2>
				</div>
			</div>

			<p className="text-gray-600 dark:text-gray-400 mb-3 text-sm flex-grow flex items-center justify-center text-center">
				{report.type.description}
			</p>

			<div
				className="w-full h-48 overflow-hidden rounded-lg mb-3 shadow-md cursor-pointer"
				onClick={onImageClick}>
				<img
					src={staticMapUrl}
					alt={`Mapa de ${report.type.type}`}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
				<span>Creado por: {report.createdBy.name}</span> •{" "}
				<span>Publicado: {formattedCreatedAt}</span>
			</div>
			<div className="flex items-center justify-between mt-auto">
				<motion.div
					className={`flex items-center text-gray-600 dark:text-gray-400 text-sm cursor-pointer transition-all duration-300 border-2 rounded-2xl py-1 px-2 ${
						userHasLiked ? "border-green-500" : ""
					}`}
					onClick={handleLikeToggle} // Actualización rápida y optimista de likes
					whileTap={{ scale: 1.2 }}
					whileHover={{ scale: 1.05 }}>
					<motion.div
						initial={{ rotate: 0, scale: 1 }}
						animate={{
							rotate: isLiking ? 25 : 0,
							scale: userHasLiked ? 1.15 : 1,
						}}
						transition={{ type: "spring", stiffness: 300, damping: 10 }}
						className="flex items-center justify-center">
						<FiThumbsUp
							className={`mr-1 ${
								userHasLiked
									? "text-green-500"
									: "text-gray-400 dark:text-gray-500"
							}`}
							size={24}
						/>
					</motion.div>
					<span
						className={`ml-2 font-semibold ${
							userHasLiked
								? "text-green-500"
								: "text-gray-600 dark:text-gray-400"
						}`}>
						{likes} {likes === 1 ? "Like" : "Likes"}
					</span>
				</motion.div>

				{/* Mostrar estado de verificación para todos, pero permitir modificar solo a administradores */}
				<motion.div
					className={`flex items-center text-gray-600 dark:text-gray-400 text-sm ${
						hasRole(user, ["admin"]) ? "cursor-pointer" : ""
					} transition-all duration-300 border-2 rounded-2xl py-1 px-2 ${
						isVerified ? "border-green-500" : "border-red-500"
					}`}
					onClick={hasRole(user, ["admin"]) ? handleVerifyToggle : undefined} // Solo admins pueden modificar
					whileTap={hasRole(user, ["admin"]) ? { scale: 1.2 } : {}}
					whileHover={hasRole(user, ["admin"]) ? { scale: 1.05 } : {}}>
					<motion.div
						initial={{ rotate: 0, scale: 1 }}
						animate={{
							rotate: isVerifying ? 25 : 0,
							scale: isVerified ? 1.15 : 1,
						}}
						transition={{ type: "spring", stiffness: 300, damping: 10 }}
						className="flex items-center justify-center">
						{isVerified ? (
							<FiCheckCircle
								className="mr-1 text-green-500"
								size={24}
							/>
						) : (
							<FiAlertCircle
								className="mr-1 text-red-500"
								size={24}
							/>
						)}
					</motion.div>
					<span className={`ml-2 font-semibold`}>
						{isVerified ? "Verificado" : "No Verificado"}
					</span>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default ReportCard;
