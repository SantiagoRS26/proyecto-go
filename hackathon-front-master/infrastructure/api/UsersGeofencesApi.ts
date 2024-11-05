import axiosInstance from "./axiosInstance";
import { UsersGeofencesDTO } from "@/core/interfaces/dto/usersGeofencesDTO";

export class UserGeofencesApi {
  async getUserGeofences(userId : string): Promise<UsersGeofencesDTO> {
    try {
      const response = await axiosInstance.get<UsersGeofencesDTO>('/users-geofences/' + userId);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Error desconocido al obtener las geocercas del usuario");
    }
  }
}