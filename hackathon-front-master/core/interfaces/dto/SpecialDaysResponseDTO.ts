export interface SpecialDayDTO {
	_id: string;
	date: string;
	reason: string;
	vehicleType: string;
	createdAt: string;
	__v: number;
}

export interface SpecialDaysResponseDTO {
	specialDays: SpecialDayDTO[];
}
