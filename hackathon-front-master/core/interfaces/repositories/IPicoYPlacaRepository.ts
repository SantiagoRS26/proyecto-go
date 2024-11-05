import { PicoYPlacaResponseDTO } from "@/core/interfaces/dto/PicoYPlacaResponseDTO";
import { PicoYPlacaGeofencesResponseDTO } from "@/core/interfaces/dto/PicoYPlacaGeofencesResponseDTO";
import { SpecialDaysResponseDTO } from "@/core/interfaces/dto/SpecialDaysResponseDTO";

export interface IPicoYPlacaRepository {
	getPicoYPlaca(): Promise<PicoYPlacaResponseDTO>;

	getPicoYPlacaGeofences(): Promise<PicoYPlacaGeofencesResponseDTO>;

	getSpecialDays(vehicleType: string): Promise<SpecialDaysResponseDTO>;
}
