import createApiInstance from "./apiInterceptor";
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8089";
const API_URL = `${BACKEND_BASE_URL}/api/v1/dashboard`;
const TRN_URL = `${BACKEND_BASE_URL}/api/v1`;

// Create API instances with interceptors
const dashboardApi = createApiInstance(API_URL);
const transactionApi = createApiInstance(TRN_URL);

// Get dashboard totals with growth metrics
export const fetchDashboardTotals = async () => {
  try {
    const response = await dashboardApi.get("/totals");
    
    return {
      totalProfessionals: response.data.totalProfessionals || 0,
      monthlyRevenue: response.data.monthlyRevenue || 0.0,
      totalStudents: response.data.totalStudents || 0,
      totalRevenue: response.data.totalRevenue || 0.0,
      dailyRevenue: response.data.dailyRevenue || 0.0,
      // Growth metrics
      monthlyGrowth: response.data.monthlyGrowth || 0.0,
      dailyGrowth: response.data.dailyGrowth || 0.0,
      yearlyGrowth: response.data.yearlyGrowth || 0.0,
      studentGrowth: response.data.studentGrowth || 0.0,
      professionalGrowth: response.data.professionalGrowth || 0.0
    };
  } catch (error) {
    console.error("Failed to fetch dashboard totals:", error);
    return {
      totalProfessionals: 0,
      monthlyRevenue: 0.0,
      totalStudents: 0,
      totalRevenue: 0.0,
      dailyRevenue: 0.0,
      monthlyGrowth: 0.0,
      dailyGrowth: 0.0,
      yearlyGrowth: 0.0,
      studentGrowth: 0.0,
      professionalGrowth: 0.0
    };
  }
};

// Get revenue chart data by time range
export const fetchRevenueChartData = async (range = "month") => {
  try {
    const response = await dashboardApi.get("/revenue-chart", {
      params: { range }
    });
    
    return {
      success: true,
      labels: response.data.labels || [],
      data: response.data.data || [],
      total: response.data.total || 0
    };
  } catch (error) {
    console.error("Failed to fetch revenue chart data:", error);
    return {
      success: false,
      labels: [],
      data: [],
      total: 0,
      error: error.response?.data?.message || error.message
    };
  }
};

// Get revenue statistics with growth comparisons
export const fetchRevenueStats = async () => {
  try {
    const response = await dashboardApi.get("/revenue-stats");
    
    return {
      success: true,
      currentMonth: response.data.currentMonth || 0.0,
      currentDay: response.data.currentDay || 0.0,
      totalRevenue: response.data.totalRevenue || 0.0,
      monthlyGrowth: response.data.monthlyGrowth || 0.0,
      dailyGrowth: response.data.dailyGrowth || 0.0,
      yearlyGrowth: response.data.yearlyGrowth || 0.0
    };
  } catch (error) {
    console.error("Failed to fetch revenue stats:", error);
    return {
      success: false,
      currentMonth: 0.0,
      currentDay: 0.0,
      totalRevenue: 0.0,
      monthlyGrowth: 0.0,
      dailyGrowth: 0.0,
      yearlyGrowth: 0.0,
      error: error.response?.data?.message || error.message
    };
  }
};

// Get paginated transactions with filters (existing)
export const fetchTransactions = async (
  page = 1, 
  size = 10, 
  filters = {}
) => {
  try {
    const params = {
      page,
      size,
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.status && { status: filters.status }),
      ...(filters.user && { email: filters.user }),
      ...(filters.transactionId && { transactionUuid: filters.transactionId }),
      ...(filters.transactionType && { entryType: filters.transactionType }),
      ...(filters.stripeCheckoutId && { stripePaymentId: filters.stripeCheckoutId })
    };

    const response = await transactionApi.get("/transactions/all", { params });

    const responseData = response.data.body.data;
    
    return {
      success: true,
      transactions: responseData.transactions || [],
      pagination: {
        currentPage: responseData.currentPage || page,
        totalPages: responseData.totalPages || 1,
        totalItems: responseData.totalItems || 0
      },
      headers: response.data.headers
    };
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return {
      success: false,
      transactions: [],
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalItems: 0
      },
      error: error.response?.data?.message || error.message
    };
  }
};

// Get transaction details (existing)
export const fetchTransactionDetails = async (transactionId) => {
  try {
    const response = await transactionApi.get(`/transactions/all/${transactionId}`);
    return {
      success: true,
      transaction: response.data.body.data,
      headers: response.data.headers
    };
  } catch (error) {
    console.error("Failed to fetch transaction details:", error);
    return {
      success: false,
      transaction: null,
      error: error.response?.data?.message || error.message
    };
  }
};