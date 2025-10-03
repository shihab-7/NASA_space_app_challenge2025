'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { LightPollutionData, PollutionLevel, RegionMapData } from '../types';
import { FeatureCollection, Feature, Geometry } from 'geojson';
import { PathOptions } from 'leaflet';

// Import polygon data
import DhakaPolygon from '../map_polygons/Dhaka.json';
import BarisalPolygon from '../map_polygons/Barisal.json';
import ChittagongPolygon from '../map_polygons/Chittagong.json';
import RajshahiPolygon from '../map_polygons/Rajshahi.json';
import KhulnaPolygon from '../map_polygons/Khulna.json';
import SylhetPolygon from '../map_polygons/Sylhet.json';
import RangpurPolygon from '../map_polygons/Rangpur.json';

interface BangladeshFeature extends Feature {
    properties: {
        name: string;
        [key: string]: string | number | boolean | null;
    };
}

interface BangladeshGeoJSON extends FeatureCollection {
    features: BangladeshFeature[];
}

interface RegionData {
    population: number;
    intensity: PollutionLevel;
    regressionResult: {
        night_light_mean: number;
        ndvi_mean: number;
        population_dense_mean: number;
    };
    llmSuggestion: string;
}

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
    year: number;
    onMapClick: (lat: number, lng: number) => void;
    pollutionData: LightPollutionData;
    regionData: Record<string, RegionMapData>;
}

function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

const Map = ({ year, onMapClick, pollutionData, regionData }: MapProps) => {
    const [mounted, setMounted] = useState(false);
    const [bangladeshGeoJSON, setBangladeshGeoJSON] = useState<BangladeshGeoJSON | null>(null);

    useEffect(() => {
        setMounted(true);
        createGeoJSONData();
    }, []);

    const createGeoJSONData = () => {
        const polygonData = {
            Dhaka: DhakaPolygon,
            Barisal: BarisalPolygon,
            Chittagong: ChittagongPolygon,
            Rajshahi: RajshahiPolygon,
            Khulna: KhulnaPolygon,
            Sylhet: SylhetPolygon,
            Rangpur: RangpurPolygon
        };

        const features: BangladeshFeature[] = Object.entries(polygonData).map(([regionName, coordinates]) => ({
            "type": "Feature",
            "properties": { "name": regionName },
            "geometry": {
                "type": "Polygon",
                "coordinates": [coordinates.map((coord: { lat: number, lng: number }) => [coord.lng, coord.lat])]
            }
        }));

        setBangladeshGeoJSON({
            "type": "FeatureCollection",
            "features": features
        });
    };

    const bangladeshRegionsData = regionData || {};

    const getColor = (intensity: PollutionLevel) => {
        switch (intensity) {
            case 'low': return '#86efac';   // green-300
            case 'moderate': return '#eab308'; // yellow-500
            case 'high': return '#f97316';  // orange-500
            case 'severe': return '#ef4444'; // red-500
            default: return '#a3a3a3';     // gray-500
        }
    };

    const styleFunction = (feature?: Feature<Geometry, Record<string, unknown>>): PathOptions => {
        if (!feature) {
            return {
                fillColor: '#FFEDA0',
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        const banglaFeature = feature as BangladeshFeature;
        const regionName = banglaFeature.properties?.name || '';
        const regionData = bangladeshRegionsData[regionName];

        const intensity = regionData ? regionData.intensity : 'low';

        return {
            fillColor: getColor(intensity),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    if (!mounted || !bangladeshGeoJSON) {
        return <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-white">Loading choropleth map...</span>
        </div>;
    }

    return (
        <MapContainer
            center={[23.8103, 90.4125]}
            zoom={8}
            className="w-full h-full"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapEvents onMapClick={onMapClick} />

            <GeoJSON
                key={`bangladesh-regions-${year}-${JSON.stringify(bangladeshRegionsData)}`}
                data={bangladeshGeoJSON}
                style={styleFunction as L.StyleFunction<Feature<Geometry, Record<string, unknown>>>}
            />

            <Marker position={[pollutionData.coordinates.lat, pollutionData.coordinates.lng]}>
                <Popup>
                    <div>
                        <h3><strong>{pollutionData.region}</strong></h3>
                        <p><strong>Status:</strong> {pollutionData.pollutionLevel}</p>
                    </div>
                </Popup>
            </Marker>


        </MapContainer>
    );
};

export default Map;