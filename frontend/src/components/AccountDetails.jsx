import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, RefreshCw, Trash2, CreditCard, ShieldCheck } from 'lucide-react';
import TransactionHistory from './TransactionHistory';
import { apiFetch } from '../api';

export default function AccountDetails({ 
  account: propAccount, 
  accounts: propAccounts = [], 
  transactions: propTransactions = [], 
  onBack, 
  onDeposit, 
  onWithdraw, 
  onTransfer,
  onDelete
}) {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState(propAccount || null);
  const [transactions, setTransactions] = useState(propTransactions || []);
  const [accounts, setAccounts] = useState(propAccounts || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propAccount) setAccount(propAccount);
  }, [propAccount]);

  useEffect(() => {
    if (propTransactions && propTransactions.length > 0) setTransactions(propTransactions);
  }, [propTransactions]);

  useEffect(() => {
    if (propAccounts && propAccounts.length > 0) setAccounts(propAccounts);
  }, [propAccounts]);

  useEffect(() => {
    const targetId = accountId || propAccount?.accountId;
    if (!targetId) return;

    const loadData = async () => {
      if (!propAccount || String(propAccount.accountId) !== String(targetId)) {
        setLoading(true);
        try {
          const accData = await apiFetch(`/accounts/${targetId}`);
          setAccount(accData);
        } catch (err) {
          console.error('Failed to load account details', err);
        } finally {
          setLoading(false);
        }
      }

      try {
        const txData = await apiFetch(`/transactions/account/${targetId}`);
        setTransactions(txData);
      } catch (err) {
        console.error('Failed to load transaction history', err);
      }

      if (accounts.length === 0) {
        try {
          const allAccounts = await apiFetch('/accounts');
          setAccounts(allAccounts);
        } catch (err) {
          console.error('Failed to load all accounts', err);
        }
      }
    };

    loadData();
  }, [accountId, propAccount?.accountId]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  // Skeleton Loader State
  if (loading || !account) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2">
            <div className="w-36 h-5 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-24 h-3 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="lg:col-span-2 h-56 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  const isSavings = account.accountType === 'Savings';

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-[#282e3a] bg-white dark:bg-[#1d212a] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252a35] transition-all shadow-sm"
            title="Back to Overview"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Account Details</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Individual account overview and transaction history</p>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(account)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold text-xs transition-all"
          >
            <Trash2 size={15} />
            Delete Account
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prominent Balance Card */}
        <div className={`relative overflow-hidden rounded-2xl p-6 shadow-sm border ${
          isSavings 
            ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-700 text-white' 
            : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white'
        }`}>
          {/* Subtle Graphic Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none" />

          <div className="flex justify-between items-center mb-6">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-white backdrop-blur-md">
              <ShieldCheck size={14} />
              {account.accountType}
            </span>
            <span className="font-mono text-xs text-white/60">ID: #{account.accountId}</span>
          </div>

          <div className="mb-4">
            <span className="text-xs text-white/70 block mb-1 uppercase tracking-wider">Account Holder</span>
            <span className="text-lg font-bold truncate block">{account.accountHolderName}</span>
          </div>

          <div className="mb-6">
            <span className="text-xs text-white/70 block mb-1 uppercase tracking-wider">Account Number</span>
            <span className="font-mono tracking-widest text-base font-bold text-white/90">{account.accountNumber}</span>
          </div>

          <div className="pt-4 border-t border-white/15">
            <span className="text-xs text-white/70 block mb-1 uppercase tracking-wider">Available Balance</span>
            <span className="text-3xl font-extrabold font-sans tracking-tight">
              ₹{account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Action Controls Box */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1d212a] rounded-2xl border border-slate-200/80 dark:border-[#282e3a] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Execute Financial Transactions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Perform deposits, withdrawals, or instant transfers to recipient accounts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => onDeposit && onDeposit(account)}
              className="flex flex-col items-center justify-center p-5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/50 hover:bg-emerald-100/60 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold transition-all group"
            >
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl text-emerald-600 dark:text-emerald-400 mb-2.5 group-hover:scale-105 transition-transform">
                <ArrowDownLeft size={22} />
              </div>
              <span className="text-sm">Deposit</span>
            </button>

            <button
              onClick={() => onWithdraw && onWithdraw(account)}
              className="flex flex-col items-center justify-center p-5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/50 hover:bg-amber-100/60 dark:bg-amber-950/20 dark:hover:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold transition-all group"
            >
              <div className="p-3 bg-amber-100 dark:bg-amber-900/60 rounded-xl text-amber-600 dark:text-amber-400 mb-2.5 group-hover:scale-105 transition-transform">
                <ArrowUpRight size={22} />
              </div>
              <span className="text-sm">Withdraw</span>
            </button>

            <button
              onClick={() => onTransfer && onTransfer(account)}
              className="flex flex-col items-center justify-center p-5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/50 hover:bg-indigo-100/60 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold transition-all group"
            >
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/60 rounded-xl text-indigo-600 dark:text-indigo-400 mb-2.5 group-hover:scale-105 transition-transform">
                <RefreshCw size={20} />
              </div>
              <span className="text-sm">Transfer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History List */}
      <TransactionHistory transactions={transactions} accounts={accounts} />
    </div>
  );
}
