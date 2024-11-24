import { ReportDTO } from "../interfaces/dto/ReportsResponseDTO";
import reportTypesData from "@/infrastructure/api/report-types.json";

export class Report {
	id: string;
	coordinates: {
		longitude: number;
		latitude: number;
	};
	type: {
		id: string;
		type: string;
		description: string;
		icons: {
			icon_normal: string;
			icon_small: string;
		};
		createdAt: string;
	};
	createdBy: {
		id: string;
		email: string;
		name: string;
		isAdmin: boolean;
		notifyTrafficDecree: boolean;
		notifyReportsOnInterestZones: boolean;
		notifyGeneralImportant: boolean;
	};
	likedBy: string[];
	isVerified: boolean;
	createdAt: string;

	constructor(dto: ReportDTO) {
		// Buscar los íconos correctos según el tipo de reporte
		const reportType = reportTypesData.reportTypes.find(
			(type) => type.type === dto.type.type
		);

		if (!reportType) {
			throw new Error(`No se encontró un ícono para el tipo de reporte: ${dto.type.type}`);
		}

		this.id = dto._id;
		this.coordinates = dto.coordinates;
		this.type = {
			id: dto.type._id,
			type: dto.type.type,
			description: dto.type.description,
			icons: {
				icon_normal: reportType.icons.icon_normal, // Sustitución de íconos
				icon_small: reportType.icons.icon_small,  // Sustitución de íconos
			},
			createdAt: dto.type.createdAt,
		};
		this.createdBy = {
			id: dto.createdBy._id,
			email: dto.createdBy.email,
			name: dto.createdBy.name,
			isAdmin: dto.createdBy.isAdmin,
			notifyTrafficDecree: dto.createdBy.notifyTrafficDecree,
			notifyReportsOnInterestZones: dto.createdBy.notifyReportsOnInterestZones,
			notifyGeneralImportant: dto.createdBy.notifyGeneralImportant,
		};
		this.likedBy = dto.likedBy;
		this.isVerified = dto.isVerified;
		this.createdAt = dto.createdAt;
	}
}