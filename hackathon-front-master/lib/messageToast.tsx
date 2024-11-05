import { toast } from "@/presentation/hooks/use-toast";
import { FiAlertCircle } from "react-icons/fi";

export const showErrorToast = (message: string, title: string = "Error") => {
  toast({
    description: (
      <div className="flex items-center justify-center">
        <FiAlertCircle className="mr-2 text-white" size={24} />
        <div>
          <strong className="text-white">{title}</strong>
          <p>{message}</p>
        </div>
      </div>
    ),
    variant: "destructive",
    duration: 3000,
  });
};
