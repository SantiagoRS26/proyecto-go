import { NotificationPermissionsDTO } from "@/core/interfaces/dto/user/NotificationPermissionsDTO";
import axiosInstance from "./axiosInstance";

export class UserApi {
	async getNotificationPermissions(
		userId: string
	): Promise<NotificationPermissionsDTO> {
		try {
			const response = await axiosInstance.get<NotificationPermissionsDTO>(
				`/notificationPermissions/${userId}`
			);
			console.log("Verificando respuesta", response.data);
			return response.data;
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.error) {
				throw new Error(error.response.data.error);
			}
			throw new Error("Error desconocido al obtener permisos de notificación");
		}
	}

	async updateNotificationPermissions(
		userId: string,
		permissions: NotificationPermissionsDTO
	): Promise<void> {
		try {
			await axiosInstance.put(`/notificationPermissions/${userId}`, {
				...permissions,
			});
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.error) {
				throw new Error(error.response.data.error);
			}
			throw new Error(
				"Error desconocido al actualizar permisos de notificación"
			);
		}
	}
}
