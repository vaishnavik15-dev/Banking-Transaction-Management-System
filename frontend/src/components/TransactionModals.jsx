import React, { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';

export function DepositModal({ isOpen, onClose, account, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !account) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    setError('');
    onSubmit({ accountId: account.accountId, amount: amt, description });
    setAmount('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-[#1d212a] rounded-2xl w-full max-w-md shadow-2xl border border-slate-200/80 dark:border-[#282e3a] overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-[#15181e] border-b border-slate-100 dark:border-[#282e3a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Deposit Funds</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Acc: {account.accountNumber} ({account.accountHolderName})</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252a35] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Deposit Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#282e3a] bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Salary Deposit"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#282e3a] bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              required
            />
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              Confirm Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function WithdrawModal({ isOpen, onClose, account, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !account) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (account.balance - amt < 500) {
      setError('Insufficient funds. Minimum balance of ₹500.00 must be maintained.');
      return;
    }
    setError('');
    onSubmit({ accountId: account.accountId, amount: amt, description });
    setAmount('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-[#1d212a] rounded-2xl w-full max-w-md shadow-2xl border border-slate-200/80 dark:border-[#282e3a] overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-[#15181e] border-b border-slate-100 dark:border-[#282e3a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <ArrowUpRight size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Withdraw Funds</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Acc: {account.accountNumber} | Current Bal: ₹{account.balance.toFixed(2)}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252a35] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Withdrawal Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#282e3a] bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              required
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Max withdrawal allowable: ₹{(account.balance - 500).toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Cash Withdrawal"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#282e3a] bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              required
            />
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
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold text-sm shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
            >
              Confirm Withdrawal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TransferModal({ isOpen, onClose, account, accounts, onSubmit }) {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !account) return null;

  const recipients = accounts.filter(a => a.accountId !== account.accountId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!recipientId) {
      setError('Please select a recipient account');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (account.balance - amt < 500) {
      setError('Insufficient funds. Minimum balance of ₹500.00 must be maintained.');
      return;
    }
    setError('');
    onSubmit({
      fromAccountId: account.accountId,
      toAccountId: parseInt(recipientId),
      amount: amt,
      description
    });
    setRecipientId('');
    setAmount('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-[#1d212a] rounded-2xl w-full max-w-md shadow-2xl border border-slate-200/80 dark:border-[#282e3a] overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-[#15181e] border-b border-slate-100 dark:border-[#282e3a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <RefreshCw size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Transfer Funds</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">From Acc: {account.accountNumber} | Bal: ₹{account.balance.toFixed(2)}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252a35] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Recipient Account
            </label>
            <select
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#282e3a] bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Recipient Account...</option>
              {recipients.map(r => (
                <option key={r.accountId} value={r.accountId}>
                  {r.accountHolderName} ({r.accountNumber}) - {r.accountType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Transfer Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#282e3a] bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Rent Payment"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#282e3a] bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              required
            />
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
              Confirm Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
