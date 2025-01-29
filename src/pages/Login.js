import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { constant } from '../Constant';
import { apiCaller } from '../utils/Apis';


const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null); // To show error message
  const [otpSent, setOtpSent] = useState(false); // To track OTP step
  const { login } = useContext(AuthContext); // Get login function from context
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState('+1');

  // Combine countryCode and phone into a single phone field
  const getFullPhoneNumber = () => {
    return `${countryCode.replace('+', '')}${phone.replace(/^0+/, '')}`; // Remove leading zeros and "+" sign
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const fullPhone = getFullPhoneNumber(); // Combine countryCode and phone

      // Use the apiCaller to send OTP
      const response = await apiCaller.post('/api/login/send-otp', { phone: fullPhone });

      // If the response is successful, move to the OTP verification step
      setOtpSent(true);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error during OTP send:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const fullPhone = getFullPhoneNumber(); // Combine countryCode and phone

      // Use the apiCaller to verify OTP
      const response = await apiCaller.post('/api/login/verify-otp', { phone: fullPhone, otp });

      if (response.token) {
        login(response.token, response.user); // Store token in context
        navigate('/'); // Redirect to home page after login
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80')`,
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="phone">
              Phone Number
            </label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="p-2 border border-gray-300 rounded-l-lg bg-gray-100"
              >
                <option value="+1">+1 USA</option>
                <option value="+91">+91 IN</option>
                <option value="+44">+44 UK</option>
                <option value="+61">+61 AU</option>
                {/* Add more country codes as needed */}
              </select>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-r-lg"
                placeholder="Enter your phone number"
                required
                disabled={otpSent}
              />
            </div>
          </div>
          {otpSent && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="otp">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter the OTP"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            {otpSent ? 'Verify OTP' : 'Send OTP'}
          </button>
        </form>

        {/* Display error message if exists */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
