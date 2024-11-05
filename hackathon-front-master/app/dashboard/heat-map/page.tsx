"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/infrastructure/store";
import { InitializeMapUseCase } from "@/core/usecases/InitializeMapUseCase";
import { MapboxService } from "@/infrastructure/services/MapboxService";
import { FiLoader, FiMap, FiMenu } from "react-icons/fi";
import { ReportRepository } from "@/infrastructure/repositories/ReportRepository";
import "mapbox-gl/dist/mapbox-gl.css";
import { toggleExpanded } from "@/infrastructure/store/uiSlice";
import { IMapService } from "@/core/interfaces/services/IMapService";
import { HeatMapForm } from "@/presentation/components/HeatMapForm";
import { ReportType } from "@/core/entities/ReportType";
import { GetReportTypesUseCase } from "@/core/usecases/GetReportTypesUseCase";
import { GetReportsByTypeUseCase } from "@/core/usecases/GetReportsByTypeUseCase";
import { Report } from "@/core/entities/Report";

export default function HeatMap() {
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapServiceRef = useRef<IMapService | null>(null);
	const markersRef = useRef<mapboxgl.Marker[]>([]);
	const [loading, setLoading] = useState(true);
	const expanded = useSelector((state: RootState) => state.ui.expanded);
	const dispatch = useDispatch<AppDispatch>();
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
	const [reportTypesLoading, setReportsLoading] = useState(false);

	const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

	const reportRepository = useMemo(() => new ReportRepository(), []);
	const [reports, setReports] = useState<Report[]>([]);

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
					setLoading(false);
				});
			}
		}
	}, [mapContainerRef.current]);

	useEffect(() => {
		const fetchReportTypes = async () => {
			setReportsLoading(true);
			console.log(reportTypesLoading);
			try {
				const getReportTypesUseCase = new GetReportTypesUseCase(
					reportRepository
				);
				const reportTypesData = await getReportTypesUseCase.execute();
				setReportTypes(reportTypesData);
			} catch (error: unknown) {
				if (error instanceof Error) {
					console.error(error.message);
				} else {
					console.error("Error desconocido al cargar los tipos de reportes");
				}
			} finally {
				setReportsLoading(false);
			}
		};

		fetchReportTypes();
	}, [reportRepository]);

	const geojsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
		type: "FeatureCollection",
		features: reports.map((report) => ({
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [
					report.coordinates.longitude,
					report.coordinates.latitude,
				],
			},
			properties: {
				id: report.id,
			},
		})),
	};

	const handleChangeType = async (type: string) => {
		try {
			const useCase = new GetReportsByTypeUseCase(reportRepository);
			const reportsData = await useCase.execute(type);
			setReports(reportsData);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!loading) {
			const mapInstance = mapServiceRef.current?.getMap();
			if (mapInstance) {
				markersRef.current.forEach((marker) => marker.remove());
				markersRef.current = [];

				if (!mapInstance.getLayer("heatmap-layer")) {
					mapInstance.addSource("reports-data", {
						type: "geojson",
						data: geojsonData,
					});

					mapInstance.addLayer({
						id: "heatmap-layer",
						type: "heatmap",
						source: "reports-data",
						maxzoom: 15,
						paint: {
							"heatmap-weight": {
								property: "density",
								type: "exponential",
								stops: [
									[0, 0],
									[5, 1],
								],
							},
							"heatmap-intensity": [
								"interpolate",
								["linear"],
								["zoom"],
								0,
								1,
								5,
								3,
							],
							"heatmap-color": [
								"interpolate",
								["linear"],
								["heatmap-density"],
								0,
								"rgba(33,102,172,0)",
								0.2,
								"rgb(103,169,207)",
								0.4,
								"rgb(209,229,240)",
								0.6,
								"rgb(253,219,199)",
								0.8,
								"rgb(239,138,98)",
								1,
								"rgb(178,24,43)",
							],
							"heatmap-radius": {
								stops: [
									[0, 2],
									[5, 20],
								],
							},
							"heatmap-opacity": [
								"interpolate",
								["linear"],
								["zoom"],
								14,
								1,
								15,
								0,
							],
						},
					});
				} else {
					const source = mapInstance.getSource(
						"reports-data"
					) as mapboxgl.GeoJSONSource;
					source.setData(geojsonData);
				}
			}
		}
	}, [loading, reports]);

	return (
		<div className="flex-1 px-4 py-5 bg-gray-100 dark:bg-gray-900 space-y-8 transition-all duration-300 h-[100vh]">
			<h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6 flex items-center justify-center">
				<FiMap className="mr-2 text-indigo-500 dark:text-indigo-400" />
				Mapa de calor según tipo de reporte
			</h1>
			{isSmallScreen && !expanded && (
				<div className="mb-4">
					<button
						onClick={() => dispatch(toggleExpanded())}
						className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
						<FiMenu size={24} />
					</button>
				</div>
			)}
			<HeatMapForm
				reportTypes={reportTypes}
				handleChangeType={handleChangeType}
			/>

			<div className="relative w-full h-[90%] rounded-lg shadow-lg dark:bg-gray-800">
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700/70 z-10">
						<FiLoader className="animate-spin text-4xl text-blue-500 dark:text-blue-400" />
					</div>
				)}
				<div
					ref={mapContainerRef}
					className="w-full h-full rounded-lg"
				/>
			</div>
		</div>
	);
}
