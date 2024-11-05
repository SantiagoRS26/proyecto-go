import { IUsersGeofencesRepository } from "@/core/interfaces/repositories/IUsersGeofencesRepository";
import {UserGeofencesApi} from "@/infrastructure/api/UsersGeofencesApi";
import { UsersGeofencesDTO } from "@/core/interfaces/dto/usersGeofencesDTO";

export class UsersGeofencesRepository implements IUsersGeofencesRepository {
  private usersGeofencesApi: UserGeofencesApi;

  constructor() {
    this.usersGeofencesApi = new UserGeofencesApi();
  }

  async getUserGeofences(userId : string): Promise<UsersGeofencesDTO> {
    try {
      const reportsResponse = await this.usersGeofencesApi.getUserGeofences(userId);
      return reportsResponse;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}