import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Botpress: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const loadBotpress = () => {
      const script = document.createElement('script');
      script.src = "https://cdn.botpress.cloud/webchat/v2.1/inject.js";
      script.async = true;
      document.body.appendChild(script);

      const configScript = document.createElement('script');
      configScript.src = "https://mediafiles.botpress.cloud/abf73d59-de68-4f12-993a-aafd25b94f9a/webchat/v2.1/config.js";
      configScript.async = true;
      document.body.appendChild(configScript);
    };

    // Memuat skrip hanya jika di halaman yang diinginkan
    if (router.pathname === '/home' || router.pathname === '/monitor') {
      loadBotpress();
    }

    return () => {
      // Hapus skrip ketika berpindah halaman
      const scripts = document.querySelectorAll('script[src="https://cdn.botpress.cloud/webchat/v2.1/inject.js"], script[src="https://mediafiles.botpress.cloud/abf73d59-de68-4f12-993a-aafd25b94f9a/webchat/v2.1/config.js"]');
      scripts.forEach(script => script.remove());
    };
  }, [router.pathname]); // Menambahkan router.pathname ke dalam dependency array

  return null; // Tidak mengembalikan JSX apapun
};

export default Botpress;
