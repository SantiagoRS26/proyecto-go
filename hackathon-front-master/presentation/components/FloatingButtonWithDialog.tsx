"use client";

import { useEffect, useState, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import { ReportRepository } from "@/infrastructure/repositories/ReportRepository";
import { GetReportTypesUseCase } from "@/core/usecases/GetReportTypesUseCase";
import { AddReportUseCase } from "@/core/usecases/AddReportUseCase";
import { ReportType } from "@/core/entities/ReportType";
import { ReportForm } from "./ReportForm";

interface FloatingButtonWithDialogProps {
	onReportAdded: () => void;
}

export default function FloatingButtonWithDialog({
	onReportAdded,
}: FloatingButtonWithDialogProps) {
	const [open, setOpen] = useState(false);
	const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
	const [reportsLoading, setReportsLoading] = useState(false);

	const handleDialogClose = () => {
		setOpen(false);
	};

	const reportRepository = useMemo(() => new ReportRepository(), []);

	const handleReportSubmit = async (
		userId: string,
		type: string,
		longitude: number,
		latitude: number
	) => {
		try {
			const addReportUseCase = new AddReportUseCase(reportRepository);
			await addReportUseCase.execute(userId, type, longitude, latitude);
			handleDialogClose();
			onReportAdded();
		} catch (error) {
			console.error("Error al crear el reporte:", error);
		}
	};

	useEffect(() => {
		const fetchReportTypes = async () => {
			setReportsLoading(true);
			try {
				const getReportTypesUseCase = new GetReportTypesUseCase(
					reportRepository
				);
				const reportTypesData = await getReportTypesUseCase.execute();
				setReportTypes(reportTypesData);
			} catch (error: unknown) {
				if (error instanceof Error) {
					console.error(error.message);
				} else {
					console.error("Error desconocido al cargar los tipos de reportes");
				}
			} finally {
				setReportsLoading(false);
			}
		};

		fetchReportTypes();
	}, [reportRepository]);

	return (
		<div>
			<Dialog
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) {
						setOpen(false);
					}
				}}>
				<DialogTrigger asChild>
					<Button
						onClick={() => setOpen(true)}
						className="fixed bottom-24 right-6 p-4 bg-indigo-500 text-white dark:bg-indigo-600 dark:text-white rounded-full shadow-lg flex items-center space-x-2 transition-colors duration-300">
						<FiPlus size={24} />
						<span>Crear Reporte</span>
					</Button>
				</DialogTrigger>
				<DialogContent
					onInteractOutside={(event) => event.preventDefault()}
					className="w-full max-w-4xl h-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg dark:shadow-xl transition-colors duration-300">
					<DialogHeader>
						<DialogTitle>Nuevo Reporte</DialogTitle>
					</DialogHeader>
					<div className="p-4">
						<ReportForm
							reportTypes={reportTypes}
							onSubmit={handleReportSubmit}
						/>
					</div>
					<div className="flex justify-end space-x-2 mt-4">
						<Button
							variant="default"
							onClick={handleDialogClose}>
							Cancelar
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
