import { IReportRepository } from "@/core/interfaces/repositories/IReportRepository";
import { Report } from "@/core/entities/Report";
import { ReactReportResponseDTO } from "@/core/interfaces/dto/ReactReportResponseDTO";

export class ToggleLikeUseCase {
  private reportRepository: IReportRepository;

  constructor(reportRepository: IReportRepository) {
    this.reportRepository = reportRepository;
  }

  async execute(
    userHasLiked: boolean,
    reportId: string,
    userId: string
  ): Promise<{ updatedReport: ReactReportResponseDTO; message: string }> {
    try {
      const action = userHasLiked ? "decrement" : "increment";

      const updatedReport = await this.reportRepository.reactToReport(
        action,
        reportId,
        userId
      );

      const message = userHasLiked ? "Like removido" : "Like añadido";
      return { updatedReport, message };
    } catch (error: any) {
      throw new Error(error.message || "Error al reaccionar al reporte");
    }
  }
}
