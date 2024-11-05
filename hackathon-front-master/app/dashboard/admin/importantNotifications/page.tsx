"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/infrastructure/api/axiosInstance";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/infrastructure/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { ImSpinner9 } from "react-icons/im";

const formSchema = z.object({
	title: z.string().nonempty({ message: "El título es obligatorio" }),
	summary: z.string().nonempty({ message: "El resumen es obligatorio" }),
	content: z
		.string()
		.min(10, { message: "El contenido debe tener al menos 10 caracteres" }),
	link: z.string().url({ message: "El enlace debe ser una URL válida" }),
});

interface News {
	_id: string;
	title: string;
	summary: string;
	content: string;
	link: string;
}

const NewsAdmin: React.FC = () => {
	const [newsList, setNewsList] = useState<News[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const userId = useSelector((state: RootState) => state.auth.user?._id);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			summary: "",
			content: "",
			link: "",
		},
	});

	useEffect(() => {
		fetchNews();
	}, []);

	const fetchNews = async () => {
		try {
			const response = await axiosInstance.get("/news");
			setNewsList(response.data.news);
		} catch {
			setError("Error al obtener las noticias");
		}
	};

	const handleCreateNews = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		try {
			const response = await axiosInstance.post("/news", {
				...values,
				user: userId,
			});
			setNewsList([...newsList, response.data.news]);
			form.reset(); // Reiniciar los campos del formulario después de enviar
			setError(null);
		} catch {
			setError("Error al crear la noticia");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteNews = async (newsId: string) => {
		try {
			await axiosInstance.delete(`/news/${newsId}`);
			setNewsList(newsList.filter((news) => news._id !== newsId));
		} catch {
			setError("Error al eliminar la noticia");
			console.log(error);
		}
	};

	return (
		<div className="container mx-auto p-4 md:p-8">
			<h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
				Administración de Noticias
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Sección para crear noticias */}
				<motion.div
					className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}>
					<h2 className="text-2xl font-semibold mb-4 dark:text-white">
						Crear Noticia
					</h2>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleCreateNews)}
							className="flex flex-col gap-y-6">
							{/* Campo Título */}
							<FormField
								control={form.control}
								name="title"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<Input
												type="text"
												placeholder="Título"
												className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
												{...field}
											/>
										</FormControl>
										{fieldState.error && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ duration: 0.3 }}>
												<FormMessage className="text-red-500 dark:text-red-400">
													{fieldState.error.message}
												</FormMessage>
											</motion.div>
										)}
									</FormItem>
								)}
							/>

							{/* Campo Resumen */}
							<FormField
								control={form.control}
								name="summary"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="Resumen"
												type="text"
												className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
												{...field}
											/>
										</FormControl>
										{fieldState.error && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ duration: 0.3 }}>
												<FormMessage className="text-red-500 dark:text-red-400">
													{fieldState.error.message}
												</FormMessage>
											</motion.div>
										)}
									</FormItem>
								)}
							/>

							{/* Campo Contenido */}
							<FormField
								control={form.control}
								name="content"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<Textarea
												placeholder="Contenido"
												className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
												{...field}
											/>
										</FormControl>
										{fieldState.error && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ duration: 0.3 }}>
												<FormMessage className="text-red-500 dark:text-red-400">
													{fieldState.error.message}
												</FormMessage>
											</motion.div>
										)}
									</FormItem>
								)}
							/>

							{/* Campo Link */}
							<FormField
								control={form.control}
								name="link"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<Input
												type="text"
												placeholder="Enlace"
												className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
												{...field}
											/>
										</FormControl>
										{fieldState.error && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ duration: 0.3 }}>
												<FormMessage className="text-red-500 dark:text-red-400">
													{fieldState.error.message}
												</FormMessage>
											</motion.div>
										)}
									</FormItem>
								)}
							/>

							{/* Botón de enviar */}
							<Button
								type="submit"
								className="w-full bg-blue-500 dark:bg-blue-600 text-white dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600"
								disabled={loading}>
								{loading ? (
									<div className="flex items-center justify-center">
										<ImSpinner9 className="animate-spin mr-2 text-white dark:text-gray-200" />
										Creando noticia...
									</div>
								) : (
									"Crear Noticia"
								)}
							</Button>
						</form>
					</Form>
				</motion.div>

				{/* Sección de lista de noticias */}
				<motion.div
					className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}>
					<h2 className="text-2xl font-semibold mb-4 dark:text-white">
						Lista de Noticias
					</h2>
					<Separator className="my-4" />
					{newsList.length === 0 ? (
						<p className="dark:text-gray-300">No hay noticias disponibles.</p>
					) : (
						<ul className="space-y-4">
							{newsList.map((news) => (
								<li
									key={news._id}
									className="flex justify-between items-center border-b pb-4 dark:border-gray-600">
									<div>
										<h3 className="text-lg font-semibold dark:text-white">
											{news.title}
										</h3>
										<p className="text-gray-600 dark:text-gray-300">
											{news.summary}
										</p>
									</div>
									<Button
										variant="destructive"
										onClick={() => handleDeleteNews(news._id)}
										className="flex items-center">
										<FaTrash className="mr-2" /> Eliminar
									</Button>
								</li>
							))}
						</ul>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default NewsAdmin;
