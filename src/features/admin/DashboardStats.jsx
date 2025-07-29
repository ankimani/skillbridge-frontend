import { Users, User, DollarSign, PieChart, CreditCard, ArrowUp, ArrowDown } from 'lucide-react';
import { fetchDashboardTotals } from '../../components/services/dashboardTotals';
import { useEffect, useState } from 'react';

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return new Intl.NumberFormat('en-US').format(num);
};

const DashboardStats = () => {
  const [stats, setStats] = useState({
    students: 0,
    professionals: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    dailyRevenue: 0,
    monthlyGrowth: 0,
    dailyGrowth: 0,
    yearlyGrowth: 0,
    studentGrowth: 0,
    professionalGrowth: 0
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardTotals();
      setStats(data);
    };
    loadData();
  }, []);

  const getTrendIcon = (value) => {
    return value >= 0 ? (
      <ArrowUp className="w-3 h-3 mr-1" />
    ) : (
      <ArrowDown className="w-3 h-3 mr-1" />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      {/* Students Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Students</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats.totalStudents)}</p>
            <div className={`flex items-center mt-2 text-xs font-medium ${
              stats.studentGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {getTrendIcon(stats.studentGrowth)}
              {Math.abs(stats.studentGrowth).toFixed(2)}% from last month
            </div>
          </div>
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Professionals Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Professionals</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats.totalProfessionals)}</p>
            <div className={`flex items-center mt-2 text-xs font-medium ${
              stats.professionalGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {getTrendIcon(stats.professionalGrowth)}
              {Math.abs(stats.professionalGrowth).toFixed(2)}% from last month
            </div>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${formatNumber(stats.totalRevenue)}</p>
            <div className={`flex items-center mt-2 text-xs font-medium ${
              stats.yearlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {getTrendIcon(stats.yearlyGrowth)}
              {Math.abs(stats.yearlyGrowth).toFixed(2)}% from last year
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 text-green-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Monthly Revenue Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${formatNumber(stats.monthlyRevenue)}</p>
            <div className={`flex items-center mt-2 text-xs font-medium ${
              stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {getTrendIcon(stats.monthlyGrowth)}
              {Math.abs(stats.monthlyGrowth).toFixed(2)}% from last month
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <PieChart className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Daily Revenue Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${formatNumber(stats.dailyRevenue)}</p>
            <div className={`flex items-center mt-2 text-xs font-medium ${
              stats.dailyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {getTrendIcon(stats.dailyGrowth)}
              {Math.abs(stats.dailyGrowth).toFixed(2)}% from yesterday
            </div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;