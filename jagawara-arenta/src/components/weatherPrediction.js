'use client';
import { useState, useEffect } from "react";

export default function Weather(){
    const [weatherData, setWeatherData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);

    const lat = -7.194080;
    const lon = 107.273049;

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
                const data = await res.json();
                setWeatherData(data);

                setSelectedDate(data.daily.time[0]);
                setLoading(false);
            } catch(error) {
                console.error("gagal mengambil data cuaca:", error);
                setLoading(false);
            }
        };
        fetcWeather();
    }, []);

    if(loading) return <div className="p-5 text-center">Memuat data cuaca real-time</div>
    if(!weatherData) return <div>Gagal memuat data</div>

    const getHourlyData = () => {
        const hourlyTimes = weatherData.hourly.time;
        const hourlyTemp = weatherData.hourly.temperature_2m;
        const hourlyHumidity = weatherData.hourly.relativehumidity_2m;
    
        return hourlyTimes.map((time, index) => ({
            time: time,
            temp: hourlyTemp[index],
            humidity: hourlyHumidity[index]
        })).filter(item => item.time.startsWith(selecetedDate));
    };

    const selectedHourlyData = getHourlyData();

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Prediksi Cuaca Desa Cipelah</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {weatherData.daily.time.map((date, index) => {
                    const maxTemp = weatherData.daily.temperature_2m_max[index];
                    const minTemp = weatherData.daily.temperature_2m_min[index];
                    const isSelected = selectedDate === date;

                    return (
                        <div key={date} onClick={() => setSelectedDate(date)} className={"min-w-[120px] p-4 rounded-lg cursor-pointer transition-all border " + (isSelected ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105" : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50")}>
                            <p className="text-sm font-semibold">{new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short'})}</p>
                            <p className="text-lg font-bold mt-2">{maxTemp}°C</p>
                            <p className="text-xs opacity-80">{minTemp}°C</p>
                        </div>
                    );
                })}
            </div>
            <div className="mt-8 bg-gray-80 p-5 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Rincian per jam ({new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long'})})</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {selectedHourlyData.map((data, index) => {
                        const hour = data.time.split('T')[1];
                        return (
                            <div key={index} className="bg-white p-3 rounded shadow-sm text-center border border-gray-100">
                                <p className="text-sm font-semibold text-gray-600">{hour}</p>
                                <p className="text-md font-bold text-blue-600 my-1">{data.temp}°C</p>
                                <p className="text-xs text-gray-500">💧{data.humidity}%</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}