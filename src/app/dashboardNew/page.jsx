'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard-layout';
import { useState, useEffect } from 'react';

export default function DashboardNew() {
  const { data: session } = useSession();

   const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [dailyTrackerLoading, setDailyTrackerLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netAmount: 0,
    avgDailyIncome: 0,
    avgDailyExpense: 0,
  });

  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState({
    income: [],
    expenses: [],
  });
  const [weeklyTrends, setWeeklyTrends] = useState([]);
  const [monthlyComparison, setMonthlyComparison] = useState({});
  const [topCategories, setTopCategories] = useState({
    income: [],
    expenses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30");

  const categories = {
    income: ["Salary", "Freelance", "Investment", "Business", "Gift", "Other"],
    expense: [
      "Food",
      "Transportation",
      "Housing",
      "Healthcare",
      "Entertainment",
      "Shopping",
      "Bills",
      "Other",
    ],
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Realistic income and expense data that matches Daily Tracker
      const incomeData = [
        { name: "Salary", amount: 5000 },
        { name: "Business", amount: 2500 },
        { name: "Freelance", amount: 1200 },
        { name: "Investment", amount: 800 },
        { name: "Gift", amount: 500 },
        { name: "Other", amount: 300 },
      ];

      const expenseData = [
        { name: "Housing", amount: 2000 },
        { name: "Food", amount: 1200 },
        { name: "Shopping", amount: 900 },
        { name: "Transportation", amount: 800 },
        { name: "Bills", amount: 700 },
        { name: "Entertainment", amount: 600 },
        { name: "Healthcare", amount: 400 },
        { name: "Other", amount: 300 },
      ];

      const totalIncome = incomeData.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      const totalExpenses = expenseData.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      const netBalance = totalIncome - totalExpenses;

      // Generate realistic daily trends based on actual data
      const dailyTrends = Array.from(
        { length: parseInt(dateRange) },
        (_, i) => {
          const date = new Date(
            Date.now() - (parseInt(dateRange) - 1 - i) * 24 * 60 * 60 * 1000,
          );
          const dayOfWeek = date.getDay();

          // Weekend vs weekday variations
          const weekendMultiplier =
            dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0;
          const baseIncome =
            (totalIncome / parseInt(dateRange)) * weekendMultiplier;
          const baseExpense =
            (totalExpenses / parseInt(dateRange)) * (weekendMultiplier + 0.2);

          return {
            date: date.toISOString().split("T")[0],
            income: Math.max(
              0,
              baseIncome + (Math.random() - 0.5) * baseIncome * 0.4,
            ),
            expenses: Math.max(
              0,
              baseExpense + (Math.random() - 0.5) * baseExpense * 0.3,
            ),
          };
        },
      );

      // Create category breakdown from realistic data
      const categoryBreakdown = {
        income: incomeData
          .filter((cat) => cat.amount > 0)
          .map((cat) => ({ category: cat.name, amount: cat.amount.toString() }))
          .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)),
        expenses: expenseData
          .filter((cat) => cat.amount > 0)
          .map((cat) => ({ category: cat.name, amount: cat.amount.toString() }))
          .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)),
      };

      // Generate weekly trends with realistic variations
      const weeklyTrends = [];
      for (let week = 0; week < 4; week++) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (4 - week) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekIncome = totalIncome * (0.8 + Math.random() * 0.4);
        const weekExpenses = totalExpenses * (0.8 + Math.random() * 0.4);

        weeklyTrends.push({
          startDate: weekStart.toISOString().split("T")[0],
          endDate: weekEnd.toISOString().split("T")[0],
          income: weekIncome,
          expenses: weekExpenses,
          balance: weekIncome - weekExpenses,
        });
      }

      // Generate monthly comparison with realistic data
      const currentMonthIncome = totalIncome * 4; // Weekly data * 4
      const currentMonthExpenses = totalExpenses * 4;
      const previousMonthIncome = currentMonthIncome * 0.92; // 8% less than current
      const previousMonthExpenses = currentMonthExpenses * 1.05; // 5% more than current

      const mockData = {
        summary: {
          totalIncome: currentMonthIncome,
          totalExpenses: currentMonthExpenses,
          netBalance: currentMonthIncome - currentMonthExpenses,
          avgDailyIncome: currentMonthIncome / 30,
          avgDailyExpense: currentMonthExpenses / 30,
        },
        dailyTrends,
        categoryBreakdown,
        weeklyTrends,
        monthlyComparison: {
          currentMonth: {
            income: currentMonthIncome,
            expenses: currentMonthExpenses,
          },
          previousMonth: {
            income: previousMonthIncome,
            expenses: previousMonthExpenses,
          },
          incomeChange:
            ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) *
            100,
          expenseChange:
            ((currentMonthExpenses - previousMonthExpenses) /
              previousMonthExpenses) *
            100,
        },
      };

      setSummary({
        totalIncome: mockData.summary?.totalIncome || 0,
        totalExpenses: mockData.summary?.totalExpenses || 0,
        netAmount: mockData.summary?.netBalance || 0,
        avgDailyIncome: mockData.summary?.avgDailyIncome || 0,
        avgDailyExpense: mockData.summary?.avgDailyExpense || 0,
      });
      setDailyData(mockData.dailyTrends || []);
      setCategoryData({
        income: mockData.categoryBreakdown?.income || [],
        expenses: mockData.categoryBreakdown?.expenses || [],
      });
      setWeeklyTrends(mockData.weeklyTrends || []);
      setMonthlyComparison(mockData.monthlyComparison || {});
      setTopCategories({
        income: mockData.topIncomeCategories || [],
        expenses: mockData.topExpenseCategories || [],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const renderDailyChart = () => {
    if (!dailyData.length) return null;

    const maxAmount = Math.max(
      ...dailyData.map((d) => Math.max(d.income, d.expenses)),
    );
    const chartHeight = 200;

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Daily Trends (Last {dateRange} days)
        </h3>
        <div className="relative" style={{ height: chartHeight + 40 }}>
          <svg
            width="100%"
            height={chartHeight + 40}
            className="overflow-visible"
          >
            {dailyData.map((day, index) => {
              const x = (index / (dailyData.length - 1)) * 100;
              const incomeHeight =
                maxAmount > 0 ? (day.income / maxAmount) * chartHeight : 0;
              const expenseHeight =
                maxAmount > 0 ? (day.expenses / maxAmount) * chartHeight : 0;

              return (
                <g key={day.date}>
                  <rect
                    x={`${x - 1.5}%`}
                    y={chartHeight - incomeHeight}
                    width="1.5%"
                    height={incomeHeight}
                    fill="#10B981"
                    opacity="0.8"
                  />
                  <rect
                    x={`${x + 0.5}%`}
                    y={chartHeight - expenseHeight}
                    width="1.5%"
                    height={expenseHeight}
                    fill="#EF4444"
                    opacity="0.8"
                  />
                  <text
                    x={`${x}%`}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6B7280"
                  >
                    {new Date(day.date).getDate()}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex justify-center mt-2 space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              <span>Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
              <span>Expenses</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyTrends = () => {
    if (!weeklyTrends.length) return null;

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Performance
        </h3>
        <div className="space-y-4">
          {weeklyTrends.map((week, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Week {index + 1}
                </p>
                <p className="text-xs text-gray-500">
                  {week.startDate} - {week.endDate}
                </p>
              </div>
              <div className="flex space-x-6 text-sm">
                <div className="text-center">
                  <p className="text-green-600 font-semibold">
                    ₹{week.income.toFixed(0)}
                  </p>
                  <p className="text-gray-500">Income</p>
                </div>
                <div className="text-center">
                  <p className="text-red-600 font-semibold">
                    ₹{week.expenses.toFixed(0)}
                  </p>
                  <p className="text-gray-500">Expenses</p>
                </div>
                <div className="text-center">
                  <p
                    className={`font-semibold ${
                      week.balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{week.balance.toFixed(0)}
                  </p>
                  <p className="text-gray-500">Balance</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthlyComparison = () => {
    if (!monthlyComparison.currentMonth) return null;

    const incomeChange = monthlyComparison.incomeChange || 0;
    const expenseChange = monthlyComparison.expenseChange || 0;

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Current Month Income
              </span>
              <span className="text-lg font-semibold text-green-600">
                ₹{monthlyComparison.currentMonth.income.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Previous Month Income
              </span>
              <span className="text-lg font-semibold text-gray-900">
                ₹{monthlyComparison.previousMonth.income.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Income Change</span>
              <span
                className={`text-sm font-semibold ${
                  incomeChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {incomeChange >= 0 ? "+" : ""}
                {incomeChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Current Month Expenses
              </span>
              <span className="text-lg font-semibold text-red-600">
                ₹{monthlyComparison.currentMonth.expenses.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Previous Month Expenses
              </span>
              <span className="text-lg font-semibold text-gray-900">
                ₹{monthlyComparison.previousMonth.expenses.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expense Change</span>
              <span
                className={`text-sm font-semibold ${
                  expenseChange <= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {expenseChange >= 0 ? "+" : ""}
                {expenseChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryChart = (data, type) => {
    if (!data.length) return null;

    const total = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const colors =
      type === "income"
        ? ["#10B981", "#059669", "#047857", "#065F46", "#064E3B"]
        : ["#EF4444", "#DC2626", "#B91C1C", "#991B1B", "#7F1D1D"];

    return (
      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => {
          const percentage =
            total > 0 ? (parseFloat(item.amount) / total) * 100 : 0;
          return (
            <div
              key={item.category}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm text-gray-700 truncate">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  ₹{parseFloat(item.amount).toFixed(0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleDailyTrackerClick = async () => {
    setDailyTrackerLoading(true);
    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 1500));
    window.location.href = "/daily-tracker";
  };

  const handleSignOut = () => {
    setUser(null);
  };
const handleNavigate = (href) => {
    window.location.href = href;
  };

  const CommonHeader = ({
    title,
    currentPage,
    user,
    onSignOut,
    onNavigate,
  }) => {
    const navigationItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/financial-dashboard",
        icon: "fas fa-chart-line",
      },
      {
        id: "daily-tracker",
        label: "Daily Tracker",
        href: "/daily-tracker",
        icon: "fas fa-calendar-day",
      },
    ];
 return (
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#357AFF]">
                  <i className="fas fa-chart-pie text-white text-sm"></i>
                </div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {title}
                </h1>
              </div>

              <nav className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.href)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? "bg-[#357AFF] text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <i className="fas fa-user text-gray-600 text-sm"></i>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {user?.email || "Guest"}
                </span>
              </div>

              <button
                onClick={onSignOut}
                className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.href)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? "bg-[#357AFF] text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <i className="fas fa-user text-gray-600 text-sm"></i>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {user?.email || "Guest"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Fetch dashboard data here
    const fetchData = async () => {
      // Add your data fetching logic here
      // For now, using mock data
      setSummary({
        totalIncome: 50000,
        totalExpenses: 30000,
        netAmount: 20000,
        avgDailyIncome: 1666.67,
        avgDailyExpense: 1000,
      });
    };

    fetchData();
     setUser({ email: "demo@example.com" });
    fetchDashboardData();
  }, [dateRange]);

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">
            Income & Expense Tracker
          </h1>
          <p className="mb-8 text-gray-600">
            Track your income and expenses with ease
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setUser({ email: "demo@example.com" })}
              className="block w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE]"
            >
              Demo Login
            </button>
            <button
              onClick={() => setUser({ email: "demo@example.com" })}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">

             {/* Use the common header component */}
      <CommonHeader
        title="Financial Dashboard"
        currentPage="dashboard"
        user={user}
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
            >
                <option value="1">To day</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDailyTrackerClick}
              disabled={dailyTrackerLoading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dailyTrackerLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Loading...
                </>
              ) : (
                <>
                  <i className="fas fa-calendar-day mr-2"></i>
                  Daily Tracker
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-arrow-up text-2xl text-green-500"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Income
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{summary.totalIncome?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-arrow-down text-2xl text-red-500"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Expenses
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{summary.totalExpenses?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i
                  className={`fas fa-balance-scale text-2xl ${
                    summary.netAmount >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                ></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net Balance</p>
                <p
                  className={`text-2xl font-semibold ${
                    summary.netAmount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{summary.netAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-chart-line text-2xl text-blue-500"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Avg Daily Income
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{summary.avgDailyIncome?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-chart-bar text-2xl text-purple-500"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Avg Daily Expense
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{summary.avgDailyExpense?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {renderDailyChart()}
        {renderWeeklyTrends()}
        {renderMonthlyComparison()}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-chart-pie text-green-500 mr-2"></i>
              Top Income Categories
            </h3>
            {categoryData.income.length > 0 ? (
              renderCategoryChart(categoryData.income, "income")
            ) : (
              <p className="text-gray-500 text-center py-4">
                No income data available
              </p>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-chart-pie text-red-500 mr-2"></i>
              Top Expense Categories
            </h3>
            {categoryData.expenses.length > 0 ? (
              renderCategoryChart(categoryData.expenses, "expense")
            ) : (
              <p className="text-gray-500 text-center py-4">
                No expense data available
              </p>
            )}
          </div>
        </div>
      </div>


          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            New Dashboard Overview
          </h1>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-indigo-100 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-indigo-800">Total Income</h2>
              <p className="text-3xl font-bold text-indigo-600">
                ${summary.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-red-800">Total Expenses</h2>
              <p className="text-3xl font-bold text-red-600">
                ${summary.totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-800">Net Amount</h2>
              <p className="text-3xl font-bold text-green-600">
                ${summary.netAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Additional Content */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Averages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700">Average Daily Income</h3>
                <p className="text-2xl font-semibold text-indigo-600">
                  ${summary.avgDailyIncome.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700">Average Daily Expense</h3>
                <p className="text-2xl font-semibold text-red-600">
                  ${summary.avgDailyExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}