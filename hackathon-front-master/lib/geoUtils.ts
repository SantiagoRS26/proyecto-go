import { PicoyPlacaGeofenceDTO } from "@/core/interfaces/dto/PicoYPlacaGeofencesResponseDTO";
import { FeatureCollection, Feature, Polygon } from "geojson";

export const convertToGeoJSON = (
  geofences: PicoyPlacaGeofenceDTO[]
): FeatureCollection<Polygon> => {
  return {
    type: "FeatureCollection",
    features: geofences.map((geofence): Feature<Polygon> => {
      const coordinates = geofence.coordinates.map(([lng, lat]) => [lng, lat]);

      if (
        coordinates.length > 0 &&
        (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
          coordinates[0][1] !== coordinates[coordinates.length - 1][1])
      ) {
        coordinates.push(coordinates[0]);
      }

      return {
        type: "Feature",
        properties: {
          id: geofence._id,
          name: geofence.name,
          vehicleType: geofence.vehicleType,
        },
        geometry: {
          type: "Polygon",
          coordinates: [coordinates],
        },
      };
    }),
  };
};
