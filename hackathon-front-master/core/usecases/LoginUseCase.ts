import { User } from "../entities/User";
import { LoginResponseDTO } from "../interfaces/dto/LoginResponseDTO";
import { IAuthRepository } from "../interfaces/repositories/IAuthRepository";
import { AppDispatch } from "@/infrastructure/store";
import { loginSuccess } from "@/infrastructure/store/authSlice";

export class LoginUseCase {
	private authRepository: IAuthRepository;

	constructor(authRepository: IAuthRepository) {
		this.authRepository = authRepository;
	}

	async execute(
		email: string,
		password: string,
		dispatch: AppDispatch
	): Promise<{ user: User; message: string }> {
		try {
			const loginResponse: LoginResponseDTO = await this.authRepository.login(
				email,
				password
			);
			const userData = loginResponse.user;

			const role = userData.isAdmin ? 'admin' : 'user';

			dispatch(loginSuccess({ ...userData, role }));
			const user = new User(userData);
			return { user, message: loginResponse.message };
		} catch (error: any) {
			throw new Error(error.message || "Error al iniciar sesión");
		}
	}
}
