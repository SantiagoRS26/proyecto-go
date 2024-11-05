import { IReportRepository } from "../interfaces/repositories/IReportRepository";
import { Report } from "../entities/Report";
import { ReportDTO } from "../interfaces/dto/ReportsResponseDTO";

export class GetReportsByTypeUseCase {
  private reportRepository: IReportRepository;

  constructor(reportRepository: IReportRepository) {
    this.reportRepository = reportRepository;
  }

  async execute(typeId: string): Promise<Report[]> {
    try {
      const reportDTOs: ReportDTO[] = await this.reportRepository.getReportsByType(typeId);
      const reports: Report[] = reportDTOs.map(dto => new Report(dto));
      return reports;
    } catch (error: any) {
      throw new Error(error.message || "Error al obtener reportes");
    }
  }
}