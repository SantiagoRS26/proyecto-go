import { IReportRepository } from "../interfaces/repositories/IReportRepository";
import { Report } from "../entities/Report";
import { PaginatedReportsResponseDTO } from "../interfaces/dto/ReportsResponseDTO";

export class GetReportsUseCase {
	private reportRepository: IReportRepository;

	constructor(reportRepository: IReportRepository) {
		this.reportRepository = reportRepository;
	}

	async execute(
		pageNumber: number,
		pageSize: number
	): Promise<{
		reports: Report[];
		totalRecords: number;
		pageNumber: number;
		totalPages: number;
	}> {
		try {
			const paginatedResponse: PaginatedReportsResponseDTO =
				await this.reportRepository.getReports(pageNumber, pageSize);
			const reports: Report[] = paginatedResponse.items.map(
				(dto) => new Report(dto)
			);

			return {
				reports: reports,
				totalRecords: paginatedResponse.totalRecords,
				pageNumber: paginatedResponse.pageNumber,
				totalPages: paginatedResponse.totalPages,
			};
		} catch (error: any) {
			throw new Error(error.message || "Error al obtener reportes");
		}
	}
}
