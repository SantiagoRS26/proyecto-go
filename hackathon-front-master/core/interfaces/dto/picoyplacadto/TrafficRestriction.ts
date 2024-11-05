export interface Days{
    day : string;
    plates : string[];
    hours : string[][][];
}
export interface Restrictions{
    days : Days[];
    exemption? : boolean;
    additionalInfo? : string;
}
export interface DailyRestriction{
    vehicleType : string;
    restrictions : Restrictions;
}
export interface Geofences {
    name: string;
    vehicleType: string;
    coordinates: number[][];
}
export interface TrafficRestriction{
    decreeName : string;
    daily : DailyRestriction[];
    geofences : Geofences[];
}