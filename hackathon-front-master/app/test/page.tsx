"use client";

const TestMapPage = () => {
	/* 	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapboxServiceRef = useRef<MapboxService | null>(null);
	const [loading, setLoading] = useState(true);
	const usersGeofencesRespository = new UsersGeofencesRepository();
	const getUserGeofencesUseCase = new GetUserGeofencesUseCase(usersGeofencesRespository);

	useEffect(() => {
		if (mapContainerRef.current) {
			
			const mapboxService = new MapboxService(
				mapContainerRef.current,
				process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
			);
			mapboxServiceRef.current = mapboxService;

			
			const initializeMapUseCase = new InitializeMapUseCase(mapboxService);
			initializeMapUseCase.execute([4.135, -73.6266], 12);

			const map = mapboxService.getMap();

			if (map) {
				map.on("load", () => {
					setLoading(false);
					getUserGeofences("670b310b311ea60afedfd422"); 
				});
			}
		}
	}, []);

	const getUserGeofences = async (userId: string) => {
		try {
			const userGeofences = await getUserGeofencesUseCase.execute(userId);
			console.log(userGeofences);
			
			if (userGeofences?.usersGeofences) {
				const geofencesGeoJSON = convertToGeoJSON(userGeofences.usersGeofences);
				console.log(geofencesGeoJSON);
				
				addGeofencesToMap(geofencesGeoJSON); 
			}
		} catch (error: any) {
			console.log(error);
		}
	};

	const convertToGeoJSON = (geofences: any[]) => {
		return {
			type: "FeatureCollection",
			features: geofences.map(geofence => ({
				type: "Feature",
				properties: {
					id: geofence._id,
					name: geofence.name
				},
				geometry: {
					type: geofence.type,
					coordinates: [geofence.coordinates]
				}
			}))
		};
	};

	const addGeofencesToMap = (geojson: any) => {
		const map = mapboxServiceRef.current?.getMap();
		if (map) {
			
			if (!map.getSource('geofences')) {
				console.log('Agregando la fuente de geocercas');
				map.addSource('geofences', {
					type: 'geojson',
					data: geojson
				});
			} else {
				console.log('La fuente ya existe, actualizando datos');
				(map.getSource('geofences') as mapboxgl.GeoJSONSource).setData(geojson);
			}
	
			
			if (!map.getLayer('geofences-layer')) {
				console.log('Agregando la capa de geocercas');
				map.addLayer({
					id: 'geofences-layer',
					type: 'fill',
					source: 'geofences',
					paint: {
						'fill-color': '#00ff00', 
						'fill-opacity': 0.4      
					}
				});
			} else {
				console.log('La capa ya existe');
			}
	
			
			if (!map.getLayer('geofences-line')) {
				map.addLayer({
					id: 'geofences-line',
					type: 'line',
					source: 'geofences',
					paint: {
						'line-color': '#ff0000',  
						'line-width': 2           
					}
				});
			}
	
			
			if (!map.getLayer('geofences-labels')) {
				console.log('Agregando la capa de etiquetas para los nombres de las geocercas');
				map.addLayer({
					id: 'geofences-labels',
					type: 'symbol',
					source: 'geofences',
					layout: {
						'text-field': ['get', 'name'],  
						'text-size': 14,                
						'text-offset': [0, 1.5],        
						'text-anchor': 'top',           
					},
					paint: {
						'text-color': '#000000'         
					}
				});
			}
		} else {
			console.log('No se pudo obtener el mapa de Mapbox');
		}
	};
	 */

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 h-screen p-20">
			{/* 			<div className="w-full max-w-7xl h-full rounded-lg shadow-lg relative">
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-100/70 z-10">
						<FiLoader className="animate-spin text-4xl text-blue-500" />
					</div>
				)}
				<div
					ref={mapContainerRef}
					className="w-full h-full rounded-lg"
				/>
			</div>  */}
		</div>
	);
};

export default TestMapPage;
