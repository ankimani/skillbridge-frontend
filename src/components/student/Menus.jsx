import React, { useState, useEffect, useRef } from 'react';
import { 
  FaEnvelope, 
  FaCog, 
  FaSignOutAlt, 
  FaUserCircle, 
  FaChevronDown, 
  FaBell,
  FaBars,
  FaTimes,
  FaBriefcase,
  FaSearch,
  FaHistory,
  FaShoppingCart
} from 'react-icons/fa';
import { RiCoinsFill } from 'react-icons/ri';
import { BsPencilSquare } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { getCoinBalance, getBillingInfo } from '../services/coinWallet';
import BuyCoinsModal from '../wallet/BuyCoinsModal';
import BillingInfoModal from '../wallet/BillingInfoModal';
import TransactionHistory from '../wallet/TransactionHistory';
import { fetchUserProfile } from '../services/authProfile';
import { logoutUser } from '../services/authLogout';

const Menus = () => {
  const [isWalletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coinBalance, setCoinBalance] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Simulated counts
  const messageCount = 5;
  const notificationCount = 3;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setWalletDropdownOpen(false);
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user profile, coin balance and billing info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const profile = await fetchUserProfile(token);
          setUserProfile(profile);
          
          // Fetch coin balance
          try {
            const balanceData = await getCoinBalance(profile.userId, token);
            setCoinBalance(balanceData.coinBalance || 0);
          } catch (balanceErr) {
            console.error('Failed to fetch coin balance:', balanceErr);
            setCoinBalance(0);
          }
          
          // Fetch billing info
          try {
            const billingData = await getBillingInfo(profile.userId, token);
            if (billingData?.headers?.responseCode === 404) {
              setBillingInfo(null);
            } else {
              setBillingInfo(billingData);
            }
          } catch (billingErr) {
            console.error('Failed to fetch billing info:', billingErr);
            setBillingInfo(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    
    fetchData();
  }, [showBuyModal, showBillingModal]); // Refresh when modals close

  const handleLogout = () => {
    const result = logoutUser(); // No async since we're not calling backend
    if (result.success) {
      navigate('/login');
      setProfileDropdownOpen(false);
    } else {
      console.error(result.message);
      // Optionally show error to user
    }
  };

  return (
    <nav className="bg-white shadow-md px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Logo and Mobile Menu Button */}
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden mr-4 text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-pink-600 flex items-center">
          <span className="bg-pink-600 text-white rounded-lg px-2 py-1 mr-1">S</span>
          <span className="hidden sm:inline">SkillsBridge</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {/* Main Navigation */}
        <div className="flex items-center space-x-6" ref={dropdownRef}>
          {/* My Job Posts - First menu item */}
          <Link 
            to="/studentdashboard" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaBriefcase className="mr-1" />
            My Job Posts
          </Link>

          {/* Find Professionals - Simple link */}
          <Link 
            to="/professionals" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaSearch className="mr-1" />
            Find Professionals
          </Link>

          {/* Wallet Dropdown - Desktop */}
          <div className="relative">
            <button
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors focus:outline-none group"
              onClick={() => {
                setWalletDropdownOpen(!isWalletDropdownOpen);
                setProfileDropdownOpen(false);
              }}
            >
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                <RiCoinsFill className="mr-2 text-yellow-500 text-lg" />
                <span className="font-medium">My Coins Wallet</span>
                <FaChevronDown className={`ml-2 text-xs transition-transform ${isWalletDropdownOpen ? 'transform rotate-180' : ''}`} />
              </div>
            </button>
            {isWalletDropdownOpen && (
              <div className="absolute mt-2 w-72 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-100 right-0">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">Available Balance</span>
                    <div className="flex items-center">
                      <RiCoinsFill className="text-yellow-500 mr-1" />
                      <span className="font-semibold text-gray-800">{coinBalance}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors text-left"
                    onMouseDown={(e) => {
                      e.stopPropagation(); 
                      setShowBillingModal(true);
                      setTimeout(() => setWalletDropdownOpen(false), 100);
                   }}
                  >
                    <div className="flex items-center">
                      <div className="bg-yellow-100 p-2 rounded-full mr-3">
                        <FaShoppingCart className="text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Buy More Coins</p>
                        <p className="text-xs text-gray-500">Add to your wallet balance</p>
                      </div>
                    </div>
                    <FaChevronDown className="text-gray-400 text-xs transform -rotate-90" />
                  </button>
                  
                  <button
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors text-left"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setShowHistoryModal(true);
                      setTimeout(() => setWalletDropdownOpen(false), 100);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaHistory className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Transaction History</p>
                        <p className="text-xs text-gray-500">View your purchase history</p>
                      </div>
                    </div>
                    <FaChevronDown className="text-gray-400 text-xs transform -rotate-90" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Menu Content */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 md:hidden`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <Link 
            to="/" 
            className="text-xl font-bold text-pink-600 flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="bg-pink-600 text-white rounded-lg px-2 py-1 mr-1">S</span>
            <span>SkillsBridge</span>
          </Link>
          <button 
            className="text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          <div className="space-y-4">
            {/* My Job Posts - First in mobile menu */}
            <Link 
              to="/studentdashboard" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaBriefcase className="mr-3" />
              My Job Posts
            </Link>

            {/* Find Professionals - Simple link in mobile */}
            <Link 
              to="/professionals" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaSearch className="mr-3" />
              Find Professionals
            </Link>

            {/* Mobile Wallet Section */}
            <div className="px-4 py-2 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <RiCoinsFill className="mr-3 text-yellow-500" />
                  <span className="font-medium">Wallet Balance</span>
                </div>
                <span className="font-semibold">{coinBalance} Coins</span>
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  className="flex-1 bg-yellow-500 text-white py-1 px-3 rounded text-sm hover:bg-yellow-600 transition-colors"
                  onClick={() => {
                    setShowBillingModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Buy Coins
                </button>
                <button
                  className="flex-1 bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setShowHistoryModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  History
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link 
              to="/post-requirement" 
              className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg mb-4 hover:from-green-600 hover:to-green-700 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BsPencilSquare className="mr-2" />
              Post Requirement
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - User Actions */}
      <div className="flex items-center space-x-4 md:space-x-6" ref={dropdownRef}>
        {/* Post Requirement Button - Mobile */}
        <Link 
          to="/post-requirement" 
          className="md:hidden bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          <BsPencilSquare size={18} />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            className="text-gray-700 hover:text-blue-600 transition-colors relative focus:outline-none"
            onClick={() => {
              setNotificationsOpen(!isNotificationsOpen);
              setProfileDropdownOpen(false);
            }}
          >
            <FaBell className="text-xl" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute mt-2 w-72 bg-white shadow-lg rounded-md py-1 z-50 right-0 border border-gray-100">
              <div className="px-4 py-2 font-medium text-gray-700 border-b border-gray-100">
                Notifications
              </div>
              <div className="max-h-60 overflow-y-auto">
                {[1, 2, 3].map((item) => (
                  <Link 
                    key={item} 
                    to="/notifications" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <div className="font-medium">New professional available</div>
                    <div className="text-gray-500 text-xs">2 hours ago</div>
                  </Link>
                ))}
              </div>
              <Link 
                to="/notifications" 
                className="block px-4 py-2 text-sm text-center text-blue-600 hover:bg-blue-50"
                onClick={() => setNotificationsOpen(false)}
              >
                View All
              </Link>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="relative">
          <Link
            to="/client-messages"
            className="text-gray-700 hover:text-blue-600 transition-colors relative flex items-center focus:outline-none"
            onClick={() => {
              setNotificationsOpen(false);
              setProfileDropdownOpen(false);
            }}
          >
            <FaEnvelope className="text-xl" />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {userProfile?.unreadMessagesCount || 0}
              </span>
            )}
            <span className="hidden md:inline ml-1">Messages</span>
          </Link>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
            onClick={() => {
              setProfileDropdownOpen(!isProfileDropdownOpen);
              setWalletDropdownOpen(false);
              setNotificationsOpen(false);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
              <FaUserCircle className="text-xl" />
            </div>
            <span className="hidden md:inline ml-2">
              {userProfile ? `${userProfile.username}` : ''}
            </span>
            <FaChevronDown className={`hidden md:inline ml-1 text-xs transition-transform ${isProfileDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>
          {isProfileDropdownOpen && (
            <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50 right-0 border border-gray-100">
              <div className="px-4 py-2 text-gray-700 border-b border-gray-100">
                <div className="font-medium">
                  {userProfile ? `${userProfile.username}` : 'User'}
                </div>
                <div className="text-xs text-gray-500">{userProfile ? `${userProfile.roleName}` : ''}</div>
              </div>
              <Link 
                to={`/profile/${userProfile?.userId}`}
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <FaUserCircle className="mr-2" /> My Profile
              </Link>
              {/* <Link 
                to="/settings" 
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <FaCog className="mr-2" /> Settings
              </Link> */}
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Modals */}
      {showBillingModal && (
        <BillingInfoModal
          userId={userProfile?.userId}
          isOpen={showBillingModal}
          onClose={() => setShowBillingModal(false)}
          onContinue={(info) => {
            setShowBillingModal(false);
            setShowBuyModal(true);
          }}
          initialData={billingInfo}
        />
      )}

      {showBuyModal && (
        <BuyCoinsModal
          userId={userProfile?.userId}
          isOpen={showBuyModal}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => {
            setShowBuyModal(false);
            // Balance will refresh automatically due to useEffect dependency
          }}
          billingInfo={billingInfo}
        />
      )}

      {showHistoryModal && (
        <TransactionHistory
          userId={userProfile?.userId}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </nav>
  );
};

export default Menus;