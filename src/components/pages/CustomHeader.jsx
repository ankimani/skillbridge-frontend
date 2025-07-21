import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Home, 
  Briefcase, 
  Wallet as WalletIcon, 
  ShoppingCart, 
  Settings, 
  LogOut,
  History,
  Bell,
  Mail,
  Key
} from 'lucide-react';
import { getCoinBalance, getBillingInfo } from '../services/coinWallet';
import BuyCoinsModal from '../wallet/BuyCoinsModal';
import BillingInfoModal from '../wallet/BillingInfoModal';
import TransactionHistory from '../wallet/TransactionHistory';
import { fetchUserProfile } from '../services/authProfile';
import { Link, useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../student/ChangePasswordModal';
import { logoutUser } from '../services/authLogout';

const CustomHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [coinBalance, setCoinBalance] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Centralized unauthorized handler
  const handleUnauthorized = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUserProfile(null);
    setCoinBalance(0);
    setBillingInfo(null);
    navigate('/login');
    setProfileOpen(false);
    setAuthError('Your session has expired. Please login again.');
  };

  // Check authentication status
  const checkAuth = async () => {
    setIsCheckingAuth(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoggedIn(false);
        setUserProfile(null);
        setIsCheckingAuth(false);
        return;
      }

      // Verify token by fetching user profile
      const profile = await fetchUserProfile(token);
      setUserProfile(profile);
      setIsLoggedIn(true);
      
      // Fetch coin balance
      try {
        const balanceData = await getCoinBalance(profile.userId, token);
        setCoinBalance(balanceData.coinBalance || 0);
      } catch (balanceErr) {
        if (balanceErr.response?.status === 401) {
          handleUnauthorized();
          return;
        }
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
        if (billingErr.response?.status === 401) {
          handleUnauthorized();
          return;
        }
        setBillingInfo(null);
      }
      
      setAuthError(null);
      
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      setAuthError(err.message || 'Failed to verify your session.');
      setIsLoggedIn(false);
      setUserProfile(null);
    }
    
    setIsCheckingAuth(false);
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    handleUnauthorized();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setWalletOpen(false);
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check auth on mount and when modals close
  useEffect(() => {
    checkAuth();
    const handleStorageChange = (e) => e.key === 'authToken' && checkAuth();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [showBuyModal, showBillingModal, showChangePasswordModal]);

  // Initial auth check
  useEffect(() => {
    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Periodic auth check
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('authToken');
      if (!!token !== isLoggedIn) checkAuth();
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  if (isCheckingAuth) {
    return (
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
      {authError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <p>{authError}</p>
            <button onClick={() => setAuthError(null)} className="text-red-700 hover:text-red-900">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              SkillBridge
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-10">
            <Link to="/" className="flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-blue-100 transition-colors">
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/jobs" className="flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-blue-100 transition-colors">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Jobs
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setWalletOpen(!walletOpen);
                      setProfileOpen(false);
                    }}
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors focus:outline-none group"
                  >
                    <div className="flex items-center bg-blue-500/20 px-3 py-1 rounded-full group-hover:bg-blue-500/30 transition-colors">
                      <WalletIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      <span className="font-medium text-white">My Coins Wallet</span>
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${walletOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {walletOpen && (
                    <div className="absolute mt-2 w-72 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-100 right-0">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-500">Available Balance</span>
                          <div className="flex items-center">
                            <WalletIcon className="h-4 w-4 mr-1 text-yellow-500" />
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
                            setTimeout(() => setWalletOpen(false), 100);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="bg-yellow-100 p-2 rounded-full mr-3">
                              <ShoppingCart className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Buy More Coins</p>
                              <p className="text-xs text-gray-500">Add to your wallet balance</p>
                            </div>
                          </div>
                          <ChevronDown className="text-gray-400 text-xs transform -rotate-90" />
                        </button>
                        
                        <button
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors text-left"
                          onMouseDown={(e) => {
                            e.stopPropagation(); 
                            setShowHistoryModal(true);
                            setTimeout(() => setWalletOpen(false), 100);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <History className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Transaction History</p>
                              <p className="text-xs text-gray-500">View your purchase history</p>
                            </div>
                          </div>
                          <ChevronDown className="text-gray-400 text-xs transform -rotate-90" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    className="text-white hover:text-blue-100 transition-colors relative focus:outline-none"
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileOpen(false);
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <Link
                    to="/messages"
                    className="text-white hover:text-blue-100 transition-colors relative flex items-center focus:outline-none"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {userProfile?.unreadMessagesCount || 0}
                    </span>
                  </Link>
                </div>

                <div className="relative ml-4" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      setWalletOpen(false);
                    }}
                    className="flex items-center text-sm rounded-full focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white hover:bg-blue-400 transition-colors">
                      {userProfile?.avatar ? (
                        <img 
                          src={userProfile.avatar} 
                          alt="Profile" 
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <span className="ml-2 text-white">
                      {userProfile?.username || 'User'}
                    </span>
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                      <div className="px-4 py-2 text-gray-700 border-b border-gray-100">
                        <div className="font-medium">
                          {userProfile?.username || 'User'}
                        </div>
                        <div className="text-xs text-gray-500">{userProfile?.roleName || 'User'}</div>
                      </div>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setShowChangePasswordModal(true);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left"
                      >
                        <Key className="h-4 w-4 mr-2 text-blue-500" />
                        Change Password
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-left"
                      >
                        <LogOut className="h-4 w-4 mr-2 text-blue-500" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-white hover:text-blue-100 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-100 hover:bg-blue-700 focus:outline-none transition-colors"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 pb-4">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/jobs"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  Jobs
                </Link>

                <div className="px-3 py-2 bg-blue-600/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <WalletIcon className="h-5 w-5 mr-3 text-yellow-500" />
                      <span className="font-medium">Wallet Balance</span>
                    </div>
                    <span className="font-semibold">{coinBalance} Coins</span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button
                      className="flex-1 bg-yellow-500 text-white py-1 px-3 rounded text-sm hover:bg-yellow-600 transition-colors flex items-center justify-center"
                      onClick={() => {
                        setShowBillingModal(true);
                        setMenuOpen(false);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Buy Coins
                    </button>
                    <button
                      className="flex-1 bg-blue-500/30 text-white py-1 px-3 rounded text-sm hover:bg-blue-500/40 transition-colors flex items-center justify-center"
                      onClick={() => {
                        setShowHistoryModal(true);
                        setMenuOpen(false);
                      }}
                    >
                      <History className="h-4 w-4 mr-1" />
                      History
                    </button>
                  </div>
                </div>

                <Link
                  to="/notifications"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <Bell className="h-5 w-5 mr-3" />
                  Notifications
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Link>

                <Link
                  to="/messages"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  <Mail className="h-5 w-5 mr-3" />
                  Messages
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {userProfile?.unreadMessagesCount || 0}
                  </span>
                </Link>

                <div className="px-3 py-2">
                  <div className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white mr-3">
                      {userProfile?.avatar ? (
                        <img 
                          src={userProfile.avatar} 
                          alt="Profile" 
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    {userProfile?.username || 'User'}
                  </div>
                  <div className="ml-12 mt-1 space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowChangePasswordModal(true);
                      }}
                      className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600 text-left"
                    >
                      <Key className="h-4 w-4 mr-3" />
                      Change Password
                    </button>
                    <Link
                      to="/settings"
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600 text-left"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-white bg-blue-800 hover:bg-blue-900 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-blue-800 bg-white hover:bg-blue-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {isLoggedIn && (
        <>
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
              onUnauthorized={handleUnauthorized}
            />
          )}

          {showBuyModal && (
            <BuyCoinsModal
              userId={userProfile?.userId}
              isOpen={showBuyModal}
              onClose={() => setShowBuyModal(false)}
              onSuccess={() => {
                setShowBuyModal(false);
                checkAuth();
              }}
              billingInfo={billingInfo}
              onUnauthorized={handleUnauthorized}
            />
          )}

          {showHistoryModal && (
            <TransactionHistory
              userId={userProfile?.userId}
              onClose={() => setShowHistoryModal(false)}
              onUnauthorized={handleUnauthorized}
            />
          )}

          {showChangePasswordModal && (
            <ChangePasswordModal
              onClose={() => setShowChangePasswordModal(false)}
              onSave={() => {}}
              onUnauthorized={handleUnauthorized}
            />
          )}
        </>
      )}
    </header>
  );
};

export default CustomHeader;