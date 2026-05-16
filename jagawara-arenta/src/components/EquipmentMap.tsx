"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconShadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

export default function EquipmentMap() {
    // Format: [Latitude, Longitude]
    const mapCenter: [number, number] = [-7.187153, 107.284926]; 
    const devices = [                   // dummy
        { id: 1, name: "Kantor Kepala Desa Cipelah", location: [-7.187398, 107.283043] },
        { id: 2, name: "Curug Cipelah", location: [-7.195821, 107.261151] },
    ];

    return (
        <div className="w-full h-[400px] xl:h-[500px] z-0 relative overflow-hidden">
            <MapContainer center={mapCenter} zoom={18} maxZoom={21} scrollWheelZoom={false} touchZoom={true} className="w-full h-full z-0">
                <TileLayer attribution='&copy; <a href="https://www.esri.com/">Esri</a>' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={21} maxNativeZoom={18}/>
                {devices.map((device) => (
                    <Marker key={device.id} position={device.location as [number, number]} icon={customIcon}>
                        <Popup>
                            <span className="font-bold text-[#0B592F]">{device.name}</span> <br /> 
                            <span className="text-xs text-gray-600">Klik tombol di bawah untuk detail.</span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}