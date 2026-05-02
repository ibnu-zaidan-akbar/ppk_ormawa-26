'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import React from 'react';

export default function Weather(){
    const [weatherData, setWeatherData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);

    const lat = -7.194080;
    const lon = 107.273049;

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
                const data = await res.json();
                setWeatherData(data);

                setSelectedDate(data.daily.time[0]);
                setLoading(false);
            } catch(error) {
                console.error("gagal mengambil data cuaca:", error);
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if(loading) return <div className="p-5 text-center">Memuat data cuaca real-time</div>
    if(!weatherData) return <div>Gagal memuat data</div>

    const getHourlyData = () => {
        const hourlyTimes = weatherData.hourly.time;
        const hourlyTemp = weatherData.hourly.temperature_2m;
        const hourlyHumidity = weatherData.hourly.relativehumidity_2m;
        const hourlyCode = weatherData.hourly.weather_code;
    
        return hourlyTimes.map((time, index) => ({
            time: time,
            temp: hourlyTemp[index],
            humidity: hourlyHumidity[index],
            weather_code: hourlyCode[index]
        })).filter(item => item.time.startsWith(selectedDate));
    };
    
    const selectedHourlyData = getHourlyData();
    function getWeatherCategory(code) {
        if (code >= 0 && code <= 10) return "Cerah";
        if (code >= 11 && code <= 50) return "Berawan";
        if (code >= 51 && code <= 62) return "Hujan Ringan";
        if (code >= 63 && code <= 72) return "Hujan Sedang";
        if (code >= 73 && code <= 83) return "Hujan deras";
        if (code >= 84) return "Badai Petir";
        return "Tidak diketahui";
    }

    function getWeatherIcon(code) {
        if (code >= 0 && code <= 10) return "/icon/Sun.svg";
        if (code >= 11 && code <= 49) return "/icon/Cloud.svg";
        if (code >= 50 && code <= 80) return "/icon/CloudRain.svg";
        if (code >= 81) return "/icon/CloudLightning.svg";
        return "Tidak diketahui";
    }

    return (
        <div className="gap-12 w-full flex flex-col items-center justify-center">
            <div className="p-4 w-full max-w-[1480px] bg-white mx-auto border-3 border-[#936440]/60 overflow-hidden items-center">
                <h2 className="text-[#0B592F] text-[20px] xl:text-[40px] leading-tight font-bold">Prediksi Cuaca Desa Cipelah</h2>
                <h3 className="text-[#936440] text-[12px] xl:text-[20px] leading-tight font-bold mb-4 ">Click Hari untuk Detail Jam</h3>
                <div className="flex gap-4 max-w-[1328px] -mx-5 xl:mx-auto px-4 border-3 border-[#936440]/60 py-4 overflow-y-hidden overflow-x-auto custom-scrollbar">
                    {weatherData.daily.time.map((date, index) => {
                        const maxTemp = weatherData.daily.temperature_2m_max[index];
                        const minTemp = weatherData.daily.temperature_2m_min[index];
                        const dailyCode = weatherData.daily.weather_code[index];
                        const weatherCategory = getWeatherCategory(dailyCode);
                        const iconPath = getWeatherIcon(dailyCode);
                        const isSelected = selectedDate === date;
                        const isLastItem = index === weatherData.daily.time.length - 1;

                        return (
                            <React.Fragment key={date}>
                                <div key={date} onClick={() => setSelectedDate(date)} className={"shrink-0 flex flex-col xl:min-w-[100px] p-4 md:p-8 xl:p-10 -m-4 cursor-pointer transition-all text-center items-center " + (isSelected ? "bg-[#0B592F]/15 hover:bg-[#F0E7D7]" : "bg-white hover:bg-gray-50")}>
                                    <p className="text-black text-[16px] md:text-[24px] font-bold">{new Date(date).toLocaleDateString('id-ID', { weekday: 'long'})}</p>
                                    <p className="text-[#936440] text-[12px] md:text-[16px] font-semibold">{new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short'})}</p>
                                    <div className="m-4 w-10 h-10 md:w-15 md:h-15 relative items-center">
                                        <Image
                                            src={iconPath} alt={weatherCategory}
                                            fill className="object-contain"
                                            />
                                    </div>
                                    <p className="text-[#936440] text-[14px] md:text-[18px] font-bold">{weatherCategory}</p>
                                    <p className="text-black text-[14px] md:text-[18px] font-semibold">{maxTemp}°C</p>
                                    <p className="text-[#936440] text-[12px] opacity-80">{minTemp}°C</p>
                                </div>
                                {!isLastItem && (
                                    <div className="w-[2px] -my-[17px] bg-[#936440]/60 shrink-0 rounded-full"></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
                <div className="xl:h-[4px] bg-[#936440]/60 rounded-full my-4 -mx-4"></div>
                <div className="pt-3 xl:p-5">
                    <h3 className="text-[#0B592F] text-[16px] xl:text-[32px] font-bold mb-4">Cuaca {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long'})} {new Date(selectedDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})} per Jam</h3>
                    <div className="flex gap-3 overflow-x-auto custom-scrollbar overflow-y-hidden pb-5">
                        {selectedHourlyData.map((data, index) => {
                        // {selectedHourlyData.filter((_, index) => index % 2 === 0).map((data, index) => {
                            const hour = data.time.split('T')[1];
                            const hourlyCode = data.weather_code;
                            const iconPath = getWeatherIcon(hourlyCode);
                            return (
                                <div key={index} className="shrink-0 min-w-[90px] xl:min-w-[100px] bg-[#EAE2D5] p-3 xl:p-5 rounded-xl shadow-lg text-center">
                                    <p className="text-[14px] xl:text-[18px] font-semibold text-gray-600">{hour}</p>
                                    <div className="my-3 mx-4 xl:m-4 w-9 xl:w-13 h-9 xl:h-13 relative items-center">
                                        <Image
                                            src={iconPath} alt="weather category"
                                            fill className="object-contain"
                                            />
                                    </div>
                                    <p className="text-[10px] xl:text-[16px] font-bold text-black my-1">{data.temp}°C</p>
                                    <p className="text-[12px] text-blue-600">💧{data.humidity}%</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}