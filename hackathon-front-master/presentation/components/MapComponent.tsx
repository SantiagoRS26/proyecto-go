// MapComponent.tsx

import React, { useEffect, useRef, useState } from "react";
import { FeatureCollection, Polygon, Feature } from "geojson";
import mapboxgl from "mapbox-gl";
import { InitializeMapUseCase } from "@/core/usecases/InitializeMapUseCase";
import { MapboxService } from "@/infrastructure/services/MapboxService";
import { motion } from "framer-motion";

// Asegúrate de tener las definiciones de TypeScript adecuadas para tu MapboxService y otros servicios
interface MapComponentProps {
  geofencesGeoJSON: FeatureCollection<Polygon> | null;
  loadingMap: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ geofencesGeoJSON, loadingMap }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapServiceRef = useRef<MapboxService | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Inicializar el mapa
  useEffect(() => {
    if (mapContainerRef.current && !mapServiceRef.current) {
      const mapService = new MapboxService(
        mapContainerRef.current,
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
      );
      mapServiceRef.current = mapService;

      const initializeMapUseCase = new InitializeMapUseCase(mapService);
      initializeMapUseCase.execute([4.135, -73.6266], 12);

      const map = mapService.getMap();
      if (map) {
        map.on("load", () => {
          setMapLoaded(true);
        });

        // Opcional: Manejar errores de carga del mapa
        map.on("error", (e) => {
          console.error("Error al cargar el mapa:", e.error);
        });
      }
    }
  }, []);

  // Renderizar las geocercas en el mapa
  useEffect(() => {
    if (mapServiceRef.current && mapLoaded && geofencesGeoJSON) {
      const mapInstance = mapServiceRef.current.getMap();
      if (mapInstance) {
        // Evitar agregar la fuente y capas si ya existen
        if (!mapInstance.getSource("geofences")) {
          mapInstance.addSource("geofences", {
            type: "geojson",
            data: geofencesGeoJSON,
          });

          // Agregar capa de relleno
          mapInstance.addLayer({
            id: "geofences-layer",
            type: "fill",
            source: "geofences",
            paint: {
              "fill-color": "#00ff00",
              "fill-opacity": 0.4,
            },
          });

          // Agregar capa de línea
          mapInstance.addLayer({
            id: "geofences-line",
            type: "line",
            source: "geofences",
            paint: {
              "line-color": "#ff0000",
              "line-width": 2,
            },
          });

          // Agregar capa de etiquetas (si las geocercas tienen una propiedad 'name')
          mapInstance.addLayer({
            id: "geofences-labels",
            type: "symbol",
            source: "geofences",
            layout: {
              "text-field": ["get", "name"], // Asegúrate de que tus geocercas tengan una propiedad 'name'
              "text-size": 14,
              "text-offset": [0, 1.5],
              "text-anchor": "top",
            },
            paint: {
              "text-color": "#000000",
            },
          });
        } else {
          // Si la fuente ya existe, actualiza sus datos
          const source = mapInstance.getSource("geofences") as mapboxgl.GeoJSONSource;
          source.setData(geofencesGeoJSON);
        }

        // Centrar y ajustar el mapa para mostrar las geocercas
        const coordinates = geofencesGeoJSON.features.flatMap(
          (feature) => (feature.geometry.type === "Polygon" ? feature.geometry.coordinates[0] : [])
        );

        if (coordinates.length > 0) {
          const bounds = coordinates.reduce(
            (bounds, coord) => bounds.extend(coord as [number, number]),
            new mapboxgl.LngLatBounds(
              coordinates[0] as [number, number],
              coordinates[0] as [number, number]
            )
          );
          mapInstance.fitBounds(bounds, { padding: 20 });
        }
      }
    }
  }, [geofencesGeoJSON, mapLoaded]);

  return (
    <div className="w-full h-96 mt-4 rounded-lg shadow-lg mb-6 relative">
      {loadingMap && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <motion.div
            className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <span className="ml-4 text-lg text-gray-600">Cargando mapa...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default MapComponent;
