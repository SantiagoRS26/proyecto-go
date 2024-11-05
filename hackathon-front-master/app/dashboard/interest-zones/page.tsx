"use client";
import { motion } from "framer-motion";
import InterestZonesMap from "./components/InterestZonesMap";
import { RootState } from "@/infrastructure/store";
import { useSelector } from "react-redux";
import axiosInstance from "@/infrastructure/api/axiosInstance";
import { useEffect, useState } from "react";
import { FiMapPin } from "react-icons/fi";

export interface AllInterestZoneDTO {
	_id?: string;
	name: string;
	user: string;
	geometry: {
		type: "Polygon";
		coordinates: number[][][];
	};
}

interface GetInterestZonesResponse {
	interestZones: AllInterestZoneDTO[];
}

export default function InterestZonesDashboard() {
	const user = useSelector((state: RootState) => state.auth.user);
	const [interestZones, setInterestZones] = useState<AllInterestZoneDTO[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	const getInterestZones = async () => {
		try {
			setIsLoaded(true);
			const response = await axiosInstance.get<GetInterestZonesResponse>(
				`interest-zones/${user?._id}`
			);
			setInterestZones(response.data.interestZones);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoaded(false);
		}
	};

	useEffect(() => {
		getInterestZones();
	}, []);

	return (
		<motion.div
			className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-10 px-4 transition-colors duration-300"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}>
			<div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl rounded-lg p-8 transition-colors duration-300">
				<div className="flex justify-center flex-col mb-4">
					<h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6 flex items-center justify-center">
						<FiMapPin className="mr-2 text-indigo-500 dark:text-indigo-400" />
						Mis zonas de interés
					</h1>
					<span className="text-gray-600 dark:text-gray-400 text-sm text-center"> Recibira notificaciones cuando un reporte se encuentre dentro de alguna de sus areas de interes  </span>

				</div>
				<form
					className="space-y-6">
					<div>
						{!isLoaded && <InterestZonesMap allInterestZones={interestZones} />}
					</div>
				</form>
			</div>
			<div></div>
		</motion.div>
	);
}
