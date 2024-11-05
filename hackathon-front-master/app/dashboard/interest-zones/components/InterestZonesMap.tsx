import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"; // Importamos tu diálogo personalizado
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { FeatureCollection, Polygon } from "geojson";
import { useSelector } from "react-redux";
import { RootState } from "@/infrastructure/store";
import axiosInstance from "@/infrastructure/api/axiosInstance";
import { AllInterestZoneDTO } from "../page";
import { showErrorToast } from "@/lib/messageToast";

interface InterestZoneDTO {
  name: string;
  user: string;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

const InterestZonesMap = ({
  allInterestZones,
}: {
  allInterestZones: AllInterestZoneDTO[];
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [showInterestZoneDialog, setInterestZoneDialog] = useState(false);
  const [interestZoneCoords, setInterestZoneCoords] = useState<number[][]>([]);
  const [interestZoneName, setInterestZoneName] = useState("");
  const [canDraw, setCanDraw] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      console.error(
        "El token de Mapbox no está definido en las variables de entorno."
      );
      return;
    }

    // Asignamos el token de Mapbox
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    // Inicializamos el mapa
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-73.6266, 4.135],
      zoom: 12,
    });

    // Inicializamos Mapbox Draw para dibujar polígonos
    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "simple_select", // Modo inicial
    });
    mapRef.current.addControl(drawRef.current);

    // Escuchamos los eventos de creación de polígonos
    mapRef.current.on("draw.create", handlePolygonCreate);
    mapRef.current.on("load", () => {
      // Una vez que el mapa ha cargado, agregar las capas
      renderZonesOnMap(allInterestZones);
    });
    // Limpiar el mapa al desmontar el componente
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const renderZonesOnMap = (zones: AllInterestZoneDTO[]) => {
    if (!mapRef.current) return;

    zones.forEach((zone) => {
      mapRef.current?.addSource(`zone-${zone._id}`, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: zone.geometry,
          properties: {
            name: zone.name,
          },
        },
      });

      // Añadir la capa de la zona
      mapRef.current?.addLayer({
        id: `zone-fill-${zone._id}`,
        type: "fill",
        source: `zone-${zone._id}`,
        layout: {},
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.4,
        },
      });

      // Añadir el borde del polígono
      mapRef.current?.addLayer({
        id: `zone-outline-${zone._id}`,
        type: "line",
        source: `zone-${zone._id}`,
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 2,
        },
      });

      // Añadir un botón de eliminación
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = `Eliminar ${zone.name}`;
      deleteButton.style.backgroundColor = "red";
      deleteButton.style.color = "white";
      deleteButton.style.padding = "5px";
      deleteButton.style.margin = "10px";
      deleteButton.style.cursor = "pointer";
      const deleteControl = new mapboxgl.Marker(deleteButton)
        .setLngLat(zone.geometry.coordinates[0][0] as [number, number])
        .addTo(mapRef.current as mapboxgl.Map);

      deleteButton.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await axiosInstance.delete(`/interest-zones/${zone._id}`);
          mapRef.current?.removeLayer(`zone-fill-${zone._id}`);
          mapRef.current?.removeLayer(`zone-outline-${zone._id}`);
          mapRef.current?.removeSource(`zone-${zone._id}`);
          deleteControl.remove();
        } catch (error) {
          showErrorToast("Ha ocurrido un error mientras se eliminaba tu zona de interes. Intentalo nuevamente", "Error");
          console.error("Error al eliminar la zona de interés:", error);
        }
      });
    });
  };

  const handlePolygonCreate = (e: {
    features: FeatureCollection<Polygon>["features"];
  }) => {
    const coordinates = e.features[0].geometry.coordinates[0]; // Obtenemos las coordenadas del polígono
    setInterestZoneCoords(coordinates);
    setInterestZoneDialog(true); // Mostramos el diálogo
  };

  const handleSaveGeofence = async () => {
    try {
      const newInterestZone: InterestZoneDTO = {
        name: interestZoneName,
        user: user?._id || "",
        geometry: {
          type: "Polygon",
          coordinates: [interestZoneCoords],
        },
      };

      const newInterestZoneRequest = await axiosInstance.post(
        "/interest-zones",
        newInterestZone
      );
      setInterestZoneDialog(false);
      const newInterestZoneData: AllInterestZoneDTO =
        newInterestZoneRequest.data.interestZone;
      if (drawRef.current) {
        drawRef.current.deleteAll(); // Eliminamos los controles de edición de la geocerca
        setCanDraw(false);

        mapRef.current?.addSource(`zone-${newInterestZoneData._id}`, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: newInterestZoneData.geometry,
            properties: {
              name: newInterestZoneData.name,
            },
          },
        });

        // Añadir la capa de la zona
        mapRef.current?.addLayer({
          id: `zone-fill-${newInterestZoneData._id}`,
          type: "fill",
          source: `zone-${newInterestZoneData._id}`,
          layout: {},
          paint: {
            "fill-color": "#088",
            "fill-opacity": 0.4,
          },
        });

        // Añadir el borde del polígono
        mapRef.current?.addLayer({
          id: `zone-outline-${newInterestZoneData._id}`,
          type: "line",
          source: `zone-${newInterestZoneData._id}`,
          layout: {},
          paint: {
            "line-color": "#000",
            "line-width": 2,
          },
        });

        // Añadir un botón de eliminación
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = `Eliminar ${newInterestZoneData.name}`;
        deleteButton.style.backgroundColor = "red";
        deleteButton.style.color = "white";
        deleteButton.style.padding = "5px";
        deleteButton.style.margin = "10px";
        deleteButton.style.cursor = "pointer";
        const deleteControl = new mapboxgl.Marker(deleteButton)
          .setLngLat(
            newInterestZoneData.geometry.coordinates[0][0] as [number, number]
          )
          .addTo(mapRef.current as mapboxgl.Map);

        deleteButton.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            await axiosInstance.delete(
              `/interest-zones/${newInterestZoneData._id}`
            );
            mapRef.current?.removeLayer(`zone-fill-${newInterestZoneData._id}`);
            mapRef.current?.removeLayer(
              `zone-outline-${newInterestZoneData._id}`
            );
            mapRef.current?.removeSource(`zone-${newInterestZoneData._id}`);
            deleteControl.remove();
          } catch (error) {
            showErrorToast("Ha ocurrido un error mientras se eliminaba tu zona de interes. Intentalo nuevamente", "Error");
            console.error("Error al eliminar la zona de interés:", error);
          }
        });
      }
      setCanDraw(false);
    } catch (error) {
      showErrorToast("Ha ocurrido un error mientras se guardaba tu zona de interes. Intentalo nuevamente", "Error");
      console.error("Error al guardar la zona de interés:", error);
    }
  };

  const handleCancelDialog = () => {
    // Si el usuario cancela, eliminamos la geocerca actual
    if (drawRef.current) {
      drawRef.current.deleteAll();
    }
    setCanDraw(false);
    setInterestZoneDialog(false);
  };

  const handleAddNewArea = () => {
    if (drawRef.current) {
      drawRef.current.changeMode("draw_polygon");
      setCanDraw(true); // Permitir que el usuario dibuje una nueva geocerca
    }
  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Mapa de zonas guardadas
      </h2>
  
      {/* Botón para agregar una nueva área */}
      <div className="text-center mb-4">
        <button
          onClick={handleAddNewArea}
          className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-opacity ${
            canDraw ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={canDraw}
        >
          Agregar nueva área
        </button>
      </div>
  
      <div
        ref={mapContainerRef}
        className="h-[80vh] mt-6 rounded-xl shadow-lg dark:bg-gray-800 transition-colors duration-300"
      ></div>
  
      {showInterestZoneDialog && (
        <Dialog
          open={showInterestZoneDialog}
          onOpenChange={setInterestZoneDialog}
          modal={true}
        >
          <DialogContent className="bg-white dark:bg-gray-800 transition-colors duration-300" hideCloseButton={true}>
            <DialogHeader>
              <DialogTitle className="text-gray-800 dark:text-gray-200">
                Agregar zona de interés
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Por favor, ingresa el nombre de la zona
              </DialogDescription>
            </DialogHeader>
  
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la zona de interés"
                value={interestZoneName}
                required
                onChange={(e) => setInterestZoneName(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 transition-colors duration-300"
              />
            </div>
  
            <DialogFooter>
              <DialogClose asChild>
                <button
                  onClick={handleCancelDialog}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 transition-colors duration-300"
                >
                  Cancelar
                </button>
              </DialogClose>
              <button
                onClick={handleSaveGeofence}
                className="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors duration-300"
              >
                Guardar
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
  
};

export default InterestZonesMap;
