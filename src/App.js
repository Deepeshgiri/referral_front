import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Referrals from './pages/Referrals';
import Rewards from './pages/Rewards';
import AdminDashboard from './pages/admin/AdminDashboard'; // Admin Dashboard
import AdminUsers from './pages/admin/AdminUsers'; // Admin Users Page
import AdminLogin from './pages/admin/AdminLogin';
import { LoadingProvider } from './context/LoadingContext';

// import Settings from './pages/Settings';

// Main App Component
const App = () => {

  
  return (
    <LoadingProvider>
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
      
    </Router>
    </LoadingProvider>
  );
};

// AppContent Component (Handles Conditional Rendering)
const AppContent = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        // Check if the user is an admin
        user?.role === 'admin' ? (
          <AdminLayout />
        ) : (
          // Show regular authenticated layout for non-admin users
          <AuthenticatedLayout />
        )
      ) : (
        // Show login/signup pages with fancy background if user is not authenticated
        <UnauthenticatedLayout />
      )}
    </div>
  );
};

// Layout for Authenticated Users (Non-Admin)
const AuthenticatedLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
     
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 p-4">
        <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Layout for Admin Users
const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <Sidebar isAdmin={true} />
        {/* Main Content */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Layout for Unauthenticated Users
const UnauthenticatedLayout = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/:code" element={<Signup />} />
      <Route path='/login/admin' element={<AdminLogin />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;