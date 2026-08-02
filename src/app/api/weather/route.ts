import { NextRequest, NextResponse } from "next/server";
import { COUNTRY_COORDS } from "@/lib/free-services";
import { fetchWithTimeout } from "@/lib/api-utils";

const WMO_CODES: Record<number, { desc: string; icon: string }> = {
  0: { desc: "Clear sky", icon: "☀️" },
  1: { desc: "Mainly clear", icon: "🌤️" },
  2: { desc: "Partly cloudy", icon: "⛅" },
  3: { desc: "Overcast", icon: "☁️" },
  45: { desc: "Fog", icon: "🌫️" },
  48: { desc: "Rime fog", icon: "🌫️" },
  51: { desc: "Light drizzle", icon: "🌦️" },
  53: { desc: "Moderate drizzle", icon: "🌦️" },
  55: { desc: "Dense drizzle", icon: "🌧️" },
  61: { desc: "Slight rain", icon: "🌧️" },
  63: { desc: "Moderate rain", icon: "🌧️" },
  65: { desc: "Heavy rain", icon: "🌧️" },
  71: { desc: "Slight snow", icon: "❄️" },
  73: { desc: "Moderate snow", icon: "❄️" },
  75: { desc: "Heavy snow", icon: "❄️" },
  80: { desc: "Slight showers", icon: "🌦️" },
  81: { desc: "Moderate showers", icon: "🌧️" },
  82: { desc: "Violent showers", icon: "⛈️" },
  95: { desc: "Thunderstorm", icon: "⛈️" },
  96: { desc: "Thunderstorm with hail", icon: "⛈️" },
  99: { desc: "Thunderstorm with heavy hail", icon: "⛈️" },
};

const FALLBACK_WEATHER: Record<string, { city: string; temp: number; condition: string; icon: string }> = {
  us: { city: "New York", temp: 22, condition: "Partly Cloudy", icon: "⛅" },
  gb: { city: "London", temp: 16, condition: "Rainy", icon: "🌧️" },
  in: { city: "New Delhi", temp: 34, condition: "Sunny", icon: "☀️" },
  pk: { city: "Islamabad", temp: 32, condition: "Clear", icon: "🌙" },
  ca: { city: "Toronto", temp: 18, condition: "Cloudy", icon: "☁️" },
  au: { city: "Sydney", temp: 24, condition: "Sunny", icon: "☀️" },
  de: { city: "Berlin", temp: 19, condition: "Overcast", icon: "☁️" },
  fr: { city: "Paris", temp: 20, condition: "Partly Cloudy", icon: "⛅" },
  jp: { city: "Tokyo", temp: 26, condition: "Humid", icon: "💧" },
  cn: { city: "Beijing", temp: 28, condition: "Hazy", icon: "🌫️" },
  br: { city: "São Paulo", temp: 25, condition: "Thunderstorm", icon: "⛈️" },
  za: { city: "Cape Town", temp: 17, condition: "Windy", icon: "💨" },
  ae: { city: "Dubai", temp: 38, condition: "Hot", icon: "🔥" },
  sa: { city: "Riyadh", temp: 40, condition: "Very Hot", icon: "🔥" },
  ng: { city: "Lagos", temp: 30, condition: "Humid", icon: "💧" },
  eg: { city: "Cairo", temp: 36, condition: "Sunny", icon: "☀️" },
  tr: { city: "Istanbul", temp: 23, condition: "Mild", icon: "🌤️" },
  ru: { city: "Moscow", temp: 15, condition: "Cool", icon: "🌤️" },
  it: { city: "Rome", temp: 27, condition: "Sunny", icon: "☀️" },
  es: { city: "Madrid", temp: 29, condition: "Clear", icon: "☀️" },
};

async function fetchOpenMeteo(lat: number, lon: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
    const res = await fetchWithTimeout(url, { next: { revalidate: 600 }, timeout: 8000 });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get("country") || "us";
  const coords = COUNTRY_COORDS[country] || COUNTRY_COORDS["us"];
  const fallback = FALLBACK_WEATHER[country] || FALLBACK_WEATHER["us"];

  const meteo = await fetchOpenMeteo(coords.lat, coords.lon);

  if (meteo?.current) {
    const current = meteo.current;
    const wmo = WMO_CODES[current.weather_code] || { desc: "Unknown", icon: "🌤️" };
    const daily = meteo.daily;
    const forecast = daily?.time?.map((date: string, i: number) => ({
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      tempHigh: Math.round(daily.temperature_2m_max[i]),
      tempLow: Math.round(daily.temperature_2m_min[i]),
      description: WMO_CODES[daily.weather_code[i]]?.desc || "Unknown",
      icon: WMO_CODES[daily.weather_code[i]]?.icon || "🌤️",
    })) || [];

    return NextResponse.json({
      city: coords.city,
      country: country.toUpperCase(),
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      description: wmo.desc,
      icon: wmo.icon,
      forecast,
      source: "open-meteo",
      lastUpdated: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    city: fallback.city,
    country: country.toUpperCase(),
    temperature: fallback.temp,
    feelsLike: fallback.temp + Math.floor(Math.random() * 4) - 2,
    humidity: 40 + Math.floor(Math.random() * 40),
    windSpeed: 5 + Math.floor(Math.random() * 20),
    description: fallback.condition,
    icon: fallback.icon,
    forecast: [],
    source: "fallback",
    lastUpdated: new Date().toISOString(),
  });
}
