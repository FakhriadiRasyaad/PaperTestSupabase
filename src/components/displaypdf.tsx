"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../components/SupabaseClient';

const DisplayPDFs = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPDF = async () => {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login'); 
        return;
      }


      const { data, error: pdfError } = await supabase
        .from('profiles')
        .select('document_url') 
        .eq('id', user.id) 
        .single(); 

      if (pdfError) {
        setError('Error fetching document');
      } else {
        setPdfUrl(data?.document_url || null);
      }
    };

    fetchPDF();
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Document</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {pdfUrl ? (
          <div className="w-full overflow-hidden"> 
            <embed
              src={pdfUrl}
              className="w-full h-[600px] border rounded" 
              title="User Document"
              type="application/pdf"
            />
            <button
            onClick={() => window.open(pdfUrl, '_blank')}
            className="text-white bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
            Download PDF
            </button>
          </div>
        ) : (
          <p className="text-gray-600">No document available for your account.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayPDFs;
