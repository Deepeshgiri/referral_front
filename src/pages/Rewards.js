import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Rewards = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  
  const [userStage, setUserStage] = useState({
    stage: 'Bronze',
    requirements: {
      directReferrals: { current: 3, required: 5, met: false },
      points: { current: 20, required: 40, met: false }
    },
    nextStageRequirements: { directReferrals: 10, points: 80 }
  });

  const getProgress = (current, required) => Math.min((current / required) * 100, 100);

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'text-white bg-gray-900' : 'bg-gray-100'}`}>
      <h1 className="text-2xl font-bold mb-6 text-center">Rewards & Progress</h1>

      <div className={`p-6 rounded-lg shadow-lg mb-8 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/10`}> 
        <h2 className="text-xl font-semibold mb-4 text-center">Current Stage: {userStage.stage}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(userStage.requirements).map(([key, { current, required }]) => (
            <div key={key} className="p-4 rounded-lg shadow-md bg-gray-50/40 dark:bg-gray-700/40 border border-white/10 backdrop-blur-lg">
              <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 shadow-md shadow-green-500 animate-pulse"
                  style={{ width: `${getProgress(current, required)}%` }}
                ></div>
                <div className="absolute inset-0 bg-white/10 rounded-full blur-md"></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Current: {current}</span>
                <span>Required: {required}</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-6 text-center">Rewards</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {[40, 80, 120].map((points, index) => {
            const progress = getProgress(userStage.requirements.points.current, points);
            return (
              <div key={index} className="relative p-4 rounded-lg shadow-lg bg-white/40 dark:bg-gray-700/40 border border-white/10 backdrop-blur-lg text-center">
                <div className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500 ${progress === 100 ? 'opacity-100' : 'opacity-50'}`}>🎁</div>
                <p className="mt-2">Reward {index + 1}</p>
                <div className="relative w-full h-4 bg-gray-300 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-blue-500 shadow-blue-500' : 'bg-yellow-500 shadow-yellow-500'} animate-pulse`}
                    style={{ width: `${progress}%` }}
                  ></div>
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-md"></div>
                </div>
                <button
                  className={`mt-3 px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${progress === 100 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                  disabled={progress < 100}
                >
                  Redeem
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Rewards;