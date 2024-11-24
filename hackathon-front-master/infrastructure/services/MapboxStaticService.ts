export class MapboxStaticService {
	private accessToken: string;

	constructor(accessToken: string) {
		this.accessToken = accessToken;
	}

	getStaticMapUrl(
		latitude: number,
		longitude: number,
		zoom: number = 12,
		width: number = 300,
		height: number = 200,
		iconUrl?: string
	): string {
		let marker;

		if (iconUrl) {
			marker = `url-${encodeURIComponent(iconUrl)}(${longitude},${latitude})`;
		} else {
			marker = `pin-s+555555(${longitude},${latitude})`;
		}
		return (
			`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${marker}/${longitude},${latitude},${zoom}/` +
			`${width}x${height}@2x?access_token=${this.accessToken}`
		);
	}
}