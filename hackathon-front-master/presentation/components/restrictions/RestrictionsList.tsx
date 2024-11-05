"use client";

import { DayRestrictionDTOWithDate } from "@/core/usecases/picoyplaca/GetWeeklyPicoYPlacaRestrictionsUseCase";
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCar, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { parseLocalDate } from "@/lib/dateUtils";

interface RestrictionsListProps {
	weekRestrictions: DayRestrictionDTOWithDate[];
	loadingRestrictions: boolean;
	errorRestrictions: string | null;
	title: string;
}

interface RestrictionStatus {
	type: "start" | "end";
	time: string;
}

const parseTime = (
	timeStr: string
): { hour: number; minute: number } | null => {
	const regex = /^(\d{1,2}):(\d{2})(am|pm)$/i;
	const match = timeStr.match(regex);
	if (!match) return null;

	let hour = parseInt(match[1], 10);
	const minute = parseInt(match[2], 10);
	const meridiem = match[3].toLowerCase();

	if (meridiem === "pm" && hour !== 12) {
		hour += 12;
	}
	if (meridiem === "am" && hour === 12) {
		hour = 0;
	}

	return { hour, minute };
};

const getTimeDifference = (from: Date, to: Date): string => {
	const diffMs = to.getTime() - from.getTime();
	if (diffMs <= 0) return "0h 0m";

	const diffMinutes = Math.floor(diffMs / 60000);
	const hours = Math.floor(diffMinutes / 60);
	const minutes = diffMinutes % 60;
	return `${hours}h ${minutes}m`;
};

const getRestrictionStatus = (
	hours: string[][][],
	simulatedNow?: Date
): RestrictionStatus | null => {
	const now = simulatedNow ? new Date(simulatedNow) : new Date();
	let statusMessage: RestrictionStatus | null = null;

	for (let period of hours) {
		for (let hourPair of period) {
			const [startStr, endStr] = hourPair;
			const startTime = parseTime(startStr.toLowerCase());
			const endTime = parseTime(endStr.toLowerCase());

			if (!startTime || !endTime) continue;

			const startDate = new Date(now);
			startDate.setHours(startTime.hour, startTime.minute, 0, 0);

			let endDate = new Date(now);
			endDate.setHours(endTime.hour, endTime.minute, 0, 0);

			// Manejar restricciones que cruzan la medianoche
			if (endDate <= startDate) {
				endDate.setDate(endDate.getDate() + 1);
			}

			if (now < startDate) {
				const diff = getTimeDifference(now, startDate);
				statusMessage = { type: "start", time: diff };
				return statusMessage;
			} else if (now >= startDate && now < endDate) {
				const diff = getTimeDifference(now, endDate);
				statusMessage = { type: "end", time: diff };
				return statusMessage;
			}
		}
	}

	return statusMessage;
};

const RestrictionsList: React.FC<RestrictionsListProps> = ({
	weekRestrictions,
	loadingRestrictions,
	errorRestrictions,
	title,
}) => {
	const [currentTime, setCurrentTime] = useState<Date>(new Date());

	// Actualizar la hora actual cada minuto
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000); // Actualiza cada 60 segundos

		return () => clearInterval(timer); // Limpia el intervalo al desmontar el componente
	}, []);

	const formatDate = (date: Date | string) => {
		const d = typeof date === "string" ? parseLocalDate(date) : date;
		return d.toLocaleDateString("es-ES", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const renderHours = (hours: string[][][]) => {
		if (!hours || hours.length === 0) return "Sin horas definidas.";

		return hours.map((period, periodIndex) => (
			<span key={periodIndex}>
				{period.map((hourPair, pairIndex) => (
					<span key={pairIndex}>
						{hourPair[0]} - {hourPair[1]}
						{pairIndex < period.length - 1 ? ", " : ""}
					</span>
				))}
				{periodIndex < hours.length - 1 ? "; " : ""}
			</span>
		));
	};

	const sortedWeekRestrictions = useMemo(() => {
		return [...weekRestrictions].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);
	}, [weekRestrictions]);

	const getVehicleIcon = (plates: string[]) => {
		if (plates.length === 0) {
			return (
				<FaExclamationTriangle className="text-yellow-500 inline-block mr-2 dark:text-yellow-400" />
			);
		}
		return (
			<FaCar className="text-blue-500 inline-block mr-2 dark:text-blue-400" />
		);
	};

	const today = useMemo(() => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}, []);

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
				{title}
			</h2>
			{loadingRestrictions ? (
				<div className="flex items-center justify-center py-10">
					<FaSpinner className="text-indigo-500 dark:text-indigo-400 text-4xl animate-spin" />
					<span className="ml-4 text-lg text-gray-600 dark:text-gray-300">
						Cargando restricciones...
					</span>
				</div>
			) : errorRestrictions ? (
				<div className="flex items-center text-red-500 dark:text-red-400">
					<FaExclamationTriangle className="mr-2" />
					<span>{errorRestrictions}</span>
				</div>
			) : sortedWeekRestrictions.length === 0 ? (
				<div className="flex items-center text-gray-600 dark:text-gray-400">
					<FaExclamationTriangle className="mr-2" />
					<span>No hay restricciones para esta semana.</span>
				</div>
			) : (
				<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{sortedWeekRestrictions.map((restriction) => {
						const restrictionDate =
							typeof restriction.date === "string"
								? parseLocalDate(restriction.date)
								: restriction.date;
						const isToday =
							restrictionDate.getFullYear() === today.getFullYear() &&
							restrictionDate.getMonth() === today.getMonth() &&
							restrictionDate.getDate() === today.getDate();

						let statusMessage: RestrictionStatus | null = null;
						if (isToday) {
							statusMessage = getRestrictionStatus(
								restriction.hours,
								currentTime
							);
						}

						return (
							<motion.li
								key={restriction._id}
								className={`bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 flex flex-col transform transition duration-300 ${
									isToday
										? "border-2 border-indigo-500 dark:border-indigo-400"
										: ""
								} hover:scale-105 hover:shadow-lg dark:hover:shadow-xl`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, ease: "easeOut" }}>
								<div className="flex items-center mb-2">
									{getVehicleIcon(restriction.plates)}
									<h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
										{formatDate(restriction.date)}
									</h3>
								</div>
								{restriction.plates.length > 0 ? (
									<div className="text-gray-600 dark:text-gray-400">
										<p>
											<span className="font-semibold">Placas:</span>{" "}
											{restriction.plates.join(", ")}
										</p>
										<p>
											<span className="font-semibold">Horas:</span>{" "}
											{renderHours(restriction.hours)}
										</p>
									</div>
								) : (
									<p className="text-yellow-600 dark:text-yellow-500">
										Sin restricciones debido a un día especial.
									</p>
								)}
								{restriction.additionalInfo && (
									<p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
										({restriction.additionalInfo})
									</p>
								)}
								{isToday && (
									<>
										<motion.div
											className="mt-2 flex items-center justify-center"
											animate={{ scale: [1, 1.1, 1] }}
											transition={{
												duration: 1,
												repeat: Infinity,
												repeatType: "loop",
											}}>
											<FaExclamationTriangle className="text-indigo-500 dark:text-indigo-400" />
											<span className="ml-2 text-indigo-500 dark:text-indigo-300 font-semibold">
												¡Hoy!
											</span>
										</motion.div>
										{statusMessage && (
											<p className="mt-2 text-sm text-center">
												{statusMessage.type === "end" ? (
													<>
														Termina en{" "}
														<span className="font-semibold text-white px-1 py-1 rounded bg-red-500 dark:bg-red-600">
															{statusMessage.time}
														</span>
													</>
												) : (
													<>
														Empieza en{" "}
														<span className="font-semibold text-white px-1 py-1 rounded bg-green-500 dark:bg-green-600">
															{statusMessage.time}
														</span>
													</>
												)}
											</p>
										)}
									</>
								)}
							</motion.li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default RestrictionsList;
