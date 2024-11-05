export interface UserDTO {
	_id: string;
	email: string;
	name: string;
	password: string;
	isAdmin: boolean;
	notifyTrafficDecree: boolean;
	notifyReportsOnInterestZones: boolean;
	__v: number;
  }