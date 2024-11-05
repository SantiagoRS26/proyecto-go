import { IPicoYPlacaRepository } from "../../interfaces/repositories/IPicoYPlacaRepository";
import { PicoYPlacaResponseDTO } from "../../interfaces/dto/PicoYPlacaResponseDTO";

export class GetPicoYPlacaUseCase {
	private picoYPlacaRepository: IPicoYPlacaRepository;

	constructor(picoYPlacaRepository: IPicoYPlacaRepository) {
		this.picoYPlacaRepository = picoYPlacaRepository;
	}

	async execute(): Promise<PicoYPlacaResponseDTO> {
		try {
			const picoYPlacaResponse =
				await this.picoYPlacaRepository.getPicoYPlaca();
			return picoYPlacaResponse;
		} catch (error: any) {
			throw new Error(
				error.message || "Error al obtener información de Pico y Placa"
			);
		}
	}
}
