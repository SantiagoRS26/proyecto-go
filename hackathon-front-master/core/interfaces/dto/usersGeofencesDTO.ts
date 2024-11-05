export interface UsersGeofencesDTO {
    usersGeofences: UserGeofenceDTO[];
}

export interface UserGeofenceDTO {
    _id: string;
    user: string;
    name: string;
    type: string;
    coordinates: number[][];
    __v: number;
}