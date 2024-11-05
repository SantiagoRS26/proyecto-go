"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/infrastructure/api/axiosInstance";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from "@/components/ui/dialog";

interface SpecialDay {
	_id: string;
	date: string;
	reason: string;
	vehicleType:
		| "publicVehicle"
		| "privateVehicle"
		| "heavyVehicle"
		| "motorcycle";
}

interface AddSpecialDayFormProps {
	onAddDay: (day: SpecialDay) => void;
}

const AddSpecialDayForm: React.FC<AddSpecialDayFormProps> = ({ onAddDay }) => {
	const [date, setDate] = useState("");
	const [reason, setReason] = useState("");
	const [vehicleType, setVehicleType] = useState("publicVehicle");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!date || !reason) {
			setError("Todos los campos son obligatorios");
			return;
		}

		try {
			const response = await axiosInstance.post("/special-days", {
				date,
				reason,
				vehicleType,
			});
			onAddDay(response.data.specialDay);
			setDate("");
			setReason("");
			setVehicleType("publicVehicle");
			setError(null);
		} catch (err) {
			setError(
				(err as { response: { data: { error: string } } }).response?.data
					?.error || "Error al agregar el día especial"
			);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4">
			{error && <div className="text-red-500">{error}</div>}
			<input
				type="date"
				value={date}
				onChange={(e) => setDate(e.target.value)}
				required
				className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
			/>
			<input
				type="text"
				value={reason}
				onChange={(e) => setReason(e.target.value)}
				placeholder="Motivo"
				required
				className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
			/>
			<select
				value={vehicleType}
				onChange={(e) => setVehicleType(e.target.value)}
				required
				className="border p-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
				<option value="publicVehicle">Taxi</option>
				<option value="privateVehicle">Vehículo Particular</option>
				<option value="heavyVehicle">Vehículo Pesado</option>
				<option value="motorcycle">Motos</option>
			</select>
			<Button
				type="submit"
				className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 dark:bg-blue-600 dark:hover:bg-blue-700">
				Agregar Día Especial
			</Button>
		</form>
	);
};

export default function SpecialDaysPage() {
	const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
	const [filteredDays, setFilteredDays] = useState<SpecialDay[]>([]);
	const [vehicleTypeFilter, setVehicleTypeFilter] = useState("publicVehicle");
	const [isAdding, setIsAdding] = useState(false);
	const [selectedDay, setSelectedDay] = useState<SpecialDay | null>(null); // Día seleccionado para eliminar

	useEffect(() => {
		const fetchSpecialDays = async () => {
			const response = await axiosInstance.get<{ specialDays: SpecialDay[] }>(
				"/special-days"
			);
			console.log(response.data.specialDays);

			const data: SpecialDay[] = response.data.specialDays;
			setSpecialDays(data);
		};

		fetchSpecialDays();
	}, []);

	useEffect(() => {
		const filtered = specialDays.filter(
			(day) => day.vehicleType === vehicleTypeFilter
		);
		setFilteredDays(filtered);
	}, [vehicleTypeFilter, specialDays]);

	const handleAddDay = (newDay: SpecialDay) => {
		setSpecialDays([...specialDays, newDay]);
		setIsAdding(false);
	};

	const handleDeleteDay = async () => {
		if (!selectedDay) return;

		try {
			await axiosInstance.delete(`/special-days/${selectedDay._id}`);
			setSpecialDays(specialDays.filter((day) => day._id !== selectedDay._id));
			setSelectedDay(null);
		} catch (error) {
			console.error("Error al eliminar día especial", error);
		}
	};

	return (
		<div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
			<div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
				<h1 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
					Días Especiales
				</h1>

				{/* Filtro por tipo de vehículo */}
				<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
					<Button
						onClick={() => setVehicleTypeFilter("publicVehicle")}
						className={`p-2 rounded-lg transition-colors duration-300 ${
							vehicleTypeFilter === "publicVehicle"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
						}`}>
						Taxis
					</Button>
					<Button
						onClick={() => setVehicleTypeFilter("privateVehicle")}
						className={`p-2 rounded-lg transition-colors duration-300 ${
							vehicleTypeFilter === "privateVehicle"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
						}`}>
						Vehículo Particular
					</Button>
					<Button
						onClick={() => setVehicleTypeFilter("heavyVehicle")}
						className={`p-2 rounded-lg transition-colors duration-300 ${
							vehicleTypeFilter === "heavyVehicle"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
						}`}>
						Vehículos Pesados
					</Button>
					<Button
						onClick={() => setVehicleTypeFilter("motorcycle")}
						className={`p-2 rounded-lg transition-colors duration-300 ${
							vehicleTypeFilter === "motorcycle"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
						}`}>
						Motos
					</Button>
				</div>

				{/* Cards de días especiales */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{filteredDays.map((day) => (
						<motion.div
							key={day._id}
							className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col items-center"
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}>
							<FiCalendar className="text-4xl text-blue-500 mb-2" />
							<h2 className="text-xl font-semibold text-gray-800 dark:text-white">
								{day.reason}
							</h2>
							<p className="text-gray-600 dark:text-gray-300">
								{new Date(day.date).toLocaleDateString("es-ES", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
									timeZone: "UTC",
								})}
							</p>
							{/* Botón de eliminar con diálogo de confirmación */}
							<Dialog>
								<DialogTrigger asChild>
									<Button
										onClick={() => setSelectedDay(day)}
										className="mt-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center">
										<FiTrash2 className="mr-2" /> Eliminar
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Confirmar eliminación</DialogTitle>
										<DialogDescription>
											¿Estás seguro de que deseas eliminar este día especial?
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button
											onClick={handleDeleteDay}
											className="bg-red-500 hover:bg-red-600 text-white">
											Eliminar
										</Button>
										<DialogClose asChild>
											<Button className="bg-gray-300 hover:bg-gray-400 text-gray-800">
												Cancelar
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</motion.div>
					))}
				</div>

				{/* Botón para agregar un nuevo día especial */}
				<div className="flex justify-center mt-8">
					{!isAdding ? (
						<Button
							onClick={() => setIsAdding(true)}
							className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex items-center">
							<FiPlusCircle className="mr-2" />
							Agregar Día Especial
						</Button>
					) : (
						<AddSpecialDayForm onAddDay={handleAddDay} />
					)}
				</div>
			</div>
		</div>
	);
}
