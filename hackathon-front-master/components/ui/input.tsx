import * as React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	type: "email" | "password" | "text";
	icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, icon, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);

		const handleTogglePassword = () => {
			setShowPassword((prev) => !prev);
		};

		return (
			<div className="relative">
				{icon && (
					<span className="absolute left-3 top-2/4 transform -translate-y-2/4 text-muted-foreground">
						{icon}
					</span>
				)}

				<input
					type={type === "password" && showPassword ? "text" : type}
					className={cn(
						"flex h-10 w-full rounded-xl border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						icon ? "pl-10 pr-10" : "pl-3 pr-3", // Ajustar el padding dependiendo de si hay ícono o no
						className
					)}
					ref={ref}
					{...props}
				/>

				{type === "password" && (
					<button
						type="button"
						onClick={handleTogglePassword}
						className="absolute right-3 top-2/4 transform -translate-y-2/4 text-muted-foreground focus:outline-none">
						{showPassword ? <FiEyeOff /> : <FiEye />}
					</button>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";

export { Input };
