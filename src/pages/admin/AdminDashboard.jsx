import React, { useState, useEffect } from 'react';
import { constant } from '../../Constant';
import { useLoading } from '../../context/LoadingContext'; // Import the useLoading hook

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { setLoading } = useLoading(); // Access the loading context

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true when the fetch starts

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
        setUsers(data.users); // Access the "users" array from the response
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after the fetch completes
      }
    };

    fetchUsers();
  }, [setLoading]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Active Users</h2>
          <p className="text-3xl font-bold">
            {users.filter((user) => user.active_status === 1).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold">
            ${users.reduce((total, user) => total + (user.points || 0), 0)}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul>
          {users.slice(0, 5).map((user) => (
            <li key={user.id} className="border-b py-2">
              <div className="flex items-center">
                <img
                  src={user.image || 'https://via.placeholder.com/40'}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">
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
