import { IReportRepository } from "@/core/interfaces/repositories/IReportRepository";
import { ReportApi } from "../api/ReportApi";
import { PaginatedReportsResponseDTO, ReportDTO } from "@/core/interfaces/dto/ReportsResponseDTO";
import { AddReportResponseDTO } from "@/core/interfaces/dto/AddReportResponseDTO";
import { ReportTypesResponseDTO } from "@/core/interfaces/dto/ReportTypesResponseDTO";
import { ReactReportResponseDTO } from "@/core/interfaces/dto/ReactReportResponseDTO";

export class ReportRepository implements IReportRepository {
	private reportApi: ReportApi;

	constructor() {
		this.reportApi = new ReportApi();
	}

	async getReports(
		pageNumber: number,
		pageSize: number
	): Promise<PaginatedReportsResponseDTO> {
		try {
			const reportsResponse = await this.reportApi.getReports(
				pageNumber,
				pageSize
			);
			return reportsResponse;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async getReportsByType(typeId: string): Promise<ReportDTO[]> {
		try {
			const reportsResponse = await this.reportApi.getReportsByType(typeId);
			return reportsResponse.reports;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async addReport(
		userId: string,
		type: string,
		longitude: number,
		latitude: number
	): Promise<AddReportResponseDTO> {
		try {
			const addReportResponse = await this.reportApi.addReport(
				userId,
				type,
				longitude,
				latitude
			);
			return addReportResponse;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async getReportTypes(): Promise<ReportTypesResponseDTO> {
		try {
			const reportTypesResponse = await this.reportApi.getReportTypes();
			return reportTypesResponse;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	async reactToReport(
		action: string,
		reportId: string,
		userId: string
	): Promise<ReactReportResponseDTO> {
		try {
			const reactReportResponse = await this.reportApi.reactToReport(
				action,
				reportId,
				userId
			);
			return reactReportResponse;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
