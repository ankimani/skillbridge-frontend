import { X, User, CreditCard, Calendar, Hash, DollarSign, Coins, ArrowUpRight, Clipboard, Check } from 'lucide-react';
import { useState } from 'react';

const TransactionDetailModal = ({ isOpen, onClose, transaction, loading, error }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUuid, setCopiedUuid] = useState(false);

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 7) return '';
    const [year, month, day, hours, minutes, seconds] = dateArray;
    return new Date(year, month - 1, day, hours, minutes, seconds).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Transaction Details</h2>
            {transaction && (
              <p className="text-xs text-gray-500 mt-1">
                Transaction occurred on {formatDate(transaction.createdAt)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="text-sm text-gray-600">Loading transaction details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50/50 border border-red-200 rounded-lg p-4">
                <div className="text-red-700 font-medium text-base mb-1">Error Loading Transaction</div>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={onClose}
                  className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          ) : transaction ? (
            <div className="space-y-6">
              {/* Transaction Summary */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    Status: {transaction.status}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    transaction.entryType === 'DEBIT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    Type: {transaction.entryType}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                  <p className="text-xl font-semibold text-green-600">
                    ${transaction.finalAmount?.toLocaleString()}
                    <span className="text-xs font-normal text-gray-500 ml-1">{transaction.currency}</span>
                  </p>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* User Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-base font-medium text-gray-800 flex items-center mb-2">
                      <User className="w-4 h-4 mr-2 text-indigo-500" />
                      User Details
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Registered Email</p>
                        <p className="text-sm font-normal text-gray-800">{transaction.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Identification */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-base font-medium text-gray-800 flex items-center mb-2">
                      <Hash className="w-4 h-4 mr-2 text-indigo-500" />
                      Transaction Identification
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Database Record ID</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-mono text-gray-800">{transaction.id}</p>
                          <button 
                            onClick={() => copyToClipboard(transaction.id, setCopiedId)}
                            className="text-gray-400 hover:text-indigo-600 p-1 rounded"
                            title="Copy to clipboard"
                          >
                            {copiedId ? <Check className="w-3 h-3 text-green-500" /> : <Clipboard className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Transaction Reference</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-mono text-gray-800">{transaction.transactionUuid}</p>
                          <button 
                            onClick={() => copyToClipboard(transaction.transactionUuid, setCopiedUuid)}
                            className="text-gray-400 hover:text-indigo-600 p-1 rounded"
                            title="Copy to clipboard"
                          >
                            {copiedUuid ? <Check className="w-3 h-3 text-green-500" /> : <Clipboard className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Financial Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-base font-medium text-gray-800 flex items-center mb-2">
                      <DollarSign className="w-4 h-4 mr-2 text-indigo-500" />
                      Financial Details
                    </h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Original Amount</p>
                          <p className="text-sm font-normal text-gray-800">${transaction.originalAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Applied Discount</p>
                          <p className="text-sm font-normal text-gray-800">{transaction.discountPercentage}%</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Digital Currency</p>
                        <div className="flex items-center">
                          <Coins className="w-4 h-4 mr-1 text-yellow-500" />
                          <span className="text-sm font-normal text-gray-800">{transaction.coins?.toLocaleString()} coins</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Transaction Description</p>
                        <p className="text-sm font-normal text-gray-800">{transaction.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-base font-medium text-gray-800 flex items-center mb-2">
                      <CreditCard className="w-4 h-4 mr-2 text-indigo-500" />
                      Payment Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Stripe Payment Reference</p>
                        {transaction.stripePaymentId ? (
                          <div className="flex items-center">
                            <p className="text-xs font-mono text-gray-800">{transaction.stripePaymentId}</p>
                            <a 
                              href={`https://dashboard.stripe.com/payments/${transaction.stripePaymentId}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-1 text-indigo-600 hover:text-indigo-800"
                              title="View in Stripe Dashboard"
                            >
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">Not available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-medium text-gray-800 flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                  System Timestamps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Date Created</p>
                    <p className="text-sm font-normal text-gray-800">{formatDate(transaction.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Last Updated</p>
                    <p className="text-sm font-normal text-gray-800">{formatDate(transaction.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white z-10 flex justify-end p-4 border-t border-gray-100 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Close Details
          </button>
          {transaction?.stripePaymentId && (
            <a
              href={`https://dashboard.stripe.com/payments/${transaction.stripePaymentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center"
            >
              View in Stripe <ArrowUpRight className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;