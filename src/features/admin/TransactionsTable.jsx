import { Eye, Search } from 'lucide-react';  // Added Search to the imports


const formatDate = (dateInput) => {
  if (!dateInput) return '';
  
  try {
    if (Array.isArray(dateInput)) {
      const [year, month, day, hours = 0, minutes = 0] = dateInput;
      const jsMonth = month >= 1 ? month - 1 : month;
      const date = new Date(year, jsMonth, day, hours, minutes);
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    
    return '';
  } catch (e) {
    console.error("Error formatting date:", e, dateInput);
    return '';
  }
};

const TransactionsTable = ({ 
  transactions, 
  pagination, 
  loading, 
  error,
  onViewTransaction,
  onPageChange 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-800 font-semibold mb-2">Error Loading Transactions</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more results.</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">{txn.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{txn.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-semibold text-gray-900">${txn.finalAmount}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${txn.entryType === 'DEBIT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {txn.entryType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(txn.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${txn.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => onViewTransaction(txn.id)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
            <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalItems} total)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-4 py-2 border rounded-lg transition-colors ${pagination.currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className={`px-4 py-2 border rounded-lg transition-colors ${pagination.currentPage >= pagination.totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionsTable;