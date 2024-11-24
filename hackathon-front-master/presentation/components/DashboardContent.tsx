"use client";

import React, {
	useEffect,
	useRef,
	useState,
	useMemo,
	useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/infrastructure/store";
import { InitializeMapUseCase } from "@/core/usecases/InitializeMapUseCase";
import { MapboxService } from "@/infrastructure/services/MapboxService";
import { FiLoader } from "react-icons/fi";
import { ReportRepository } from "@/infrastructure/repositories/ReportRepository";
import ReportCard from "@/presentation/components/ReportCard";
import SkeletonReportCard from "@/presentation/components/SkeletonReportCard";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import FloatingButtonWithDialog from "@/presentation/components/FloatingButtonWithDialog";
import { IMapService } from "@/core/interfaces/services/IMapService";
import { useReports } from "@/presentation/hooks/useReports";
import { GetStaticMapUrlUseCase } from "@/core/usecases/GetStaticMapUrlUseCase";
import { MapboxStaticService } from "@/infrastructure/services/MapboxStaticService";
import PaginationControls from "./PaginationControls";
import { hasRole } from "@/lib/authorization";

export default function DashboardContent() {
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapServiceRef = useRef<IMapService | null>(null);
	const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
	const currentPopupRef = useRef<mapboxgl.Popup | null>(null);
	const [mapLoading, setMapLoading] = useState(true);
	const expanded = useSelector((state: RootState) => state.ui.expanded);
	const dispatch = useDispatch<AppDispatch>();
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [activeTab, setActiveTab] = useState<string>("both");
	const user = useSelector((state: RootState) => state.auth.user);
	const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
	const reportRepository = useMemo(() => new ReportRepository(), []);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;
	const {
		reports,
		loading: reportsLoading,
		refetch,
		totalPages,
		totalRecords,
		pageNumber,
		setPageNumber,
	} = useReports(reportRepository, currentPage, pageSize);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
			setPageNumber(newPage);
		}
	};

	const handleReportAdded = () => {
		setCurrentPage(1);
		setPageNumber(1);
		refetch(); // Refresca los reportes al agregar uno nuevo
	};

	useEffect(() => {
		const checkScreenSize = () => {
			setIsSmallScreen(window.innerWidth < 640);
		};
		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	useEffect(() => {
		if (mapContainerRef.current && !mapServiceRef.current) {
			const mapService = new MapboxService(
				mapContainerRef.current,
				mapboxToken
			);
			mapServiceRef.current = mapService;
			const initializeMapUseCase = new InitializeMapUseCase(mapService);
			initializeMapUseCase.execute([4.135, -73.6266], 12);
			const map = mapService.getMap();
			if (map) {
				map.on("load", () => {
					setMapLoading(false);
				});
			}
		}
	}, [mapContainerRef.current, mapboxToken]);

	useEffect(() => {
		const mapInstance = mapServiceRef.current?.getMap();
		if (mapInstance) {
			setTimeout(() => {
				mapInstance.resize();
			}, 300);
		}
	}, [expanded]);

	const handleFlyToReport = useCallback((reportId: string) => {
		const mapInstance = mapServiceRef.current?.getMap();
		const marker = markersRef.current[reportId];
		if (mapInstance && marker) {
			const { lng, lat } = marker.getLngLat();
			mapInstance.flyTo({
				center: [lng, lat],
				zoom: 14,
				essential: true,
				speed: 1.2,
				curve: 1.2,
				easing: (t) => t,
			});
			if (
				currentPopupRef.current &&
				currentPopupRef.current !== marker.getPopup()
			) {
				currentPopupRef.current.remove();
			}
			const popup = marker.getPopup();
			if (popup) {
				popup.addTo(mapInstance);
				currentPopupRef.current = popup;
				popup.on("close", () => {
					if (currentPopupRef.current === popup) {
						currentPopupRef.current = null;
					}
				});
			}
		}
	}, []);

	useEffect(() => {
		if (!reportsLoading && reports.length > 0) {
			// Actualizado para depender de reportsLoading
			const mapInstance = mapServiceRef.current?.getMap();
			if (mapInstance) {
				Object.values(markersRef.current).forEach((marker) => marker.remove());
				markersRef.current = {};
				reports.forEach((report) => {
					const { longitude, latitude } = report.coordinates;
					const markerElement = document.createElement("div");
					if (report.type.icons.icon_normal || report.type.icons.icon_small) {
						const iconElement = document.createElement("img");
						//iconElement.src = report.type.icons.icon_normal;
						iconElement.src = report.type.icons.icon_small;
						iconElement.style.width = "20px";
						iconElement.style.height = "30px";
						markerElement.appendChild(iconElement);
					} else {
						markerElement.style.width = "25px";
						markerElement.style.height = "25px";
						markerElement.style.backgroundColor = "blue";
						markerElement.style.borderRadius = "50%";
					}
					const popupContent = `
                        <div class="popup-content">
                            <h3>${report.type.type}</h3>
                            <p>${report.type.description}</p>
                            <p><strong>Creado por:</strong> ${
															report.createdBy.name
														}</p>
                            <p><strong>Fecha:</strong> ${new Date(
															report.createdAt
														).toLocaleString()}</p>
                        </div>
                    `;
					const popup = new mapboxgl.Popup({
						offset: 20,
						closeButton: true,
					}).setHTML(popupContent);
					popup.on("close", () => {
						if (currentPopupRef.current === popup) {
							currentPopupRef.current = null;
						}
					});
					const marker = new mapboxgl.Marker(markerElement)
						.setLngLat([longitude, latitude])
						.setPopup(popup)
						.addTo(mapInstance);
					markerElement.addEventListener("click", () => {
						if (currentPopupRef.current && currentPopupRef.current !== popup) {
							currentPopupRef.current.remove();
						}
						popup.addTo(mapInstance);
						currentPopupRef.current = popup;
						handleFlyToReport(report.id);
					});
					markersRef.current[report.id] = marker;
				});
			}
		}
	}, [reports, reportsLoading, handleFlyToReport]); // Dependencias actualizadas

	useEffect(() => {
		if (activeTab === "map" || activeTab === "both") {
			const mapInstance = mapServiceRef.current?.getMap();
			if (mapInstance) {
				if (mapInstance.loaded()) {
					mapInstance.resize();
				} else {
					mapInstance.on("load", () => {
						mapInstance.resize();
					});
				}
			}
		}
	}, [activeTab]);

	const mapVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	};

	const mapboxStaticService = new MapboxStaticService(mapboxToken);
	const getStaticMapUrlUseCase = new GetStaticMapUrlUseCase(
		mapboxStaticService
	);

	return (
		<div className="flex-1 px-4 py-5 bg-gray-100 dark:bg-gray-900/50 space-y-8 transition-all duration-300">
			<motion.div
				variants={mapVariants}
				initial="hidden"
				animate={
					activeTab === "map" || activeTab === "both" ? "visible" : "hidden"
				}
				exit="hidden"
				transition={{ duration: 0.5 }}
				onAnimationComplete={() => {
					if (activeTab === "map" || activeTab === "both") {
						const mapInstance = mapServiceRef.current?.getMap();
						if (mapInstance) {
							mapInstance.resize();
						}
					}
				}}
				className={`flex p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-xl relative ${
					activeTab === "map" || activeTab === "both" ? "block" : "hidden"
				}`}>
				{(mapLoading || reportsLoading) && ( // Mostrar loader si el mapa o los reportes están cargando
					<div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800/70 z-10">
						<FiLoader className="animate-spin text-4xl text-blue-500" />
					</div>
				)}
				<div
					ref={mapContainerRef}
					className="w-full h-96 rounded-2xl shadow-xl"
				/>
			</motion.div>
			<Tabs
				defaultValue="both"
				onValueChange={setActiveTab}
				className="w-full">
				<TabsList className="flex space-x-2 mb-4 dark:bg-gray-900/50 p-2 rounded-lg transition-colors duration-300">
					<TabsTrigger
						value="map"
						className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
							activeTab === "map"
								? "bg-indigo-500 text-white shadow dark:bg-indigo-600 dark:text-gray-200"
								: "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
						}`}>
						Mapa
					</TabsTrigger>
					<TabsTrigger
						value="reports"
						className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
							activeTab === "reports"
								? "bg-indigo-500 text-white shadow dark:bg-indigo-600 dark:text-gray-200"
								: "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
						}`}>
						Reportes
					</TabsTrigger>
					<TabsTrigger
						value="both"
						className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
							activeTab === "both"
								? "bg-indigo-500 text-white shadow dark:bg-indigo-600 dark:text-gray-200"
								: "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
						}`}>
						Ambos
					</TabsTrigger>
				</TabsList>
				<TabsContent value="map" />
				<TabsContent value="reports">
					{totalPages > 1 && (
						<div className="flex justify-center mb-4">
							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								handlePageChange={handlePageChange}
							/>
						</div>
					)}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5">
						{reportsLoading ? (
							Array.from({ length: 10 }).map((_, index) => (
								<SkeletonReportCard key={index} />
							))
						) : (
							<AnimatePresence>
								{reports.map((report) => {
									const staticMapUrl = getStaticMapUrlUseCase.execute(
										report.coordinates.latitude,
										report.coordinates.longitude,
										14,
										300,
										200,
										report.type.icons.icon_small
									);
									return (
										<ReportCard
											key={report.id}
											report={report}
											staticMapUrl={staticMapUrl}
											onImageClick={() => handleFlyToReport(report.id)}
										/>
									);
								})}
							</AnimatePresence>
						)}
					</div>
					{totalPages > 1 && (
						<div className="flex justify-center mt-4">
							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								handlePageChange={handlePageChange}
							/>
						</div>
					)}
				</TabsContent>
				<TabsContent value="both">
					{totalPages > 1 && (
						<div className="flex justify-center mb-4">
							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								handlePageChange={handlePageChange}
							/>
						</div>
					)}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5">
						{reportsLoading ? (
							Array.from({ length: 5 }).map((_, index) => (
								<SkeletonReportCard key={index} />
							))
						) : (
							<AnimatePresence>
								{reports.map((report) => {
									const staticMapUrl = getStaticMapUrlUseCase.execute(
										report.coordinates.latitude,
										report.coordinates.longitude,
										14,
										300,
										200,
										report.type.icons.icon_small
									);
									return (
										<ReportCard
											key={report.id}
											report={report}
											staticMapUrl={staticMapUrl}
											onImageClick={() => handleFlyToReport(report.id)}
										/>
									);
								})}
							</AnimatePresence>
						)}
					</div>
					{totalPages > 1 && (
						<div className="flex justify-center mt-4">
							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								handlePageChange={handlePageChange}
							/>
						</div>
					)}
				</TabsContent>
			</Tabs>
			{hasRole(user, ["user", "admin"]) && (
				<FloatingButtonWithDialog onReportAdded={handleReportAdded} />
			)}
		</div>
	);
}
