import React, { useState, useEffect } from 'react';
import { constant } from '../../Constant';
import { useLoading } from '../../context/LoadingContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register the required components for Chart.js, including ArcElement for Pie chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { setLoading } = useLoading();

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${constant.api}/api/admin/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [setLoading]);

  if (error) {
    return <div>Error: {error}</div>;
  }

   // Active vs Inactive Users
   const activeUsersData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [
          users.filter(user => user.active_status === 1).length,
          users.filter(user => user.active_status === 0).length
        ],
        backgroundColor: ['#4CAF50', '#FFC107'],
      },
    ],
  };

  // Referral Count
  const referralCountData = {
    labels: users.map(user => `${user.first_name} ${user.last_name}`),
    datasets: [
      {
        label: 'Referral Count',
        data: users.map(user => user.referral_count),
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
    ],
  };

  // Points Distribution
  const pointsData = {
    labels: users.map(user => `${user.first_name} ${user.last_name}`),
    datasets: [
      {
        label: 'Points',
        data: users.map(user => user.points),
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        borderWidth: 1,
      },
    ],
  };

  // Users by Stage
  const stageData = {
    labels: ['Stage 1', 'Stage 2', 'Stage 3'],
    datasets: [
      {
        label: 'Users by Stage',
        data: [
          users.filter(user => user.stage === 1).length,
          users.filter(user => user.stage === 2).length,
          users.filter(user => user.stage === 3).length,
        ],
        backgroundColor: ['#FF5733', '#FFBF00', '#2E8B57'],
        borderColor: ['#FF5733', '#FFBF00', '#2E8B57'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      {/* Admin Dashboard Title */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Admin Dashboard
      </h1>
  
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-gradient-to-r from-blue-400 via-green-400 to-pink-400 p-6 rounded-lg shadow-md text-white flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
        </div>
  
        {/* Active Users Card */}
        <div className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 p-6 rounded-lg shadow-md text-white flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Active Users</h2>
          <p className="text-3xl font-bold mt-2">
            {users.filter((user) => user.active_status === 1).length}
          </p>
        </div>
  
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 p-6 rounded-lg shadow-md text-white flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold mt-2">
            ${users.reduce((total, user) => total + (user.points || 0), 0)}
          </p>
        </div>
      </div>
  
      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* Active vs Inactive Users Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full h-auto">
          <h2 className="text-lg font-semibold mb-4 text-center">Active vs Inactive Users</h2>
          <Pie data={activeUsersData} />
        </div>
  
        {/* Referral Count Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full h-auto">
          <h2 className="text-lg font-semibold mb-4 text-center">Referral Count</h2>
          <Bar data={referralCountData} />
        </div>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* Points Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full h-auto">
          <h2 className="text-lg font-semibold mb-4 text-center">Points Distribution</h2>
          <Bar data={pointsData} />
        </div>
  
        {/* Users by Stage Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full h-auto">
          <h2 className="text-lg font-semibold mb-4 text-center">Users by Stage</h2>
          <Bar data={stageData} />
        </div>
      </div>
  
      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul>
          {users.slice(0, 5).map((user) => (
            <li key={user.id} className="border-b py-3">
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex justify-center items-center text-white font-bold text-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                  style={{
                    backgroundColor: user.image ? 'transparent' : undefined,
                    color: user.image ? 'transparent' : '#fff',
                  }}
                >
                  {user.first_name[0].toUpperCase()}
                </div>
  
                {/* User Info */}
                <div>
                  <p className="font-semibold text-gray-800">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Signed up on {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
};

export default AdminDashboard;
