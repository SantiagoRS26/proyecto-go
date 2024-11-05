export interface AddReportResponseDTO {
	report: {
    likedBy: never[];
		_id: string;
		type: string;
		createdBy: string;
		coordinates: {
			longitude: number;
			latitude: number;
		};
		likes: number;
		isVerified: boolean;
		createdAt: string;
		__v: number;
	};
}