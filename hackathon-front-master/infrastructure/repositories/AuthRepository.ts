import { IAuthRepository } from "@/core/interfaces/repositories/IAuthRepository";
import { AuthApi } from "../api/AuthApi";
import { LoginResponseDTO } from "@/core/interfaces/dto/LoginResponseDTO";

export class AuthRepository implements IAuthRepository {
	private authApi: AuthApi;
	constructor() {
		this.authApi = new AuthApi();
	}

	async login(email: string, password: string): Promise<LoginResponseDTO> {
		try {
			return await this.authApi.login(email, password);
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async register(
		name: string,
		email: string,
		password: string
	): Promise<RegisterResponseDTO> {
		try {
			return await this.authApi.register(name, email, password);
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
