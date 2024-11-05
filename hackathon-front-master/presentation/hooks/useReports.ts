import { useState, useEffect } from "react";
import { Report } from "@/core/entities/Report";
import { IReportRepository } from "@/core/interfaces/repositories/IReportRepository";
import { GetReportsUseCase } from "@/core/usecases/GetReportsUseCase";

interface UseReportsResponse {
	reports: Report[];
	loading: boolean;
	refetch: () => void;
	totalPages: number;
	totalRecords: number;
	pageNumber: number;
	setPageNumber: (page: number) => void;
}

export function useReports(
	reportRepository: IReportRepository,
	initialPageNumber: number = 1,
	initialPageSize: number = 10
): UseReportsResponse {
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageNumber, setPageNumber] = useState(initialPageNumber);
	const [pageSize] = useState(initialPageSize);

	const fetchReports = async () => {
		setLoading(true);
		try {
			const getReportsUseCase = new GetReportsUseCase(reportRepository);
			const paginatedData = await getReportsUseCase.execute(
				pageNumber,
				pageSize
			);
			setReports(paginatedData.reports);
			setTotalPages(paginatedData.totalPages);
			setTotalRecords(paginatedData.totalRecords);
		} catch (error) {
			console.error("Error al cargar los reportes", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReports();
	}, [reportRepository, pageNumber, pageSize]);

	const refetch = () => {
		fetchReports();
	};

	return {
		reports,
		loading,
		refetch,
		totalPages,
		totalRecords,
		pageNumber,
		setPageNumber,
	};
}
