import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { weatherService } from '../services/api';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets } from 'lucide-react';

export default function WeatherWidget({ city = 'Colombo' }) {
    const { t } = useTranslation();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWeather();
    }, [city]);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await weatherService.getWeather(city);
            setWeather(data);
        } catch (err) {
            console.error('Weather fetch error:', err);
            // Extract the actual error message from backend response
            const errorMessage = err.response?.data?.error
                || err.response?.data?.message
                || err.message
                || 'Failed to fetch weather data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (weatherData) => {
        if (!weatherData?.weather?.[0]?.main) {
            return <Sun className="w-10 h-10 text-yellow-500" />;
        }

        const condition = weatherData.weather[0].main.toLowerCase();

        switch (condition) {
            case 'clear':
                return <Sun className="w-10 h-10 text-yellow-500" />;
            case 'clouds':
                return <Cloud className="w-10 h-10 text-gray-500" />;
            case 'rain':
            case 'drizzle':
                return <CloudRain className="w-10 h-10 text-blue-500" />;
            case 'snow':
                return <CloudSnow className="w-10 h-10 text-blue-300" />;
            case 'wind':
                return <Wind className="w-10 h-10 text-gray-600" />;
            default:
                return <Cloud className="w-10 h-10 text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 mb-6 shadow-lg animate-pulse">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-blue-200 rounded w-1/3"></div>
                        <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 shadow-lg">
                <div className="flex items-center space-x-3">
                    <Cloud className="w-10 h-10 text-amber-500" />
                    <div>
                        <h3 className="font-bold text-amber-900">Weather Service Notice</h3>
                        <p className="text-sm text-amber-700">{error}</p>
                        {error.includes('activate') && (
                            <p className="text-xs text-amber-600 mt-2">
                                ⏳ New API keys take 10 min - 2 hours to activate. Please check back later!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Handle demo mode (when no API key is set)
    if (weather?.message?.includes('demo mode')) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-5 mb-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Sun className="w-10 h-10 text-yellow-500" />
                        <div>
                            <h3 className="font-bold text-blue-900">{city} Weather</h3>
                            <p className="text-xl text-blue-700">{weather.temp}°C - {weather.weather}</p>
                            <p className="text-xs text-blue-500 mt-1">⚠️ Demo Mode - Add API key for real data</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Real weather data
    const temp = Math.round(weather?.main?.temp || 0);
    const feelsLike = Math.round(weather?.main?.feels_like || 0);
    const humidity = weather?.main?.humidity || 0;
    const description = weather?.weather?.[0]?.description || 'Unknown';
    const cityName = weather?.name || city;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-5 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {getWeatherIcon(weather)}
                    <div>
                        <h3 className="font-bold text-blue-900 text-lg">{cityName}</h3>
                        <p className="text-3xl font-bold text-blue-700">{temp}°C</p>
                        <p className="text-sm text-blue-600 capitalize">{description}</p>
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <Droplets className="w-4 h-4" />
                        <span>{humidity}%</span>
                    </div>
                    <p className="text-xs text-blue-500">Feels like {feelsLike}°C</p>
                </div>
            </div>
        </div>
    );
}
