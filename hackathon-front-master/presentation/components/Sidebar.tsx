"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/infrastructure/store";
import { toggleExpanded } from "@/infrastructure/store/uiSlice";
import {
	FiMoreVertical,
	FiChevronsLeft,
	FiChevronsRight,
	FiX,
	FiHome,
	FiSettings,
	FiMap,
	FiLogIn,
	FiUserPlus,
	FiAlertCircle,
	FiLock,
	FiMapPin,
	FiSun,
	FiMoon,
	FiUser,
	FiLogOut,
	FiBell,
	FiMessageCircle,
	FiFileText,
	FiCalendar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem";
import { hasRole } from "@/lib/authorization";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logout } from "@/infrastructure/store/authSlice";
import { useRouter } from "next/navigation";

interface SidebarProps {
	currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
	const dispatch = useDispatch<AppDispatch>();
	const expanded = useSelector((state: RootState) => state.ui.expanded);
	const user = useSelector((state: RootState) => state.auth.user);
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);
	const router = useRouter();

	const [isSmallScreen, setIsSmallScreen] = useState(false);

	const { theme, setTheme } = useTheme();

	useEffect(() => {
		const checkScreenSize = () => {
			setIsSmallScreen(window.innerWidth < 640);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	useEffect(() => {
		if (isSmallScreen && expanded) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isSmallScreen, expanded]);

	// Función para alternar el tema
	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	// Función para manejar el clic en un ítem
	const handleItemClick = useCallback(() => {
		if (isSmallScreen && expanded) {
			dispatch(toggleExpanded());
		}
	}, [isSmallScreen, expanded, dispatch]);

	const handleLogout = useCallback(() => {
		dispatch(logout());

		router.push("/auth/login");
	}, [dispatch, router]);

	return (
		<>
			{isSmallScreen && !expanded && (
				<button
					onClick={() => dispatch(toggleExpanded())}
					className="fixed top-4 left-4 p-2 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white z-50 shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300">
					<FiChevronsRight />
				</button>
			)}

			<aside
				className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-sm 
          z-50 transition-all duration-300
          ${
						isSmallScreen
							? expanded
								? "w-full overflow-hidden"
								: "w-0 overflow-hidden"
							: expanded
							? "w-64 overflow-visible"
							: "w-16 overflow-visible"
					}
        `}>
				<nav className="h-full flex flex-col">
					{/* Encabezado del Sidebar */}
					<div className="p-4 pb-2 flex justify-between items-center">
						<motion.img
							src="https://cicdesarrollos.com/Iconos/logo.PNG"
							alt="Logo"
							animate={{ width: expanded ? "8rem" : "0rem" }}
							className="overflow-hidden transition-width max-w-24"
						/>
						<button
							onClick={() => dispatch(toggleExpanded())}
							className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
							{isSmallScreen && expanded ? (
								<FiX />
							) : expanded ? (
								<FiChevronsLeft />
							) : (
								<FiChevronsRight />
							)}
						</button>
					</div>

					{/* Items del Sidebar */}
					<ul className="flex-1 px-3">
						<SidebarItem
							icon={<FiHome />}
							text="Inicio"
							href="/dashboard"
							active={currentPath === "/dashboard"}
							onClick={handleItemClick}
						/>

						<SidebarItem
							icon={<FiAlertCircle />}
							text="Restricciones"
							href="/dashboard/restrictions"
							active={currentPath === "/dashboard/restrictions"}
							onClick={handleItemClick}
						/>

						<SidebarItem
							icon={<FiMap />}
							text="Mapa de calor"
							href="/dashboard/heat-map"
							active={currentPath === "/dashboard/heat-map"}
							onClick={handleItemClick}
						/>

						{hasRole(user, ["user", "admin"]) && (
							<SidebarItem
								icon={<FiMapPin />}
								text="Zonas de interés"
								href="/dashboard/interest-zones"
								active={currentPath === "/dashboard/interest-zones"}
								onClick={handleItemClick}
							/>
						)}

						{/* {hasRole(user, ["admin"]) && (
							<SidebarItem
								icon={<FiLock />}
								text="Actualizar pico y placa"
								href="/dashboard/admin/picoyplaca"
								active={currentPath === "/dashboard/admin/picoyplaca"}
								onClick={handleItemClick}
							/>
						)} */}

						{hasRole(user, ["admin"]) && (
							<SidebarItem
								icon={<FiCalendar />}
								text="Días sin pico y placa"
								href="/dashboard/admin/specialdays"
								active={currentPath === "/dashboard/admin/specialdays"}
								onClick={handleItemClick}
							/>
						)}

						{hasRole(user, ["admin"]) && (
							<SidebarItem
								icon={<FiFileText />}
								text="Crear noticia"
								href="/dashboard/admin/importantNotifications"
								active={
									currentPath === "/dashboard/admin/importantNotifications"
								}
								onClick={handleItemClick}
							/>
						)}

						{hasRole(user, ["admin"]) && (
							<SidebarItem
								icon={<FiMessageCircle />}
								text="Admin ChatBot"
								href="/dashboard/admin/chatbot"
								active={currentPath === "/dashboard/admin/chatbot"}
								onClick={handleItemClick}
							/>
						)}
					</ul>

					{/* Botón para cambiar el tema */}
					<div className="px-4 mb-4">
						<button
							onClick={toggleTheme}
							className="flex items-center justify-center w-full p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
							<motion.div
								key={theme}
								initial={{ rotate: 0, opacity: 0 }}
								animate={{ rotate: 360, opacity: 1 }}
								transition={{ duration: 0.5 }}
								className="flex items-center">
								{theme === "dark" ? (
									<FiSun
										className="text-yellow-500"
										size={20}
									/>
								) : (
									<FiMoon
										className="text-gray-800"
										size={20}
									/>
								)}
							</motion.div>
							{expanded && (
								<span className="ml-2 text-gray-700 dark:text-gray-200">
									{theme === "dark" ? "Claro" : "Oscuro"}
								</span>
							)}
						</button>
					</div>

					{/* Pie del Sidebar */}
					<div className="border-t dark:border-gray-700 flex p-3">
						{hasRole(user, ["user", "admin"]) ? (
							<div className="flex items-center w-full">
								<img
									src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
										user.name
									)}&background=c7d2fe&color=3730a3&bold=true`}
									alt={`${user.name} Avatar`}
									className="w-10 h-10 rounded-md"
								/>
								<motion.div
									animate={{
										width: expanded ? "13rem" : "0rem",
										marginLeft: expanded ? "0.75rem" : "0rem",
									}}
									className="flex items-center overflow-hidden !w-full space-x-3">
									<div className="flex-1 min-w-0">
										<h4 className="font-semibold text-gray-900 dark:text-gray-200 truncate max-w-xs">
											{user.name}
										</h4>
										<span className="text-xs text-gray-600 dark:text-gray-400 truncate block max-w-xs">
											{user.email}
										</span>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="outline"
												className="ml-2 p-1 rounded-lg">
												<FiMoreVertical
													size={20}
													className="text-gray-700 dark:text-gray-300"
												/>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-56">
											<DropdownMenuGroup>
												<DropdownMenuItem
													asChild
													className="cursor-pointer">
													<Link
														href="/dashboard/profile/notifications"
														className="flex items-center w-full"
														onClick={handleItemClick}>
														<FiUser className="mr-2 h-4 w-4" />
														<span>Perfil</span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem
													asChild
													className="cursor-pointer">
													<Link
														href="/dashboard/profile/notifications"
														className="flex items-center w-full"
														onClick={handleItemClick}>
														<FiBell className="mr-2 h-4 w-4" />
														<span>Notificaciones</span>
													</Link>
												</DropdownMenuItem>
											</DropdownMenuGroup>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="cursor-pointer"
												onClick={() => {
													handleItemClick();
													handleLogout();
												}}>
												<FiLogOut className="mr-2 h-4 w-4" />
												<span>Cerrar sesión</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</motion.div>
							</div>
						) : hasRole(user, ["guest"]) ? (
							<div className="flex flex-col space-y-2 w-full">
								<Link href="/auth/login">
									<button
										className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 w-full"
										onClick={handleItemClick}>
										<FiLogIn />
										{expanded && <span>Iniciar Sesión</span>}
									</button>
								</Link>
								<Link href="/auth/register">
									<button
										className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition duration-300 w-full"
										onClick={handleItemClick}>
										<FiUserPlus />
										{expanded && <span>Registrarse</span>}
									</button>
								</Link>
							</div>
						) : null}
					</div>
				</nav>
			</aside>
		</>
	);
};

export default Sidebar;
