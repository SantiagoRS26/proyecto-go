import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/presentation/components/ThemeProvider";
import "mapbox-gl/dist/mapbox-gl.css";
import { ReduxProvider } from "@/presentation/components/ReduxProvider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "ViviMovil",
	description:
		"ViviMovil es una plataforma digital diseñada para mantener a los ciudadanos de Villavicencio siempre informados sobre el estado de la movilidad en su ciudad. A través de alertas en tiempo real, los usuarios recibirán notificaciones sobre restricciones viales, cambios en el tráfico, cierres de calles, obras públicas y condiciones meteorológicas que puedan afectar la circulación",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="es"
			suppressHydrationWarning>
			<head>
				<link
					rel="icon"
					href="/logo.ico"
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ReduxProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="default"
						enableSystem>
						{children}
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
