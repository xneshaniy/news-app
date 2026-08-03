"use client";

import { useEffect, useState } from "react";
import { Droplets, Wind } from "lucide-react";
import { useCountry } from "./CountryProvider";
import { WeatherData } from "@/types/news";

export default function WeatherWidget() {
  const { country } = useCountry();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/weather?country=${country}`)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [country]);

  if (loading || !weather) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white animate-pulse">
        <div className="h-4 bg-white/20 rounded w-20 mb-2" />
        <div className="h-8 bg-white/20 rounded w-16" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm opacity-80">{weather.city}</p>
          <p className="text-3xl font-bold">{weather.icon} {weather.temperature}°C</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-80">{weather.description}</p>
          <p className="text-xs opacity-60">Feels like {weather.feelsLike}°C</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs opacity-80">
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          {weather.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          {weather.windSpeed} km/h
        </span>
      </div>

      {weather.forecast && weather.forecast.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-5 gap-1">
          {weather.forecast.map((day, i) => (
            <div key={i} className="text-center">
              <p className="text-[10px] opacity-60">{day.date}</p>
              <p className="text-sm">{day.icon}</p>
              <p className="text-[10px]">{day.tempHigh}°</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
