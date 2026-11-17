import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Eye, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Trash2 } from 'lucide-react';

export default function AccountCard({ account, onViewDetails, onDeposit, onWithdraw, onTransfer, onDelete }) {
  const navigate = useNavigate();
  const isSavings = account.accountType === 'Savings';

  const handleDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(account);
    } else {
      navigate(`/accounts/${account.accountId}`);
    }
  };

  const maskedNumber = account.accountNumber
    ? `•••• ${account.accountNumber.slice(-4)}`
    : '•••• ••••';

  return (
    <div className="group relative bg-white dark:bg-[#1d212a] rounded-2xl border border-slate-200/80 dark:border-[#282e3a] p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Decorative Accent Glow */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        isSavings 
          ? 'bg-indigo-600 dark:bg-indigo-500' 
          : 'bg-slate-700 dark:bg-slate-500'
      }`} />

      <div>
        {/* Header Badges */}
        <div className="flex justify-between items-center mb-5">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
            isSavings
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}>
            {account.accountType}
          </span>
          <span className="p-2 rounded-xl bg-slate-100 dark:bg-[#252a35] text-slate-500 dark:text-slate-400">
            <CreditCard size={18} />
          </span>
        </div>

        {/* Account Holder Name & Masked Number */}
        <div className="mb-6">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate mb-1">
            {account.accountHolderName}
          </h4>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tracking-wider">
            {maskedNumber}
          </span>
        </div>

        {/* Balance Display */}
        <div className="mb-6">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
            Available Balance
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
            ₹{account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="pt-4 border-t border-slate-100 dark:border-[#282e3a] flex items-center justify-between gap-2">
        <button
          onClick={handleDetailsClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
          title="View Details"
        >
          <Eye size={14} />
          Details
        </button>

        <div className="flex items-center gap-1">
          {onDeposit && (
            <button
              onClick={() => onDeposit(account)}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 transition-colors"
              title="Deposit Funds"
            >
              <ArrowDownLeft size={16} />
            </button>
          )}
          {onWithdraw && (
            <button
              onClick={() => onWithdraw(account)}
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40 transition-colors"
              title="Withdraw Funds"
            >
              <ArrowUpRight size={16} />
            </button>
          )}
          {onTransfer && (
            <button
              onClick={() => onTransfer(account)}
              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 transition-colors"
              title="Transfer Funds"
            >
              <ArrowLeftRight size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(account)}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Account"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
