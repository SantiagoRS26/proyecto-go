import { UsersGeofencesDTO } from "../dto/usersGeofencesDTO";

export interface IUsersGeofencesRepository {
	getUserGeofences(userId: string): Promise<UsersGeofencesDTO>;
}
