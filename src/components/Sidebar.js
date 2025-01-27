import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons from React Icons

const Sidebar = ({ isAdmin = false }) => {
  const { theme } = useContext(ThemeContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Admin-specific sidebar content
  const adminSidebarContent = (
    <ul className=''>
      <li className="mb-4">
        <Link
          to="/admin/dashboard"
          className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          Admin Dashboard
        </Link>
      </li>
      <li className="mb-4">
        <Link
          to="/admin/users"
          className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          Manage Users
        </Link>
      </li>
      <li className="mb-4">
        <Link
          to="/admin/settings"
          className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          Admin Settings
        </Link>
      </li>
    </ul>
  );

  // Normal user-specific sidebar content
  const userSidebarContent = (
    <ul className='h-screen'>
      <li className="mb-4">
        <Link
          to="/"
          className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          Dashboard
        </Link>
      </li>
      <li className="mb-4">
        <Link
          to="/referrals"
          className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          Referrals
        </Link>
      </li>
      <li className="mb-4">
        <Link
          to="/rewards"
          className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          Rewards
        </Link>
      </li>
      <li className="mb-4">
        <Link
          to="/settings"
          className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          Settings
        </Link>
      </li>
    </ul>
  );

  // Determine which sidebar content to display
  const sidebarContent = isAdmin ? adminSidebarContent : userSidebarContent;

  return (
    <div>
      {/* Hamburger Icon for Small Screens */}
      <button
        className="md:hidden text-2xl p-2"
        onClick={toggleDrawer}
        aria-label="toggle menu"
      >
        {isDrawerOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar for Larger Screens */}
      <aside
        className={`hidden md:block w-64 p-4 h-screen ${
          theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 text-white'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Drawer for Small Screens */}
      {isDrawerOpen && (
        <div
          className={`fixed top-0 left-0 w-64  p-4 h-screen ${
            theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 text-white'
          } z-50`}
        >
          <button
            className="text-2xl p-2"
            onClick={toggleDrawer}
            aria-label="close menu"
          >
            <FaTimes />
          </button>
          {sidebarContent}
        </div>
      )}
    </div>
  );
};

export default Sidebar;