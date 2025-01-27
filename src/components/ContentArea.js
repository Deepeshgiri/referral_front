import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { userData } from '../data';

const ContentArea = () => {
  const { theme } = useContext(ThemeContext);

  return (
   <>
    <main className={`flex-1 p-8 ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}`}>
      <h2 className="text-2xl font-bold mb-4">Referral Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
          <p className="text-lg font-semibold">Total Referrals</p>
          <p className="text-3xl">{userData.referrals.length}</p>
        </div>
        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
          <p className="text-lg font-semibold">Total Points</p>
          <p className="text-3xl">{userData.points}</p>
        </div>
        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
          <p className="text-lg font-semibold">Active Referrals</p>
          <p className="text-3xl">{userData.referrals.filter(ref => ref.points > 0).length}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Your Referrals</h2>
      <div className={`rounded-lg overflow-hidden shadow ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
        <table className="w-full">
          <thead>
            <tr className={`${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`}>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {userData.referrals.map((ref) => (
              <tr key={ref.id} className={`${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'}`}>
                <td className="p-3">{ref.name}</td>
                <td className="p-3">{ref.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
   </>
  );
};

export default ContentArea;