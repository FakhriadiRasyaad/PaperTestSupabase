import React, { useEffect, useState } from 'react';
import supabase from '../components/SupabaseClient';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SensorData {
  created_at: string;
  ds18b20_temp1: number;
  ds18b20_temp2: number;
  ds18b20_temp3: number;
  ds18b20_temp4: number;
  dht22_temp: number;
  dht22_humi: number;
  fan_status: string;
  flow_rate: number;
  sound_detected: string;
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
    ds18b20_temp2: 0,
    ds18b20_temp3: 0,
    ds18b20_temp4: 0,
    dht22_temp: 0,
    dht22_humi: 0,
    fan_status: 'Off',
    flow_rate: 0,
    sound_detected: 'Sunyi',
  };

  const chartData = {
    labels: data.map(item => item.created_at),
    datasets: [
      {
        label: 'DS18B20 Temperature1 (°C)',
        data: data.map(item => item.ds18b20_temp1),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'DS18B20 Temperature2 (°C)',
        data: data.map(item => item.ds18b20_temp2),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'DS18B20 Temperature3 (°C)',
        data: data.map(item => item.ds18b20_temp3),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'DS18B20 Temperature4 (°C)',
        data: data.map(item => item.ds18b20_temp4),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'DHT22 Temperature (°C)',
        data: data.map(item => item.dht22_temp),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'DHT22 Humidity (%)',
        data: data.map(item => item.dht22_humi),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Flow Rate',
        data: data.map(item => item.flow_rate),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };
  const chartDatas = {
    labels: data.map(item => item.created_at),
    datasets: [
      {
        label: 'DHT22 Humidity (°C)',
        data: data.map(item => item.dht22_temp),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'DHT22 Temperature (°C)',
        data: data.map(item => item.dht22_humi),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Flow (%)',
        data: data.map(item => item.flow_rate),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };


  const convertToCSV = (jsonData: SensorData[]) => {
    const headers = ['Created at', 'DS18B20 Temp1 (°C)', 'DS18B20 Temp2 (°C)', 'DS18B20 Temp3 (°C)', 'DS18B20 Temp4 (°C)', 'DHT22 Temp (°C)', 'DHT22 Humidity (%)', 'Fan Status', 'Sound Detected', 'Flow Rate'];
    const csvRows = [headers.join(',')];

    jsonData.forEach((item) => {
      const row = [
        item.created_at,
        item.ds18b20_temp1,
        item.ds18b20_temp2,
        item.ds18b20_temp3,
        item.ds18b20_temp4,
        item.dht22_temp,
        item.dht22_humi,
        item.fan_status,
        item.sound_detected,
        item.flow_rate,
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'esp32_data.csv');
    a.click();
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
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded ${activeSource === 'esp32_duplicate' ? 'font-bold' : ''}`}
                onClick={() => setActiveSource('esp32_duplicate')}
              >
                Source B (ESP32 Duplicate)
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">DS18B20 Temperature1</h4>
                <p className="text-3xl font-bold text-teal-600">{latestData.ds18b20_temp1}°C</p>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">DS18B20 Temperature2</h4>
                <p className="text-3xl font-bold text-teal-600">{latestData.ds18b20_temp2}°C</p>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">DS18B20 Temperature3</h4>
                <p className="text-3xl font-bold text-teal-600">{latestData.ds18b20_temp3}°C</p>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">DS18B20 Temperature4</h4>
                <p className="text-3xl font-bold text-teal-600">{latestData.ds18b20_temp4}°C</p>
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
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">Flow Rate</h4>
                <p className="text-3xl font-bold text-orange-600">{latestData.flow_rate}</p>
              </div>
              <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded-lg">
                <h4 className="font-medium">Sound Detected</h4>
                <p className="text-3xl font-bold text-red-600">{latestData.sound_detected}</p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 w-full h-96">
            <h3 className="text-xl font-semibold mb-4">Temperature Chart</h3>
            <div className="overflow-x-auto">
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 w-full h-96">
            <h3 className="text-xl font-semibold mb-4">DHT22 Chart</h3>
            <div className="overflow-x-auto">
              <Bar data={chartDatas} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>



          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Data Table</h3>
            <div className="overflow-x-auto">
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              onClick={downloadCSV}>
              Download CSV
            </button>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created at</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DS18B20 Temp1</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DS18B20 Temp2</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DS18B20 Temp3</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DS18B20 Temp4</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DHT22 Temp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DHT22 Humidity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fan Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sound Detected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flow Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr key={item.created_at}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.created_at}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.ds18b20_temp1}°C</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.ds18b20_temp2}°C</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.ds18b20_temp3}°C</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.ds18b20_temp4}°C</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.dht22_temp}°C</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.dht22_humi}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.fan_status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.sound_detected}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.flow_rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
