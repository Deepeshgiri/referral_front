// DialogBox.js
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const DialogBox = ({ message, onClose }) => {

    const {theme} = useContext(ThemeContext);
 
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className={`${theme ==="light"? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg max-w-sm w-full`}>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className={`${theme ==="light" ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DialogBox;