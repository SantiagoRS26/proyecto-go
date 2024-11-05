import { LoginResponseDTO } from "../dto/LoginResponseDTO";

export interface IAuthRepository {
	login(email: string, password: string): Promise<LoginResponseDTO>;
	register(
		name: string,
		email: string,
		password: string
	): Promise<RegisterResponseDTO>;
}
