import { IPicoYPlacaRepository } from "../../interfaces/repositories/IPicoYPlacaRepository";
import { PicoYPlacaGeofencesResponseDTO } from "../../interfaces/dto/PicoYPlacaGeofencesResponseDTO";

export class GetPicoYPlacaGeofencesUseCase {
	private picoYPlacaRepository: IPicoYPlacaRepository;

	constructor(picoYPlacaRepository: IPicoYPlacaRepository) {
		this.picoYPlacaRepository = picoYPlacaRepository;
	}

	async execute(): Promise<PicoYPlacaGeofencesResponseDTO> {
		try {
			const geofencesResponse =
				await this.picoYPlacaRepository.getPicoYPlacaGeofences();
			return geofencesResponse;
		} catch (error: any) {
			throw new Error(
				error.message || "Error al obtener las geocercas de Pico y Placa"
			);
		}
	}
}
