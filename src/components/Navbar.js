import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav
      className={`p-4 shadow-md ${
        theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className=' container flex justify-start items-center'>
        <img src="/assets/images/website/logo.png" alt="Logo" className="h-12 w-12 m-0" />
        <h1 className="text-2xl font-bold"> <u className=' animate-pulse font-extrabold'>MS TAX</u> Referral</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;