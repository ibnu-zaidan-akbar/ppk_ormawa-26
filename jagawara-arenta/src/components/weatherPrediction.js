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

}