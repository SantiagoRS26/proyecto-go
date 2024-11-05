"use client";

import React from "react";
import DashboardContent from "@/presentation/components/DashboardContent";
import ProtectedRoute from "@/presentation/components/ProtectedRoute";

export default function DashboardPage() {
	return (
		<ProtectedRoute allowedRoles={["guest","user", "admin"]}>
			<DashboardContent />
		</ProtectedRoute>
	);
}
