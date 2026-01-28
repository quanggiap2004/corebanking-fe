import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getUserAccounts } from '../services/accountService';
import { formatCurrency } from '../utils/formatters';
import Header from '../components/layout/Header';
import AccountCard from '../components/features/AccountCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import Button from '../components/common/Button';
import { PlusCircleIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const userId = user?.userId || 1;
      const data = await getUserAccounts(userId);
      setAccounts(data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      toast.error('Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600">Here's an overview of your accounts</p>
            </div>
            {user?.transactionLimit && (
              <div className="bg-primary-50 px-4 py-2 rounded-lg border border-primary-100">
                <p className="text-xs text-primary-600 font-medium uppercase tracking-wide">Transaction Limit</p>
                <p className="text-lg font-bold text-primary-700">{formatCurrency(user.transactionLimit)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button
            variant="primary"
            onClick={() => navigate('/transfer')}
            className="flex items-center space-x-2"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>New Transfer</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/deposit')}
            className="flex items-center space-x-2"
          >
            <BanknotesIcon className="h-5 w-5" />
            <span>Deposit Money</span>
          </Button>
        </div>

        {/* Accounts Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <BanknotesIcon className="h-7 w-7 mr-2 text-primary-600" />
              Your Accounts
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <LoadingSkeleton key={i} type="account" />
              ))}
            </div>
          ) : accounts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-card">
              <BanknotesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Accounts Found</h3>
              <p className="text-gray-600">
                You don't have any accounts yet. Contact your bank to create one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Section - Placeholder */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl p-8 text-center shadow-card">
            <p className="text-gray-600">
              Click on an account to view transaction history
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
