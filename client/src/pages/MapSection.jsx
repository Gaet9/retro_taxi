import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import waymoLogo from "../assets/Logos/waymo.svg";
import teslaLogo from "../assets/Logos/Tesla.svg";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import "leaflet/dist/leaflet.css";

// Component to handle center updates without overriding user zoom
const MapUpdater = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [map, center]);

    return null;
};

// Keep mapZoom state synced with user interactions
const ZoomListener = ({ onZoomChange }) => {
    const map = useMap();
    useEffect(() => {
        const handler = () => onZoomChange(map.getZoom());
        map.on("zoomend", handler);
        return () => map.off("zoomend", handler);
    }, [map, onZoomChange]);
    return null;
};

export const MapSection = () => {
    const [mapCenter, setMapCenter] = useState([35, -100]); // Default USA
    const [mapZoom, setMapZoom] = useState(4);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [waymoGeojson, setWaymoGeojson] = useState([]);
    const [waymoAreas, setWaymoAreas] = useState([]);
    const [showWaymoAreas] = useState(true);

    // Fetch provider GeoJSON files from public directory
    useEffect(() => {
        const providers = [
            {
                id: "waymo",
                name: "Waymo",
                logo: waymoLogo,
                defaultColor: "#03e89e",
                areas: [
                    { id: "Waymo-LA", name: "Waymo-LA", url: "/map-Waymo/Waymo-LA.geojson" },
                    { id: "Waymo-SF", name: "Waymo-SF", url: "/map-Waymo/Waymo-SF.geojson" },
                    { id: "Waymo-PX", name: "Waymo-PX", url: "/map-Waymo/Waymo-PX.geojson" },
                    { id: "Waymo-AU", name: "Waymo-AU", url: "/map-Waymo/Waymo-AU.geojson" },
                    { id: "Waymo-AT", name: "Waymo-AT", url: "/map-Waymo/Waymo-AT.geojson" },
                ],
            },
            {
                id: "tesla",
                name: "Tesla",
                logo: teslaLogo,
                defaultColor: "#CC0000",
                areas: [{ id: "Tesla-AU", name: "Tesla-AU", url: "/map-Tesla/Tesla-AU.geojson" }],
            },
            // Add additional providers here later
        ];

        let isMounted = true;

        const allAreaPromises = providers.flatMap((provider) =>
            (provider.areas || []).map(async (area) => {
                try {
                    const res = await fetch(area.url);
                    if (!res.ok) throw new Error(`Failed to load ${area.name}`);
                    const data = await res.json();
                    return {
                        providerId: provider.id,
                        providerName: provider.name,
                        logo: provider.logo,
                        color: area.color || provider.defaultColor,
                        ...area,
                        data,
                    };
                } catch (err) {
                    console.error(err);
                    return null;
                }
            })
        );

        Promise.all(allAreaPromises).then((results) => {
            if (!isMounted) return;
            const layers = results.filter(Boolean);
            setWaymoGeojson(layers);
            try {
                const computed = layers
                    .map((layer) => {
                        const tmp = L.geoJSON(layer.data);
                        const bounds = tmp.getBounds();
                        if (!bounds || !bounds.isValid()) return null;
                        const center = bounds.getCenter();
                        const idFromUrl = (layer.url || "")
                            .split("/")
                            .pop()
                            ?.replace(/\.geojson$/i, "");
                        const id = layer.id || idFromUrl || layer.name;
                        return { ...layer, id, bounds, center };
                    })
                    .filter(Boolean);
                setWaymoAreas(computed);
            } catch {
                // If bounds fail, just keep raw
                setWaymoAreas(
                    layers.map((layer) => ({
                        ...layer,
                        id:
                            layer.id ||
                            (layer.url || "")
                                .split("/")
                                .pop()
                                ?.replace(/\.geojson$/i, "") ||
                            layer.name,
                    }))
                );
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    // Get user's current location
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                setMapCenter([latitude, longitude]);
                setMapZoom(15);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location. Please try again.");
                setIsLoading(false);
            }
        );
    };

    return (
        <div className='min-h-screen bg-butter racing-font'>
            <Navigation color='text-purple-950' />
            <Header color='text-purple-950'>Available services</Header>

            {/* Main Content Container */}
            <div className='container mx-auto px-6 py-8'>
                <div className='max-w-7xl mx-auto'>
                    {/* Controls Section */}
                    <div className='bg-butter rounded-2xl shadow-lg shadow-purple-950/20 p-6 mb-8'>
                        <div className='flex flex-wrap items-center justify-between gap-4'>
                            <div className='flex flex-wrap items-center gap-4'>
                                <h2 className='text-xl sm:text-2xl font-bold text-purple-900'>
                                    <i className='fa-solid fa-map-location-dot mr-3'></i>
                                    LA Service Area
                                </h2>
                            </div>

                            <div className='flex flex-wrap items-center gap-3'>
                                <button
                                    onClick={getCurrentLocation}
                                    disabled={isLoading}
                                    className='inline-flex items-center px-4 py-2 bg-purple-950 text-butter rounded-xl
                                        hover:bg-purple-800 transform hover:scale-105 transition-all duration-300 ease-out
                                        disabled:opacity-50 disabled:cursor-not-allowed'>
                                    {isLoading ? (
                                        <>
                                            <i className='fa-solid fa-spinner fa-spin mr-2'></i>
                                            Locating...
                                        </>
                                    ) : (
                                        <>
                                            <i className='fa-solid fa-location-crosshairs mr-2'></i>
                                            My Location
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setMapCenter([35, -100]);
                                        setMapZoom(4);
                                        setUserLocation(null);
                                    }}
                                    className='inline-flex items-center px-4 py-2 bg-purple-600 text-butter rounded-xl
                                        hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 ease-out'>
                                    <i className='fa-solid fa-globe mr-2'></i>
                                    Reset View
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className='bg-butter rounded-2xl shadow-lg shadow-purple-950/20 overflow-hidden'>
                        <div className='h-96 sm:h-[500px] md:h-[600px] lg:h-[700px]'>
                            <MapContainer
                                center={mapCenter}
                                zoom={mapZoom}
                                style={{ height: "100%", width: "100%" }}
                                scrollWheelZoom={true}>
                                <MapUpdater center={mapCenter} />
                                <ZoomListener onZoomChange={setMapZoom} />

                                {/* Tile Layer */}
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                />

                                {/* Service Area Polygon removed */}

                                {/* Waymo logo markers when zoomed out */}
                                {mapZoom <= 9 &&
                                    waymoAreas.map((area) => (
                                        <Marker
                                            key={`${area.id || area.name}-marker`}
                                            position={area.center}
                                            icon={L.icon({
                                                iconUrl: area.logo,
                                                iconSize: [36, 36],
                                                iconAnchor: [18, 36],
                                                popupAnchor: [0, -36],
                                            })}
                                            eventHandlers={{
                                                click: (ev) => {
                                                    const map = ev.target._map;
                                                    if (area.bounds && area.bounds.isValid()) {
                                                        map.flyToBounds(area.bounds, { padding: [24, 24], duration: 1.0 });
                                                    } else if (area.center) {
                                                        map.flyTo(area.center, Math.max(map.getZoom(), 10), { duration: 1.0 });
                                                    }
                                                },
                                            }}>
                                            <Popup>{area.id || area.name}</Popup>
                                        </Marker>
                                    ))}

                                {/* Waymo GeoJSON Areas when zoomed in */}
                                {mapZoom > 9 &&
                                    showWaymoAreas &&
                                    waymoGeojson.map((layer) => (
                                        <GeoJSON
                                            key={layer.url || layer.name}
                                            data={layer.data}
                                            icon={L.icon({
                                                iconUrl: layer.logo,
                                                iconSize: [36, 36],
                                                iconAnchor: [18, 36],
                                                popupAnchor: [0, -36],
                                            })}
                                            style={{
                                                color: layer.color,
                                                weight: 2,
                                                opacity: 0.9,
                                                fillColor: layer.color,
                                                fillOpacity: 0.2,
                                            }}
                                            onEachFeature={(_feature, lyr) => {
                                                lyr.on("click", () => {
                                                    const map = lyr._map;
                                                    if (lyr.getBounds && lyr.getBounds().isValid()) {
                                                        map.flyToBounds(lyr.getBounds(), { padding: [24, 24], duration: 1.0 });
                                                    }
                                                });
                                            }}
                                        />
                                    ))}

                                {/* User Location Marker */}
                                {userLocation && (
                                    <Marker position={userLocation}>
                                        <Popup>
                                            <div className='text-center'>
                                                <i className='fa-solid fa-user text-blue-600 text-lg mb-2'></i>
                                                <p className='font-semibold text-purple-900'>Your Location</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                    </div>

                    {/* Map Info removed */}
                </div>
            </div>

            <Footer />
        </div>
    );
};
