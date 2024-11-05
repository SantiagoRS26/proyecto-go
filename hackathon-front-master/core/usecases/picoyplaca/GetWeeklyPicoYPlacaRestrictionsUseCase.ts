// src/core/usecases/picoyplaca/GetWeeklyPicoYPlacaRestrictionsUseCase.ts

import { IPicoYPlacaRepository } from "../../interfaces/repositories/IPicoYPlacaRepository";
import { SpecialDaysResponseDTO, SpecialDayDTO } from "../../interfaces/dto/SpecialDaysResponseDTO";
import { DayRestrictionDTO, PicoYPlacaResponseDTO } from "../../interfaces/dto/PicoYPlacaResponseDTO";

export interface DayRestrictionDTOWithDate extends DayRestrictionDTO {
  date: Date;
  additionalInfo?: string; // Asegúrate de que esta propiedad esté incluida
}

export class GetWeeklyPicoYPlacaRestrictionsUseCase {
  private picoYPlacaRepository: IPicoYPlacaRepository;

  constructor(picoYPlacaRepository: IPicoYPlacaRepository) {
    this.picoYPlacaRepository = picoYPlacaRepository;
  }

  async execute(
    vehicleType: string,
    weekStartDate: Date
  ): Promise<{ weekRestrictions: DayRestrictionDTOWithDate[]; specialDays: SpecialDayDTO[] }> {
    try {
      const picoYPlacaResponse: PicoYPlacaResponseDTO = await this.picoYPlacaRepository.getPicoYPlaca();
      const specialDaysResponse: SpecialDaysResponseDTO = await this.picoYPlacaRepository.getSpecialDays(vehicleType);

      const restrictions = picoYPlacaResponse.picoyPlacaDaily.find(item => item.vehicleType === vehicleType)?.restrictions.days || [];
      const specialDays = specialDaysResponse.specialDays || [];

      // Mapear nombres de días a fechas dentro de la semana seleccionada
      const weekRestrictions: DayRestrictionDTOWithDate[] = restrictions.map(restriction => {
        const date = this.getDateFromDayName(restriction.day, weekStartDate);
        return { ...restriction, date };
      });

      // Aplicar días especiales
      const restrictionsWithSpecialDays = this.applySpecialDays(
        weekRestrictions,
        specialDays,
        weekStartDate,
        new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000)
      );

      return { weekRestrictions: restrictionsWithSpecialDays, specialDays };
    } catch (error: any) {
      throw new Error(error.message || "Error al obtener las restricciones por semanas");
    }
  }

  private getDateFromDayName(dayName: string, weekStartDate: Date): Date {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayIndex = daysOfWeek.indexOf(dayName);
    if (dayIndex === -1) {
      throw new Error(`Nombre de día inválido: ${dayName}`);
    }
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + dayIndex);
    date.setUTCHours(12, 0, 0, 0); // Establecer la hora a mediodía UTC para evitar cambios de día
    return date;
  }

  private applySpecialDays(
    weekRestrictions: DayRestrictionDTOWithDate[],
    specialDays: SpecialDayDTO[],
    startDate: Date,
    endDate: Date
  ): DayRestrictionDTOWithDate[] {
    return weekRestrictions.map(restriction => {
      const restrictionDate = restriction.date;

      const specialDay = specialDays.find(special => {
        const specialDate = new Date(special.date);
        return this.areSameUTCDate(specialDate, restrictionDate);
      });

      if (specialDay) {
        return {
          ...restriction,
          plates: [],
          hours: [],
          additionalInfo: `Día especial: ${specialDay.reason}`
        };
      }

      return restriction;
    });
  }

  private areSameUTCDate(date1: Date, date2: Date): boolean {
    return (
      date1.getUTCFullYear() === date2.getUTCFullYear() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCDate() === date2.getUTCDate()
    );
  }
}
