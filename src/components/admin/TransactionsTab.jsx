import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import TransactionFilters from './TransactionFilters';
import TransactionsTable from './TransactionsTable';
import TransactionDetailModal from '../pages/TransactionDetailModal';
import { fetchTransactions, fetchTransactionDetails } from '../services/dashboardTotals';

const TransactionsTab = () => {
  const [transactionFilters, setTransactionFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    user: '',
    transactionType: '',
    transactionId: '',
    stripeCheckoutId: '',
    mpesaCode: ''
  });


  const [transactionsData, setTransactionsData] = useState({
    transactions: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    },
    loading: false,
    error: null
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    loading: false,
    error: null,
    transaction: null
  });
  useEffect(() => {
    loadTransactions(1, 10);
  }, []);
  // Calculate if any filters are active
  const hasActiveFilters = Object.values(transactionFilters).some(value => value !== '');

  const handleFilterChange = (field, value) => {
    setTransactionFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilter = (field) => {
    setTransactionFilters(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const clearAllFilters = () => {
    setTransactionFilters({
      startDate: '',
      endDate: '',
      status: '',
      user: '',
      transactionType: '',
      transactionId: '',
      stripeCheckoutId: '',
      mpesaCode: ''
    });
  };

  const loadTransactions = async (page, size) => {
    try {
      setTransactionsData(prev => ({
        ...prev,
        loading: true,
        error: null
      }));
  
      const filters = {
        ...transactionFilters,
        startDate: transactionFilters.startDate || '',
        endDate: transactionFilters.endDate || ''
      };
  
      const response = await fetchTransactions(page, size, filters);
      
      if (response.success) {
        setTransactionsData({
          transactions: response.transactions || [],
          pagination: response.pagination,
          loading: false,
          error: null
        });
      } else {
        setTransactionsData(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to fetch transactions'
        }));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactionsData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const handleViewTransaction = async (id) => {
    setModalState({
      isOpen: true,
      loading: true,
      error: null,
      transaction: null
    });
  
    try {
      const response = await fetchTransactionDetails(id);
      
      if (response.success) {
        setModalState({
          isOpen: true,
          loading: false,
          error: null,
          transaction: response.transaction
        });
      } else {
        setModalState({
          isOpen: true,
          loading: false,
          error: response.error || 'Failed to fetch transaction details',
          transaction: null
        });
      }
    } catch (error) {
      console.error('Error loading transaction details:', error);
      setModalState({
        isOpen: true,
        loading: false,
        error: error.message,
        transaction: null
      });
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      loading: false,
      error: null,
      transaction: null
    });
  };

  const handlePageChange = (newPage) => {
    loadTransactions(newPage, 10);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Transactions</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
      
      <TransactionFilters
        filters={transactionFilters}
        onFilterChange={handleFilterChange}
        onClearFilter={clearFilter}
        onClearAll={clearAllFilters}
        onApplyFilters={() => loadTransactions(1, 10)}
      />

      <TransactionsTable
        transactions={transactionsData.transactions}
        pagination={transactionsData.pagination}
        loading={transactionsData.loading}
        error={transactionsData.error}
        onViewTransaction={handleViewTransaction}
        onPageChange={handlePageChange}
      />

      <TransactionDetailModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        transaction={modalState.transaction}
        loading={modalState.loading}
        error={modalState.error}
      />
    </div>
  );
};

export default TransactionsTab;