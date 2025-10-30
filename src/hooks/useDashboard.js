'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const useDashboard = () => {
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

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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

      const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
      const netBalance = totalIncome - totalExpenses;

      // Generate daily trends
      const dailyTrends = Array.from({ length: parseInt(dateRange) }, (_, i) => {
        const date = new Date(Date.now() - (parseInt(dateRange) - 1 - i) * 24 * 60 * 60 * 1000);
        const dayOfWeek = date.getDay();
        const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0;
        const baseIncome = (totalIncome / parseInt(dateRange)) * weekendMultiplier;
        const baseExpense = (totalExpenses / parseInt(dateRange)) * (weekendMultiplier + 0.2);

        return {
          date: date.toISOString().split("T")[0],
          income: Math.max(0, baseIncome + (Math.random() - 0.5) * baseIncome * 0.4),
          expenses: Math.max(0, baseExpense + (Math.random() - 0.5) * baseExpense * 0.3),
        };
      });

      // Generate weekly trends
      const weeklyTrendsData = Array.from({ length: 4 }, (_, week) => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (4 - week) * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekIncome = totalIncome * (0.8 + Math.random() * 0.4);
        const weekExpenses = totalExpenses * (0.8 + Math.random() * 0.4);

        return {
          startDate: weekStart.toISOString().split("T")[0],
          endDate: weekEnd.toISOString().split("T")[0],
          income: weekIncome,
          expenses: weekExpenses,
          balance: weekIncome - weekExpenses,
        };
      });

      // Monthly comparison
      const currentMonthIncome = totalIncome * 4;
      const currentMonthExpenses = totalExpenses * 4;
      const previousMonthIncome = currentMonthIncome * 0.92;
      const previousMonthExpenses = currentMonthExpenses * 1.05;

      setSummary({
        totalIncome,
        totalExpenses,
        netAmount: netBalance,
        avgDailyIncome: totalIncome / 30,
        avgDailyExpense: totalExpenses / 30,
      });

      setDailyData(dailyTrends);
      setCategoryData({
        income: incomeData.map(item => ({ category: item.name, amount: item.amount.toString() })),
        expenses: expenseData.map(item => ({ category: item.name, amount: item.amount.toString() })),
      });
      setWeeklyTrends(weeklyTrendsData);
      setMonthlyComparison({
        currentMonth: { income: currentMonthIncome, expenses: currentMonthExpenses },
        previousMonth: { income: previousMonthIncome, expenses: previousMonthExpenses },
        incomeChange: ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100,
        expenseChange: ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  return {
    user,
    setUser,
    userLoading,
    setUserLoading,
    dailyTrackerLoading,
    setDailyTrackerLoading,
    summary,
    setSummary,
    dailyData,
    setDailyData,
    categoryData,
    setCategoryData,
    weeklyTrends,
    setWeeklyTrends,
    monthlyComparison,
    setMonthlyComparison,
    topCategories,
    setTopCategories,
    loading,
    setLoading,
    error,
    setError,
    dateRange,
    setDateRange,
    categories,
    fetchDashboardData,
  };
};

export default useDashboard;