import { useState, useEffect } from 'react';
import { fetchDashboardTotals } from '../services/dashboardTotals';
import SidebarNavigation from './SidebarNavigation';
import TopHeader from './TopHeader';
import DashboardStats from './DashboardStats';
import RecentTeachersTable from './RecentTeachersTable';
import RecentStudentsTable from './RecentStudentsTable';
import RevenueOverview from './RevenueOverview';
import TeachersTab from './TeachersTab';
import StudentsTab from './StudentsTab';
import UsersTab from './usermanagement/UsersTab';
import TransactionsTab from './TransactionsTab';
import PricingTab from './PricingTab';
import SettingsTab from './SettingsTab';
import BulkDiscountTab from './BulkDiscountTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    students: 0,
    professionals: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    dailyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const totals = await fetchDashboardTotals();
        setStats({
          students: totals.totalStudents,
          professionals: totals.totalProfessionals,
          totalRevenue: totals.totalRevenue,
          monthlyRevenue: totals.monthlyRevenue,
          dailyRevenue: totals.dailyRevenue
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const toggleUserStatus = (userId) => {
    console.log(`Toggle status for user ${userId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats stats={stats} />
            <RevenueOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTeachersTable />
              <RecentStudentsTable />
            </div>
          </div>
        );
      case 'teachers':
        return <TeachersTab />;
      case 'students':
        return <StudentsTab />;
      case 'users':
        return <UsersTab toggleUserStatus={toggleUserStatus} />;
      case 'transactions':
        return <TransactionsTab />;
      case 'pricing':
        return <PricingTab />;
        case 'discounts':
        return <BulkDiscountTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopHeader activeTab={activeTab} />
        
        <div className="flex-1 overflow-auto p-6">
          {loading && activeTab === 'dashboard' ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;