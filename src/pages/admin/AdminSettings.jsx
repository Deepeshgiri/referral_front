import React, { useState, useEffect } from 'react';
import { apiCaller } from '../../utils/Apis';

const AdminSettings = () => {
  const [stages, setStages] = useState([]);
  const [newStage, setNewStage] = useState('');
  const [editingStage, setEditingStage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        setLoading(true);
        const stageData = await apiCaller.get('/api/admin/stages');
        setStages(stageData);
      } catch (error) {
        console.error('Error fetching stages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, []);

  const handleCreateStage = async () => {
    try {
      setLoading(true);
      const stage = await apiCaller.post('/api/admin/stages', { stage_name: newStage });
      setStages([...stages, stage]);
      setNewStage('');
    } catch (error) {
      console.error('Error creating stage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStage = async (id) => {
    try {
      setLoading(true);
      await apiCaller.delete(`/api/admin/stages/${id}`);
      setStages(stages.filter(stage => stage.id !== id));
    } catch (error) {
      console.error('Error deleting stage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStage = async () => {
    if (!editingStage) return;
    try {
      setLoading(true);
      await apiCaller.put(`/api/admin/stages/${editingStage.id}`, { stage_name: editingStage.stage_name });
      setStages(stages.map(stage => (stage.id === editingStage.id ? editingStage : stage)));
      setEditingStage(null);
    } catch (error) {
      console.error('Error updating stage:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Stages</h2>
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

      <h3 className="font-semibold text-lg">Existing Stages</h3>
      <table className="w-full mt-4 bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Stage Name</th>
            <th className="p-2">Stage points</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((stage) => (
            <tr key={stage.id} className="border-b">
              <td className="p-2 text-center">{stage.id}</td>
              <td className="p-2 text-center">
                {editingStage && editingStage.id === stage.id ? (
                  <input
                    type="text"
                    value={editingStage.stage_name}
                    onChange={(e) => setEditingStage({ ...editingStage, stage_name: e.target.value })}
                    className="border p-1"
                  />
                ) : (
                  stage.stage_name
                )}
              </td>
              <td className="p-2 text-center">
                {editingStage && editingStage.id === stage.id ? (
                  <input
                    type="text"
                    value={editingStage.stage_points}
                    onChange={(e) => setEditingStage({ ...editingStage, stage_points: e.target.value })}
                    className="border p-1"
                  />
                ) : (
                  stage.stage_points
                )}
              </td>
              <td className="p-2 text-center">
                {editingStage && editingStage.id === stage.id ? (
                  <button className="text-green-500 mr-2" onClick={handleUpdateStage}>Save</button>
                ) : (
                  <button className="text-yellow-500 mr-2" onClick={() => setEditingStage(stage)}>Edit</button>
                )}
                <button className="text-red-500" onClick={() => handleDeleteStage(stage.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSettings;
