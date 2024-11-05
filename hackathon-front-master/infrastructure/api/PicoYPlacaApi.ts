import axiosInstance from "./axiosInstance";
import { PicoYPlacaResponseDTO } from "@/core/interfaces/dto/PicoYPlacaResponseDTO";
import { PicoYPlacaGeofencesResponseDTO } from "@/core/interfaces/dto/PicoYPlacaGeofencesResponseDTO";
import { SpecialDaysResponseDTO } from "@/core/interfaces/dto/SpecialDaysResponseDTO";

export class PicoYPlacaApi {
  async getPicoYPlaca(): Promise<PicoYPlacaResponseDTO> {
    try {
      const response = await axiosInstance.get<PicoYPlacaResponseDTO>("/pico-y-placa");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Error desconocido al obtener la información de pico y placa");
    }
  }

  async getPicoYPlacaGeofences(): Promise<PicoYPlacaGeofencesResponseDTO> {
    try {
      const response = await axiosInstance.get<PicoYPlacaGeofencesResponseDTO>("/pico-y-placa-geofences");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Error desconocido al obtener las geocercas de pico y placa");
    }
  }

  async getSpecialDays(vehicleType: string): Promise<SpecialDaysResponseDTO> {
    try {
      const response = await axiosInstance.get<SpecialDaysResponseDTO>(`/special-days/${vehicleType}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Error desconocido al obtener los días especiales");
    }
  }
}
