import { useEffect, useState } from 'react';
import PricingService from '../../components/services/pricing';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const PricingTab = () => {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Modal states
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await PricingService.getCurrentPricing();
        if (response.success) {
          setPricingData(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to fetch pricing data');
        console.error('Error fetching pricing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return 'N/A';
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openPriceModal = () => {
    setNewPrice(pricingData.basePricePerCoin.toFixed(4));
    setPriceError('');
    setShowPriceModal(true);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setNewPrice(value);
    
    // Validate input
    if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
      setPriceError('Please enter a valid positive number');
    } else {
      setPriceError('');
    }
  };

  const proceedToConfirmation = () => {
    if (!priceError && newPrice) {
      setShowPriceModal(false);
      setShowConfirmModal(true);
    }
  };

  const handleUpdatePrice = async () => {
    setShowConfirmModal(false);
    setIsUpdating(true);
    
    try {
      const response = await PricingService.updatePricing(parseFloat(newPrice));
      
      if (response.success) {
        setPricingData(response.data);
        setSuccessMessage({
          title: 'Price Update Successful',
          message: `Coin price has been updated to $${parseFloat(newPrice).toFixed(4)} USD.`
        });
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.error || 'Failed to update price');
      }
    } catch (err) {
      setError('Error updating price. Please try again.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Pricing Management</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Pricing Management</h2>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Loading Pricing Data</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
      {/* Price Input Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Update Coin Price
                </h3>
                <div className="mt-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    New Price (USD)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 py-2 sm:text-sm border border-gray-300 rounded-md"
                      placeholder="0.00"
                      value={newPrice}
                      onChange={handlePriceChange}
                    />
                  </div>
                  {priceError && <p className="mt-1 text-sm text-red-600">{priceError}</p>}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={proceedToConfirmation}
                  disabled={!!priceError || !newPrice}
                >
                  Continue
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPriceModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Info className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Price Update
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are about to change the coin price from <span className="font-semibold">${pricingData.basePricePerCoin.toFixed(4)}</span> to <span className="font-semibold">${parseFloat(newPrice).toFixed(4)}</span>.
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        This change will affect all future transactions. Are you sure you want to continue?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleUpdatePrice}
                >
                  Confirm Update
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pricing Management</h2>
          <p className="text-gray-600">Current coin pricing configuration</p>
        </div>
        <button
          onClick={openPriceModal}
          disabled={isUpdating}
          className={`px-6 py-3 rounded-lg font-medium flex items-center ${
            isUpdating 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 transition-colors'
          } text-white shadow-md`}
        >
          {isUpdating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : (
            'Update Coin Price'
          )}
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-start">
          <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-green-800">{successMessage.title}</h3>
            <p className="text-green-600">{successMessage.message}</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Per Coin (USD)</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pricingData && (
              <tr key={pricingData.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pricingData.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  ${pricingData.basePricePerCoin.toFixed(4)} USD
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(pricingData.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pricingData.createdBy || 'System'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(pricingData.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pricingData.updatedBy || 'System'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Note:</span> Changing the coin price will affect all future transactions. Please verify carefully before updating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTab;