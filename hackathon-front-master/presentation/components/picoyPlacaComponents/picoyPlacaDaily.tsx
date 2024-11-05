"use client";
import { useState } from "react";
import {
	PicoPlacaDailyDTO,
	Restriction,
	WeekDays,
	PicoPlacaFormProps,
	VehicleType,
	daysMap,
} from "../../../core/interfaces/dto/picoyplacadto/PicoPlacaDailyDTO";

const PicoPlacaForm = ({ updateData, vehicleType }: PicoPlacaFormProps) => {
	const selectedVehicleType =
		VehicleType[vehicleType as keyof typeof VehicleType] ||
		VehicleType.PublicVehicle;
	const [formData, setFormData] = useState<PicoPlacaDailyDTO>({
		vehicleType: selectedVehicleType,
		restrictions: {
			days: [{ day: WeekDays.Monday, plates: [], hours: [["", ""]] }],
			exemption: false,
			additionalInfo: "",
		},
		createdAt: new Date(),
	});

	const handleExemptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isExempt = e.target.checked;
		const updatedForm = {
			...formData,
			restrictions: {
				...formData.restrictions,
				exemption: isExempt,
				days: isExempt ? [] : formData.restrictions.days, // Vacia días si está exento
				additionalInfo: formData.restrictions.additionalInfo,
			},
		};
		setFormData(updatedForm);
		updateData(updatedForm);
	};
	const handleAdditionalInfoChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		const updatedForm = {
			...formData,
			restrictions: {
				...formData.restrictions,
				additionalInfo: e.target.value,
			},
		};
		setFormData(updatedForm);
		updateData(updatedForm);
	};
	const handleRestrictionChange = (
		index: number,
		key: keyof Restriction,
		value: unknown
	) => {
		const newRestrictions = [...formData.restrictions.days];
		newRestrictions[index] = { ...newRestrictions[index], [key]: value };
		const updatedForm = {
			...formData,
			restrictions: { ...formData.restrictions, days: newRestrictions },
		};
		setFormData(updatedForm);
		updateData(updatedForm);
	};

	const handleAddDayRestriction = () => {
		const availableDays = getAvailableDays();
		if (availableDays.length === 0) {
			alert("Ya has seleccionado todos los días posibles.");
			return;
		}

		const updatedForm = {
			...formData,
			restrictions: {
				...formData.restrictions,
				days: [
					...formData.restrictions.days,
					{ day: availableDays[0], plates: [], hours: [["", ""]] },
				],
			},
		};
		setFormData(updatedForm);
		updateData(updatedForm);
	};
	const getDayInSpanish = (day: WeekDays) => daysMap[day];
	const handleAddHourRestriction = (dayIndex: number) => {
		const updatedForm = {
			...formData,
			restrictions: {
				...formData.restrictions,
				days: formData.restrictions.days.map((day, index) =>
					index === dayIndex ? { ...day, hours: [...day.hours, ["", ""]] } : day
				),
			},
		};
		setFormData(updatedForm);
		updateData(updatedForm);
	};

	const getAvailableDays = () => {
		const selectedDays = formData.restrictions.days.map((r) => r.day);
		return Object.values(WeekDays).filter((day) => !selectedDays.includes(day));
	};

	return (
		<div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6 transition-colors duration-300">
			<div className="space-y-4">
				<div>
					<label className="inline-flex items-center">
						<input
							type="checkbox"
							checked={formData.restrictions.exemption}
							onChange={handleExemptionChange}
							className="form-checkbox h-5 w-5 text-indigo-600 dark:bg-gray-700 dark:border-gray-600"
						/>
						<span className="ml-2 text-gray-700 dark:text-gray-200">
							Exento de pico y placa
						</span>
					</label>
				</div>

				{!formData.restrictions.exemption && (
					<>
						{formData.restrictions.days.map((restriction, index) => (
							<div
								key={index}
								className="border-t border-gray-200 dark:border-gray-600 pt-4">
								<h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
									Restricción {index + 1}
								</h4>

								<div className="mt-2">
									<label
										htmlFor={`day-${index}`}
										className="block text-sm font-medium text-gray-700 dark:text-gray-200">
										Día:
									</label>
									<select
										id={`day-${index}`}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
										value={restriction.day}
										onChange={(e) =>
											handleRestrictionChange(index, "day", e.target.value)
										}>
										{getAvailableDays()
											.concat(restriction.day)
											.map((day) => (
												<option
													key={day}
													value={day}>
													{getDayInSpanish(day)}
												</option>
											))}
									</select>
								</div>

								<div className="mt-2">
									<label
										htmlFor={`plates-${index}`}
										className="block text-sm font-medium text-gray-700 dark:text-gray-200">
										Placas restringidas:
									</label>
									<input
										type="text"
										id={`plates-${index}`}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
										value={restriction.plates.join(",")}
										onChange={(e) =>
											handleRestrictionChange(
												index,
												"plates",
												e.target.value.split(",")
											)
										}
										placeholder="Ej. 0,1,2"
									/>
								</div>

								<div className="mt-2">
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
										Horas de restricción:
									</label>
									{restriction.hours.map((hourRange, hourIndex) => (
										<div
											key={hourIndex}
											className="flex space-x-4 mt-2">
											<input
												type="text"
												placeholder="Hora inicio"
												className="block w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
												value={hourRange[0]}
												onChange={(e) =>
													handleRestrictionChange(
														index,
														"hours",
														restriction.hours.map((h, i) =>
															i === hourIndex ? [e.target.value, h[1]] : h
														)
													)
												}
											/>
											<input
												type="text"
												placeholder="Hora fin"
												className="block w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
												value={hourRange[1]}
												onChange={(e) =>
													handleRestrictionChange(
														index,
														"hours",
														restriction.hours.map((h, i) =>
															i === hourIndex ? [h[0], e.target.value] : h
														)
													)
												}
											/>
										</div>
									))}

									<button
										type="button"
										className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors duration-300"
										onClick={() => handleAddHourRestriction(index)}>
										Añadir más horas
									</button>
								</div>
							</div>
						))}

						<button
							type="button"
							className="mt-4 w-full inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors duration-300"
							onClick={handleAddDayRestriction}>
							Añadir día de restricción
						</button>
					</>
				)}

				<div className="mt-4">
					<label
						htmlFor="additional-info"
						className="block text-sm font-medium text-gray-700 dark:text-gray-200">
						Información adicional:
					</label>
					<textarea
						id="additional-info"
						className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
						value={formData.restrictions.additionalInfo}
						onChange={handleAdditionalInfoChange}
						placeholder="Información relevante..."
					/>
				</div>
			</div>
		</div>
	);
};

export default PicoPlacaForm;
