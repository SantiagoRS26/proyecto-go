// src/infrastructure/services/MapboxService.ts

import { IMapService } from "@/core/interfaces/services/IMapService";
import mapboxgl from "mapbox-gl";

export class MapboxService implements IMapService {
	private map: mapboxgl.Map | null = null;

	constructor(private container: HTMLElement, private accessToken: string) {
		mapboxgl.accessToken = accessToken;
	}

	initializeMap(center: [number, number], zoom: number) {
		if (!this.map) {
			this.map = new mapboxgl.Map({
				container: this.container,
				style: "mapbox://styles/mapbox/streets-v12",
				zoom: zoom,
				center: [center[1], center[0]],
			});
			this.map.addControl(new mapboxgl.NavigationControl());
		}
	}

	getMap() {
		return this.map;
	}

	getStaticMapUrl(
		coordinates: [number, number],
		zoom: number,
		width: number,
		height: number
	): string {
		const [lng, lat] = coordinates;
		return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${lng},${lat},${zoom},0,0/${width}x${height}?access_token=${this.accessToken}`;
	}
}
