import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 15;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('titik_koordinat')
      .select(`
        id,
        node_id,
        nama_lokasi,
        latitude,
        longitude,
        sensor_data (
          status,
          curah_hujan,
          kelembapan,
          kemiringan,
          getaran,
          baterai,
          status_daya,
          created_at
        )
      `)
      .eq('kategori', 'EWS')
      .order('created_at', { referencedTable: 'sensor_data', ascending: false })
      .limit(1, { referencedTable: 'sensor_data' });

    if (error) throw error;

    const formattedData = data.map((titik: any) => {
      const latestSensor = titik.sensor_data && titik.sensor_data.length > 0 
        ? titik.sensor_data[0] 
        : null;

      const statusAlat = latestSensor ? latestSensor.status.toUpperCase() : 'OFFLINE';
      let statusColor = 'bg-gray-400';
      if (statusAlat === 'NORMAL') statusColor = 'bg-[#8CA70A]';
      else if (statusAlat === 'WASPADA') statusColor = 'bg-[#EEB627]';
      else if (statusAlat === 'SIAGA') statusColor = 'bg-[#DF6F3B]';
      else if (statusAlat === 'AWAS') statusColor = 'bg-[#FF1100]';

      return {
        id: titik.node_id,
        station: titik.nama_lokasi,
        lat: titik.latitude,
        lng: titik.longitude,
        status: statusAlat,
        statusColor: statusColor,
        battery: latestSensor ? latestSensor.baterai : 0,
        batteryStatus: latestSensor && latestSensor.status_daya ? latestSensor.status_daya : "Discharge",
        curah_hujan: latestSensor ? latestSensor.curah_hujan : 0,
        kelembapan: latestSensor ? latestSensor.kelembapan : 0,
        kemiringan: latestSensor ? latestSensor.kemiringan : 0,
        getaran: latestSensor ? latestSensor.getaran : 0,
        last_update: latestSensor ? latestSensor.created_at : null,
      };
    });

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("Gagal menarik data live:", error.message);
    return NextResponse.json({ message: 'Gagal mengambil data', error: error.message }, { status: 500 });
  }
}   