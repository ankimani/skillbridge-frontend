import { Search, X } from 'lucide-react';

const TransactionFilters = ({
  filters,
  onFilterChange,
  onClearFilter,
  onClearAll,
  onApplyFilters
}) => {
  const filterLabels = {
    startDate: 'Start Date',
    endDate: 'End Date',
    status: 'Status',
    user: 'User',
    transactionType: 'Type',
    transactionId: 'Transaction ID',
    stripeCheckoutId: 'Stripe ID',
    mpesaCode: 'M-Pesa Code'
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="mb-6 space-y-4">
      {/* Date and Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <div className="relative">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {filters.startDate && (
              <button
                onClick={() => onClearFilter('startDate')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <div className="relative">
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {filters.endDate && (
              <button
                onClick={() => onClearFilter('endDate')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
            {filters.status && (
              <button
                onClick={() => onClearFilter('status')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
          <div className="relative">
            <select
              value={filters.transactionType}
              onChange={(e) => onFilterChange('transactionType', e.target.value)}
              className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="">All Types</option>
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </select>
            {filters.transactionType && (
              <button
                onClick={() => onClearFilter('transactionType')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Fields Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search User</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.user}
              onChange={(e) => onFilterChange('user', e.target.value)}
              placeholder="Email or name..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {filters.user && (
              <button
                onClick={() => onClearFilter('user')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.transactionId}
              onChange={(e) => onFilterChange('transactionId', e.target.value)}
              placeholder="TXN-123456..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
            />
            {filters.transactionId && (
              <button
                onClick={() => onClearFilter('transactionId')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Payment ID</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.stripeCheckoutId}
              onChange={(e) => onFilterChange('stripeCheckoutId', e.target.value)}
              placeholder="pi_..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
            />
            {filters.stripeCheckoutId && (
              <button
                onClick={() => onClearFilter('stripeCheckoutId')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search & Apply</label>
          <button
            onClick={onApplyFilters}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <span
                key={key}
                className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
              >
                <span>{filterLabels[key]}: {value}</span>
                <button
                  onClick={() => onClearFilter(key)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;