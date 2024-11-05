import { LoginResponseDTO } from "@/core/interfaces/dto/LoginResponseDTO";
import axiosInstance from "./axiosInstance";

export class AuthApi {
	async login(email: string, password: string): Promise<LoginResponseDTO> {
		try {
			const response = await axiosInstance.post<LoginResponseDTO>("/sign-in", {
				email,
				password,
			});
			return response.data;
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.error) {
				throw new Error(error.response.data.error);
			}
			throw new Error("Error desconocido al iniciar sesión");
		}
	}

	async register(
		name: string,
		email: string,
		password: string
	): Promise<RegisterResponseDTO> {
		try {
			const response = await axiosInstance.post<RegisterResponseDTO>(
				"/sign-up",
				{
					name,
					email,
					password,
				}
			);
			return response.data;
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.error) {
				throw new Error(error.response.data.error);
			}
			throw new Error("Error desconocido al registrar usuario");
		}
	}

	async logout(): Promise<void> {
		await axiosInstance.post("/logout");
		localStorage.removeItem("token");
	}
}
