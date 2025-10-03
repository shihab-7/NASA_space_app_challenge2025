import { LightPollutionData, PollutionLevel } from '../types';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';

interface RightPanelProps {
  data: LightPollutionData;
  isOpen: boolean;
  onToggle: () => void;
}

const RightPanel = ({ data, isOpen, onToggle }: RightPanelProps) => {
  // Replace dynamic class generation with direct class mapping
  const getPollutionColor = (level: PollutionLevel) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'severe': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendColor = (level: PollutionLevel) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };


  const getTrendHeight = (level: PollutionLevel) => {
    switch (level) {
      case 'low': return '40%';
      case 'moderate': return '60%';
      case 'high': return '80%';
      case 'severe': return '100%';
      default: return '10%';
    }
  };

  const getPollutionDescription = (level: PollutionLevel) => {
    switch (level) {
      case 'low': return 'Some light pollution. Good star visibility.';
      case 'moderate': return 'Moderate light pollution. Limited star visibility.';
      case 'high': return 'Significant light pollution. Few stars visible.';
      case 'severe': return 'Extreme light pollution. Only brightest stars visible.';
      default: return '';
    }
  };

  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  return (
    <Paper
      elevation={6}
      className={`h-screen w-90 flex-shrink-0 transition-all duration-300 flex flex-col bg-white/70 text-gray-900 ${isOpen ? 'mr-0' : '-mr-80'}`}
      sx={{
        height: '100vh',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 16,
      }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <h2 className="text-xl font-bold">Location Details: {data.region}</h2>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <Card className="bg-white shadow rounded">
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Light Pollution Level</h4>
              <span className={`font-bold ${getPollutionColor(data.pollutionLevel)}`}>
                {data.pollutionLevel.charAt(0).toUpperCase() + data.pollutionLevel.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {getPollutionDescription(data.pollutionLevel)}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={getTrendColor(data.pollutionLevel)}
                style={{
                  width: getTrendHeight(data.pollutionLevel),
                  height: '100%',
                  borderRadius: '0.375rem'
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>None</span>
              <span>{data.pollutionLevel.charAt(0).toUpperCase() + data.pollutionLevel.slice(1)}</span>
              <span>Severe</span>
            </div>
          </CardContent>
        </Card>

        {data.regressionResult && (
          <Card className="bg-white shadow rounded">
            <CardContent>
              <h4 className="font-semibold mb-3">Environmental Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Night Light Mean:</span>
                  <span className="font-medium">{data.regressionResult.night_light_mean.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">NDVI Mean:</span>
                  <span className="font-medium">{data.regressionResult.ndvi_mean.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Population Density Mean:</span>
                  <span className="font-medium">{data.regressionResult.population_dense_mean.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white shadow rounded">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <IconButton
                size="small"
                onClick={() => setSuggestionsOpen((open) => !open)}
                aria-label={suggestionsOpen ? "Collapse suggestions" : "Expand suggestions"}
                className='flex items-center justify-between w-full'
              >
                <h4 className="font-semibold">Improvement Suggestions</h4>
                {suggestionsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
            {suggestionsOpen && (
              <ul className="space-y-2">
                {data.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow rounded">
          <CardContent>
            <h4 className="font-semibold mb-3">Pollution Trend (2017-2050)</h4>
            <div className="h-32 rounded p-2">
              <div className="flex items-end h-24 gap-1">
                {data.trends.map((level, index) => (
                  <div
                    key={index}
                    className="flex-1 flex items-end justify-center"
                    style={{ height: '100%' }}
                  >
                    <div
                      className={getTrendColor(level)}
                      style={{ height: getTrendHeight(level), width: '100%' }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2017</span>
                <span>2050</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Paper>
  );
};

export default RightPanel;