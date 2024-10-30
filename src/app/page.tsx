"use client";
import React, { useEffect, useState } from 'react';
import supabase from '../components/SupabaseClient';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SensorData {
  created_at: string;
  ds18b20_temp1: number;
  dht22_temp: number;
  dht22_humi: number;
  fan_status: string;
}

const Esp32Dashboard: React.FC = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [activeSource, setActiveSource] = useState<'esp32_1' | 'esp32_duplicate'>('esp32_1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: esp32Data, error: esp32Error } = await supabase
          .from('esp32_1')
          .select('*')
          .order('created_at', { ascending: true });

        if (esp32Error) throw esp32Error;

        const { data: esp32DuplicateData, error: esp32DuplicateError } = await supabase
          .from('esp32_duplicate')
          .select('*')
          .order('created_at', { ascending: true });

        if (esp32DuplicateError) throw esp32DuplicateError;

        setData(activeSource === 'esp32_1' ? esp32Data as SensorData[] : esp32DuplicateData as SensorData[]);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching data:', error.message);
          setError('Failed to fetch data: ' + error.message);
        } else {
          console.error('Unexpected error:', error);
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSource]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  const latestData = data.length > 0 ? data[data.length - 1] : {
    ds18b20_temp1: 0,
    dht22_temp: 0,
    dht22_humi: 0,
    fan_status: 'Off',
  };







  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Sensor Data</h3>
            <div className="flex space-x-4 mb-4">
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded ${activeSource === 'esp32_1' ? 'font-bold' : ''}`}
                onClick={() => setActiveSource('esp32_1')}
              >
                Source A (ESP32)
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">DS18B20 Temperature1</h4>
                <p className="text-3xl font-bold text-teal-600">{latestData.ds18b20_temp1}°C</p>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">DHT22 Temperature</h4>
                <p className="text-3xl font-bold text-pink-600">{latestData.dht22_temp}°C</p>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">DHT22 Humidity</h4>
                <p className="text-3xl font-bold text-blue-600">{latestData.dht22_humi}%</p>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">Fan Status</h4>
                <p className="text-3xl font-bold text-green-600">{latestData.fan_status}</p>
              </div>
            </div>
        </div>
       </div>
    </div>
  <Footer />
</div>
  );
};

export default Esp32Dashboard;
