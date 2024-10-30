// pages/home.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../components/SupabaseClient';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
// import Image from 'next/image';

const ProfilPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({ full_name: '', avatar_url: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login'); 
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          setError('Error fetching profile');
        } else {
          setProfile({
            full_name: data?.full_name || 'User',
            avatar_url: data?.avatar_url || '/default-avatar.png', // Default avatar if none
          });
        }
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    router.push('/login');
  };

  const handleSettings = () => {
    router.push('/profil/setting'); // Redirect to settings page
  };

  const handleAboutUs = () => {
    router.push('/profil/about'); // Redirect to About Us page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-md w-full">
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-36 h-36 rounded-full mb-4 object-cover border-2 border-gray-300"
          />
          <h2 className="text-2xl font-bold mb-4 text-center">{profile.full_name}</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex flex-col space-y-2 w-full">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={handleSettings}
            >
              Settings
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={handleAboutUs}
            >
              About Us
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilPage;
