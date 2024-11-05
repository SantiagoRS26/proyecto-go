// src/presentation/components/HeatMapForm.tsx

"use client";

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
import { motion } from "framer-motion";
import { ReportType } from "@/core/entities/ReportType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const heatMapSchema = z
  .object({
    type: z.string().min(1, { message: "Seleccione un tipo de reporte" }),
  })

interface HeatMapFormProps {
  reportTypes: ReportType[];
  handleChangeType: (
    typeId: string,
  ) => Promise<void>;
}

export function HeatMapForm({ reportTypes, handleChangeType }: HeatMapFormProps) {

  const form = useForm<z.infer<typeof heatMapSchema>>({
    resolver: zodResolver(heatMapSchema),
    defaultValues: {
      type: "",
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-y-6"
        >
          {/* Campo de selección para el tipo de reporte */}
          <FormField
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={handleChangeType} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de reporte" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((reportType) => (
                        <SelectItem key={reportType.id} value={reportType.id}>
                          <div className="flex items-center">
                            <img
                              src={reportType.iconSmall}
                              alt={reportType.type}
                              className="w-4 h-4 mr-2"
                            />
                            {reportType.type}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {fieldState.error && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormMessage />
                  </motion.div>
                )}
              </FormItem>
            )}
          />
        </form>
      </Form>
    </motion.div>
  );
}