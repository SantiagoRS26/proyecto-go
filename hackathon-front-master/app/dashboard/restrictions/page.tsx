"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/infrastructure/store";
import { GetPicoYPlacaGeofencesUseCase } from "@/core/usecases/picoyplaca/GetPicoYPlacaGeofencesUseCase";
import { PicoYPlacaRepository } from "@/infrastructure/repositories/PicoYPlacaRepository";
import { IPicoYPlacaRepository } from "@/core/interfaces/repositories/IPicoYPlacaRepository";
import {
	DayRestrictionDTOWithDate,
	GetWeeklyPicoYPlacaRestrictionsUseCase,
} from "@/core/usecases/picoyplaca/GetWeeklyPicoYPlacaRestrictionsUseCase";
import RestrictionsList from "@/presentation/components/restrictions/RestrictionsList";
import MapComponent from "@/presentation/components/MapComponent";
import { convertToGeoJSON } from "@/lib/geoUtils";
import { motion } from "framer-motion";
import {
	FaChevronLeft,
	FaChevronRight,
	FaCalendarAlt,
	FaCalendarDay,
	FaSpinner,
} from "react-icons/fa";

interface PicoYPlacaGeofencesResponseDTO {
	picoyPlacaGeofences: PicoyPlacaGeofenceDTO[];
}

import { PicoyPlacaGeofenceDTO } from "@/core/interfaces/dto/PicoYPlacaGeofencesResponseDTO";

export default function RestrictionsPage() {
	const [activeTab, setActiveTab] = useState<string>("privateVehicle");
	const expanded = useSelector((state: RootState) => state.ui.expanded);
	const [loadingMap, setLoadingMap] = useState<boolean>(true);
	const [geofences, setGeofences] =
		useState<PicoYPlacaGeofencesResponseDTO | null>(null);

	const [weekStartDate, setWeekStartDate] = useState<Date>(() => {
		const today = new Date();
		const dayOfWeek = today.getDay(); // 0 (Domingo) a 6 (Sábado)

		// Calcular la diferencia para llegar al lunes
		const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

		// Crear una nueva fecha para el inicio de la semana (lunes)
		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() + diff);
		startOfWeek.setHours(0, 0, 0, 0); // Opcional: establecer la hora a medianoche

		return startOfWeek;
	});

	const [weekRestrictions, setWeekRestrictions] = useState<{
		[key: string]: DayRestrictionDTOWithDate[];
	}>({});
	const [loadingRestrictions, setLoadingRestrictions] = useState<{
		[key: string]: boolean;
	}>({});
	const [errorRestrictions, setErrorRestrictions] = useState<{
		[key: string]: string | null;
	}>({});

	// Estado para la fecha y hora actual
	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	// Actualizar la fecha y hora actual cada segundo
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentDate(new Date());
		}, 1000); // Actualiza cada 1 segundo

		return () => clearInterval(timer); // Limpia el intervalo al desmontar el componente
	}, []);

	const vehicleTypes = useMemo(
		() => [
			{
				value: "motorcycle",
				label: "Motos",
				title: "Restricciones para Motos",
			},
			{
				value: "privateVehicle",
				label: "Particulares",
				title: "Restricciones para Vehículos Particulares",
			},
			{
				value: "publicVehicle",
				label: "Taxis",
				title: "Restricciones para Taxis",
			},
			{
				value: "heavyVehicle",
				label: "Transporte de Carga",
				title: "Restricciones para Transporte de Carga",
			},
		],
		[]
	);

	// Obtener geocercas
	useEffect(() => {
		const getGeofences = async () => {
			try {
				const picoYPlacaRepository: IPicoYPlacaRepository =
					new PicoYPlacaRepository();
				const useCase = new GetPicoYPlacaGeofencesUseCase(picoYPlacaRepository);
				const response = await useCase.execute();
				setGeofences(response);
			} catch (error) {
				console.error("Error al obtener las geocercas:", error);
			} finally {
				setLoadingMap(false);
			}
		};

		getGeofences();
	}, []);

	// Redimensionar el mapa al cambiar el tamaño
	useEffect(() => {
		const handleResize = () => {
			window.dispatchEvent(new Event("resize"));
		};
		handleResize();
	}, [expanded]);

	// Memoización de geocercas filtradas y GeoJSON
	const filteredGeofences = useMemo(() => {
		if (!geofences) return [];
		const filtered = geofences.picoyPlacaGeofences.filter(
			(geofence) => geofence.vehicleType === activeTab
		);
		return filtered;
	}, [geofences, activeTab]);

	const geofencesGeoJSON = useMemo(() => {
		return convertToGeoJSON(filteredGeofences);
	}, [filteredGeofences]);

	// Obtener restricciones semanales
	useEffect(() => {
		const weekKey = `${activeTab}_${weekStartDate.toISOString().split("T")[0]}`;

		if (weekRestrictions[weekKey]) return;

		const getWeeklyRestrictions = async () => {
			setLoadingRestrictions((prev) => ({ ...prev, [weekKey]: true }));
			setErrorRestrictions((prev) => ({ ...prev, [weekKey]: null }));
			try {
				const picoYPlacaRepository: IPicoYPlacaRepository =
					new PicoYPlacaRepository();
				const useCase = new GetWeeklyPicoYPlacaRestrictionsUseCase(
					picoYPlacaRepository
				);
				const result = await useCase.execute(activeTab, weekStartDate);
				setWeekRestrictions((prev) => ({
					...prev,
					[weekKey]: result.weekRestrictions,
				}));
			} catch (error: unknown) {
				console.error("Error al obtener las restricciones semanales:", error);
				let errorMessage = "Error al obtener las restricciones semanales";

				if (error instanceof Error) {
					errorMessage = error.message;
				}

				setErrorRestrictions((prev) => ({
					...prev,
					[weekKey]: errorMessage,
				}));
			} finally {
				setLoadingRestrictions((prev) => ({ ...prev, [weekKey]: false }));
			}
		};

		getWeeklyRestrictions();
	}, [activeTab, weekStartDate, weekRestrictions]);

	// Navegación entre semanas
	const goToPreviousWeek = () => {
		setWeekStartDate((prevDate) => {
			const newDate = new Date(prevDate);
			newDate.setDate(prevDate.getDate() - 7);
			return newDate;
		});
	};

	const goToNextWeek = () => {
		setWeekStartDate((prevDate) => {
			const newDate = new Date(prevDate);
			newDate.setDate(prevDate.getDate() + 7);
			return newDate;
		});
	};

	// Navegar a la semana actual
	const goToCurrentWeek = () => {
		const today = new Date();
		const dayOfWeek = today.getDay(); // 0 (Domingo) a 6 (Sábado)
		const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() + diff);
		startOfWeek.setHours(0, 0, 0, 0); // Opcional: establecer la hora a medianoche
		setWeekStartDate(startOfWeek);
	};

	// Formatear fecha para mostrar
	const formatDate = (date: Date) => {
		return date.toLocaleDateString("es-ES", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<motion.div
			className="min-h-screen bg-gray-100 dark:bg-gray-900/50 py-10 px-4 transition-colors duration-300"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}>
			<div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 transition-colors duration-300">
				{/* Título */}
				<h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6 flex items-center justify-center">
					<FaCalendarAlt className="mr-2 text-indigo-500 dark:text-indigo-400" />
					Restricciones de Pico y Placa
				</h1>

				{/* Botón Hoy, Fecha y Hora Actual */}
				<div className="flex flex-col items-center mb-6">
					<motion.button
						onClick={goToCurrentWeek}
						className="flex items-center px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-300"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						<FaCalendarDay className="mr-2" />
						Hoy
					</motion.button>
					{/* Fecha Actual */}
					<span className="mt-2 text-lg text-gray-600 dark:text-gray-300">
						{currentDate.toLocaleDateString("es-ES", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
					{/* Hora Actual */}
					<span className="mt-1 text-lg text-gray-600 dark:text-gray-300">
						{currentDate.toLocaleTimeString("es-ES", {
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
							hour12: true, // Cambiado a true para formato AM/PM
						})}
					</span>
				</div>

				{/* Información de la Semana y Navegación */}
				<div className="flex flex-col md:flex-row items-center justify-between mb-8">
					{/* Botón Semana Anterior */}
					<motion.button
						onClick={goToPreviousWeek}
						className="flex items-center px-4 py-2 bg-indigo-500 dark:bg-indigo-600 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300 mb-4 md:mb-0"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						<FaChevronLeft className="mr-2" />
						Semana Anterior
					</motion.button>

					{/* Información de la Semana */}
					<div className="text-center">
						<span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
							Semana: {formatDate(weekStartDate)} -{" "}
							{formatDate(
								new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000)
							)}
						</span>
					</div>

					{/* Botón Semana Siguiente */}
					<motion.button
						onClick={goToNextWeek}
						className="flex items-center px-4 py-2 bg-indigo-500 dark:bg-indigo-600 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300 mt-4 md:mt-0"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						Semana Siguiente
						<FaChevronRight className="ml-2" />
					</motion.button>
				</div>

				{/* Tabs */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}>
					<Tabs
						defaultValue={activeTab}
						onValueChange={setActiveTab}
						className="w-full">
						<TabsList className="flex bg-white dark:bg-gray-800 space-x-2 mb-6 p-2 rounded-lg transition-colors duration-300">
							{vehicleTypes.map((vehicleType) => (
								<TabsTrigger
									key={vehicleType.value}
									value={vehicleType.value}
									className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
										activeTab === vehicleType.value
											? "bg-indigo-500 text-white shadow dark:bg-indigo-600 dark:text-gray-200"
											: "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
									}`}>
									{vehicleType.label}
								</TabsTrigger>
							))}
						</TabsList>

						{/* Contenido de las pestañas */}	
						{vehicleTypes.map((vehicleType) => {
							const weekKey = `${vehicleType.value}_${
								weekStartDate.toISOString().split("T")[0]
							}`;
							return (
								<TabsContent
									key={vehicleType.value}
									value={vehicleType.value}>
									<RestrictionsList
										title={vehicleType.title}
										weekRestrictions={weekRestrictions[weekKey] || []}
										loadingRestrictions={loadingRestrictions[weekKey] || false}
										errorRestrictions={errorRestrictions[weekKey] || null}
									/>
								</TabsContent>
							);
						})}
					</Tabs>
				</motion.div>

				{/* Mapa */}
				<motion.div
					className="mt-8"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.6, duration: 0.5 }}>
					<div className="relative h-96 rounded-lg shadow-lg overflow-hidden dark:bg-gray-800">
						{loadingMap ? (
							<div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
								{/* Indicador de carga con React Icons y animate-spin */}
								<FaSpinner className="text-indigo-500 text-6xl animate-spin dark:text-indigo-400" />
								<span className="ml-4 text-lg text-gray-600 dark:text-gray-300">
									Cargando mapa...
								</span>
							</div>
						) : (
							<MapComponent
								geofencesGeoJSON={geofencesGeoJSON}
								loadingMap={loadingMap}
							/>
						)}
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}
