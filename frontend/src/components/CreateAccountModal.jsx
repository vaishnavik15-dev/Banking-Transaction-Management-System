import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

export default function CreateAccountModal({ isOpen, onClose, onCreate }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [balance, setBalance] = useState('');
  const [accountType, setAccountType] = useState('Savings');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!/^\d{10}$/.test(accountNumber)) {
      newErrors.accountNumber = 'Account number must be exactly 10 digits';
    }
    if (!accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }
    const bal = parseFloat(balance);
    if (isNaN(bal) || bal < 500) {
      newErrors.balance = 'Initial balance must be at least 500.00';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onCreate({
        accountNumber,
        accountHolderName,
        balance: parseFloat(balance),
        accountType
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-[#1d212a] rounded-2xl w-full max-w-md shadow-2xl border border-slate-200/80 dark:border-[#282e3a] overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-[#15181e] border-b border-slate-100 dark:border-[#282e3a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <PlusCircle size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Create New Account</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252a35] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="e.g. 1234567890"
              className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all ${
                errors.accountNumber ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-[#282e3a]'
              }`}
              required
            />
            {errors.accountNumber && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.accountNumber}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all ${
                errors.accountHolderName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-[#282e3a]'
              }`}
              required
            />
            {errors.accountHolderName && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.accountHolderName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Initial Balance (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="Min 500.00"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all ${
                  errors.balance ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-[#282e3a]'
                }`}
                required
              />
              {errors.balance && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.balance}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#282e3a] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 transition-all"
              >
                <option value="Savings">Savings</option>
                <option value="Checking">Checking</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-[#282e3a] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#282e3a] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#252a35] font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all transform active:scale-95"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
