import React, { useState } from "react";
import {
  Cloud,
  MapPin,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Search,
} from "lucide-react";

export default function WeatherApp() {
  const [latitude, setLatitude] = useState("13.7563");
  const [longitude, setLongitude] = useState("100.5018");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,visibility&timezone=auto`
      );

      if (!response.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลได้");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentHourData = () => {
    if (!weatherData) return null;

    const currentTime = new Date(weatherData.current_weather.time);
    const hourIndex = weatherData.hourly.time.findIndex(
      (time) => new Date(time).getTime() === currentTime.getTime()
    );

    return {
      humidity: weatherData.hourly.relative_humidity_2m[hourIndex],
      visibility: weatherData.hourly.visibility[hourIndex],
    };
  };

  const hourData = getCurrentHourData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-center mb-8">
            <Cloud className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">สภาพอากาศ</h1>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                ละติจูด (Latitude)
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="เช่น 13.7563"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                ลองจิจูด (Longitude)
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="เช่น 100.5018"
              />
            </div>

            <button
              onClick={fetchWeather}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              {loading ? "กำลังโหลด..." : "ค้นหาสภาพอากาศ"}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              <p className="font-semibold">เกิดข้อผิดพลาด</p>
              <p>{error}</p>
            </div>
          )}

          {weatherData && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                <Thermometer className="w-16 h-16 text-blue-500 mx-auto mb-3" />
                <p className="text-gray-600 text-lg mb-2">อุณหภูมิปัจจุบัน</p>
                <p className="text-6xl font-bold text-blue-600">
                  {weatherData.current_weather.temperature}°C
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <Wind className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">ความเร็วลม</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {weatherData.current_weather.windspeed}
                  </p>
                  <p className="text-xs text-gray-500">km/h</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <Cloud className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">รหัสสภาพอากาศ</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {weatherData.current_weather.weathercode}
                  </p>
                  <p className="text-xs text-gray-500">WMO Code</p>
                </div>

                {hourData && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-5 text-center">
                      <Droplets className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">ความชื้น</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {hourData.humidity}%
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 text-center">
                      <Eye className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">ทัศนวิสัย</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {(hourData.visibility / 1000).toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">km</p>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  <strong>เวลาอัปเดต:</strong>{" "}
                  {new Date(weatherData.current_weather.time).toLocaleString(
                    "th-TH"
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>พิกัด:</strong> {latitude}, {longitude}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>เขตเวลา:</strong> {weatherData.timezone}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-white text-sm">
          <p>ข้อมูลจาก Open-Meteo API</p>
          <p className="mt-1 opacity-75">พยากรณ์อากาศแบบเปิด และฟรี</p>
        </div>
      </div>
    </div>
  );
}
