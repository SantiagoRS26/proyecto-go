import { NotificationPermissionsDTO } from "../dto/user/NotificationPermissionsDTO";

export interface IUserRepository {
	getNotificationPermissions(
		userId: string
	): Promise<NotificationPermissionsDTO>;
	updateNotificationPermissions(
		userId: string,
		permissions: NotificationPermissionsDTO
	): Promise<void>;
}
