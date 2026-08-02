"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useCountry } from "@/components/CountryProvider";
import { WeatherData } from "@/types/news";
import { COUNTRIES } from "@/lib/constants";
import { Cloud, Droplets, Wind, Thermometer, MapPin } from "lucide-react";

export default function WeatherPage() {
  const { country, setCountry } = useCountry();
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Weather</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Current weather conditions by country
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700/50 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                  ))}
                </div>
              </div>
            ) : weather ? (
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 opacity-80" />
                  <span className="opacity-80">{weather.city}, {weather.country}</span>
                </div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-6xl font-bold mb-2">
                      {weather.icon} {weather.temperature}°C
                    </p>
                    <p className="text-xl opacity-90">{weather.description}</p>
                    <p className="text-sm opacity-70">Feels like {weather.feelsLike}°C</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <Thermometer className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-sm opacity-80">Temperature</p>
                    <p className="text-xl font-semibold">{weather.temperature}°C</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <Droplets className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-sm opacity-80">Humidity</p>
                    <p className="text-xl font-semibold">{weather.humidity}%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <Wind className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-sm opacity-80">Wind Speed</p>
                    <p className="text-xl font-semibold">{weather.windSpeed} km/h</p>
                  </div>
                </div>

                {weather.forecast && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {weather.forecast.map((day, i) => (
                        <div
                          key={i}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
                        >
                          <p className="text-sm opacity-80 mb-1">{day.date}</p>
                          <p className="text-2xl mb-1">{day.icon}</p>
                          <p className="text-sm font-semibold">
                            {day.tempHigh}° / {day.tempLow}°
                          </p>
                          <p className="text-xs opacity-70">{day.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Select Country</h3>
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-4 max-h-[600px] overflow-y-auto">
              <div className="space-y-1">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCountry(c.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      country === c.code
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
