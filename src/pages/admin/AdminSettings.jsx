import { Outlet } from 'react-router-dom';

const AdminSettings = () => {
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Settings</h1>
      <Outlet /> {/* This will render either Rewards or Stages based on the route */}
    </div>
  );
};

export default AdminSettings;
