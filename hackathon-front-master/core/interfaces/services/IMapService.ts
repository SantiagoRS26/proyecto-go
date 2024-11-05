export interface IMapService {
	initializeMap(center: [number, number], zoom: number): void;
	getMap(): mapboxgl.Map | null;
	getStaticMapUrl(
		coordinates: [number, number],
		zoom: number,
		width: number,
		height: number
	): string;
}
