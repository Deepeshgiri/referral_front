// import React, { useState, useEffect } from 'react';
// import { constant } from '../../Constant';

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited
//   const [editedUser, setEditedUser] = useState({}); // Store edited user data

//   // Fetch users from the API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch(`${constant.api}/api/admin/users`, {
//                   method: 'GET',
//                   headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//                   },
//                 });
        
//                 if (!response.ok) {
//                   throw new Error('Failed to fetch users');
//                 }
        
//                 const data = await response.json();
//                 setUsers(data.users);// Access the "users" array from the response
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Handle edit button click
//   const handleEdit = (user) => {
//     setEditingUserId(user.id);
//     setEditedUser({ ...user }); // Initialize editedUser with the current user data
//   console.log(user);
//   console.log(editingUserId)
  
//   };

//   // Handle input change
//   const handleInputChange = (e, field) => {
//     setEditedUser({
//       ...editedUser,
//       [field]: e.target.value,
//     });
//   };

//   // Save edited user data
//   const handleSave = async (userId) => {
//     try {
//       const response = await fetch(`${constant.api}/api/admin/update-user`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//         },
//         body: JSON.stringify(editedUser),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update user');
//       }

//       // Update the users list with the edited user data
//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.id === userId ? { ...user, ...editedUser } : user
//         )
//       );

//       // Reset editing state
//       setEditingUserId(null);
//       setEditedUser({});
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   if (loading) {
//     return <div>Loading users...</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

//       {/* User Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="min-w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stage</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="border-b">
//                 <td className="px-6 py-4 text-sm text-gray-700">{user.id}</td>
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   {editingUserId === user.id ? (
//                     <input
//                       type="text"
//                       value={editedUser.first_name || ''}
//                       onChange={(e) => handleInputChange(e, 'first_name')}
//                       className="border p-1 rounded"
//                     />
//                   ) : (
//                     `${user.first_name} ${user.last_name}`
//                   )}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   {editingUserId === user.id ? (
//                     <input
//                       type="email"
//                       value={editedUser.stage || ''}
//                       onChange={(e) => handleInputChange(e, 'stage')}
//                       className="border p-1 rounded"
//                     />
//                   ) : (
//                     user.stage
//                   )}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   {editingUserId === user.id ? (
//                     <input
//                       type="text"
//                       value={editedUser.phone || ''}
//                       onChange={(e) => handleInputChange(e, 'phone')}
//                       className="border p-1 rounded"
//                     />
//                   ) : (
//                     user.phone
//                   )}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-700">
//                   {editingUserId === user.id ? (
//                     <button
//                       onClick={() => handleSave(user.id)}
//                       className="text-green-500 hover:text-green-700"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleEdit(user)}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       Edit
//                     </button>
//                   )}
//                   <button className="text-red-500 hover:text-red-700 ml-4">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;



import React, { useState, useEffect } from 'react';
import { constant } from '../../Constant';

const AdminUsers = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // Track the user being edited
  const [editedUser, setEditedUser] = useState({}); // Store edited user data

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
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
                setUsers(data.users);// Access the "users" array from the response

      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle edit button click
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedUser({ ...user }); // Initialize editedUser with the current user data
  };

  // Handle input change
  const handleInputChange = (e, field) => {
    setEditedUser({
      ...editedUser,
      [field]: e.target.value,
    });
  };

 // Filter users based on the search term
 const filteredUsers = users.filter(
  (user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
);


  // Save edited user data
  const handleSave = async () => {
    try {
      const response = await fetch(`${constant.api}/api/admin/update-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update the users list with the edited user data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editedUser.id ? { ...user, ...editedUser } : user
        )
      );

      // Close the modal
      setEditingUser(null);
      setEditedUser({});
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return setLoading;
  }

 
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-400 via-green-400 to-pink-400 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Stage</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Points</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Refer count</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-gray-200`}
              >
                <td className="px-6 py-4 text-sm text-gray-700">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.stage}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.points}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.referral_count}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-500 hover:text-blue-700 transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button className="text-red-500 hover:text-red-700 ml-4 transition-all duration-200">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={editedUser.first_name || ''}
                  onChange={(e) => handleInputChange(e, 'first_name')}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stage</label>
                <input
                  type="text"
                  value={editedUser.stage || ''}
                  onChange={(e) => handleInputChange(e, 'stage')}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={editedUser.phone || ''}
                  onChange={(e) => handleInputChange(e, 'phone')}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminUsers;