import { ReportDTO } from "../interfaces/dto/ReportsResponseDTO";

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
		this.id = dto._id;
		this.coordinates = dto.coordinates;
		this.type = {
			id: dto.type._id,
			type: dto.type.type,
			description: dto.type.description,
			icons: {
				icon_normal: dto.type.icons.icon_normal,
				icon_small: dto.type.icons.icon_small,
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
