// app/dashboard/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/presentation/components/Sidebar";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/infrastructure/store";
import { Toaster } from "@/components/ui/toaster";
import ChatBot from "@/presentation/components/ChatBot";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const expanded = useSelector((state: RootState) => state.ui.expanded);

	const [isSmallScreen, setIsSmallScreen] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsSmallScreen(window.innerWidth < 640);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	let mainMarginLeftClass = "ml-0";

	if (!isSmallScreen) {
		if (expanded) {
			mainMarginLeftClass = "ml-64";
		} else {
			mainMarginLeftClass = "ml-16";
		}
	}

	return (
		<>
			<Sidebar currentPath={pathname} />
			<main className={`flex-1 ${mainMarginLeftClass} transition-all`}>
				{children}
			</main>
			<Toaster />
			{pathname !== "/dashboard/admin/chatbot" && <ChatBot />}
		</>
	);
}
