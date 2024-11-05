"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaSave } from "react-icons/fa";
import Decree from "../../../presentation/components/picoyPlacaComponents/decree";
import MapboxExample from "../../../presentation/components/picoyPlacaComponents/TestMap";
import PicoPlacaForm from "../../../presentation/components/picoyPlacaComponents/picoyPlacaDaily";
import { PicoPlacaDailyDTO } from "../../../core/interfaces/dto/picoyplacadto/PicoPlacaDailyDTO";
import { GeofenceDTO } from "../../../core/interfaces/dto/picoyplacadto/GeofenceDTO";
import {
	DailyRestriction,
	Days,
	Geofences,
	TrafficRestriction,
} from "../../../core/interfaces/dto/picoyplacadto/TrafficRestriction";
import axiosInstance from "@/infrastructure/api/axiosInstance";
import { useRouter } from "next/navigation";
import ErrorDialog from "../../../presentation/components/picoyPlacaComponents/ErrorDialog";
import ProtectedRoute from "@/presentation/components/ProtectedRoute";

export default function UpdatePicoPlacaForm() {
	const [decreeName, setDecreeName] = useState<string>("");

	const [publicVehicleData, setPublicVehicleData] =
		useState<PicoPlacaDailyDTO | null>(null);
	const [privateVehicleData, setPrivateVehicleData] =
		useState<PicoPlacaDailyDTO | null>(null);
	const [motorcycleData, setMotorcycleData] =
		useState<PicoPlacaDailyDTO | null>(null);
	const [heavyVehicleData, setHeavyVehicleData] =
		useState<PicoPlacaDailyDTO | null>(null);
	const [geofences, setGeofences] = useState<GeofenceDTO[]>([]);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const [isError, setIsError] = useState(false);
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log({
			decreeName,
			restrictions: {
				publicVehicle: publicVehicleData,
				privateVehicle: privateVehicleData,
				motorcycle: motorcycleData,
				heavyVehicle: heavyVehicleData,
			},
		});
	};
	const generateTrafficRestrictions = (): TrafficRestriction => {
		const mapRestrictions = (
			dto: PicoPlacaDailyDTO | null
		): DailyRestriction | null => {
			if (!dto) return null;
			const { vehicleType, restrictions } = dto;

			// Mapea los días y sus restricciones
			const days: Days[] = restrictions.days.map((restriction) => ({
				day: restriction.day,
				plates: restriction.plates,
				hours: restriction.hours.map((hourSet) => [hourSet]), // Ajustando las horas para que sean de tipo `string[][][]`
			}));

			// Construye el objeto DailyRestriction
			const dailyRestriction: DailyRestriction = {
				vehicleType: vehicleType,
				restrictions: {
					days: days,
					exemption: restrictions.exemption || false,
					additionalInfo: restrictions.additionalInfo || "",
				},
			};

			return dailyRestriction;
		};

		// Mapeo de geofences
		const mappedGeofences: Geofences[] = geofences.map((geo) => ({
			name: geo.name,
			vehicleType: geo.vehicleType,
			coordinates: geo.coordinates,
		}));

		// Construcción final de TrafficRestriction
		const trafficRestriction: TrafficRestriction = {
			decreeName: decreeName,
			daily: [
				mapRestrictions(publicVehicleData),
				mapRestrictions(privateVehicleData),
				mapRestrictions(motorcycleData),
				mapRestrictions(heavyVehicleData),
			].filter(Boolean) as DailyRestriction[], // Filtra los null
			geofences: mappedGeofences,
		};

		return trafficRestriction;
	};
	const fetchTrafficRestrictions = async () => {
		try {
			const response = await axiosInstance.post(
				"/traffic-restrictions",
				generateTrafficRestrictions()
			);
			if (response.status !== 201) {
				throw new Error("Error fetching traffic restrictions");
			}
			setDialogMessage("Restricciones de tráfico creadas exitosamente.");
			setIsError(false);
			setIsDialogOpen(true);
		} catch (error) {
			console.error("Error fetching traffic restrictions:", error);
			setDialogMessage("Error al crear restricciones de tráfico.");
			setIsError(true);
			setIsDialogOpen(true);
		}
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		if (isError) {
			router.refresh();
		} else {
			router.push("/dashboard/restrictions");
		}
	};
	return (
		<ProtectedRoute allowedRoles={["admin"]}>
			<motion.div
				className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4 transition-colors duration-300"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}>
				<div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 transition-colors duration-300">
					<h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6 flex items-center justify-center">
						<FaSave className="mr-2 text-indigo-500 dark:text-indigo-400" />
						Actualizar Pico y Placa
					</h1>

					<form
						onSubmit={handleSubmit}
						className="space-y-6">
						{/* Decreto */}
						<Decree
							decreeName={decreeName}
							setDecreeName={setDecreeName}
						/>

						{/* Geocerca */}
						<div>
							<MapboxExample updateData={setGeofences} />
						</div>

						{/* Formulario para cada tipo de vehículo */}
						<h2 className="text-2xl font-bold mb-4 text-left text-gray-800 dark:text-gray-200">
							Taxis
						</h2>
						<PicoPlacaForm
							updateData={setPublicVehicleData}
							vehicleType="PublicVehicle"
						/>

						<h2 className="text-2xl font-bold mb-4 text-left text-gray-800 dark:text-gray-200">
							Particulares
						</h2>
						<PicoPlacaForm
							updateData={setPrivateVehicleData}
							vehicleType="PrivateVehicle"
						/>

						<h2 className="text-2xl font-bold mb-4 text-left text-gray-800 dark:text-gray-200">
							Motos
						</h2>
						<PicoPlacaForm
							updateData={setMotorcycleData}
							vehicleType="Motorcycle"
						/>

						<h2 className="text-2xl font-bold mb-4 text-left text-gray-800 dark:text-gray-200">
							Vehículos pesados
						</h2>
						<PicoPlacaForm
							updateData={setHeavyVehicleData}
							vehicleType="HeavyVehicle"
						/>

						{/* Botón de Enviar */}
						<div className="flex justify-center">
							<button
								onClick={fetchTrafficRestrictions}
								type="submit"
								className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition-colors duration-300">
								Guardar
							</button>
						</div>
					</form>
				</div>

				<div>
					<ErrorDialog
						isOpen={isDialogOpen}
						onClose={() => setIsDialogOpen(false)}
						message={dialogMessage}
						onConfirm={handleDialogClose}
						isError={isError}
					/>
				</div>
			</motion.div>
		</ProtectedRoute>
	);
}
