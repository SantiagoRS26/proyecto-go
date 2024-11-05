import { NotificationPermissionsDTO } from "@/core/interfaces/dto/user/NotificationPermissionsDTO";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

export class GetNotificationPermissionsUseCase {
	private userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async execute(userId: string): Promise<NotificationPermissionsDTO> {
		try {
			const notificationPermissions: NotificationPermissionsDTO = await this.userRepository.getNotificationPermissions(userId);
			return notificationPermissions;
		} catch (error: any) {
			throw new Error(error.message || "Error al obtener los permisos de notificación");
		}
	}
}
