import React, { useState, useEffect } from 'react';
import { apiCaller } from '../../utils/Apis'; // Import the ApiCaller class


const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('stages');
  const [stages, setStages] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [criteria, setCriteria] = useState([]);

  const [newStage, setNewStage] = useState('');
  const [newReward, setNewReward] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch stages, rewards, and criteria from the API
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        setLoading(true);
        const stageData = await apiCaller.get('/api/admin/stages');
        const rewardData = await apiCaller.get('/api/admin/rewards');
        const criteriaData = await apiCaller.get('/api/admin/criteria');
        
        setStages(stageData.stages);
        setRewards(rewardData.rewards);
        setCriteria(criteriaData.criteria);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettingsData();
  }, []);

  // Handle creating a new stage
  const handleCreateStage = async () => {
    try {
      setLoading(true);
      const stage = await apiCaller.post('/api/admin/stages', { name: newStage });
      setStages([...stages, stage]);
      setNewStage('');
    } catch (error) {
      console.error('Error creating stage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new reward
  const handleCreateReward = async () => {
    try {
      setLoading(true);
      const reward = await apiCaller.post('/api/admin/rewards', { name: newReward });
      setRewards([...rewards, reward]);
      setNewReward('');
    } catch (error) {
      console.error('Error creating reward:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating new criteria
  const handleCreateCriteria = async () => {
    try {
      setLoading(true);
      const criteriaItem = await apiCaller.post('/api/admin/criteria', { name: newCriteria });
      setCriteria([...criteria, criteriaItem]);
      setNewCriteria('');
    } catch (error) {
      console.error('Error creating criteria:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar (Tabs) */}
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-semibold">Referral Platform Settings</h2>
      </div>

      {/* Tabs Navigation */}
      <div className="flex justify-center bg-gray-200 p-4 space-x-4">
        <button
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2 rounded-md ${activeTab === 'stages' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Stages
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-md ${activeTab === 'rewards' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Rewards
        </button>
        <button
          onClick={() => setActiveTab('criteria')}
          className={`px-4 py-2 rounded-md ${activeTab === 'criteria' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Criteria
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Content based on active tab */}
        {activeTab === 'stages' && (
          <div>
            <div className="mb-4">
              <input
                type="text"
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                placeholder="Enter new stage name"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleCreateStage}
                className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
              >
                Create Stage
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Existing Stages</h3>
              <ul className="mt-4 space-y-2">
                {stages.map((stage) => (
                  <li key={stage.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                    <span>{stage.name}</span>
                    <div className="space-x-2">
                      <button className="text-yellow-500">Edit</button>
                      <button className="text-red-500">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div>
            <div className="mb-4">
              <input
                type="text"
                value={newReward}
                onChange={(e) => setNewReward(e.target.value)}
                placeholder="Enter new reward"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleCreateReward}
                className="mt-2 w-full bg-green-500 text-white p-2 rounded"
              >
                Create Reward
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Existing Rewards</h3>
              <ul className="mt-4 space-y-2">
                {rewards.map((reward) => (
                  <li key={reward.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                    <span>{reward.name}</span>
                    <div className="space-x-2">
                      <button className="text-yellow-500">Edit</button>
                      <button className="text-red-500">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'criteria' && (
          <div>
            <div className="mb-4">
              <input
                type="text"
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                placeholder="Enter new criteria"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleCreateCriteria}
                className="mt-2 w-full bg-purple-500 text-white p-2 rounded"
              >
                Create Criteria
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Existing Criteria</h3>
              <ul className="mt-4 space-y-2">
                {criteria.map((criterion) => (
                  <li key={criterion.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                    <span>{criterion.name}</span>
                    <div className="space-x-2">
                      <button className="text-yellow-500">Edit</button>
                      <button className="text-red-500">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
