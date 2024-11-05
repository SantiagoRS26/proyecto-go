export interface PicoyPlacaGeofenceDTO {
	_id: string;
	name: string;
	type: string;
	vehicleType: string;
	decree: string;
	coordinates: [number, number][];
	createdAt: string;
	modifiedAt: string;
	__v: number;
}

export interface PicoYPlacaGeofencesResponseDTO {
	picoyPlacaGeofences: PicoyPlacaGeofenceDTO[];
}


