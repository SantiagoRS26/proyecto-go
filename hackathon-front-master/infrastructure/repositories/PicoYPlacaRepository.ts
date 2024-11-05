import { IPicoYPlacaRepository } from "@/core/interfaces/repositories/IPicoYPlacaRepository";
import { PicoYPlacaApi } from "../api/PicoYPlacaApi";
import { PicoYPlacaResponseDTO } from "@/core/interfaces/dto/PicoYPlacaResponseDTO";
import { PicoYPlacaGeofencesResponseDTO } from "@/core/interfaces/dto/PicoYPlacaGeofencesResponseDTO";
import { SpecialDaysResponseDTO } from "@/core/interfaces/dto/SpecialDaysResponseDTO";

export class PicoYPlacaRepository implements IPicoYPlacaRepository {
  private picoYPlacaApi: PicoYPlacaApi;

  constructor() {
    this.picoYPlacaApi = new PicoYPlacaApi();
  }

  async getPicoYPlaca(): Promise<PicoYPlacaResponseDTO> {
    try {
      const picoYPlacaResponse = await this.picoYPlacaApi.getPicoYPlaca();
      return picoYPlacaResponse;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getPicoYPlacaGeofences(): Promise<PicoYPlacaGeofencesResponseDTO> {
    try {
      const picoYPlacaGeofencesResponse = await this.picoYPlacaApi.getPicoYPlacaGeofences();
      return picoYPlacaGeofencesResponse;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getSpecialDays(vehicleType: string): Promise<SpecialDaysResponseDTO> {
    try {
      const specialDaysResponse = await this.picoYPlacaApi.getSpecialDays(vehicleType);
      return specialDaysResponse;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
