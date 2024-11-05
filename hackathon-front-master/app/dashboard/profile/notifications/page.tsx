"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/infrastructure/store";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { NotificationPermissionsDTO } from "@/core/interfaces/dto/user/NotificationPermissionsDTO";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { GetNotificationPermissionsUseCase } from "@/core/usecases/user/GetNotificationPermissionsUseCase";
import { UpdateNotificationPermissionsUseCase } from "@/core/usecases/user/UpdateNotificationPermissionsUseCase";
import { toast } from "@/presentation/hooks/use-toast";

const FormSchema = z.object({
	notifyTrafficDecree: z.boolean().default(false),
	notifyReportsOnInterestZones: z.boolean().default(false),
	notifyGeneralImportant: z.boolean().default(false),
});

export default function NotificationsPage() {
	const user = useSelector((state: RootState) => state.auth.user);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			notifyTrafficDecree: false,
			notifyReportsOnInterestZones: false,
			notifyGeneralImportant: false,
		},
	});

	const userRepository = new UserRepository();
	const getNotificationPermissionsUseCase =
		new GetNotificationPermissionsUseCase(userRepository);
	const updateNotificationPermissionsUseCase =
		new UpdateNotificationPermissionsUseCase(userRepository);

	const fetchNotificationPermissions = useCallback(async () => {
		if (user) {
			try {
				const notificationPermissions: NotificationPermissionsDTO =
					await getNotificationPermissionsUseCase.execute(user._id);
				form.reset(notificationPermissions);
			} catch (error) {
				toast({
					title: "Error",
					description: "No se pudieron cargar los permisos de notificación.",
				});
                console.log("Error al cargar los permisos de notificación", error);
			}
		}
	}, [user, form]);

	useEffect(() => {
		if (user) {
			fetchNotificationPermissions();
		}
	}, [user, fetchNotificationPermissions]);

	// Función para manejar la actualización de permisos
	async function onSubmit(data: z.infer<typeof FormSchema>) {
		if (user) {
			try {
				await updateNotificationPermissionsUseCase.execute(user._id, data);
				toast({
					title: "Éxito",
					description:
						"Los permisos de notificación se han actualizado correctamente.",
				});
			} catch (error) {
				toast({
					title: "Error",
					description:
						"No se pudieron actualizar los permisos de notificación.",
				});
                console.log("Error al actualizar los permisos de notificación", error);
			}
		}
	}

	return (
		<div className="p-6 bg-white dark:bg-gray-900 transition-colors duration-300 rounded-lg shadow-lg">
			<h1 className="text-xl font-medium mb-4 text-gray-900 dark:text-gray-100">
				Configuración de notificaciones
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full space-y-6">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="notifyTrafficDecree"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
									<div className="space-y-0.5">
										<FormLabel className="text-base text-gray-900 dark:text-gray-100">
											Decretos de Tráfico
										</FormLabel>
										<FormDescription className="text-gray-600 dark:text-gray-400">
											Recibir notificaciones sobre decretos relacionados con el
											tráfico.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											className="bg-gray-200 dark:bg-gray-700"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="notifyReportsOnInterestZones"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
									<div className="space-y-0.5">
										<FormLabel className="text-base text-gray-900 dark:text-gray-100">
											Zonas de Interés
										</FormLabel>
										<FormDescription className="text-gray-600 dark:text-gray-400">
											Recibir reportes sobre zonas de interés cercanas.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											className="bg-gray-200 dark:bg-gray-700"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="notifyGeneralImportant"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
									<div className="space-y-0.5">
										<FormLabel className="text-base text-gray-900 dark:text-gray-100">
											Notificaciones Importantes
										</FormLabel>
										<FormDescription className="text-gray-600 dark:text-gray-400">
											Recibir notificaciones generales importantes.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											className="bg-gray-200 dark:bg-gray-700"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<Button
						type="submit"
						className="bg-blue-500 dark:bg-blue-600 text-white">
						Guardar cambios
					</Button>
				</form>
			</Form>
		</div>
	);
}
