"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../components/SupabaseClient';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
// import Image from 'next/image';

const SettingsPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if the user is logged in and fetch their profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, is_admin, avatar_url, updated_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setFullName(data.full_name);
          setEmail(data.email);
          setIsAdmin(data.is_admin);
          setAvatar(data.avatar_url);
          setCreatedAt(data.updated_at);
        }
      }
    };

    fetchUserProfile();
  }, [router]);

  // Upload avatar and return the signed URL
  const uploadAvatar = async (file: File) => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const fileName = `${timestamp}-${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`${fileName}`, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw new Error(`Failed to upload avatar: ${uploadError.message}`);
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(uploadData.path, 60 * 60 * 24 * 365 * 10);

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }

    return signedUrlData.signedUrl;
  };

  
  const handleUpdateAvatar = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      setError('User not found or not authenticated');
      return;
    }
  
    if (newAvatar) {
      try {
        const newAvatarUrl = await uploadAvatar(newAvatar);
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: newAvatarUrl })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error updating avatar:', error);
          setError(error.message);
        } else {
          // Update avatar in state
          setAvatar(newAvatarUrl);
          setError('');  // Clear any previous errors
        }
      } catch (err) {
        console.error('Error in handleUpdateAvatar:', err);
        // Check if err is an instance of Error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          // Handle unexpected error types
          setError('An unexpected error occurred');
        }
      }
    } else {
      setError('No avatar file selected.');
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Pengaturan Akun</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Avatar */}
        {avatar && (
          <img
            src={avatar} 
            alt="Avatar" 
            className="h-36 w-36 rounded-full mb-6 border-2 border-gray-300 shadow-md" 
          />
        )}

        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <p className="text-lg font-semibold">{fullName}</p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-lg font-semibold">{email}</p>
          </div>

          {/* Account Created Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Akun dibuat</label>
            <p className="text-lg font-semibold">{new Date(createdAt).toLocaleDateString('id-ID')}</p>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="text-lg font-semibold">{isAdmin ? 'Admin' : 'User'}</p>
          </div>

          {/* Change Avatar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ganti Avatar</label>
            <input
              type="file"
              onChange={(e) => setNewAvatar(e.target.files ? e.target.files[0] : null)}
              className="mt-2 border rounded p-2 w-full"
            />
            <button
              onClick={handleUpdateAvatar}
              className="bg-red-500 text-white rounded-lg p-2 w-full hover:bg-red-800 mt-4 transition duration-200"
            >
              Update Avatar
            </button>
          </div>
        </div>
        <div className="mt-20"> {/* Margin above the footer */}
        <Footer />
      </div>
      </div>
    </div>
  );
};

export default SettingsPage;
