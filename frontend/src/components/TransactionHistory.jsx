import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, RefreshCw, History, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TransactionHistory({ transactions = [], accounts = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getAccountInfo = (id) => {
    if (!id) return '';
    const acc = accounts.find(a => a.accountId === id);
    return acc ? `${acc.accountHolderName} (${acc.accountNumber})` : `Account #${id}`;
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
  );

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isIncomingTx = (tx) => {
    if (tx.transactionType === 'DEPOSIT' || tx.transactionType === 'TRANSFER_IN') return true;
    if (tx.transactionType === 'WITHDRAWAL' || tx.transactionType === 'TRANSFER_OUT') return false;
    
    const desc = (tx.description || '').toLowerCase();
    return desc.includes('received') || desc.includes('transfer from') || desc.includes('from account');
  };

  const renderTransactionIcon = (tx) => {
    if (isIncomingTx(tx)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <ArrowDownLeft size={20} />
        </div>
      );
    }
    if (tx.transactionType === 'WITHDRAWAL') {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
          <ArrowUpRight size={20} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
        <ArrowUpRight size={18} />
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#1d212a] rounded-2xl border border-slate-200/80 dark:border-[#282e3a] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-[#282e3a]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <History size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Transaction History</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Chronological activity record</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {transactions.length} Records
        </span>
      </div>

      {currentItems.length > 0 ? (
        <div className="space-y-3">
          {currentItems.map((tx) => {
            const incoming = isIncomingTx(tx);
            const sign = incoming ? '+' : '-';

            return (
              <div 
                key={tx.transactionId}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-[#282e3a] bg-slate-50/50 dark:bg-[#15181e]/60 hover:bg-slate-100/50 dark:hover:bg-[#15181e] transition-colors"
              >
                <div className="flex items-center gap-4">
                  {renderTransactionIcon(tx)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {tx.description || tx.transactionType}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        incoming ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                        tx.transactionType === 'WITHDRAWAL' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                        'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}>
                        {incoming ? (tx.transactionType === 'DEPOSIT' ? 'DEPOSIT' : 'TRANSFER IN') : (tx.transactionType === 'WITHDRAWAL' ? 'WITHDRAWAL' : 'TRANSFER OUT')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-1">
                      <span>{formatDate(tx.transactionDate)}</span>
                      {tx.recipientAccountId && (
                        <span>• Recipient/Sender: <strong className="text-slate-600 dark:text-slate-300 font-medium">{getAccountInfo(tx.recipientAccountId)}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-bold font-sans ${
                    incoming ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {sign}₹{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    ID: #{tx.transactionId}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-slate-200 dark:border-[#282e3a] rounded-xl bg-slate-50/50 dark:bg-[#15181e]/30">
          <History size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Transactions Found</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Deposit or transfer funds to start seeing history records here.</p>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#282e3a] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Page <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> of <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-[#282e3a] bg-white dark:bg-[#15181e] hover:bg-slate-50 dark:hover:bg-[#252a35] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-[#282e3a] bg-white dark:bg-[#15181e] hover:bg-slate-50 dark:hover:bg-[#252a35] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
