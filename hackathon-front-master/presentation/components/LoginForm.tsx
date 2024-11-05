"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FiMail, FiLock } from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";
import { motion } from "framer-motion";
import { useState } from "react";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor proporcione un correo electrónico válido." }),
  password: z.string(),
});

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await onSubmit(values.email, values.password);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Correo"
                    icon={<FiMail className="text-gray-600 dark:text-gray-300" />}
                    className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </motion.div>
                )}
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    icon={<FiLock className="text-gray-600 dark:text-gray-300" />}
                    className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </motion.div>
                )}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-600 text-white dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <ImSpinner9 className="animate-spin mr-2 text-white dark:text-gray-200" />
                Iniciando sesión...
              </div>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
