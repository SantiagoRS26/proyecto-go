import { IPicoYPlacaRepository } from "../../interfaces/repositories/IPicoYPlacaRepository";
import { SpecialDaysResponseDTO } from "../../interfaces/dto/SpecialDaysResponseDTO";

export class GetSpecialDaysUseCase {
	private picoYPlacaRepository: IPicoYPlacaRepository;

	constructor(picoYPlacaRepository: IPicoYPlacaRepository) {
		this.picoYPlacaRepository = picoYPlacaRepository;
	}

	async execute(vehicleType: string): Promise<SpecialDaysResponseDTO> {
		try {
			const specialDaysResponse =
				await this.picoYPlacaRepository.getSpecialDays(vehicleType);
			return specialDaysResponse;
		} catch (error: any) {
			throw new Error(error.message || "Error al obtener los días especiales");
		}
	}
}
