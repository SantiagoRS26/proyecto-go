import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { FaEye, FaTrash } from "react-icons/fa";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from "@/components/ui/dialog"; // Importamos tu diálogo personalizado
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
	GeofenceDTO,
	GeofenceProps,
} from "../../../core/interfaces/dto/picoyplacadto/GeofenceDTO";
import { FeatureCollection, Polygon } from "geojson";

const MapboxExample = ({ updateData }: GeofenceProps) => {
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const drawRef = useRef<MapboxDraw | null>(null); // Referencia al control de dibujo
	const [geofences, setGeofences] = useState<GeofenceDTO[]>([]);
	const [showGeofenceDialog, setShowGeofenceDialog] = useState(false);
	const [newGeofenceCoords, setNewGeofenceCoords] = useState<number[][]>([]);
	const [newGeofenceName, setNewGeofenceName] = useState("");
	const [newVehicleType, setNewVehicleType] = useState<
		"motorcycle" | "publicVehicle" | "privateVehicle" | "heavyVehicle"
	>("motorcycle");

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
			console.error(
				"El token de Mapbox no está definido en las variables de entorno."
			);
			return;
		}

		// Asignamos el token de Mapbox
		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

		// Inicializamos el mapa
		mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current as HTMLDivElement,
			style: "mapbox://styles/mapbox/streets-v12",
			center: [-73.6266, 4.135],
			zoom: 12,
		});

		// Inicializamos Mapbox Draw para dibujar polígonos
		drawRef.current = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				polygon: true,
				trash: true,
			},
			defaultMode: "draw_polygon",
		});
		mapRef.current.addControl(drawRef.current);

		// Escuchamos los eventos de creación de polígonos
		mapRef.current.on("draw.create", handlePolygonCreate);

		// Limpiar el mapa al desmontar el componente
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
			}
		};
	}, []);

	const handlePolygonCreate = (e: {
		features: FeatureCollection<Polygon>["features"];
	}) => {
		const coordinates = e.features[0].geometry.coordinates[0]; // Obtenemos las coordenadas del polígono
		setNewGeofenceCoords(coordinates);
		setShowGeofenceDialog(true); // Mostramos el diálogo
	};

	const handleSaveGeofence = () => {
		const newGeofence: GeofenceDTO = {
			id: Date.now().toString(),
			name: newGeofenceName || "Sin nombre",
			vehicleType: newVehicleType,
			coordinates: newGeofenceCoords,
		};
		const updatedGeofences = [...geofences, newGeofence];
		setGeofences(updatedGeofences);
		updateData(updatedGeofences);
		setNewGeofenceName("");
		setNewVehicleType("motorcycle");
		setShowGeofenceDialog(false);

		if (drawRef.current) {
			drawRef.current.deleteAll(); // Borramos la geocerca del mapa después de guardarla
		}
	};

	const handleViewGeofence = (geofenceId: string) => {
		const geofence = geofences.find((g) => g.id === geofenceId);
		if (geofence && drawRef.current) {
			drawRef.current.deleteAll();
			drawRef.current.add({
				type: "Feature",
				geometry: {
					type: "Polygon",
					coordinates: [geofence.coordinates],
				},
				properties: {},
			});
		}
	};

	const handleViewAllGeofencesByType = (
		vehicleType:
			| "motorcycle"
			| "publicVehicle"
			| "privateVehicle"
			| "heavyVehicle"
	) => {
		const geofencesOfType = geofences.filter(
			(g) => g.vehicleType === vehicleType
		);
		if (drawRef.current) {
			drawRef.current.deleteAll();
			geofencesOfType.forEach((geofence) => {
				if (!drawRef.current) return;
				drawRef.current.add({
					type: "Feature",
					geometry: {
						type: "Polygon",
						coordinates: [geofence.coordinates],
					},
					properties: {},
				});
			});
		}
	};

	const handleDeleteGeofence = (geofenceId: string) => {
		setGeofences(geofences.filter((g) => g.id !== geofenceId));
		if (drawRef.current) {
			drawRef.current.deleteAll(); // Eliminamos la geocerca visible si existe
		}
	};

	const handleCancelDialog = () => {
		// Si el usuario cancela, eliminamos la geocerca actual
		if (drawRef.current) {
			drawRef.current.deleteAll();
		}
		setShowGeofenceDialog(false);
	};

	const renderGeofenceTable = (
		title: string,
		vehicleType:
			| "motorcycle"
			| "publicVehicle"
			| "privateVehicle"
			| "heavyVehicle"
	) => {
		const geofencesOfType = geofences.filter(
			(g) => g.vehicleType === vehicleType
		);
		return (
			<div className="mb-6">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
						{title}
					</h3>
					<button
						onClick={() => handleViewAllGeofencesByType(vehicleType)}
						className="inline-flex items-center px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
						<FaEye className="mr-2" /> Ver todas
					</button>
				</div>
				<table className="w-full border-collapse">
					<thead className="bg-gray-200 dark:bg-gray-700">
						<tr>
							<th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">
								Nombre
							</th>
							<th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">
								Acciones
							</th>
						</tr>
					</thead>
					<tbody>
						{geofencesOfType.length === 0 ? (
							<tr>
								<td
									colSpan={2}
									className="p-4 text-center text-gray-500 dark:text-gray-400">
									No hay geocercas para {title}
								</td>
							</tr>
						) : (
							geofencesOfType.map((g) => (
								<tr
									key={g.id}
									className="border-b dark:border-gray-600">
									<td className="p-4 dark:text-gray-300">{g.name}</td>
									<td className="p-4">
										<button
											onClick={() => handleViewGeofence(g.id)}
											className="inline-flex items-center px-3 py-2 mr-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
											<FaEye className="mr-2" /> Ver
										</button>
										<button
											onClick={() => handleDeleteGeofence(g.id)}
											className="inline-flex items-center px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-400">
											<FaTrash className="mr-2" /> Eliminar
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		);
	};

	return (
		<>
			<h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
				Mapa de Pico y Placa
			</h2>
			<div
				ref={mapContainerRef}
				className="h-[80vh] mt-6 rounded-xl shadow-lg bg-white dark:bg-gray-800"></div>
			<div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-6 space-y-6">
				{/* Tablas separadas por tipo de vehículo */}
				{renderGeofenceTable("Motos", "motorcycle")}
				{renderGeofenceTable("Taxis", "publicVehicle")}
				{renderGeofenceTable("Vehículo Particular", "privateVehicle")}
				{renderGeofenceTable("Vehículo Pesado", "heavyVehicle")}
			</div>

			{/* Diálogo para agregar nueva geocerca */}
			{showGeofenceDialog && (
				<Dialog
					open={showGeofenceDialog}
					onOpenChange={setShowGeofenceDialog}>
					<DialogContent hideCloseButton={true}>
						<DialogHeader>
							<DialogTitle className="dark:text-white">
								Agregar Geocerca
							</DialogTitle>
							<DialogDescription className="dark:text-gray-300">
								Por favor, ingresa el nombre y selecciona el tipo de vehículo
								para esta geocerca.
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4">
							<input
								type="text"
								placeholder="Nombre de la geocerca"
								value={newGeofenceName}
								onChange={(e) => setNewGeofenceName(e.target.value)}
								className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:text-white"
							/>
							<select
								value={newVehicleType}
								onChange={(e) =>
									setNewVehicleType(
										e.target.value as
											| "motorcycle"
											| "publicVehicle"
											| "privateVehicle"
											| "heavyVehicle"
									)
								}
								className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:text-white">
								<option value="motorcycle">Motos</option>
								<option value="publicVehicle">Taxis</option>
								<option value="privateVehicle">Vehículo Particular</option>
								<option value="heavyVehicle">Vehículo Pesado</option>
							</select>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<button
									onClick={handleCancelDialog}
									className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
									Cancelar
								</button>
							</DialogClose>
							<button
								onClick={handleSaveGeofence}
								className="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
								Guardar
							</button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
};

export default MapboxExample;
