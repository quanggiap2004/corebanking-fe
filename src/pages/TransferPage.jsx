import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getUserAccounts } from '../services/accountService';
import { executeTransfer } from '../services/transferService';
import { transferSchema } from '../utils/validators';
import { formatCurrency } from '../utils/formatters';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { ArrowLeftIcon, ArrowsRightLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TransferPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transferResult, setTransferResult] = useState(null);
  const [formData, setFormData] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(transferSchema),
    defaultValues: {
      sourceAccountNumber: location.state?.sourceAccountNumber || '',
      destinationAccountNumber: '',
      amount: '',
      transferType: 'INTERNAL',
      description: '',
    },
  });

  const sourceAccountNumber = watch('sourceAccountNumber');
  const selectedSourceAccount = accounts.find(acc => acc.accountNumber === sourceAccountNumber);

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

  const onSubmit = (data) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmTransfer = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const result = await executeTransfer(formData);
      
      setTransferResult(result);
      setShowSuccessModal(true);
      toast.success('Transfer completed successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Transfer failed. Please try again.';
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

        {/* Transfer Form */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <ArrowsRightLeftIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transfer Money</h1>
              <p className="text-sm text-gray-600">Send funds to another account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Source Account */}
            <div>
              <label htmlFor="sourceAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                From Account <span className="text-danger-600">*</span>
              </label>
              <select
                id="sourceAccountNumber"
                {...register('sourceAccountNumber')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select source account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.accountNumber} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
              {errors.sourceAccountNumber && (
                <p className="mt-1 text-sm text-danger-600">{errors.sourceAccountNumber.message}</p>
              )}
              
              {selectedSourceAccount && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Available Balance: <span className="font-semibold">{formatCurrency(selectedSourceAccount.balance)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Destination Account */}
            <Input
              label="To Account Number"
              type="text"
              id="destinationAccountNumber"
              placeholder="Enter destination account number"
              {...register('destinationAccountNumber')}
              error={errors.destinationAccountNumber?.message}
              required
            />

            {/* Amount */}
            <div>
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
              {user?.transactionLimit && (
                 <p className="mt-1 text-xs text-gray-500">
                   Your transaction limit: <span className="font-medium">{formatCurrency(user.transactionLimit)}</span> per transfer
                 </p>
              )}
            </div>

            {/* Transfer Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Type <span className="text-danger-600">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="INTERNAL"
                    {...register('transferType')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Internal Transfer</p>
                    <p className="text-sm text-gray-600">Transfer within the same bank</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="INTERBANK_MOCK"
                    {...register('transferType')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Interbank Transfer (Mock)</p>
                    <p className="text-sm text-gray-600">Transfer to another bank (simulated)</p>
                  </div>
                </label>
              </div>
              {errors.transferType && (
                <p className="mt-1 text-sm text-danger-600">{errors.transferType.message}</p>
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
                placeholder="Add a note about this transfer..."
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
              {isSubmitting ? 'Processing...' : 'Review Transfer'}
            </Button>
          </form>
        </Card>

        {/* Confirmation Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirm Transfer"
        >
          {formData && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">From Account:</span>
                  <span className="font-medium">{formData.sourceAccountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To Account:</span>
                  <span className="font-medium">{formData.destinationAccountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-lg text-primary-600">
                    {formatCurrency(formData.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transfer Type:</span>
                  <span className="font-medium">{formData.transferType}</span>
                </div>
                {formData.description && (
                  <div>
                    <span className="text-gray-600 block mb-1">Description:</span>
                    <p className="text-sm text-gray-900">{formData.description}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmTransfer}
                  className="flex-1"
                >
                  Confirm Transfer
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          title="Transfer Successful"
        >
          {transferResult && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Transfer Completed!
                </h3>
                <p className="text-gray-600">{transferResult.message}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction Ref:</span>
                  <span className="font-mono font-medium">{transferResult.transactionRef}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">New Source Balance:</span>
                  <span className="font-semibold">{formatCurrency(transferResult.newSourceBalance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Destination Balance:</span>
                  <span className="font-semibold">{formatCurrency(transferResult.newDestinationBalance)}</span>
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

export default TransferPage;
