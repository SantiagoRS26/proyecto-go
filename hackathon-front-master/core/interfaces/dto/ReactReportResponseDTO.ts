export interface ReactReportResponseDTO {
	report: {
		coordinates: {
			longitude: number;
			latitude: number;
		};
		_id: string;
		type: string;
		createdBy: string;
		likedBy: string[];
		isVerified: boolean;
		createdAt: string;
		__v: number;
	};
}