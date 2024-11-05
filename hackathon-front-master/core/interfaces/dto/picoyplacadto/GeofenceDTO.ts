export interface GeofenceDTO {
    id: string;
    name: string;
    vehicleType: 'motorcycle' | 'publicVehicle' | 'privateVehicle' | 'heavyVehicle';
    coordinates: number[][];
}
export interface GeofenceProps {
    updateData: (data: GeofenceDTO[]) => void;
  }