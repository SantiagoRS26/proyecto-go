import { IUsersGeofencesRepository } from "../interfaces/repositories/IUsersGeofencesRepository";
import { UsersGeofencesDTO } from "../interfaces/dto/usersGeofencesDTO";

export class GetUserGeofencesUseCase {
  private userGeofenceRepository: IUsersGeofencesRepository;

  constructor(userGeofenceRepository: IUsersGeofencesRepository) {
    this.userGeofenceRepository = userGeofenceRepository;
  }

  async execute(userId : string): Promise<UsersGeofencesDTO> {
    try {
        const userGeofencesDTO: UsersGeofencesDTO = await this.userGeofenceRepository.getUserGeofences(userId);
        return userGeofencesDTO;
    } catch (error: any) {
      throw new Error(error.message || "Error al obtener geocercas del usuario");
    }
  }
}