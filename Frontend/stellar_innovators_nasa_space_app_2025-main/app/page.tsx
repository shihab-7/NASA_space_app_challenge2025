'use client';
import { useState, useEffect } from 'react';
import DynamicMap from './components/DynamicMap';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';
import { LightPollutionData, PollutionLevel, ApiResponse, RegionMapData } from './types';

// Initial data structure just for first render
const initialData: LightPollutionData = {
    region: 'Dhaka',
    pollutionLevel: 'moderate',
    coordinates: { lat: 23.8103, lng: 90.4125 },
    suggestions: ['Loading suggestions...'],
    trends: ['low', 'low', 'moderate', 'moderate'] as PollutionLevel[],
};

const regionCoordinates: Record<string, { lat: number, lng: number }> = {
    "Dhaka": { lat: 23.8103, lng: 90.4125 },
    "Chittagong": { lat: 22.3569, lng: 91.7832 },
    "Rajshahi": { lat: 24.3745, lng: 88.6042 },
    "Khulna": { lat: 22.8456, lng: 89.5403 },
    "Sylhet": { lat: 24.8949, lng: 91.8687 },
    "Rangpur": { lat: 25.7439, lng: 89.2752 },
    "Barisal": { lat: 22.7010, lng: 90.3535 },
};

export default function Home() {
    const [year, setYear] = useState<number>(2023);
    const [selectedData, setSelectedData] = useState<LightPollutionData>(initialData);
    const [isPanelOpen, setIsPanelOpen] = useState({ left: true, right: true });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [apiData, setApiData] = useState<Record<string, ApiResponse>>({});
    const [currentRegion, setCurrentRegion] = useState<string>('Dhaka');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/proxy?year=${year}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setApiData(data);

                updateSelectedDataFromApi(currentRegion, data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [year]);

    const updateSelectedDataFromApi = (regionName: string, data: Record<string, ApiResponse>, clickedCoordinates?: { lat: number, lng: number }) => {
        if (data && data[regionName]) {
            const apiResponse = data[regionName];

            const trends: PollutionLevel[] = ['moderate', 'high', 'severe', 'severe'];

            setSelectedData({
                region: regionName,
                pollutionLevel: apiResponse.classification_result,
                suggestions: apiResponse.llm_suggestion.split('\n'),
                trends: trends,
                coordinates: clickedCoordinates || regionCoordinates[regionName] || { lat: 23.8103, lng: 90.4125 },
                regressionResult: {
                    night_light_mean: apiResponse.regression_result[0],
                    ndvi_mean: apiResponse.regression_result[1],
                    population_dense_mean: apiResponse.regression_result[2],
                }
            });
        }
    };

    const handleYearChange = (newYear: number) => {
        setYear(newYear);
    };

    const handleDistrictChange = (newRegion: string) => {
        setCurrentRegion(newRegion);
        if (apiData && apiData[newRegion]) {
            updateSelectedDataFromApi(newRegion, apiData);
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        let clickedRegion = 'Dhaka';

        if (lat > 23.5 && lat < 24.5 && lng > 89.8 && lng < 91.0) clickedRegion = 'Dhaka';
        else if (lat > 21.8 && lat < 24.0 && lng > 91.0 && lng < 92.6) clickedRegion = 'Chittagong';
        else if (lat > 24.0 && lat < 25.8 && lng > 88.0 && lng < 89.8) clickedRegion = 'Rajshahi';
        else if (lat > 21.5 && lat < 23.4 && lng > 88.8 && lng < 90.2) clickedRegion = 'Khulna';
        else if (lat > 24.0 && lat < 25.2 && lng > 90.8 && lng < 92.6) clickedRegion = 'Sylhet';
        else if (lat > 25.2 && lat < 26.6 && lng > 88.0 && lng < 90.5) clickedRegion = 'Rangpur';
        else if (lat > 21.5 && lat < 23.4 && lng > 89.8 && lng < 91.0) clickedRegion = 'Barisal';

        setCurrentRegion(clickedRegion);

        if (apiData && apiData[clickedRegion]) {
            updateSelectedDataFromApi(clickedRegion, apiData, { lat, lng });
        }
    };

    const prepareRegionDataForMap = () => {
        if (!apiData) return {};

        return Object.keys(apiData).reduce((acc, region) => {
            const data = apiData[region];
            acc[region] = {
                intensity: data.classification_result,
                regressionResult: {
                    night_light_mean: data.regression_result[0],
                    ndvi_mean: data.regression_result[1],
                    population_dense_mean: data.regression_result[2],
                },
                llmSuggestion: data.llm_suggestion,
            };
            return acc;
        }, {} as Record<string, RegionMapData>);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <Navigation />

            <div className={`flex flex-1 overflow-hidden relative ${isLoading ? 'filter blur-sm' : ''}`}>
                {isPanelOpen.left && (
                    <LeftPanel
                        year={year}
                        onYearChange={handleYearChange}
                        currentRegion={currentRegion}
                        onDistrictChange={handleDistrictChange}
                    />
                )}

                <div className="flex-1 w-full">
                    <DynamicMap
                        year={year}
                        onMapClick={handleMapClick}
                        pollutionData={selectedData}
                        regionData={prepareRegionDataForMap()}
                    />
                </div>

                {isPanelOpen.right && (
                    <RightPanel
                        data={selectedData}
                        isOpen={isPanelOpen.right}
                        onToggle={() => setIsPanelOpen(prev => ({ ...prev, right: !prev.right }))
                        }
                    />
                )}
            </div>

            {isLoading && <LoadingSpinner />}
        </div>
    );
}