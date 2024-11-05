"use client";
import { DecreeDTO } from "../../../core/interfaces/dto/picoyplacadto/DecreeDTO";

export default function Decree({ decreeName, setDecreeName }: DecreeDTO) {
	return (
		<div>
			<label className="block text-lg font-medium text-gray-700 dark:text-gray-200">
				Nombre del Decreto
			</label>
			<input
				type="text"
				value={decreeName}
				onChange={(e) => setDecreeName(e.target.value)}
				className="mt-1 block w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
				placeholder="Nombre del Decreto"
			/>
		</div>
	);
}
