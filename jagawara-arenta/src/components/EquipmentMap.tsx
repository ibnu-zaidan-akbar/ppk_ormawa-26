"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css"

const getClassicPin = (warnaBg: string) => {
    let hexColor = '#9ca3af'; 
    if (warnaBg.includes('#')) {
        const match = warnaBg.match(/#[0-9a-fA-F]+/i);
        if (match) hexColor = match[0];
    } else if (warnaBg.includes('red')) hexColor = '#FF1100';
    else if (warnaBg.includes('blue')) hexColor = '#3b82f6';
    else if (warnaBg.includes('green')) hexColor = '#22c55e';
    else if (warnaBg.includes('brown')) hexColor = '#8B4513';

    return L.divIcon({
        className: 'bg-transparent border-none',
        html: `
            <div class="relative flex items-center justify-center drop-shadow-md" style="color: ${hexColor};">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10">
                    <circle cx="12" cy="9" r="3.5" fill="white" />
                    <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

function KameraPeta({ titikFokus }: { titikFokus: { lat: number; lng: number } | null }){
    const map = useMap();
    useEffect(() => {
        if(titikFokus){
            map.flyTo([titikFokus.lat, titikFokus.lng], 18, {
                animate: true,
                duration: 1.5
            });
        }
    }, [titikFokus, map]);
    return null;
}

interface SensorData {
    id: string;
    station: string;
    lat: number;
    lng: number;
    status: string;
    statusColor: string;
}

export default function EquipmentMap({ titikFokus, dataLokasi }: { titikFokus: { lat: number; lng: number } | null ; dataLokasi: SensorData[]; }) {
    const mapCenter: [number, number] = [-7.187153, 107.284926];
    return (
        <div className="w-full h-full z-0 relative overflow-hidden">
            <MapContainer center={mapCenter} zoom={18} maxZoom={21} scrollWheelZoom={false} touchZoom={true} className="w-full h-full z-0">
                <TileLayer attribution='&copy; <a href="https://www.esri.com/">Esri</a>' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={21} maxNativeZoom={18}/>
                <KameraPeta titikFokus={titikFokus}/>
                {dataLokasi.map((device) => (
                    <Marker key={device.id} position={[device.lat, device.lng]} icon={getClassicPin(device.statusColor)}>
                        <Popup>
                            <div className="flex flex-col gap-1">
                                <span className={`text-[10px] text-white px-2 py-1 rounded-full font-bold w-fit ${device.statusColor}`}>{device.status}</span>
                                <span className="font-bold text-[#0B592F]">{device.station}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}