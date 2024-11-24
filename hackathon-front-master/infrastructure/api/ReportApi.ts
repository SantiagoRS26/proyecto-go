import { AddReportResponseDTO } from "@/core/interfaces/dto/AddReportResponseDTO";
import axiosInstance from "./axiosInstance";
import { PaginatedReportsResponseDTO, ReportsResponseDTO } from "@/core/interfaces/dto/ReportsResponseDTO";
import { ReportTypesResponseDTO } from "@/core/interfaces/dto/ReportTypesResponseDTO";
import { ReactReportResponseDTO } from "@/core/interfaces/dto/ReactReportResponseDTO";
import reportTypesData from './report-types.json';

export class ReportApi {
	async getReports(pageNumber: number, pageSize: number): Promise<PaginatedReportsResponseDTO> {
		try {
		  const response = await axiosInstance.get<PaginatedReportsResponseDTO>(
			`/reports?pageNumber=${pageNumber}&pageSize=${pageSize}`
		  );
		  return response.data;
		} catch (error: any) {
		  if (error.response && error.response.data && error.response.data.error) {
			throw new Error(error.response.data.error);
		  }
		  throw new Error("Error desconocido al obtener los reportes");
		}
	  }

	async getReportsByType(typeId: string): Promise<ReportsResponseDTO> {
		try {
			const response = await axiosInstance.get<ReportsResponseDTO>(`/reports/type/${typeId}`);
			return response.data;
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.error) {
				throw new Error(error.response.data.error);
			}
			throw new Error("Error desconocido al obtener los reportes");
		}
	}

	async addReport(
		userId: string,
		type: string,
		longitude: number,
		latitude: number
	): Promise<AddReportResponseDTO> {
		try {
			const requestBody = {
				userId,
				type,
				longitude,
				latitude,
			};

			const response = await axiosInstance.post<AddReportResponseDTO>(
				"/reports",
				requestBody
			);
			return response.data;
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.error) {
				throw new Error(error.response.data.error);
			}
			throw new Error("Error desconocido al agregar el reporte");
		}
	}

	async getReportTypes(): Promise<ReportTypesResponseDTO> {
		try {
			// Simular la obtención de datos directamente desde el archivo JSON
			const response: ReportTypesResponseDTO = reportTypesData;
			return response;
		} catch (error: any) {
			throw new Error("Error desconocido al obtener los tipos de reportes desde el archivo");
		}
	}

	async reactToReport(action: string, reportId: string, userId: string): Promise<ReactReportResponseDTO> {
		try {
		  const requestBody = {
			action,
			reportId,
			userId,
		  };
	
		  const response = await axiosInstance.put<ReactReportResponseDTO>(
			"/reaction-report",
			requestBody
		  );
		  return response.data;
		} catch (error: any) {
		  if (error.response && error.response.data && error.response.data.error) {
			throw new Error(error.response.data.error);
		  }
		  throw new Error("Error desconocido al reaccionar al reporte");
		}
	  }
}
