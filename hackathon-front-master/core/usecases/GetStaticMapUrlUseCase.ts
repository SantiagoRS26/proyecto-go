import { MapboxStaticService } from "@/infrastructure/services/MapboxStaticService";

export class GetStaticMapUrlUseCase {
	private mapboxStaticService: MapboxStaticService;

	constructor(mapboxStaticService: MapboxStaticService) {
		this.mapboxStaticService = mapboxStaticService;
	}

	execute(
		latitude: number,
		longitude: number,
		zoom?: number,
		width?: number,
		height?: number,
		iconUrl?: string
	): string {
		return this.mapboxStaticService.getStaticMapUrl(
			latitude,
			longitude,
			zoom,
			width,
			height,
			iconUrl
		);
	}
}
