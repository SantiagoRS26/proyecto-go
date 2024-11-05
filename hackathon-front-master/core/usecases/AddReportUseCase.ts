import { IReportRepository } from "@/core/interfaces/repositories/IReportRepository";
import { AddReportResponseDTO } from "@/core/interfaces/dto/AddReportResponseDTO";

export class AddReportUseCase {
  private reportRepository: IReportRepository;

  constructor(reportRepository: IReportRepository) {
    this.reportRepository = reportRepository;
  }

  async execute(
    userId: string,
    type: string,
    longitude: number,
    latitude: number
  ): Promise<AddReportResponseDTO> {
    try {
      const response = await this.reportRepository.addReport(
        userId,
        type,
        longitude,
        latitude
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}