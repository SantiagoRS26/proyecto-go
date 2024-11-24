import { IReportRepository } from "@/core/interfaces/repositories/IReportRepository";
import { ReportTypeDTO, ReportTypesResponseDTO } from "@/core/interfaces/dto/ReportTypesResponseDTO";
import { ReportType } from "../entities/ReportType";

export class GetReportTypesUseCase {
  private reportRepository: IReportRepository;

  constructor(reportRepository: IReportRepository) {
    this.reportRepository = reportRepository;
  }

  async execute(): Promise<ReportType[]> {
    try {
      const reportTypeDTOs: ReportTypeDTO[] = (await this.reportRepository.getReportTypes()).reportTypes;
      
      const reportTypes: ReportType[] = reportTypeDTOs.map(dto => new ReportType(dto));
      console.log("caso de uso: ", reportTypes);
      return reportTypes;
    } catch (error: any) {
      throw new Error(error.message || "Error al obtener tipos de reportes");
    }
  }
}
