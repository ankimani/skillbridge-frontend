import { useEffect, useState } from 'react';
import BulkDiscountService from '../services/bulkDiscount';
import { CheckCircle2, AlertCircle, Info, PlusCircle, Edit2, Trash2, XCircle, Check, RotateCw } from 'lucide-react';

const BulkDiscountTab = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    minCoins: '',
    discountPercentage: '',
    active: true
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await BulkDiscountService.getAllActiveDiscounts();
      if (response.success) {
        setDiscounts(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to fetch bulk discounts');
      console.error('Error fetching bulk discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.minCoins || isNaN(formData.minCoins)) {
      errors.minCoins = 'Please enter a valid minimum coins number';
    }
    
    if (!formData.discountPercentage || isNaN(formData.discountPercentage)) {
      errors.discountPercentage = 'Please enter a valid discount percentage';
    } else if (formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      errors.discountPercentage = 'Discount must be between 0 and 100';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openAddModal = () => {
    setFormData({
      minCoins: '',
      discountPercentage: '',
      active: true
    });
    setFormErrors({});
    setCurrentDiscount(null);
    setShowAddModal(true);
  };

  const openEditModal = (discount) => {
    setFormData({
      minCoins: discount.minCoins,
      discountPercentage: discount.discountPercentage,
      active: discount.active
    });
    setFormErrors({});
    setCurrentDiscount(discount);
    setShowEditModal(true);
  };

  const openDeleteModal = (discount) => {
    setCurrentDiscount(discount);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowUpdateConfirmModal(true);
  };

  const confirmUpdate = async () => {
    setShowUpdateConfirmModal(false);
    setIsProcessing(true);
    try {
      const discountData = {
        minCoins: parseInt(formData.minCoins),
        discountPercentage: parseFloat(formData.discountPercentage),
        active: formData.active
      };

      let response;
      if (currentDiscount) {
        response = await BulkDiscountService.updateBulkDiscount(
          currentDiscount.id, 
          discountData
        );
      } else {
        response = await BulkDiscountService.addBulkDiscount(discountData);
      }

      if (response.success) {
        setSuccessMessage({
          title: currentDiscount ? 'Discount Updated' : 'Discount Added',
          message: currentDiscount 
            ? 'Bulk discount has been updated successfully'
            : 'New bulk discount has been added successfully'
        });
        setTimeout(() => setSuccessMessage(null), 5000);
        fetchDiscounts();
        currentDiscount ? setShowEditModal(false) : setShowAddModal(false);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Operation failed. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeactivate = async () => {
    setIsProcessing(true);
    try {
      const response = await BulkDiscountService.deactivateDiscount(currentDiscount.id);
      
      if (response.success) {
        setSuccessMessage({
          title: 'Discount Deactivated',
          message: 'Bulk discount has been deactivated successfully'
        });
        setTimeout(() => setSuccessMessage(null), 5000);
        fetchDiscounts();
        setShowDeleteModal(false);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to deactivate discount. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
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
  const handleActivate = async () => {
    setIsProcessing(true);
    try {
      const response = await BulkDiscountService.activateDiscount(currentDiscount.id);
      
      if (response.success) {
        setSuccessMessage({
          title: 'Discount Activated',
          message: 'Bulk discount has been activated successfully'
        });
        setTimeout(() => setSuccessMessage(null), 5000);
        fetchDiscounts();
        setShowActivateModal(false);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to activate discount. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Bulk Discount Management</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Bulk Discount Management</h2>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Loading Discounts</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
      {/* Add Discount Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Add New Bulk Discount
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="minCoins" className="block text-sm font-medium text-gray-700">
                      Minimum Coins
                    </label>
                    <input
                      type="number"
                      name="minCoins"
                      id="minCoins"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        formErrors.minCoins ? 'border-red-500' : 'border'
                      }`}
                      value={formData.minCoins}
                      onChange={handleInputChange}
                      min="1"
                    />
                    {formErrors.minCoins && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.minCoins}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
                      Discount Percentage
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="discountPercentage"
                        id="discountPercentage"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formErrors.discountPercentage ? 'border-red-500' : 'border'
                        }`}
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0.01"
                        max="100"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                    {formErrors.discountPercentage && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.discountPercentage}</p>
                    )}
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="active"
                      id="active"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Add Discount'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Discount Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Edit Bulk Discount
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="minCoins" className="block text-sm font-medium text-gray-700">
                      Minimum Coins
                    </label>
                    <input
                      type="number"
                      name="minCoins"
                      id="minCoins"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        formErrors.minCoins ? 'border-red-500' : 'border'
                      }`}
                      value={formData.minCoins}
                      onChange={handleInputChange}
                      min="1"
                    />
                    {formErrors.minCoins && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.minCoins}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
                      Discount Percentage
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="discountPercentage"
                        id="discountPercentage"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          formErrors.discountPercentage ? 'border-red-500' : 'border'
                        }`}
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0.01"
                        max="100"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                    {formErrors.discountPercentage && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.discountPercentage}</p>
                    )}
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="active"
                      id="active"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Update Discount'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Deactivate Discount
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate this discount?
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Minimum coins: {currentDiscount?.minCoins}, Discount: {currentDiscount?.discountPercentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={handleDeactivate}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Deactivate'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activate Confirmation Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Activate Discount
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to activate this discount?
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Minimum coins: {currentDiscount?.minCoins}, Discount: {currentDiscount?.discountPercentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={handleActivate}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Activate'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowActivateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Confirmation Modal */}
      {showUpdateConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Info className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Discount Update
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {currentDiscount ? 'update' : 'create'} this discount?
                      </p>
                      {currentDiscount && (
                        <div className="mt-2 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Current values:</p>
                          <p className="text-sm text-gray-500">Min Coins: {currentDiscount.minCoins}</p>
                          <p className="text-sm text-gray-500">Discount: {currentDiscount.discountPercentage}%</p>
                          <p className="text-sm font-medium text-gray-700 mt-2">New values:</p>
                          <p className="text-sm text-gray-500">Min Coins: {formData.minCoins}</p>
                          <p className="text-sm text-gray-500">Discount: {formData.discountPercentage}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmUpdate}
                >
                  Confirm Update
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowUpdateConfirmModal(false)}
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
          <h2 className="text-2xl font-bold text-gray-800">Bulk Discount Management</h2>
          <p className="text-gray-600">Configure volume-based pricing discounts</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-3 rounded-lg font-medium flex items-center bg-indigo-600 hover:bg-indigo-700 transition-colors text-white shadow-md"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Discount
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

<div className="overflow-x-auto border border-gray-200 rounded-lg">
  <div className="inline-block min-w-full align-middle">
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Coins</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount %</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {discounts.length > 0 ? (
            discounts.map((discount) => (
              <tr key={discount.id} className={discount.active ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {discount.minCoins}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {discount.discountPercentage}%
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    discount.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {discount.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(discount.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {discount.createdBy || 'System Admin'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(discount.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {discount.updatedBy || 'System Admin'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(discount)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                      aria-label={`Edit discount for ${discount.minCoins} coins`}
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    {discount.active ? (
                      <button
                        onClick={() => openDeleteModal(discount)}
                        className="text-red-600 hover:text-red-900"
                        title="Deactivate"
                        aria-label={`Deactivate discount for ${discount.minCoins} coins`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentDiscount(discount);
                          setShowActivateModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Activate"
                        aria-label={`Activate discount for ${discount.minCoins} coins`}
                      >
                        <RotateCw className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                No active bulk discounts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Note:</span> Bulk discounts are applied automatically when users purchase the specified minimum coin amount or more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkDiscountTab;