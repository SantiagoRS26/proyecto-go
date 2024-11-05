export interface ReportsResponseDTO {
	reports: ReportDTO[];
}

export interface PaginatedReportsResponseDTO {
	items: ReportDTO[];
	totalRecords: number;
	pageNumber: number;
	pageSize: number;
	totalPages: number;
}

export interface ReportDTO {
	coordinates: {
		longitude: number;
		latitude: number;
	};
	_id: string;
	type: {
		_id: string;
		type: string;
		description: string;
		icons: {
			icon_normal: string;
			icon_small: string;
		};
		createdAt: string;
		__v: number;
	};
	createdBy: {
		_id: string;
		email: string;
		name: string;
		isAdmin: boolean;
		notifyTrafficDecree: boolean;
		notifyReportsOnInterestZones: boolean;
		notifyGeneralImportant: boolean;
		__v: number;
	};
	likedBy: string[];
	isVerified: boolean;
	createdAt: string;
	__v: number;
}
