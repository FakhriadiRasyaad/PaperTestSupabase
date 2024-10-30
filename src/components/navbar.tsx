import React, { useState } from 'react';
import Link from 'next/link';
import logo from '../assets/standby.png'; 
import Image from 'next/image';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage the hamburger menu

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the menu open/close state
  };

  return (
    <nav className="bg-[#E3383A] p-4 flex justify-between items-center">
      <Link href="/home" className="flex items-center">
        <div className="h-12 w-12 mr-2 rounded-full bg-white flex justify-center items-center">
          <Image 
            src={logo.src} 
            alt="StandBy Logo" 
            className="h-10 w-10 object-cover rounded-full" 
          />
        </div>
        <h1 className="text-white text-lg font-bold">StandBy</h1>
      </Link>

      <button 
        className="text-white md:hidden focus:outline-none" 
        onClick={toggleMenu}
      >
        {isOpen ? '✖' : '☰'} 
      </button>

      <ul className={`flex-col md:flex-row md:flex list-none m-0 p-0 space-y-4 md:space-y-0 md:space-x-4 absolute md:static bg-[#630000] md:bg-transparent transition-all duration-300 ease-in-out ${isOpen ? 'top-16 left-0 w-full' : 'top-[-100%]'} md:top-0`}>
        <li className="text-white text-center">
          <Link href="/monitor">Monitor</Link>
        </li>
        <li className="text-white text-center">
          <Link href="/home">Dokumen</Link>
        </li>
        <li className="text-white text-center">
          <Link href="/user">User</Link>
        </li>
        <li className="text-white text-center">
          <Link href="/profil">Profil</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
