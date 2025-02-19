import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { apiCaller } from '../utils/Apis';

const Rewards = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const data = await apiCaller.get('/rewards');
        const activeRewards = data.data.filter(reward => reward.is_active === 1);
        setRewards(activeRewards);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      }
    };

    const fetchReferrals = async () => {
      try {
        const data = await apiCaller.get('/api/referrals/list');
        setReferralData(data.data);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
    fetchReferrals();
  }, []);

  const getProgress = (current, required) => Math.min((current / required) * 100, 100);

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'text-white bg-gray-900' : 'bg-gray-100'}`}>
      <h1 className="text-2xl font-bold mb-6 text-center">Rewards & Progress</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : referralData ? (
        <>
          {/* User Progress */}
          <div className="p-6 rounded-lg shadow-lg mb-8 bg-white/30 dark:bg-gray-800/30 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white text-center">
              Current Stage: {referralData.details.currentStage} (Stage {referralData.details.stageId}/{referralData.details.stageCount})
            </h2>

            
          </div>

          {/* Referral Network */}
          <h3 className="text-lg font-semibold mt-6 text-center">Your Network</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {referralData.network.map((person) => (
              <div key={person.id} className="p-4 rounded-lg shadow-lg bg-white/40 dark:bg-gray-700/40 border border-white/10 text-center">
                <h4 className="font-semibold">{person.first_name} {person.last_name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Stage: {person.stage}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Points: {person.points}</p>
              </div>
            ))}
          </div>

          {/* Rewards Section */}
          <h3 className="text-lg font-semibold mt-6 text-center">Available Rewards</h3>
          {rewards.length === 0 ? (
            <p className="text-center mt-4">No active rewards available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {rewards.map((reward) => {
                const progress = getProgress(referralData.details.pointsEarned, reward.points_required);
                return (
                  <div key={reward.id} className="relative p-4 rounded-lg shadow-lg bg-white/40 dark:bg-gray-700/40 border border-white/10 text-center">
                    <img src={reward.image_url} alt={reward.name} className="w-20 h-20 mx-auto rounded-lg object-cover" />
                    <h4 className="mt-2 font-semibold">{reward.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{reward.description || 'No description available'}</p>

                    <div className="relative w-full h-4 bg-gray-300 rounded-full mt-3 overflow-hidden">
                      <div className="h-full transition-all duration-500 bg-blue-500" style={{ width: `${progress}%` }}></div>
                    </div>

                    <button
                      className={`mt-3 px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${progress === 100 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                      disabled={progress < 100}
                    >
                      Please contact to Redeem
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <p className="text-center mt-4 text-red-500">Failed to load referral data.</p>
      )}
    </div>
  );
};

export default Rewards;
