import { AddReportResponseDTO } from "../dto/AddReportResponseDTO";
import { PaginatedReportsResponseDTO, ReportDTO } from "../dto/ReportsResponseDTO";
import { ReportTypesResponseDTO } from "../dto/ReportTypesResponseDTO";
import { ReactReportResponseDTO } from "../dto/ReactReportResponseDTO";

export interface IReportRepository {
	getReports(
		pageNumber: number,
		pageSize: number
	): Promise<PaginatedReportsResponseDTO>;

	getReportsByType(typeId: string): Promise<ReportDTO[]>;

	addReport(
		userId: string,
		type: string,
		longitude: number,
		latitude: number
	): Promise<AddReportResponseDTO>;

	getReportTypes(): Promise<ReportTypesResponseDTO>;

	reactToReport(
		action: string,
		reportId: string,
		userId: string
	): Promise<ReactReportResponseDTO>;
}
