// src/presentation/components/ReportForm.tsx

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
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/infrastructure/store";
import { ReportType } from "@/core/entities/ReportType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapboxService } from "@/infrastructure/services/MapboxService";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FiLoader } from "react-icons/fi";
import { IMapService } from "@/core/interfaces/services/IMapService";

const reportSchema = z
  .object({
    type: z.string().min(1, { message: "Seleccione un tipo de reporte" }),
    longitude: z
      .number({ invalid_type_error: "Longitud es requerida" })
      .min(-180, { message: "Longitud inválida" })
      .max(180, { message: "Longitud inválida" }),
    latitude: z
      .number({ invalid_type_error: "Latitud es requerida" })
      .min(-90, { message: "Latitud inválida" })
      .max(90, { message: "Latitud inválida" }),
  })
  .refine(
    (data) => data.longitude !== undefined && data.latitude !== undefined,
    {
      message: "Por favor seleccione la ubicación del reporte",
      path: ["longitude", "latitude"],
    }
  );

interface ReportFormProps {
  reportTypes: ReportType[];
  onSubmit: (
    userId: string,
    type: string,
    longitude: number,
    latitude: number
  ) => Promise<void>;
}

export function ReportForm({ reportTypes, onSubmit }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapServiceRef = useRef<IMapService | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [loading, setLoading] = useState(true);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: "",
      longitude: undefined,
      latitude: undefined,
    },
  });

  useEffect(() => {
    if (mapContainerRef.current && !mapServiceRef.current) {
      const mapService = new MapboxService(mapContainerRef.current, mapboxToken);
      mapServiceRef.current = mapService;

      mapService.initializeMap([4.135, -73.6266], 12);
      const map = mapService.getMap();

      if (map) {
        map.on("load", () => {
          setLoading(false);
        });

        map.on("click", (event: mapboxgl.MapMouseEvent) => {
          const { lng, lat } = event.lngLat;
          form.setValue("longitude", lng);
          form.setValue("latitude", lat);

          if (markerRef.current) {
            markerRef.current.setLngLat([lng, lat]);
          } else {
            const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
            markerRef.current = marker;
          }
        });
      }
    }
  }, [mapContainerRef.current, form]);

  useEffect(() => {
    const handleResize = () => {
      const mapInstance = mapServiceRef.current?.getMap();
      if (mapInstance) {
        setTimeout(() => {
          mapInstance.resize();
        }, 400);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function handleSubmit(values: z.infer<typeof reportSchema>) {
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(user._id, values.type, values.longitude, values.latitude);
      form.reset();
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-y-6"
        >
          {/* Campo de selección para el tipo de reporte */}
          <FormField
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de reporte" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((reportType) => (
                        <SelectItem key={reportType.id} value={reportType.type}>
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
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </motion.div>
                )}
              </FormItem>
            )}
          />

          {/* Contenedor para el mapa */}
          <div className="relative w-full max-w-7xl h-96 rounded-lg shadow-lg">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/70 z-10">
                <FiLoader className="animate-spin text-4xl text-blue-500" />
              </div>
            )}
            <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
          </div>
          {form.formState.errors.longitude && form.formState.errors.latitude && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {form.formState.errors.longitude.message ||
                form.formState.errors.latitude.message}
            </motion.div>
          )}

          {/* Botón de envío */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <motion.div
                className="flex items-center justify-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <FiLoader className="animate-spin" />
                <span>Creando reporte...</span>
              </motion.div>
            ) : (
              "Crear Reporte"
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}