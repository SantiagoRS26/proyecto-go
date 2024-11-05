import { NotificationPermissionsDTO } from "@/core/interfaces/dto/user/NotificationPermissionsDTO";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

export class UpdateNotificationPermissionsUseCase {
	private userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async execute(
		userId: string,
		permissions: NotificationPermissionsDTO
	): Promise<void> {
		try {
			await this.userRepository.updateNotificationPermissions(
				userId,
				permissions
			);
		} catch (error: any) {
			throw new Error(
				error.message || "Error al actualizar los permisos de notificación"
			);
		}
	}
}
