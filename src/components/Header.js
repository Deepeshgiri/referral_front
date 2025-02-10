import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaThreads } from 'react-icons/fa6'; // Import icons

const Header = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const referralLink = user ? `${window.location.origin}/signup/${user.referralCode}` : '';

  const handleCopy = () => {
    if (!referralLink) return;
  
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(referralLink)
        .then(() => alert('Referral link copied to clipboard!'))
        .catch(() => alert('Failed to copy referral link.'));
    } else {
      // Fallback for unsupported browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Referral link copied to clipboard!');
      } catch (err) {
        alert('Failed to copy referral link.');
      }
      document.body.removeChild(textArea);
    }
  };
  

  const handleShare = (platform) => {
    const shareUrl = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(referralLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}`,
      instagram: `https://www.instagram.com/`,
      threads: `https://www.threads.net/`,
    }[platform];

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <header className={`p-8 ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
      <div className="container mx-auto">
        {user ? (
          <>
            <h2 className="text-3xl font-bold">Welcome, {user.firstName}</h2>
            <div className="mt-4">
              <p className="font-semibold">Your Referral Code:</p>
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  value={user.referralCode || 'N/A'}
                  readOnly
                  className={`flex-1 p-2 rounded-l ${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-600 text-white'}`}
                />
                <button
                  className={`p-2 rounded-r ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'}`}
                  onClick={handleCopy}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Share via:</p>
              <div className="flex space-x-4 mt-2">
                <button
                  className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-500 text-white' : 'bg-green-700 text-white'}`}
                  onClick={() => handleShare('whatsapp')}
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp size={24} />
                </button>
                <button
                  className={`p-2 rounded-full ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-blue-800 text-white'}`}
                  onClick={() => handleShare('facebook')}
                  aria-label="Share on Facebook"
                >
                  <FaFacebook size={24} />
                </button>
                <button
                  className={`p-2 rounded-full ${theme === 'light' ? 'bg-black text-white' : 'bg-gray-900 text-white'}`}
                  onClick={() => handleShare('twitter')}
                  aria-label="Share on X (Twitter)"
                >
                  <FaTwitter size={24} />
                </button>
                <button
                  className={`p-2 rounded-full ${theme === 'light' ? 'bg-pink-500 text-white' : 'bg-pink-700 text-white'}`}
                  onClick={() => handleShare('instagram')}
                  aria-label="Share on Instagram"
                >
                  <FaInstagram size={24} />
                </button>
                <button
                  className={`p-2 rounded-full ${theme === 'light' ? 'bg-black text-white' : 'bg-gray-900 text-white'}`}
                  onClick={() => handleShare('threads')}
                  aria-label="Share on Threads"
                >
                  <FaThreads size={24} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <h2 className="text-3xl font-bold">Welcome, Guest</h2>
        )}
      </div>
    </header>
  );
};

export default Header;