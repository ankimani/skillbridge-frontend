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
import { getBillingInfo } from '../../components/services/coinWallet';
import { getCoinBalance } from '../../components/services/digitalCoins';
import BuyCoinsModal from '../wallet/BuyCoinsModal';
import BillingInfoModal from '../wallet/BillingInfoModal';
import TransactionHistory from '../wallet/TransactionHistory';
import { fetchUserProfile } from '../../components/services/authProfile';
import { logoutUser } from '../../components/services/authLogout';
import { useAuthStore } from '../../store/useAuthStore';
import { ROUTES } from '../../constants/routes';

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
  
  // Get authentication state
  const isLoggedIn = useAuthStore((state) => !!state.token);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  // Get actual counts from user profile
  const messageCount = userProfile?.unreadMessagesCount || 0;
  const notificationCount = 3; // Keep notification count as is for now

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
        const token = useAuthStore.getState().token || localStorage.getItem('authToken');
        if (token) {
          const profile = await fetchUserProfile(token);
          setUserProfile(profile);
          
          // Fetch coin balance
          try {
            console.log('Menus: Fetching coin balance for user:', profile.userId);
            const balanceData = await getCoinBalance(profile.userId, token);
            console.log('Menus: Coin balance data received:', balanceData);
            setCoinBalance(balanceData?.coinBalance || 0);
            console.log('Menus: Coin balance set to:', balanceData?.coinBalance || 0);
          } catch (balanceErr) {
            console.error('Failed to fetch coin balance:', balanceErr);
            console.error('Balance error details:', {
              message: balanceErr.message,
              response: balanceErr.response?.data,
              status: balanceErr.response?.status
            });
            setCoinBalance(0);
          }
          
          // Fetch billing info
          try {
            console.log('Menus: Fetching billing info for user:', profile.userId);
            const billingData = await getBillingInfo(profile.userId, token);
            console.log('Menus: Billing data received:', billingData);
            
            if (billingData?.headers?.responseCode === 404) {
              console.log('Menus: No billing info found (404)');
              setBillingInfo(null);
            } else {
              console.log('Menus: Setting billing info:', billingData);
              setBillingInfo(billingData);
            }
          } catch (billingErr) {
            console.error('Failed to fetch billing info:', billingErr);
            console.error('Billing error details:', {
              message: billingErr.message,
              response: billingErr.response?.data,
              status: billingErr.response?.status
            });
            setBillingInfo(null);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Only fetch data if user is logged in
    if (isLoggedIn) {
      fetchData();
    } else {
      // Clear user data when logged out
      setUserProfile(null);
      setCoinBalance(0);
      setBillingInfo(null);
    }
  }, [isLoggedIn]); // Add isLoggedIn as dependency

  const handleLogout = () => {
    // Use Zustand store logout to properly update state
    useAuthStore.getState().logout();
    // Also clear localStorage for consistency
    logoutUser();
    navigate('/login');
  };

  // Don't render if not logged in or auth not initialized
  if (!isInitialized) {
    return null; // Don't show anything while checking auth
  }

  if (!isLoggedIn) {
    return null; // Don't show menu when logged out
  }

  return (
    <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-2xl sticky top-0 z-50 border-b border-blue-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden mr-4 text-white hover:text-blue-100 transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Logo */}
            <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-200 hover:from-blue-100 hover:to-white transition-all duration-300 transform hover:scale-105">
              SkillBridge
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* My Job Posts */}
            <Link 
              to="/studentdashboard" 
              className="flex items-center px-4 py-2 text-sm font-medium text-white hover:text-blue-100 transition-all duration-200 rounded-lg hover:bg-white/10 group"
            >
              <FaBriefcase className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              My Job Posts
            </Link>

            {/* Find Professionals */}
            <Link 
              to="/professionals" 
              className="flex items-center px-4 py-2 text-sm font-medium text-white hover:text-blue-100 transition-all duration-200 rounded-lg hover:bg-white/10 group"
            >
              <FaSearch className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Find Professionals
            </Link>

            {/* Wallet Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setWalletDropdownOpen(!isWalletDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="flex items-center text-white hover:text-blue-100 transition-all duration-200 focus:outline-none group"
              >
                <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all duration-200 border border-yellow-400/30 hover:border-yellow-400/50 shadow-lg hover:shadow-xl">
                  <RiCoinsFill className="h-5 w-5 mr-2 text-yellow-400 drop-shadow-sm" />
                  <span className="font-semibold text-white">My Coins Wallet</span>
                  <FaChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isWalletDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {isWalletDropdownOpen && (
                <div className="absolute mt-3 w-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-xl py-3 z-50 border border-gray-200/50 right-0 transform transition-all duration-200">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Available Balance</span>
                      <div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full">
                        <RiCoinsFill className="h-4 w-4 mr-2 text-yellow-600" />
                        <span className="font-bold text-gray-800 text-lg">{coinBalance}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2">
                    <button
                      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200 text-left group border border-transparent hover:border-yellow-200"
                      onMouseDown={(e) => {
                        e.stopPropagation(); 
                        console.log('Menus: Opening billing modal with billingInfo:', billingInfo);
                        if (!billingInfo) {
                          console.log('Menus: No billing info available, will show empty form');
                        }
                        setShowBillingModal(true);
                        setTimeout(() => setWalletDropdownOpen(false), 100);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform shadow-lg">
                          <FaShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Buy More Coins</p>
                          <p className="text-xs text-gray-500">Add to your wallet balance</p>
                        </div>
                      </div>
                      <FaChevronDown className="text-gray-400 text-xs transform -rotate-90 group-hover:text-gray-600 transition-colors" />
                    </button>
                    
                    <button
                      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 text-left group border border-transparent hover:border-blue-200"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setShowHistoryModal(true);
                        setTimeout(() => setWalletDropdownOpen(false), 100);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-400 to-indigo-400 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform shadow-lg">
                          <FaHistory className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Transaction History</p>
                          <p className="text-xs text-gray-500">View your purchase history</p>
                        </div>
                      </div>
                      <FaChevronDown className="text-gray-400 text-xs transform -rotate-90 group-hover:text-gray-600 transition-colors" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                className="text-white hover:text-blue-100 transition-all duration-200 relative focus:outline-none group p-2 rounded-lg hover:bg-white/10"
                onClick={() => {
                  setNotificationsOpen(!isNotificationsOpen);
                  setProfileDropdownOpen(false);
                }}
              >
                <FaBell className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Messages */}
            <div className="relative">
              <Link
                to="/client-messages"
                className="text-white hover:text-blue-100 transition-all duration-200 relative flex items-center focus:outline-none group p-2 rounded-lg hover:bg-white/10"
              >
                <FaEnvelope className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {messageCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => {
                  setProfileDropdownOpen(!isProfileDropdownOpen);
                  setWalletDropdownOpen(false);
                }}
                className="flex items-center text-sm rounded-full focus:outline-none group"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-white/80 hover:border-white transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105">
                  {userProfile?.avatar ? (
                    <img 
                      src={userProfile.avatar} 
                      alt="User avatar"
                      className="h-full w-full rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <FaUserCircle className="h-6 w-6 text-white" />
                  )}
                </div>
                <span className="ml-3 text-white font-medium group-hover:text-blue-100 transition-colors">
                  {userProfile?.username || 'User'}
                </span>
                <FaChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfileDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-xl shadow-2xl bg-white/95 backdrop-blur-md ring-1 ring-black/5 py-2 z-50 border border-gray-200/50 transform transition-all duration-200">
                  <div className="px-4 py-3 text-gray-700 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
                    <div className="font-semibold text-gray-800">
                      {userProfile?.username || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{userProfile?.roleName || 'User'}</div>
                  </div>
                  <Link 
                    to={ROUTES.STUDENT_PROFILE}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <FaUserCircle className="h-4 w-4 mr-3 text-blue-500 group-hover:scale-110 transition-transform" />
                    My Profile
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 text-left transition-all duration-200 group"
                  >
                    <FaSignOutAlt className="h-4 w-4 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>
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
            {/* My Job Posts */}
            <Link 
              to="/studentdashboard" 
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaBriefcase className="mr-3" />
              My Job Posts
            </Link>

            {/* Find Professionals */}
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
                    console.log('Menus: Opening billing modal (mobile) with billingInfo:', billingInfo);
                    if (!billingInfo) {
                      console.log('Menus: No billing info available, will show empty form');
                    }
                    setShowBillingModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Buy Coins
                </button>
                <button
                  className="flex-1 bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    setShowHistoryModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  History
                </button>
              </div>
            </div>

            {/* Mobile Profile Section */}
            <div className="px-4 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
                  <FaUserCircle className="text-white text-sm" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{userProfile?.username || 'User'}</p>
                  <p className="text-xs text-gray-500">{userProfile?.roleName || 'User'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={ROUTES.STUDENT_PROFILE}
                  className="flex-1 bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="flex-1 bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBuyModal && (
        <BuyCoinsModal 
          userId={userProfile?.userId}
          isOpen={showBuyModal} 
          onClose={() => setShowBuyModal(false)}
          billingInfo={billingInfo}
        />
      )}
      
      {showBillingModal && (
        <BillingInfoModal 
          userId={userProfile?.userId}
          isOpen={showBillingModal} 
          onClose={() => setShowBillingModal(false)}
          onContinue={(billingData) => {
            console.log('Menus: Billing modal onContinue called with:', billingData);
            setShowBillingModal(false);
            setShowBuyModal(true);
          }}
          initialData={billingInfo}
        />
      )}
      
      {showHistoryModal && (
        <TransactionHistory 
          userId={userProfile?.userId}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </header>
  );
};

export default Menus;