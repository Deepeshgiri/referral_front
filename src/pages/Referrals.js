import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import DialogBox from '../components/DialogBox';
import '../App.css';
import { apiCaller } from '../utils/Apis';
import { useLoading } from '../context/LoadingContext';

const Referrals = () => {
  const { setLoading } = useLoading();
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [referralStats, setReferralStats] = useState(null);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        setLoading(true);
        const response = await apiCaller.get('/api/referrals/list', setLoading);

        // Transform the backend response to match the expected structure
        const transformedData = {
          directReferrals: response.data.details.totalReferrals,
          networkSize: response.data.details.totalReferrals, // Assuming network size is the same as total referrals
          totalEarnings: response.data.details.pointsEarned,
          network: response.data.network.map((member) => ({
            id: member.referred_id, // Use referred_id as a placeholder for ID
            firstName: member.first_name, // Placeholder since firstName is not provided
            lastName: member.last_name, // Placeholder since lastName is not provided
            points: member.points, // Placeholder since email is not provided
            level: member.stage,
            active:member.active_status
          })),
        };

        setReferralStats(transformedData);
      } catch (error) {
        setError('Error fetching referral stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralStats();
  }, [setLoading]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className={`p-6 ${theme === 'dark' ? 'text-white' : ''}`}>
      <h1 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-800' : ''}`}>Your Referral Network</h1>

      {referralStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-2">Direct Referrals</h3>
            <p className="text-3xl font-bold text-blue-600">{referralStats.directReferrals}</p>
          </div>
          <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-2">Network Size</h3>
            <p className="text-3xl font-bold text-green-600">{referralStats.networkSize}</p>
          </div>
          <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-purple-600">${referralStats.totalEarnings}</p>
          </div>
        </div>
      )}

      {referralStats?.network && referralStats.network.length > 0 && (
        <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Your Network</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                <th className="px-4 py-2">S.No</th>

                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">current Points</th>
                  <th className="px-4 py-2">Level</th>
                  <th className="px-4 py-2">Active Status</th>

                </tr>
              </thead>
              <tbody>
                {referralStats.network.map((member, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}` : ''}
                  >
                    <td className="px-4 py-2">{index+1}</td>
                    <td className="px-4 py-2">{`${member.firstName} ${member.lastName}`}</td>
                    <td className="px-4 py-2">{member.points}</td>
                    <td className="px-4 py-2">Level {member.level}</td>
                    <td className="px-4 py-2">{member.active ===1? "Active":"Inactive"}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDialog && (
        <DialogBox
          message={dialogMessage}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default Referrals;