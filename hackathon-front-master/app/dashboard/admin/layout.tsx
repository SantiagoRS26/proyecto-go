"use client";

import ProtectedRoute from "@/presentation/components/ProtectedRoute";
import { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
};

export default Layout;
