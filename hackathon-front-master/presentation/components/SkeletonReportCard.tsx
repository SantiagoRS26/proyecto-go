"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonReportCard: React.FC = () => {
	return (
		<div className="p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl max-w-md animate-pulse transition-colors duration-300">
			{/* Título */}
			<Skeleton className="h-6 w-3/4 mb-2 bg-gray-300 dark:bg-gray-600" />

			{/* Descripción */}
			<Skeleton className="h-4 w-full mb-2 bg-gray-300 dark:bg-gray-600" />

			{/* Información de Creación */}
			<Skeleton className="h-3 w-1/2 mb-4 bg-gray-300 dark:bg-gray-600" />

			{/* Imagen del Mapa */}
			<div className="mt-3">
				<Skeleton className="h-48 w-full rounded-lg object-cover bg-gray-300 dark:bg-gray-600" />
			</div>

			{/* Acciones: Likes y Verificación */}
			<div className="mt-3 flex items-center justify-between">
				<Skeleton className="h-4 w-16 bg-gray-300 dark:bg-gray-600" />
				<Skeleton className="h-4 w-20 bg-gray-300 dark:bg-gray-600" />
			</div>
		</div>
	);
};

export default SkeletonReportCard;
