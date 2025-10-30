"use client";
import React from "react";

function MainComponent() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [incomeCategories, setIncomeCategories] = useState([
    {
      id: "1",
      name: "Salary",
      amount: 5000,
      remarks: "Monthly salary payment",
    },
    {
      id: "2",
      name: "Freelance",
      amount: 1200,
      remarks: "Web development project",
    },
    {
      id: "3",
      name: "Investment",
      amount: 800,
      remarks: "Dividend from stocks",
    },
    {
      id: "4",
      name: "Business",
      amount: 2500,
      remarks: "Online store revenue",
    },
    {
      id: "5",
      name: "Gift",
      amount: 500,
      remarks: "Birthday gift from family",
    },
    { id: "6", name: "Other", amount: 300, remarks: "Cashback and rewards" },
  ]);
  const [expenseCategories, setExpenseCategories] = useState([
    {
      id: "1",
      name: "Food",
      amount: 1200,
      remarks: "Groceries and dining out",
    },
    {
      id: "2",
      name: "Transportation",
      amount: 800,
      remarks: "Fuel and public transport",
    },
    { id: "3", name: "Housing", amount: 2000, remarks: "Rent and utilities" },
    {
      id: "4",
      name: "Healthcare",
      amount: 400,
      remarks: "Medical checkup and medicines",
    },
    {
      id: "5",
      name: "Entertainment",
      amount: 600,
      remarks: "Movies and subscriptions",
    },
    {
      id: "6",
      name: "Shopping",
      amount: 900,
      remarks: "Clothes and electronics",
    },
    {
      id: "7",
      name: "Bills",
      amount: 700,
      remarks: "Internet, phone, electricity",
    },
    { id: "8", name: "Other", amount: 300, remarks: "Miscellaneous expenses" },
  ]);
  const [incomeSearch, setIncomeSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");
  const [showAddIncomeCategory, setShowAddIncomeCategory] = useState(false);
  const [showAddExpenseCategory, setShowAddExpenseCategory] = useState(false);
  const [newIncomeCategory, setNewIncomeCategory] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showRemarksPopup, setShowRemarksPopup] = useState(null);
  const [tempRemarks, setTempRemarks] = useState("");
  const [tempUnit, setTempUnit] = useState("");
  const [tempUnitType, setTempUnitType] = useState("");
  const [tempRate, setTempRate] = useState("");
  const [dailyTransactions, setDailyTransactions] = useState({});

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

  const loadDailyData = async (date) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load daily data");
      setLoading(false);
    }
  };

  const handleDailyTrackerClick = () => {
    window.location.href = "/daily-tracker";
  };

  const initializeDailyData = (date) => {
    if (!dailyTransactions[date]) {
      setDailyTransactions((prev) => ({
        ...prev,
        [date]: {
          income: [
            {
              id: "1",
              name: "Salary",
              amount: 5000,
              remarks: "Monthly salary payment",
            },
            {
              id: "2",
              name: "Freelance",
              amount: 1200,
              remarks: "Web development project",
            },
            {
              id: "3",
              name: "Investment",
              amount: 800,
              remarks: "Dividend from stocks",
            },
            {
              id: "4",
              name: "Business",
              amount: 2500,
              remarks: "Online store revenue",
            },
            {
              id: "5",
              name: "Gift",
              amount: 500,
              remarks: "Birthday gift from family",
            },
            {
              id: "6",
              name: "Other",
              amount: 300,
              remarks: "Cashback and rewards",
            },
          ],
          expenses: [
            {
              id: "1",
              name: "Food",
              amount: 1200,
              remarks: "Groceries and dining out",
              unit: "5",
              unitType: "items",
              rate: "240",
            },
            {
              id: "2",
              name: "Transportation",
              amount: 800,
              remarks: "Fuel and public transport",
              unit: "40",
              unitType: "liters",
              rate: "20",
            },
            {
              id: "3",
              name: "Housing",
              amount: 2000,
              remarks: "Rent and utilities",
              unit: "1",
              unitType: "month",
              rate: "2000",
            },
            {
              id: "4",
              name: "Healthcare",
              amount: 400,
              remarks: "Medical checkup and medicines",
              unit: "2",
              unitType: "visits",
              rate: "200",
            },
            {
              id: "5",
              name: "Entertainment",
              amount: 600,
              remarks: "Movies and subscriptions",
              unit: "3",
              unitType: "services",
              rate: "200",
            },
            {
              id: "6",
              name: "Shopping",
              amount: 900,
              remarks: "Clothes and electronics",
              unit: "4",
              unitType: "items",
              rate: "225",
            },
            {
              id: "7",
              name: "Bills",
              amount: 700,
              remarks: "Internet, phone, electricity",
              unit: "3",
              unitType: "bills",
              rate: "233",
            },
            {
              id: "8",
              name: "Other",
              amount: 300,
              remarks: "Miscellaneous expenses",
              unit: "1",
              unitType: "misc",
              rate: "300",
            },
          ],
        },
      }));
    }
  };

  const getCurrentDateData = () => {
    return dailyTransactions[selectedDate] || { income: [], expenses: [] };
  };

  const currentData = getCurrentDateData();
  const currentIncomeCategories = currentData.income || [];
  const currentExpenseCategories = currentData.expenses || [];

  const calculateTotals = () => {
    const currentData = getCurrentDateData();
    const totalIncome = currentData.income.reduce(
      (sum, cat) => sum + (cat.amount || 0),
      0
    );
    const totalExpenses = currentData.expenses.reduce(
      (sum, cat) => sum + (cat.amount || 0),
      0
    );

    setSummary({
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      avgDailyIncome: totalIncome / parseInt(dateRange),
      avgDailyExpense: totalExpenses / parseInt(dateRange),
    });
  };

  const openRemarksPopup = (categoryId, type) => {
    const currentData = getCurrentDateData();
    const categories =
      type === "income" ? currentData.income : currentData.expenses;
    const category = categories.find((cat) => cat.id === categoryId);

    if (category) {
      setShowRemarksPopup({ categoryId, type, categoryName: category.name });
      setTempRemarks(category.remarks || "");
      if (type === "expense") {
        setTempUnit(category.unit || "");
        setTempUnitType(category.unitType || "");
        setTempRate(category.rate || "");
      }
    }
  };

  const saveRemarksAndDetails = () => {
    if (!showRemarksPopup) return;

    const { categoryId, type } = showRemarksPopup;

    setDailyTransactions((prev) => {
      const dateData = prev[selectedDate] || { income: [], expenses: [] };
      const updatedData = { ...dateData };

      if (type === "income") {
        updatedData.income = dateData.income.map((cat) =>
          cat.id === categoryId ? { ...cat, remarks: tempRemarks } : cat
        );
      } else {
        updatedData.expenses = dateData.expenses.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                remarks: tempRemarks,
                unit: tempUnit,
                unitType: tempUnitType,
                rate: tempRate,
              }
            : cat
        );
      }

      return { ...prev, [selectedDate]: updatedData };
    });

    setShowRemarksPopup(null);
    setTempRemarks("");
    setTempUnit("");
    setTempUnitType("");
    setTempRate("");
    setHasUnsavedChanges(true);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Calculate totals from current date's categories
      const currentData = getCurrentDateData();
      const totalIncome = currentData.income.reduce(
        (sum, cat) => sum + (cat.amount || 0),
        0
      );
      const totalExpenses = currentData.expenses.reduce(
        (sum, cat) => sum + (cat.amount || 0),
        0
      );
      const netBalance = totalIncome - totalExpenses;

      // Generate realistic daily trends based on current data
      const dailyTrends = Array.from(
        { length: parseInt(dateRange) },
        (_, i) => {
          const date = new Date(
            Date.now() - (parseInt(dateRange) - 1 - i) * 24 * 60 * 60 * 1000
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
              baseIncome + (Math.random() - 0.5) * baseIncome * 0.4
            ),
            expenses: Math.max(
              0,
              baseExpense + (Math.random() - 0.5) * baseExpense * 0.3
            ),
          };
        }
      );

      // Create category breakdown from current data
      const categoryBreakdown = {
        income: currentData.income
          .filter((cat) => cat.amount > 0)
          .map((cat) => ({ category: cat.name, amount: cat.amount.toString() }))
          .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)),
        expenses: currentData.expenses
          .filter((cat) => cat.amount > 0)
          .map((cat) => ({ category: cat.name, amount: cat.amount.toString() }))
          .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)),
      };

      // Generate weekly trends
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

      const currentMonthIncome = totalIncome * 4;
      const currentMonthExpenses = totalExpenses * 4;
      const previousMonthIncome =
        currentMonthIncome * (0.85 + Math.random() * 0.3);
      const previousMonthExpenses =
        currentMonthExpenses * (0.9 + Math.random() * 0.2);

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

  const handleAmountChange = (categoryId, amount, type) => {
    const numAmount = parseFloat(amount) || 0;

    setDailyTransactions((prev) => {
      const dateData = prev[selectedDate] || { income: [], expenses: [] };
      const updatedData = { ...dateData };

      if (type === "income") {
        updatedData.income = dateData.income.map((cat) =>
          cat.id === categoryId ? { ...cat, amount: numAmount } : cat
        );
      } else {
        updatedData.expenses = dateData.expenses.map((cat) =>
          cat.id === categoryId ? { ...cat, amount: numAmount } : cat
        );
      }

      return { ...prev, [selectedDate]: updatedData };
    });

    setHasUnsavedChanges(true);
  };

  const addNewCategory = (type) => {
    const categoryName =
      type === "income" ? newIncomeCategory : newExpenseCategory;

    if (!categoryName.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    const newCategory = {
      id: Math.random().toString(36).substr(2, 9),
      name: categoryName.trim(),
      amount: 0,
      remarks: "",
    };

    if (type === "expense") {
      newCategory.unit = "";
      newCategory.unitType = "";
      newCategory.rate = "";
    }

    setDailyTransactions((prev) => {
      const dateData = prev[selectedDate] || { income: [], expenses: [] };
      const updatedData = { ...dateData };

      if (type === "income") {
        updatedData.income = [...dateData.income, newCategory];
        setNewIncomeCategory("");
        setShowAddIncomeCategory(false);
      } else {
        updatedData.expenses = [...dateData.expenses, newCategory];
        setNewExpenseCategory("");
        setShowAddExpenseCategory(false);
      }

      return { ...prev, [selectedDate]: updatedData };
    });

    setHasUnsavedChanges(true);
  };

  const deleteCategory = (categoryId, type) => {
    setDailyTransactions((prev) => {
      const dateData = prev[selectedDate] || { income: [], expenses: [] };
      const updatedData = { ...dateData };

      if (type === "income") {
        updatedData.income = dateData.income.filter(
          (cat) => cat.id !== categoryId
        );
      } else {
        updatedData.expenses = dateData.expenses.filter(
          (cat) => cat.id !== categoryId
        );
      }

      return { ...prev, [selectedDate]: updatedData };
    });

    setHasUnsavedChanges(true);
    setDeleteConfirm(null);
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasUnsavedChanges(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const filteredIncomeCategories = currentIncomeCategories.filter((cat) =>
    cat.name.toLowerCase().includes(incomeSearch.toLowerCase())
  );

  const filteredExpenseCategories = currentExpenseCategories.filter((cat) =>
    cat.name.toLowerCase().includes(expenseSearch.toLowerCase())
  );

  const { useEffect } = React;

  useEffect(() => {
    setUser({ email: "demo@example.com" });
    initializeDailyData(selectedDate);
    loadDailyData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    calculateTotals();
    fetchDashboardData();
  }, [dailyTransactions, selectedDate, dateRange]);

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
            Daily Tracker
          </h1>
          <p className="mb-8 text-gray-600">
            Track your daily income and expenses
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

  // Add the CommonHeader component
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

  const handleSignOut = () => {
    setUser(null);
  };

  const handleNavigate = (href) => {
    window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use the common header component */}
      <CommonHeader
        title="Daily Tracker"
        currentPage="daily-tracker"
        user={user}
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
              />
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <p className="text-green-600 font-semibold text-lg">
                  ₹{summary.totalIncome.toFixed(2)}
                </p>
                <p className="text-gray-500">Income</p>
              </div>
              <div className="text-center">
                <p className="text-red-600 font-semibold text-lg">
                  ₹{summary.totalExpenses.toFixed(2)}
                </p>
                <p className="text-gray-500">Expenses</p>
              </div>
              <div className="text-center">
                <p
                  className={`font-semibold text-lg ${
                    summary.netAmount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{summary.netAmount.toFixed(2)}
                </p>
                <p className="text-gray-500">Balance</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-500 flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        )}

        {hasUnsavedChanges && (
          <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700 flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              You have unsaved changes
            </div>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-lg text-gray-600">Loading daily data...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Income Categories Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <i className="fas fa-arrow-up text-green-500 mr-2"></i>
                    Income Categories
                  </h2>
                  <button
                    onClick={() => setShowAddIncomeCategory(true)}
                    className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <i className="fas fa-plus mr-1"></i>
                    Add Category
                  </button>
                </div>

                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search income categories..."
                    value={incomeSearch}
                    onChange={(e) => setIncomeSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                  />
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {showAddIncomeCategory && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Category name"
                        value={newIncomeCategory}
                        onChange={(e) => setNewIncomeCategory(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        onKeyPress={(e) =>
                          e.key === "Enter" && addNewCategory("income")
                        }
                      />
                      <button
                        onClick={() => addNewCategory("income")}
                        className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddIncomeCategory(false);
                          setNewIncomeCategory("");
                        }}
                        className="rounded-lg bg-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {filteredIncomeCategories.map((category) => (
                  <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            openRemarksPopup(category.id, "income")
                          }
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit remarks"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              id: category.id,
                              type: "income",
                              name: category.name,
                            })
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={category.amount || ""}
                          onChange={(e) =>
                            handleAmountChange(
                              category.id,
                              e.target.value,
                              "income"
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {filteredIncomeCategories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {incomeSearch
                      ? "No categories match your search"
                      : "No income categories added yet"}
                  </div>
                )}
              </div>
            </div>

            {/* Expense Categories Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <i className="fas fa-arrow-down text-red-500 mr-2"></i>
                    Expense Categories
                  </h2>
                  <button
                    onClick={() => setShowAddExpenseCategory(true)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <i className="fas fa-plus mr-1"></i>
                    Add Category
                  </button>
                </div>

                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search expense categories..."
                    value={expenseSearch}
                    onChange={(e) => setExpenseSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#357AFF] focus:outline-none focus:ring-1 focus:ring-[#357AFF]"
                  />
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {showAddExpenseCategory && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Category name"
                        value={newExpenseCategory}
                        onChange={(e) => setNewExpenseCategory(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        onKeyPress={(e) =>
                          e.key === "Enter" && addNewCategory("expense")
                        }
                      />
                      <button
                        onClick={() => addNewCategory("expense")}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddExpenseCategory(false);
                          setNewExpenseCategory("");
                        }}
                        className="rounded-lg bg-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {filteredExpenseCategories.map((category) => (
                  <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            openRemarksPopup(category.id, "expense")
                          }
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit details"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              id: category.id,
                              type: "expense",
                              name: category.name,
                            })
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={category.amount || ""}
                          onChange={(e) =>
                            handleAmountChange(
                              category.id,
                              e.target.value,
                              "expense"
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {filteredExpenseCategories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {expenseSearch
                      ? "No categories match your search"
                      : "No expense categories added yet"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the category "{deleteConfirm.name}
              "? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteCategory(deleteConfirm.id, deleteConfirm.type)
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showRemarksPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {showRemarksPopup.type === "income"
                ? "Edit Remarks"
                : "Edit Details"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={tempRemarks}
                  onChange={(e) => setTempRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Optional remarks..."
                  rows="2"
                />
              </div>

              {showRemarksPopup.type === "expense" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={tempUnit}
                    onChange={(e) => setTempUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    value={tempUnitType}
                    onChange={(e) => setTempUnitType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate
                  </label>
                  <input
                    type="text"
                    value={tempRate}
                    onChange={(e) => setTempRate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => saveRemarksAndDetails()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;