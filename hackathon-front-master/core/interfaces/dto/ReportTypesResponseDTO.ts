export interface ReportTypeDTO {
	icons: {
		icon_normal: string;
		icon_small: string;
	};
	_id: string;
	type: string;
	description: string;
	createdAt: string;
	__v: number;
}

export interface ReportTypesResponseDTO {
	reportTypes: ReportTypeDTO[];
}
