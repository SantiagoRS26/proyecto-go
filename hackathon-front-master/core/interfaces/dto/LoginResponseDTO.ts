import { UserDTO } from "./UserDTO";

export interface LoginResponseDTO {
	user: UserDTO;
	message: string;
}
