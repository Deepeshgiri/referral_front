import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { apiCaller } from '../../utils/Apis';

const Rewards = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newReward, setNewReward] = useState({ name: '', points_required: 0, min_ref: 0, description: '', image_url: '', is_active: true });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/rewards');
      setRewards(response.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReward = async () => {
    try {
      setLoading(true);
      await apiCaller.post('/rewards', newReward);
      fetchRewards();
      setNewReward({ name: '', points_required: 0, min_ref: 0, description: '', image_url: '', is_active: true });
    } catch (error) {
      console.error('Error adding reward:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReward = async (id) => {
    try {
      setLoading(true);
      await apiCaller.delete(`/rewards/${id}`);
      fetchRewards();
    } catch (error) {
      console.error('Error deleting reward:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'text-white bg-gray-900' : 'bg-gray-100'}`}>
      <h1 className="text-2xl font-bold mb-6 text-center">Rewards & Progress</h1>
      
      <div className="p-6 rounded-lg shadow-lg mb-8 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/10"> 
        <h3 className="text-lg font-semibold mb-4 text-center">Add New Reward</h3>
        <div className="flex flex-col items-center gap-4">
          <input type="text" placeholder="Reward Name" value={newReward.name} onChange={(e) => setNewReward({ ...newReward, name: e.target.value })} className="p-2 border rounded-lg w-64" />
          <input type="number" placeholder="Points Required" value={newReward.points_required} onChange={(e) => setNewReward({ ...newReward, points_required: e.target.value })} className="p-2 border rounded-lg w-64" />
          <input type="number" placeholder="Min Referrals" value={newReward.min_ref} onChange={(e) => setNewReward({ ...newReward, min_ref: e.target.value })} className="p-2 border rounded-lg w-64" />
          <input type="text" placeholder="Description" value={newReward.description} onChange={(e) => setNewReward({ ...newReward, description: e.target.value })} className="p-2 border rounded-lg w-64" />
          <input type="text" placeholder="Image URL" value={newReward.image_url} onChange={(e) => setNewReward({ ...newReward, image_url: e.target.value })} className="p-2 border rounded-lg w-64" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={newReward.is_active} onChange={(e) => setNewReward({ ...newReward, is_active: e.target.checked })} /> Active
          </label>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleAddReward}>Add Reward</button>
        </div>
      </div>
      
      <div className="p-6 rounded-lg shadow-lg backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/10"> 
        <h2 className="text-xl font-semibold mb-4 text-center">Available Rewards</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-white/10">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 border border-white/10">Name</th>
                <th className="p-2 border border-white/10">Points Required</th>
                <th className="p-2 border border-white/10">Min Referrals</th>
                <th className="p-2 border border-white/10">Description</th>
                <th className="p-2 border border-white/10">Image</th>
                <th className="p-2 border border-white/10">Active</th>
                <th className="p-2 border border-white/10">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.id} className="bg-white dark:bg-gray-800">
                  <td className="p-2 border border-white/10">{reward.name}</td>
                  <td className="p-2 border border-white/10">{reward.points_required}</td>
                  <td className="p-2 border border-white/10">{reward.min_ref}</td>
                  <td className="p-2 border border-white/10">{reward.description}</td>
                  <td className="p-2 border border-white/10"><img src={reward.image_url} alt={reward.name} className="w-16 h-16 object-cover" /></td>
                  <td className="p-2 border border-white/10">{reward.is_active ? 'Yes' : 'No'}</td>
                  <td className="p-2 border border-white/10">
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg" onClick={() => handleDeleteReward(reward.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rewards;