import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { constant } from '../Constant';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
  const [error, setError] = useState(null);
  const [countryCode, setCountryCode] = useState('+1'); // Default country code
  const { login } = useContext(AuthContext); // Access login function from AuthContext
  const navigate = useNavigate();
  const { code } = useParams(); // Get referral code from URL params
  //const [referralCode, setReferralCode] = useState('');

  // Set referral code from URL params on component mount
  useEffect(() => {
    // if (code) {
    //   setReferralCode(code);
    // }
    const oldToken = localStorage.getItem('token');
    const oldUser = localStorage.getItem('user');
    if (oldToken && oldUser) {
      login(oldToken, oldUser);
    }
  }, [code]);

  // Handle phone number submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (!phone) {
      setError('Phone number is required');
      return;
    }
    if (!firstName) {
      setError('Name is required');
      return;
    }
    const getFullPhoneNumber = () => {
      return `${countryCode.replace('+', '')}${phone.replace(/^0+/, '')}`; // Remove leading zeros and "+" sign
    };
    // Trim leading zeros from the phone number
    // const formattedPhone = phone.replace(/^0+/, '');

    // Combine country code and formatted phone number
    const fullPhoneNumber = getFullPhoneNumber();

    try {
      const response = await fetch(`${constant.api}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: fullPhoneNumber, countryCode, firstName, lastName }),
      });

      if (response.ok) {
        setStep(2); // Move to OTP step
        setError(null); // Clear errors
      } else {
        const data = await response.json();
        setError(data.error || 'Error sending OTP');
      }
    } catch (error) {
      setError('An error occurred while sending OTP');
    }
  };

  // Handle OTP submission and user authentication
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError('OTP is required');
      return;
    }
    const getFullPhoneNumber = () => {
      return `${countryCode.replace('+', '')}${phone.replace(/^0+/, '')}`; // Remove leading zeros and "+" sign
    };
    //

    // Trim leading zeros from the phone number
    const formattedPhone = getFullPhoneNumber();

    // Combine country code and formatted phone number
    const fullPhoneNumber = `${formattedPhone}`;

    try {
      const response = await fetch(`${constant.api}/api/signup/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: fullPhoneNumber,
          countryCode,
          otp,
          firstName,
          lastName: lastName || '',
          referralCode: code || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data; // Assuming the API response contains both the token and user details

        if (data.error){
          navigate(`/signup/${code}`)
        }
        // Authenticate the user with token and user data
        login(token, user);
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid OTP');
        navigate('/signup')
      }
    } catch (error) {
      setError('An error occurred while verifying OTP');
      navigate('/signup')
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
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? 'Sign Up' : 'Verify OTP'}
        </h2>

        {step === 1 && (
          <form onSubmit={handlePhoneSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                First Name
              </label>
              <input
                type="text"
                id="name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter your Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="lastname">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter your Last Name"
              />
            </div>
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
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="otp">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter OTP sent to your phone"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Display error message */}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;