import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { apiCaller } from '../../utils/Apis';

const Rewards = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    points_required: 0,
    min_ref: 0,
    description: '',
    image_url: '',
    is_active: true,
  });
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewReward({ ...newReward, image_url: file }); // Storing the file itself for upload
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleAddReward = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append the new reward data to FormData
      formData.append('name', newReward.name);
      formData.append('points_required', newReward.points_required);
      formData.append('min_ref', newReward.min_ref);
      formData.append('description', newReward.description);
      formData.append('is_active', newReward.is_active);
      
      // Append the image file
      if (newReward.image_url) {
        formData.append('image', newReward.image_url);  // 'image' is the key that your backend expects
      }
      
      // Send the request with FormData
      await apiCaller.post('/rewards', formData,setLoading(true));
      fetchRewards();
      
      // Reset the state after successful submission
      setNewReward({
        name: '',
        points_required: 0,
        min_ref: 0,
        description: '',
        image_url: '',
        is_active: true,
      });
      setImagePreview(null);
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
      <h1 className="text-3xl font-bold mb-6 text-center">Rewards & Progress</h1>
      
      <div className="p-6 rounded-lg shadow-lg mb-8 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/10"> 
        <h3 className="text-xl font-semibold mb-4 text-center">Add New Reward</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['name', 'points_required', 'min_ref', 'description'].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm font-semibold capitalize">{field.replace('_', ' ')}</label>
              <input 
                type={field.includes('points') || field.includes('min_ref') ? 'number' : 'text'}
                value={newReward[field]}
                onChange={(e) => setNewReward({ ...newReward, [field]: e.target.value })}
                className="p-2 border rounded-lg w-full"/>
            </div>
          ))}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="p-2 border rounded-lg" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold">Active</label>
            <input type="checkbox" checked={newReward.is_active} onChange={(e) => setNewReward({ ...newReward, is_active: e.target.checked })} />
          </div>
        </div>
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full" onClick={handleAddReward}>
          Add Reward
        </button>
      </div>

      <div className="p-6 rounded-lg shadow-lg backdrop-blur-md bg-white/30"> 
        <h2 className="text-xl font-semibold mb-4 text-center">Available Rewards</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-white/10">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                {['Name', 'Points Required', 'Min Referrals', 'Description', 'Image', 'Active', 'Actions'].map((head, index) => (
                  <th key={index} className="p-2 border border-white/10">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.id} className="bg-white">
                  <td className="p-2 border">{reward.name}</td>
                  <td className="p-2 border">{reward.points_required}</td>
                  <td className="p-2 border">{reward.min_ref}</td>
                  <td className="p-2 border">{reward.description}</td>
                  <td className="p-2 border"><img src={reward.image_url} alt={reward.name} className="w-16 h-16 object-cover rounded" /></td>
                  <td className="p-2 border">{reward.is_active ? "yes" : "no"}</td>
                  <td className="p-2 border text-center">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg" onClick={() => handleDeleteReward(reward.id)}>
                      Delete
                    </button>
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
