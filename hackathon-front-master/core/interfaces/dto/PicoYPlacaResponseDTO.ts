export interface DayRestrictionDTO {
	day: string;
	plates: string[];
	hours: string[][][];
	_id: string;
  }
  
  export interface RestrictionsDTO {
	days: DayRestrictionDTO[];
	exemption: boolean;
	additionalInfo?: string;
  }
  
  export interface PicoYPlacaDailyDTO {
	restrictions: RestrictionsDTO;
	_id: string;
	decree: string;
	vehicleType: string;
	createdAt: string;
	__v: number;
  }
  
  export interface PicoYPlacaResponseDTO {
	picoyPlacaDaily: PicoYPlacaDailyDTO[];
  }

  export interface DayRestrictionDTOWithDate extends DayRestrictionDTO {
	date: Date;
	additionalInfo?: string;
  }
  