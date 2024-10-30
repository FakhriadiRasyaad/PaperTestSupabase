"use client"; 

import supabase from '../components/SupabaseClient'; 
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../assets/standby.png';
import foto from '../assets/bayi.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        router.push('/login'); // Redirect to home if user is already logged in
      }
    };

    checkUser();
  }, [router]);
  
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      document.cookie = `token=${session?.access_token}; path=/;`;
      router.push('/home');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${foto.src})` }}>
      </div>

      <nav className="bg-white shadow-md p-4 relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image 
              src={logo.src}
              alt="Stanby Logo" 
              className="h-8 w-8 mr-2" 
            />
            <h1 className="text-lg font-bold text-red-400">StandBy</h1>
          </div>
          <button 
            onClick={() => setIsLoginVisible(!isLoginVisible)} 
            className="text-red-500 hover:underline">
            Login
          </button>
        </div>
      </nav>
      <div className="relative z-10 flex justify-center items-center flex-1">
             <h1 className="text-4xl font-bold text-red-800">Selamat Datang!</h1>
          </div>

      {isLoginVisible && (
        <div className="flex items-center justify-center flex-1 relative z-10">
          <div className="bg-white shadow-md rounded-lg p-8 w-96">
            <h2 className="text-3xl font-bold text-center text-red-800 mb-6">Login</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleLogin} 
              className="bg-[#E3383A] text-white rounded-lg p-2 w-full hover:bg-red-700 transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      )}

     
      <div className="relative z-10 p-8">
        <h2>standbyincubator@gmail.com</h2>
        <h2>standby123</h2>
        <h2>fakhriadi06ras@gmail.com</h2>
        <h2>qwerty12345</h2>
      </div>
    </div>
  );
};

export default LoginPage;



