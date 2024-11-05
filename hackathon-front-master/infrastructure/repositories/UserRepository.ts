import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { UserApi } from "../api/UserApi";
import { NotificationPermissionsDTO } from "@/core/interfaces/dto/user/NotificationPermissionsDTO";

export class UserRepository implements IUserRepository {
	private userApi: UserApi;

	constructor() {
		this.userApi = new UserApi();
	}

	async getNotificationPermissions(
		userId: string
	): Promise<NotificationPermissionsDTO> {
		try {
			return await this.userApi.getNotificationPermissions(userId);
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async updateNotificationPermissions(
		userId: string,
		permissions: NotificationPermissionsDTO
	): Promise<void> {
		try {
			await this.userApi.updateNotificationPermissions(userId, permissions);
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
