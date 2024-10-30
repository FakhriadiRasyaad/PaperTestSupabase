import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Botpress from '../components/botpress';
import logo from '../assets/standby.png';
import DisplayPDFs from '../components/displaypdf';
import Image from 'next/image';

const HomePage: React.FC = () => {
  const [tableData, setTableData] = useState(
    Array.from({ length: 10 }, () => Array(2).fill(''))
  );

  const keteranganData = [
    "Data Proses",
    "Data di Perjalanan",
    "Data Rusak",
    "Data Baru Diperbarui",
    "Data Pending",
    "Data Terkirim",
    "Data Valid",
    "Data Tidak Valid",
    "Data Dalam Proses Verifikasi",
    "Data Selesai"
  ];

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <Botpress />
      <DisplayPDFs />
      <main className="flex-1 p-4 md:p-8">
        <div className="mt-8 mb-10 relative" id="printableArea">
          <div className="letterhead flex items-center justify-between mb-0.5">
            <Image src={logo.src} alt="Logo" className="w-32 md:w-40 mr-4" />
            <div className="flex-grow text-center">
              <h1 className="text-xl font-bold">TEST REPORT</h1>
            </div>
          </div>
          <hr className="mt-0 mb-2 w-full border-t-2 border-gray-300" />
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">No. Lab :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan No. Lab"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">Nama Produk :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan Nama Produk"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">Model :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan Model"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <p className="text-sm font-bold text-gray-700">Referensi : SNI IEC 60601-1:2024</p>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">Author :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan Author"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 w-1/3">No. Serial :</label>
                  <input
                    type="text"
                    className="p-1 rounded w-2/3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Masukkan No. Serial"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <p className="text-sm font-bold text-gray-700">
                    Tanggal Uji: {new Date().toLocaleString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-lg rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">NO</th>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">KETERANGAN</th>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">PENJELASAN</th>
                  <th className="px-2 md:px-4 py-2 border border-gray-300">HASIL</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((rowData, rowIndex) => (
                  <tr key={rowIndex} className="text-center hover:bg-gray-100 transition duration-150">
                    <td className="px-2 md:px-4 py-2 border border-gray-300">{rowIndex + 1}</td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300">{keteranganData[rowIndex]}</td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300">
                      <textarea
                        className="w-full p-2 bg-transparent border-none resize-y placeholder-gray-400 focus:outline-none focus:ring-0"
                        value={rowData[0]}
                        onChange={(e) => handleInputChange(rowIndex, 0, e.target.value)}
                        placeholder="Masukan Data"
                        rows={2}
                        style={{ minHeight: '50px' }}
                      />
                    </td>
                    <td className="px-2 md:px-4 py-2 border border-gray-300">
                      <select
                        className="w-full p-2 bg-transparent border-none appearance-none rounded focus:outline-none focus:ring-0"
                        value={rowData[1]}
                        onChange={(e) => handleInputChange(rowIndex, 1, e.target.value)}
                      >
                        <option value="">Pilih...</option>
                        <option value="P">P</option>
                        <option value="L">L</option>
                        <option value="NC">NC</option>
                        <option value="NA">NA</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default HomePage;
