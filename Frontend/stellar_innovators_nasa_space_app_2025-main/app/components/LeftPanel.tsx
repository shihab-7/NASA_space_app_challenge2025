'use client';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const regionCoordinates: Record<string, { lat: number, lng: number }> = {
  "Dhaka": { lat: 23.8103, lng: 90.4125 },
  "Chittagong": { lat: 22.3569, lng: 91.7832 },
  "Rajshahi": { lat: 24.3745, lng: 88.6042 },
  "Khulna": { lat: 22.8456, lng: 89.5403 },
  "Sylhet": { lat: 24.8949, lng: 91.8687 },
  "Rangpur": { lat: 25.7439, lng: 89.2752 },
  "Barisal": { lat: 22.7010, lng: 90.3535 },
};

interface LeftPanelProps {
  year: number;
  onYearChange: (year: number) => void;
  currentRegion: string;
  onDistrictChange?: (region: string) => void;
}

const LeftPanel = ({ year, onYearChange, currentRegion, onDistrictChange }: LeftPanelProps) => {
  const [startYear] = useState(2017);
  const [endYear] = useState(2080);

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'absolute',
        top: 24,
        left: 24,
        zIndex: 1000,
        width: 280,
        minHeight: 300,
        backgroundColor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: 4,
        boxShadow: 6,
        overflowY: 'auto',
      }}
      className="flex flex-col"
    >
      <div className="p-4">
        <Typography variant="h6" className="font-bold text-gray-900 mb-2">
          Timeline Controls
        </Typography>
        <Divider className="mb-4" />

        <div className="my-4">
          <FormControl fullWidth className="mb-6">
            <InputLabel id="year-select-label" className="text-gray-700">Select Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={year}
              label="Select Year"
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="bg-white rounded"
              size="small"
            >
              {years.map(y => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="my-4">
          <FormControl fullWidth className="mb-6">
            <InputLabel id="district-select-label" className="text-gray-700">Select District</InputLabel>
            <Select
              labelId="district-select-label"
              value={currentRegion}
              label="Select District"
              onChange={(e) => onDistrictChange?.(e.target.value)}
              className="bg-white rounded"
              size="small"
            >
              {Object.keys(regionCoordinates).map(region => (
                <MenuItem key={region} value={region}>{region}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="mt-4">
          <Typography variant="h6" className="font-bold text-gray-900 mb-2">
            Legend
          </Typography>
          <Divider className="mb-2" />
          <div className="space-y-2 mt-2">
            <div className="flex items-center text-xs">
              <span className="w-4 h-4 rounded bg-[#ef4444] mr-2 border border-gray-300"></span>
              <span className="text-gray-700">Severe</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="w-4 h-4 rounded bg-[#f97316] mr-2 border border-gray-300"></span>
              <span className="text-gray-700">High</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="w-4 h-4 rounded bg-[#eab308] mr-2 border border-gray-300"></span>
              <span className="text-gray-700">Moderate</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="w-4 h-4 rounded bg-[#86efac] mr-2 border border-gray-300"></span>
              <span className="text-gray-700">Low</span>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default LeftPanel;