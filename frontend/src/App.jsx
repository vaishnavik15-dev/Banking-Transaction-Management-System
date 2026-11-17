import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  TrendingUp,
  Wallet,
  Users,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Search
} from 'lucide-react';

import WelcomePage from './components/WelcomePage';
import Login from './components/Login';
import AccountCard from './components/AccountCard';
import AccountDetails from './components/AccountDetails';
import CreateAccountModal from './components/CreateAccountModal';
import { DepositModal, WithdrawModal, TransferModal } from './components/TransactionModals';
import { apiFetch } from './api';
import './App.css';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('banking_session') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('banking_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Dark / Light Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('banking_theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('banking_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  // Dashboard Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [accountFilter, setAccountFilter] = useState('ALL');

  // Loading states
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transactionTarget, setTransactionTarget] = useState(null);

  // Notification states
  const [notification, setNotification] = useState(null);

  // Fetch accounts list using native fetch
  const fetchAccounts = async () => {
    setGlobalLoading(true);
    try {
      const data = await apiFetch('/accounts');
      setAccounts(data);
    } catch (err) {
      showNotification('error', err.message || 'Failed to retrieve accounts.');
    } finally {
      setGlobalLoading(false);
    }
  };

  // Fetch transactions of active account
  const fetchTransactions = async (accountId) => {
    try {
      const data = await apiFetch(`/transactions/account/${accountId}`);
      setTransactions(data);
    } catch (err) {
      showNotification('error', err.message || 'Failed to fetch transaction history.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAccounts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount.accountId);
    }
  }, [selectedAccount]);

  const handleLogin = () => {
    localStorage.setItem('banking_session', 'true');
    const saved = localStorage.getItem('banking_user');
    setCurrentUser(saved ? JSON.parse(saved) : null);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('banking_session');
    localStorage.removeItem('banking_token');
    localStorage.removeItem('banking_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setSelectedAccount(null);
    navigate('/');
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Account creation API via fetch
  const handleCreateAccount = async (accountData) => {
    setLoading(true);
    try {
      await apiFetch('/accounts', {
        method: 'POST',
        body: {
          ...accountData,
          userId: currentUser?.userId || null
        },
      });
      showNotification('success', 'Account created successfully!');
      setIsCreateOpen(false);
      fetchAccounts();
    } catch (err) {
      showNotification('error', err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  // Deposit API via fetch
  const handleDeposit = async (data) => {
    setLoading(true);
    try {
      const updatedAcc = await apiFetch('/transactions/deposit', {
        method: 'POST',
        body: data,
      });
      showNotification('success', `Successfully deposited $${data.amount.toFixed(2)}.`);
      setIsDepositOpen(false);
      updateSelectedAccount(updatedAcc);
      fetchAccounts();
    } catch (err) {
      showNotification('error', err.message || 'Deposit failed.');
    } finally {
      setLoading(false);
    }
  };

  // Withdraw API via fetch
  const handleWithdraw = async (data) => {
    setLoading(true);
    try {
      const updatedAcc = await apiFetch('/transactions/withdraw', {
        method: 'POST',
        body: data,
      });
      showNotification('success', `Successfully withdrew $${data.amount.toFixed(2)}.`);
      setIsWithdrawOpen(false);
      updateSelectedAccount(updatedAcc);
      fetchAccounts();
    } catch (err) {
      showNotification('error', err.message || 'Withdrawal failed.');
    } finally {
      setLoading(false);
    }
  };

  // Transfer API via fetch
  const handleTransfer = async (data) => {
    setLoading(true);
    try {
      const updatedAcc = await apiFetch('/transactions/transfer', {
        method: 'POST',
        body: data,
      });
      showNotification('success', `Successfully transferred $${data.amount.toFixed(2)}.`);
      setIsTransferOpen(false);
      updateSelectedAccount(updatedAcc);
      fetchAccounts();
    } catch (err) {
      showNotification('error', err.message || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Account API via fetch (Soft Delete Compliant)
  const handleDeleteAccount = async (account) => {
    if (!account) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete account ${account.accountNumber} (${account.accountHolderName})?`);
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await apiFetch(`/accounts/${account.accountId}`, {
        method: 'DELETE',
      });
      showNotification('success', `Account ${account.accountNumber} deleted successfully.`);
      if (selectedAccount?.accountId === account.accountId) {
        setSelectedAccount(null);
      }
      fetchAccounts();
      navigate('/dashboard');
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete account.');
    } finally {
      setLoading(false);
    }
  };

  const updateSelectedAccount = (updatedAccount) => {
    if (selectedAccount && selectedAccount.accountId === updatedAccount.accountId) {
      setSelectedAccount(updatedAccount);
    }
  };

  const filteredAccounts = accounts.filter(acc => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      acc.accountHolderName.toLowerCase().includes(query) ||
      acc.accountNumber.includes(query);
    const matchesFilter = accountFilter === 'ALL' || acc.accountType === accountFilter;
    return matchesSearch && matchesFilter;
  });

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleSelectAccount = (acc) => {
    setSelectedAccount(acc);
    navigate(`/accounts/${acc.accountId}`);
  };

  // Protected Layout Component for Dashboard & Account details
  const DashboardLayout = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    const displayName = currentUser?.fullName || currentUser?.username || 'Administrator';

    return (
      <div className="app-shell">
        
        {/* Submitting Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-card">
              <Loader2 className="loading-spinner" size={24} />
              <span className="loading-text">Processing Request...</span>
            </div>
          </div>
        )}

        {/* Notifications */}
        {notification && (
          <div className="notification-wrapper">
            <div className={`notification-card ${
              notification.type === 'success' ? 'notification-success' : 'notification-error'
            }`}>
              {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <div className="notification-message">{notification.message}</div>
            </div>
          </div>
        )}

        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="sidebar-brand" onClick={() => navigate('/')}>
              <div className="sidebar-brand-icon">
                TB
              </div>
              <div>
                <h1 className="sidebar-brand-title">TrustBank</h1>
                <span className="sidebar-brand-subtitle">Dashboard v1.0</span>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button 
                onClick={() => { setSelectedAccount(null); navigate('/dashboard'); }}
                className={`nav-btn ${location.pathname === '/dashboard' ? 'nav-btn-active' : 'nav-btn-inactive'}`}
              >
                <LayoutDashboard size={18} />
                Overview
              </button>
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="nav-btn nav-btn-inactive"
              >
                <PlusCircle size={18} />
                Open Account
              </button>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <div className="session-card">
              <p className="session-label">Session Account</p>
              <p className="session-value">{displayName}</p>
              {currentUser?.username && (
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">@{currentUser.username}</p>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="signout-btn"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          
          {/* Top Header */}
          <header className="topbar">
            <div className="topbar-left">
              <h2 className="topbar-title-mobile">TrustBank</h2>
              <div className="topbar-welcome">
                <span className="topbar-welcome-label">Welcome back,</span>
                <span className="topbar-welcome-name">{displayName}</span>
              </div>
            </div>

            <div className="topbar-right">
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme} 
                className="theme-toggle-btn"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>
              <button 
                onClick={handleLogout}
                className="topbar-logout-mobile"
              >
                <LogOut size={20} />
              </button>
            </div>
          </header>

          {/* Outer Scroll Container */}
          <div className="content-scroll">
            <div className="content-inner">
              <Routes>
                {/* Overview Dashboard route */}
                <Route 
                  path="/dashboard" 
                  element={
                    <div className="overview-wrapper">
                      
                      {/* Header Summary */}
                      <div className="overview-header">
                        <div>
                          <h2 className="overview-title">Financial Summary</h2>
                          <p className="overview-subtitle">Manage accounts & financial transactions</p>
                        </div>
                        <button 
                          onClick={() => setIsCreateOpen(true)}
                          className="new-account-btn"
                        >
                          <PlusCircle size={16} />
                          New Account
                        </button>
                      </div>

                      {/* Metrics Summary Info Cards */}
                      <div className="metrics-grid">
                        <div className="metric-card">
                          <div className="metric-icon metric-icon-primary">
                            <Wallet size={22} />
                          </div>
                          <div>
                            <span className="metric-label">Total Balance</span>
                            <span className="metric-value">
                              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        <div className="metric-card">
                          <div className="metric-icon metric-icon-success">
                            <Users size={22} />
                          </div>
                          <div>
                            <span className="metric-label">Active Accounts</span>
                            <span className="metric-value">{accounts.length}</span>
                          </div>
                        </div>

                        <div className="metric-card">
                          <div className="metric-icon metric-icon-warning">
                            <TrendingUp size={22} />
                          </div>
                          <div>
                            <span className="metric-label">System Status</span>
                            <span className="metric-status-pill">OPERATIONAL</span>
                          </div>
                        </div>
                      </div>

                      {/* Search and Filter Controls */}
                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-[#1d212a] p-4 rounded-2xl border border-slate-200/80 dark:border-[#282e3a] shadow-sm">
                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                            <Search size={18} />
                          </span>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by holder name or account number..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-[#282e3a] bg-slate-50 dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#15181e] p-1 rounded-xl border border-slate-200/60 dark:border-[#282e3a]">
                          {['ALL', 'Savings', 'Checking'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setAccountFilter(type)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                accountFilter === type
                                  ? 'bg-white dark:bg-[#1d212a] text-indigo-600 dark:text-indigo-400 shadow-sm'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                              }`}
                            >
                              {type === 'ALL' ? 'All Types' : type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Grid list of Accounts with Skeleton Loading State */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="accounts-section-title mb-0">Accounts List</h3>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            Showing {filteredAccounts.length} of {accounts.length} accounts
                          </span>
                        </div>

                        {globalLoading ? (
                          <div className="accounts-grid">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="skeleton-card">
                                <div className="flex justify-between">
                                  <div className="skeleton-box w-20 h-5" />
                                  <div className="skeleton-box w-8 h-8 rounded-xl" />
                                </div>
                                <div className="skeleton-box w-36 h-6 mt-4" />
                                <div className="skeleton-box w-24 h-4" />
                                <div className="pt-4 border-t border-slate-100 dark:border-[#282e3a] flex justify-between items-end">
                                  <div className="skeleton-box w-28 h-7" />
                                  <div className="skeleton-box w-16 h-7" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : filteredAccounts.length > 0 ? (
                          <div className="accounts-grid">
                            {filteredAccounts.map((acc) => (
                              <AccountCard 
                                key={acc.accountId} 
                                account={acc} 
                                onViewDetails={handleSelectAccount}
                                onDeposit={(a) => { setTransactionTarget(a); setIsDepositOpen(true); }}
                                onWithdraw={(a) => { setTransactionTarget(a); setIsWithdrawOpen(true); }}
                                onTransfer={(a) => { setTransactionTarget(a); setIsTransferOpen(true); }}
                                onDelete={handleDeleteAccount}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="empty-state">
                            <div className="empty-state-icon">
                              📭
                            </div>
                            <h4 className="empty-state-title">No Accounts Found</h4>
                            <p className="empty-state-text">
                              {searchQuery || accountFilter !== 'ALL'
                                ? 'No bank accounts match your search query or filter selection.'
                                : 'Get started by opening a new Checking or Savings account below.'}
                            </p>
                            <button 
                              onClick={() => { setSearchQuery(''); setAccountFilter('ALL'); setIsCreateOpen(true); }}
                              className="empty-state-btn"
                            >
                              {searchQuery || accountFilter !== 'ALL' ? 'Reset Filter & Create' : 'Create Account'}
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  } 
                />

                {/* Account Details Route */}
                <Route 
                  path="/accounts/:accountId" 
                  element={
                    <AccountDetails 
                      account={selectedAccount}
                      accounts={accounts}
                      transactions={transactions}
                      onBack={() => { setSelectedAccount(null); navigate('/dashboard'); }}
                      onDeposit={(acc) => { setTransactionTarget(acc); setIsDepositOpen(true); }}
                      onWithdraw={(acc) => { setTransactionTarget(acc); setIsWithdrawOpen(true); }}
                      onTransfer={(acc) => { setTransactionTarget(acc); setIsTransferOpen(true); }}
                      onDelete={handleDeleteAccount}
                    />
                  } 
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>

        </main>

        {/* Modals Mounting */}
        <CreateAccountModal 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
          onCreate={handleCreateAccount}
        />

        <DepositModal
          isOpen={isDepositOpen}
          onClose={() => { setIsDepositOpen(false); setTransactionTarget(null); }}
          account={transactionTarget}
          onSubmit={handleDeposit}
        />

        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => { setIsWithdrawOpen(false); setTransactionTarget(null); }}
          account={transactionTarget}
          onSubmit={handleWithdraw}
        />

        <TransferModal
          isOpen={isTransferOpen}
          onClose={() => { setIsTransferOpen(false); setTransactionTarget(null); }}
          account={transactionTarget}
          accounts={accounts}
          onSubmit={handleTransfer}
        />

      </div>
    );
  };

  return (
    <Routes>
      {/* Landing / Welcome Page as default landing */}
      <Route 
        path="/" 
        element={
          <WelcomePage 
            isAuthenticated={isAuthenticated} 
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        } 
      />

      {/* Login & Signup Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} initialMode="login" />
        } 
      />
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} initialMode="signup" />
        } 
      />

      {/* Dashboard Routes */}
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  );
}