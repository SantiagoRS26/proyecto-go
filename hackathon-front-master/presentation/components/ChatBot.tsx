"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaRobot } from "react-icons/fa";
import axiosInstance from "@/infrastructure/api/axiosInstance";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

const MAX_QUESTION_LENGTH = 200;

const ChatBot: React.FC = () => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<{ role: string; content: string }[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const messageEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = async () => {
		if (!input.trim()) return;

		if (input.length > MAX_QUESTION_LENGTH) {
			setErrorMessage(
				`La pregunta es demasiado larga. El máximo permitido es de ${MAX_QUESTION_LENGTH} caracteres.`
			);
			return;
		}

		setErrorMessage("");

		const newMessage = { role: "user", content: input };
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setInput("");
		setIsLoading(true);

		const customURL = "http://localhost:3002/api/chatbot-movilidad";

		try {
			const response = await axiosInstance.post(customURL, {
				question: input,
			});

			setMessages((prevMessages) => [
				...prevMessages,
				{ role: "bot", content: response.data.message },
			]);
		} catch (error) {
			console.error("Error fetching chatbot response", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-40">
			{/* Botón flotante para abrir/cerrar el chatbot */}
			<motion.button
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl dark:bg-gradient-to-r dark:from-blue-400 dark:to-blue-500 focus:outline-none"
				onClick={() => setIsOpen(!isOpen)}>
				<FaRobot size={24} />
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						transition={{ duration: 0.3 }}
						className="fixed bottom-16 right-6 w-96 h-[36rem] bg-white shadow-2xl rounded-lg flex flex-col dark:bg-gray-800 dark:shadow-lg">
						{/* Encabezado estilo WhatsApp mejorado */}
						<div className="flex items-center justify-between p-4 text-gray-800 dark:text-white rounded-t-lg shadow-md transition-colors duration-300">
							<div className="flex items-center space-x-3">
								{/* Animación del icono del robot */}
								<motion.div
									initial={{ scale: 1 }}
									animate={{
										rotate: [0, 15, -15, 0],
										scale: [1, 1.2, 1],
										transition: { duration: 1.25, repeat: Infinity },
									}}>
									<FaRobot className="h-8 w-8 text-gray-600 dark:text-white" />
								</motion.div>

								<div>
									{/* Animación del título */}
									<motion.h2
										className="text-xl font-bold text-gray-600 dark:text-white"
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, ease: "easeInOut" }}>
										MoviBot
									</motion.h2>

									{/* Animación del subtítulo */}
									<motion.p
										className="text-sm text-gray-600 dark:text-gray-200"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											delay: 0.2,
											duration: 0.8,
											ease: "easeInOut",
										}}>
										Tu asistente virtual
									</motion.p>
								</div>
							</div>
						</div>

						{/* Contenedor de mensajes */}
						<div className="flex-grow p-4 overflow-y-auto w-full">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`my-2 flex ${
										message.role === "user" ? "justify-end" : "justify-start"
									}`}>
									<div
										className={`px-4 py-2 rounded-2xl max-w-xs shadow-lg ${
											message.role === "user"
												? "bg-gradient-to-r from-blue-400 to-blue-500 text-white dark:bg-gradient-to-r dark:from-blue-400 dark:to-blue-500"
												: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
										}`}>
										{message.role === "bot" ? (
											<ReactMarkdown>{message.content}</ReactMarkdown>
										) : (
											message.content
										)}
									</div>
								</div>
							))}
							{isLoading && (
								<div className="my-2 flex justify-start">
									<div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 shadow-lg animate-pulse">
										Escribiendo...
									</div>
								</div>
							)}
							<div ref={messageEndRef}></div>
						</div>

						{/* Input de mensajes */}
						<div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 w-full">
							<div className="flex items-center w-full">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && sendMessage()}
									placeholder="Escribe tu mensaje..."
									className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-400 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
								/>
								<button
									onClick={sendMessage}
									className="ml-4 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none">
									<FaPaperPlane className="h-5 w-5" />
								</button>
							</div>
							{errorMessage && (
								<p className="text-red-500 dark:text-red-400 text-sm mt-2">
									{errorMessage}
								</p>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ChatBot;
