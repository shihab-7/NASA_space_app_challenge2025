import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '../../types';

const TARGET_URL = 'https://light-pollution-visualizer.duckdns.org/ml_model_pred/predict/';
const TIMEOUT_MS = 90000;

export async function GET(req: NextRequest) {
    try {
        const yearParam = req.nextUrl.searchParams.get('year');
        const year = yearParam ? Number(yearParam) : undefined;
        const response = await fetchAllDivisionsData(year as number);

        // Return the response
        return NextResponse.json(response);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data from API', details: String(error) },
            { status: 500 }
        );
    }
}

export const fetchDivisionData = async (
    division: string,
    year: number
): Promise<ApiResponse> => {
    try {
        // Create an AbortController with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                division,
                year,
            }),
            signal: controller.signal,
        }).finally(() => {
            clearTimeout(timeoutId); // Clear the timeout when fetch completes
        });

        if (!response.ok) {
            throw new Error(`Error fetching data for ${division}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Request timeout for ${division} after ${TIMEOUT_MS}ms`);
        }
        console.error(`Failed to fetch data for ${division}:`, error);
        throw error;
    }
};

export const fetchAllDivisionsData = async (
    year: number
): Promise<Record<string, ApiResponse>> => {
    const divisions = [
        'Dhaka',
        'Chittagong',
        'Rajshahi',
        'Khulna',
        'Sylhet',
        'Rangpur',
        'Barisal'
    ];

    try {
        const requests = divisions.map(division =>
            fetchDivisionData(division, year)
                .then(data => ({ division, data }))
                .catch(error => {
                    console.error(`Error fetching ${division} data:`, error);
                    return { division, error };
                })
        );

        const results = await Promise.all(requests);

        return results.reduce((acc, result) => {
            if ('data' in result && !('error' in result)) {
                acc[result.division] = result.data;
            }
            return acc;
        }, {} as Record<string, ApiResponse>);
    } catch (error) {
        console.error('Failed to fetch all divisions data:', error);
        throw error;
    }
};
