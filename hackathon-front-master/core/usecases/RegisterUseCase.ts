import { IAuthRepository } from "../interfaces/repositories/IAuthRepository";

export class RegisterUseCase {
	private authRepository: IAuthRepository;

	constructor(authRepository: IAuthRepository) {
		this.authRepository = authRepository;
	}

	async execute(
		name: string,
		email: string,
		password: string
	): Promise<{ message: string }> {
		try {
			const registerResponse: RegisterResponseDTO =
				await this.authRepository.register(name, email, password);
			return { message: registerResponse.message };
		} catch (error: any) {
			throw new Error(error.message || "Error al registrar usuario");
		}
	}
}
