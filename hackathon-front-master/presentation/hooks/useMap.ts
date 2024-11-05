// src/hooks/useMap.ts
import { useEffect, useRef, useState } from "react";
import { IMapService } from "@/core/interfaces/services/IMapService";
import { MapboxService } from "@/infrastructure/services/MapboxService";

export function useMap(
  containerRef: React.RefObject<HTMLDivElement>,
  initialCenter: [number, number],
  initialZoom: number
) {
  const mapServiceRef = useRef<IMapService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (containerRef.current && !mapServiceRef.current) {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
      const mapService = new MapboxService(containerRef.current, mapboxToken);
      mapServiceRef.current = mapService;

      mapService.initializeMap(initialCenter, initialZoom);
      const map = mapService.getMap();

      if (map) {
        map.on("load", () => {
          setLoading(false);
        });
      }
    }
  }, [containerRef.current]);

  return { mapService: mapServiceRef.current, loading };
}
