'use client';

import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard-layout';

export default function Dashboard() {
  const { data: session } = useSession();

  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome back, {session?.user?.name}!
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h2 className="text-lg font-medium text-indigo-900 mb-2">Financial Dashboard</h2>
              <p className="text-indigo-700">
                View your financial overview, income, and expenses.
              </p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h2 className="text-lg font-medium text-emerald-900 mb-2">Daily Tracker</h2>
              <p className="text-emerald-700">
                Track your daily income and expenses.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-lg font-medium text-purple-900 mb-2">Reports</h2>
              <p className="text-purple-700">
                Generate detailed reports and analytics.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Tips</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Use the Financial Dashboard to monitor your overall financial health</li>
              <li>• Track your daily transactions in the Daily Tracker</li>
              <li>• Review your spending patterns in the Reports section</li>
              <li>• Set budgets and financial goals to stay on track</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}