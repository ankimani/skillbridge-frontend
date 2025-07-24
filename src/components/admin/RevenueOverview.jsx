import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchRevenueChartData } from '../services/dashboardTotals';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RevenueOverview = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchRevenueChartData(timeRange);
        if (response.success) {
          // Transform data for Recharts
          const transformedData = response.labels.map((label, index) => ({
            name: label,
            revenue: response.data[index]
          }));
          setChartData({
            labels: response.labels,
            data: transformedData,
            total: response.total
          });
        }
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  const renderChart = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (timeRange === 'year' && chartType === 'pie') {
      return (
        <PieChart width={800} height={400}>
          <Pie
            data={chartData.data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="revenue"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Revenue']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
        </PieChart>
      );
    }

    return (
      <BarChart
        data={chartData.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip 
          formatter={(value) => [`$${value}`, 'Revenue']}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Revenue Overview</h2>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'quarter' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Quarterly
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'year' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Yearly
            </button>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm rounded-md ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Bar
            </button>
            {timeRange === 'year' && (
              <button
                onClick={() => setChartType('pie')}
                className={`px-3 py-1 text-sm rounded-md ${chartType === 'pie' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Pie
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        {!loading && `Total: $${new Intl.NumberFormat('en-US').format(chartData.total || 0)}`}
      </div>
    </div>
  );
};

export default RevenueOverview;