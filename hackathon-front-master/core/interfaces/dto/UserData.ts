export interface UserData {
	_id: string;
	email: string;
	name: string;
	role: "guest" | "user" | "admin";
	__v: number;
}