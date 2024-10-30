import React from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import foto from '../../assets/Foto.jpg';
import Image from 'next/image';

const AboutUs: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <p className="text-lg text-center mb-10">
          Lorem kepsum terkesum kesum
          </p>
        <h2 className="text-3xl font-semibold text-center mb-6">Our Mission</h2>
        <p className="text-lg text-center mb-10">
        Lorem kepsum terkesum kesum
        </p>

        <h2 className="text-3xl font-semibold text-center mb-6">Our Vision</h2>
        <p className="text-lg text-center mb-10">
        Lorem kepsum terkesum kesum
        </p>

        <h2 className="text-3xl font-semibold text-center mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image src={foto.src} alt="Team Member 1" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold">Suryo Adhi Wibowo</h3>
              <p className="text-gray-600">Supervising Lecturer</p>
              <p className="mt-2">
                SAO
              </p>
            </div>
          </div>
   
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image src={foto.src} alt="Team Member 1" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold">Sadam Al Rasyid</h3>
              <p className="text-gray-600">IoT and Backend Developer for StandBy</p>
              <p className="mt-2">
                1101210112
              </p>
            </div>
          </div>

      
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image src={foto.src} alt="Team Member 1" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold">Reynaldhi Tryana Graha</h3>
              <p className="text-gray-600">Mobile Application Developer for StandBy</p>
              <p className="mt-2">
              1101213117
              </p>
            </div>
          </div>

       
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image src={foto.src} alt="Team Member 1" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold">Fakhriadi Rasyaad</h3>
              <p className="text-gray-600">Frontend Developer for StandBy</p>
              <p className="mt-2">
              1101210301
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
           <Image src={foto.src} alt="Team Member 1" className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold">Marshaniswah Syamsul </h3>
              <p className="text-gray-600">Artificial Intelligence Developer for StandBy</p>
              <p className="mt-2">
                1101210153
              </p>
            </div>
          </div>
        </div>
        <div className="mt-20"> {/* Margin above the footer */}
        <Footer />
      </div>
      </div>
    </div>
  );
};

export default AboutUs;
