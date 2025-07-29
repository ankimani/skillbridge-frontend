import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCreditCard, FaCoins, FaLock, FaArrowRight, FaRegCreditCard, FaCalendarAlt, FaShieldAlt, FaCheckCircle, FaTimes, FaMobileAlt, FaArrowLeft, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { buyCoins, buyCoinMpesa, calculateCoinPrice } from '../../components/services/coinWallet';

// Preload Stripe.js when the app loads
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized Alert Component
const Alert = React.memo(({ type, message, onClose, duration = 5000 }) => {
  const alertStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconStyles = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  const icons = {
    success: FaCheckCircle,
    error: FaTimes,
    warning: FaExclamationTriangle,
    info: FaCheckCircle
  };

  const Icon = icons[type];

  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`border rounded-lg p-4 mb-4 ${alertStyles[type]} animate-in slide-in-from-top-2 duration-300`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconStyles[type]}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-opacity-20 hover:bg-gray-600 ${iconStyles[type]}`}
              aria-label="Close alert"
            >
              <FaTimes className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

// Memoized Step Indicator Component
const StepIndicator = React.memo(({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            index + 1 <= currentStep 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {index + 1 <= currentStep ? (
              <FaCheckCircle className="text-xs" />
            ) : (
              index + 1
            )}
          </div>
          {index < totalSteps - 1 && (
            <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
              index + 1 < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

// Main Form Component
const BuyCoinsForm = ({ userId, onSuccess, onClose, billingInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [currentStep, setCurrentStep] = useState(1);
  const [coins, setCoins] = useState(100);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchasedCoins, setPurchasedCoins] = useState(0);
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  });
  const [cardBrand, setCardBrand] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  
  // Memoized country data
  const [countries] = useState(() => [
    { name: 'United States', code: 'US' },
    { name: 'Kenya', code: 'KE' },
    { name: 'United Kingdom', code: 'GB' }
  ]);

  // Debounce coin changes to prevent rapid API calls
  const debouncedCoins = useDebounce(coins, 500);
  const totalSteps = 3;

  // Memoized billing data extraction
  const billingData = useMemo(() => {
    if (billingInfo?.body?.data?.body?.data) return billingInfo.body.data.body.data;
    if (billingInfo?.body?.data) return billingInfo.body.data;
    return billingInfo || {};
  }, [billingInfo]);

  // Check if billing data is loaded
  const isBillingDataLoading = useMemo(() => {
    return !(billingData && billingData.fullName);
  }, [billingData]);

  // Initialize Stripe readiness
  useEffect(() => {
    stripePromise.then(() => setStripeReady(true));
  }, []);

  // Fetch price when debounced coins change
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found');
        
        const priceData = await calculateCoinPrice(debouncedCoins, token);
        if (!priceData || typeof priceData.finalPrice !== 'number') {
          throw new Error('Invalid price data received');
        }
        setAmount(priceData.finalPrice);
      } catch (err) {
        console.error('Price calculation error:', err);
        setAlert({ 
          type: 'error', 
          message: err.message || 'Failed to calculate price',
          duration: 8000
        });
        setAmount(0);
      }
    };
    
    if (debouncedCoins > 0) {
      fetchPrice();
    }
  }, [debouncedCoins]);

  // Get country code from billing data
  const getCountryCode = useCallback((countryName) => {
    if (!countryName) return null;
    const country = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    return country ? country.code : null;
  }, [countries]);

  // Check if can proceed to next step
  const canProceedToNextStep = useMemo(() => {
    switch (currentStep) {
      case 1: 
        return coins > 0 && amount > 0;
      case 2: 
        return paymentMethod !== '';
      case 3: 
        return paymentMethod === 'mpesa' 
          ? phoneNumber.length >= 9 
          : cardComplete.cardNumber && cardComplete.cardExpiry && cardComplete.cardCvc;
      default: 
        return false;
    }
  }, [currentStep, coins, amount, paymentMethod, phoneNumber, cardComplete]);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps && canProceedToNextStep) {
      setCurrentStep(currentStep + 1);
      setAlert(null);
    }
  }, [currentStep, totalSteps, canProceedToNextStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setAlert(null);
    }
  }, [currentStep]);

  // Card change handlers
  const handleCardChange = useCallback((field) => (event) => {
    if (field === 'cardNumber') {
      setCardBrand(event.brand || null);
    }
    
    setCardComplete(prev => ({
      ...prev,
      [field]: event.complete
    }));
  }, []);

  // Coin amount handlers
  const handleCoinChange = useCallback((e) => {
    const value = parseInt(e.target.value) || 50;
    setCoins(Math.max(50, Math.round(value / 50) * 50));
  }, []);

  const incrementCoins = useCallback(() => {
    setCoins(prev => prev + 50);
  }, []);

  const decrementCoins = useCallback(() => {
    setCoins(prev => Math.max(50, prev - 50));
  }, []);

  // Payment submission
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    
    if (!amount || amount <= 0) {
      setAlert({
        type: 'error',
        message: 'Invalid amount. Please try again.',
        duration: 5000
      });
      return;
    }

    const hasRequiredBillingInfo = billingData && 
      billingData.fullName && 
      billingData.country && 
      billingData.city && 
      billingData.address && 
      billingData.contactNo;

    if (!hasRequiredBillingInfo) {
      setAlert({
        type: 'error',
        message: 'Please complete your billing information first',
        duration: 5000
      });
      return;
    }
    
    const countryCode = getCountryCode(billingData.country);
    if (!countryCode) {
      setAlert({
        type: 'error',
        message: 'Invalid country. Please check your billing information.',
        duration: 5000
      });
      return;
    }
    
    setLoading(true);
    setAlert(null);

    try {
      if (paymentMethod === 'mpesa') {
        setMpesaLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const result = await buyCoinMpesa(
          userId,
          phoneNumber,
          amount,
          coins,
          token
        );

        if (result.headers.responseCode !== 200) throw new Error(result.headers.customerMessage || 'M-Pesa payment failed');

        setPurchasedCoins(coins);
        setPurchaseSuccess(true);
        setAlert({ 
          type: 'success', 
          message: `M-Pesa payment request sent to ${phoneNumber}. Please check your phone and follow the instructions to enter your M-Pesa PIN and complete the payment.`,
          duration: 10000
        });
        
        setTimeout(() => {
          onSuccess();
        }, 3500);
        return;
      }

      // Stripe payment
      if (!stripe || !elements) {
        throw new Error('Payment system not ready');
      }

      const { paymentMethod: stripePaymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: billingData.fullName,
          email: localStorage.getItem('userEmail') || '',
          phone: billingData.contactNo,
          address: {
            line1: billingData.address,
            city: billingData.city,
            state: billingData.state,
            country: countryCode
          }
        }
      });

      if (stripeError) throw stripeError;

      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');
      
      const billingAddress = {
        fullName: billingData.fullName,
        country: billingData.country,
        state: billingData.state || '',
        city: billingData.city,
        address: billingData.address,
        contactNo: billingData.contactNo
      };

      const result = await buyCoins(
        userId,
        {
          amount,
          currency: 'USD',
          numberOfCoins: coins,
          cardToken: stripePaymentMethod.id,
          billingAddress,
          idempotencyKey: crypto.randomUUID()
        },
        token
      );

      if (result.headers.responseCode !== 200) throw new Error(result.headers.customerMessage || 'Purchase failed');

      setPurchasedCoins(coins);
      setPurchaseSuccess(true);
      setAlert({ 
        type: 'success', 
        message: `${coins} coins will be added to your wallet!`,
        duration: 5000
      });
      
      setTimeout(() => {
        onSuccess();
      }, 3500);
    } catch (err) {
      console.error('Payment error:', err);
      setAlert({ 
        type: 'error', 
        message: err.message || 'Payment failed. Please try again.',
        duration: 8000
      });
    } finally {
      setLoading(false);
      setMpesaLoading(false);
    }
  }, [
    amount, 
    billingData, 
    getCountryCode, 
    paymentMethod, 
    phoneNumber, 
    coins, 
    userId, 
    onSuccess, 
    stripe, 
    elements
  ]);

  // Define all step contents at the top level using useMemo
  const step1Content = useMemo(() => (
    <div className="space-y-6">
      {isBillingDataLoading ? (
        <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ) : (
        billingData?.fullName && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaUser className="text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Billing Information</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">{billingData.fullName}</span></p>
              <p>{billingData.address}, {billingData.city}</p>
              <p>{billingData.country} • {billingData.contactNo}</p>
            </div>
          </div>
        )
      )}

      <div className="text-center space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Select Coins</h3>
          <p className="text-gray-600 text-sm">Choose the number of coins you'd like to purchase</p>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <button
            type="button"
            onClick={decrementCoins}
            className="w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
            disabled={coins <= 50}
          >
            <span className="text-gray-600 font-bold">−</span>
          </button>
          
          <div className="text-center mx-6">
            <input
              type="number"
              min="50"
              step="50"
              value={coins}
              onChange={handleCoinChange}
              className="text-3xl font-bold text-indigo-600 w-24 text-center border-b-2 border-indigo-200 focus:border-indigo-500 focus:outline-none bg-transparent"
            />
            <div className="text-xs text-gray-500 mt-1">coins</div>
          </div>
          
          <button
            type="button"
            onClick={incrementCoins}
            className="w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all shadow-sm"
          >
            <span className="text-gray-600 font-bold">+</span>
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-indigo-700">
              {amount > 0 ? `$${amount.toFixed(2)}` : 'Calculating...'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {coins} coins at ${(amount/coins).toFixed(2)} per coin
          </div>
        </div>
      </div>
    </div>
  ), [isBillingDataLoading, billingData, coins, amount, handleCoinChange, decrementCoins, incrementCoins]);

  const step2Content = useMemo(() => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Method</h3>
        <p className="text-gray-600 text-sm">Choose how you'd like to pay</p>
      </div>
      
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
            paymentMethod === 'card' 
              ? 'border-indigo-500 bg-indigo-50 shadow-md' 
              : 'border-gray-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${
              paymentMethod === 'card' 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              <FaCreditCard />
            </div>
            <div>
              <div className="font-medium text-gray-800">Credit/Debit Card</div>
              <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
            </div>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => setPaymentMethod('mpesa')}
          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
            paymentMethod === 'mpesa' 
              ? 'border-green-500 bg-green-50 shadow-md' 
              : 'border-gray-200 hover:border-green-300'
          }`}
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${
              paymentMethod === 'mpesa' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              <FaMobileAlt />
            </div>
            <div>
              <div className="font-medium text-gray-800">M-Pesa</div>
              <div className="text-sm text-gray-500">Pay via mobile money</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  ), [paymentMethod]);

  const step3Content = useMemo(() => {
    if (paymentMethod === 'card' && !stripeReady) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    return paymentMethod === 'card' ? (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="border border-gray-300 rounded-lg p-2 h-10 bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <CardNumberElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    '::placeholder': { color: '#9ca3af' },
                  },
                  invalid: { color: '#ef4444' },
                },
              }}
              onChange={handleCardChange('cardNumber')}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="border border-gray-300 rounded-lg p-2 h-10 bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1f2937',
                      '::placeholder': { color: '#9ca3af' },
                    },
                    invalid: { color: '#ef4444' },
                  },
                }}
                onChange={handleCardChange('cardExpiry')}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <div className="border border-gray-300 rounded-lg p-2 h-10 bg-white focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1f2937',
                      '::placeholder': { color: '#9ca3af' },
                    },
                    invalid: { color: '#ef4444' },
                  },
                }}
                onChange={handleCardChange('cardCvc')}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-2 pt-2">
          {Object.entries({
            visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png',
            mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png',
            amex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png',
          }).map(([brand, logo]) => (
            <img 
              key={brand}
              src={logo} 
              alt={brand} 
              className={`h-6 transition-opacity ${cardBrand === brand ? 'opacity-100' : 'opacity-30'}`}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">+254</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="7XX XXX XXX"
              className="block w-full pl-14 pr-3 py-2 h-10 border border-gray-300 rounded-lg bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You'll receive an M-Pesa prompt on this number
          </p>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Ensure your M-Pesa PIN is ready. You'll receive a payment request on your phone.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }, [paymentMethod, stripeReady, phoneNumber, cardBrand, handleCardChange]);

  // Success view
  if (purchaseSuccess) {
    return (
      <div className="p-8 text-center">
        <div className="mb-6 animate-bounce">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
            <FaCheckCircle className="relative text-green-500 text-5xl mx-auto" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {paymentMethod === 'mpesa' ? 'Payment Request Sent!' : 'Payment Successful!'}
        </h3>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
          {paymentMethod === 'mpesa' ? (
            <>
              <p className="text-lg text-gray-700 mb-3">
                We've sent an STK push request to <span className="font-bold">{phoneNumber}</span>
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-left">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-700">
                      Please check your phone and follow the M-Pesa instructions to complete the payment.
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Once confirmed, <span className="font-bold">{purchasedCoins} coins</span> will be added to your wallet.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-lg text-gray-700">
              <span className="font-bold text-green-600">{purchasedCoins} coins</span>will be added to your wallet!
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)}
          duration={alert.duration}
        />
      )}
      
      {currentStep === 1 && step1Content}
      {currentStep === 2 && step2Content}
      {currentStep === 3 && step3Content}
      
      <div className="flex justify-between pt-4 border-t border-gray-200 mt-6">
        <button
          type="button"
          onClick={currentStep === 1 ? onClose : prevStep}
          className="flex items-center px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors rounded-lg border border-gray-300 hover:bg-gray-50"
          disabled={loading}
        >
          <FaArrowLeft className="mr-2" />
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </button>
        
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceedToNextStep || loading}
            className={`flex items-center px-6 py-2.5 rounded-lg font-medium transition-all ${
              canProceedToNextStep && !loading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
            <FaArrowRight className="ml-2" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !canProceedToNextStep}
            className={`flex items-center px-6 py-2.5 rounded-lg font-medium transition-all ${
              loading || !canProceedToNextStep
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {paymentMethod === 'mpesa' && mpesaLoading ? 'Sending M-Pesa...' : 'Processing...'}
              </>
            ) : (
              <>
                Pay ${amount.toFixed(2)}
                <FaLock className="ml-2 text-xs" />
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
        <FaLock className="text-green-600 text-xs" />
        <span>Your payment is secure and encrypted</span>
      </div>
    </div>
  );
};

// Main Modal Component
const BuyCoinsModal = ({ userId, isOpen, onClose, onSuccess, billingInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FaCoins className="mr-3 text-yellow-300" />
                Buy Coins
              </h2>
              <p className="mt-1 opacity-90 text-sm">Add coins to your wallet</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-200 focus:outline-none text-xl transition-transform hover:rotate-90"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <BuyCoinsForm 
              userId={userId} 
              onSuccess={() => {
                onSuccess();
                onClose();
              }} 
              onClose={onClose} 
              billingInfo={billingInfo}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

BuyCoinsModal.propTypes = {
  userId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  billingInfo: PropTypes.shape({
    fullName: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
    address: PropTypes.string,
    contactNo: PropTypes.string,
    state: PropTypes.string,
    body: PropTypes.shape({
      data: PropTypes.oneOfType([
        PropTypes.shape({
          body: PropTypes.shape({
            data: PropTypes.object
          })
        }),
        PropTypes.object
      ])
    })
  })
};

export default BuyCoinsModal;