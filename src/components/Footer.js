import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className={`p-4 ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-900 text-white'}`}>
      <div className="container mx-auto text-center">
        <p>&copy; 2025 MSTAX Referral Dashboard. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;