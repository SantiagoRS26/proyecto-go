export enum VehicleType {
    PublicVehicle = "publicVehicle",
    PrivateVehicle = "privateVehicle",
    HeavyVehicle = "heavyVehicle",
    Motorcycle = "motorcycle"
  }
  
  export enum WeekDays {
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
    Sunday = "Sunday"
  }
  export const daysMap = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
};

  export interface Restriction {
    day: WeekDays;
    plates: string[]; 
    hours: string[][]; 
  }
  
  export interface PicoPlacaRestrictions {
    days: Restriction[];
    exemption?: boolean; 
    additionalInfo?: string; 
  }
  
  export interface PicoPlacaDailyDTO {
    vehicleType: VehicleType;
    restrictions: PicoPlacaRestrictions;
    createdAt?: Date; 
  }
export interface PicoPlacaFormProps {
  updateData: (data: PicoPlacaDailyDTO) => void; // Función para actualizar el padre
  vehicleType: string;
}