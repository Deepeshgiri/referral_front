import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { constant } from '../Constant';
import { AuthContext } from '../context/AuthContext';

const Rewards = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [userStage, setUserStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user stage
        const stageResponse = await fetch(`${constant.api}/api/stage/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const stageData = await stageResponse.json();
        
        if (stageResponse.ok) {
          setUserStage(stageData);
          
          // Check stage progress
          await fetch(`${constant.api}/api/stage/check-progress/${user.id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
        } else {
          setError(stageData.message);
        }
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className={`p-6 ${theme === 'dark' ? 'text-white' : ''}`}>
      <h1 className="text-2xl font-bold mb-6">Rewards & Progress</h1>

      {userStage && (
        <div className={`p-6 rounded-lg shadow mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Current Stage: {userStage.stage}</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Stage Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="font-medium">Direct Referrals</p>
                <div className="flex justify-between mt-2">
                  <span>Current: {userStage.requirements?.directReferrals?.current || 0}</span>
                  <span>Required: {userStage.requirements?.directReferrals?.required || 0}</span>
                </div>
                {userStage.requirements?.directReferrals?.met && (
                  <div className="mt-2 text-green-500">✓ Requirement met!</div>
                )}
              </div>
              <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="font-medium">Points</p>
                <div className="flex justify-between mt-2">
                  <span>Current: {userStage.requirements?.points?.current || 0}</span>
                  <span>Required: {userStage.requirements?.points?.required || 0}</span>
                </div>
                {userStage.requirements?.points?.met && (
                  <div className="mt-2 text-green-500">✓ Requirement met!</div>
                )}
              </div>
            </div>
          </div>

          {userStage.nextStageRequirements && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Next Stage Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className="font-medium">Direct Referrals</p>
                  <p className="mt-2">Required: {userStage.nextStageRequirements.directReferrals}</p>
                </div>
                <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className="font-medium">Points</p>
                  <p className="mt-2">Required: {userStage.nextStageRequirements.points}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rewards;