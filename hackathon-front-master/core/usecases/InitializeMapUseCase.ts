import { IMapService } from "../interfaces/services/IMapService";

export class InitializeMapUseCase {
  constructor(private mapService: IMapService) {}

  execute(center: [number, number], zoom: number) {
    this.mapService.initializeMap(center, zoom);
  }
}