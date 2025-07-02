import { PieChart, User, Users, DollarSign, CreditCard, Settings } from 'lucide-react';

const SidebarNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-indigo-800">
        <div className="flex items-center justify-center h-16 px-4 bg-indigo-900">
          <h1 className="text-white font-bold text-xl">Admin Panel</h1>
        </div>
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'dashboard' ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
            >
              <PieChart className="mr-3 h-5 w-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'teachers' ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
            >
              <User className="mr-3 h-5 w-5" />
              Teachers
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'students' ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
            >
              <Users className="mr-3 h-5 w-5" />
              Students
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'users' ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
            >
              <Users className="mr-3 h-5 w-5" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'transactions' ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
            >
              <DollarSign className="mr-3 h-5 w-5" />
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'pricing' ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('discounts')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'discounts' ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Discounts
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'settings' ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;