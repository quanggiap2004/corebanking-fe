import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getUserAccounts } from '../services/accountService';
import { executeDeposit } from '../services/depositService';
import { formatCurrency } from '../utils/formatters';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { ArrowLeftIcon, BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Validation schema
const depositSchema = yup.object({
  accountNumber: yup.string().required('Account is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be greater than zero')
    .typeError('Amount must be a number'),
  source: yup.string().required('Source is required'),
  description: yup.string().max(255, 'Description too long'),
});

const DepositPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [depositResult, setDepositResult] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(depositSchema),
    defaultValues: {
      accountNumber: '',
      amount: '',
      source: 'Wells Fargo Mock',
      description: '',
    },
  });

  const selectedAccountNumber = watch('accountNumber');
  const selectedAccount = accounts.find(acc => acc.accountNumber === selectedAccountNumber);

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const result = await executeDeposit(data);
      
      setDepositResult(result);
      setShowSuccessModal(true);
      toast.success('Deposit completed successfully!');
      
      // Refresh accounts to show updated balance
      await fetchAccounts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Deposit failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton type="card" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="secondary"
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Button>

        {/* Deposit Form */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Deposit Money</h1>
              <p className="text-sm text-gray-600">Add funds to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Selection */}
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                To Account <span className="text-danger-600">*</span>
              </label>
              <select
                id="accountNumber"
                {...register('accountNumber')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select account to deposit into</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.accountNumber} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
              {errors.accountNumber && (
                <p className="mt-1 text-sm text-danger-600">{errors.accountNumber.message}</p>
              )}
              
              {selectedAccount && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Current Balance: <span className="font-semibold">{formatCurrency(selectedAccount.balance)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Amount */}
            <Input
              label="Amount"
              type="number"
              step="0.01"
              id="amount"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
              error={errors.amount?.message}
              required
            />

            {/* Source Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Source <span className="text-danger-600">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="Wells Fargo Mock"
                    {...register('source')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Wells Fargo (Mock)</p>
                    <p className="text-sm text-gray-600">External bank deposit simulation</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="Chase Mock"
                    {...register('source')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Chase Bank (Mock)</p>
                    <p className="text-sm text-gray-600">External bank deposit simulation</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="Cash Deposit"
                    {...register('source')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Cash Deposit</p>
                    <p className="text-sm text-gray-600">Branch or ATM deposit</p>
                  </div>
                </label>
              </div>
              {errors.source && (
                <p className="mt-1 text-sm text-danger-600">{errors.source.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows="3"
                placeholder="Add a note about this deposit..."
                {...register('description')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : 'Complete Deposit'}
            </Button>
          </form>
        </Card>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          title="Deposit Successful"
        >
          {depositResult && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Deposit Completed!
                </h3>
                <p className="text-gray-600">{depositResult.message}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction Ref:</span>
                  <span className="font-mono font-medium">{depositResult.transactionRef}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">New Balance:</span>
                  <span className="font-semibold text-lg text-green-600">
                    {formatCurrency(depositResult.newBalance)}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleSuccessClose}
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default DepositPage;
