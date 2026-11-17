import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Zap, 
  Building2, 
  Globe, 
  LogIn,
  UserPlus,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react';
import './WelcomePage.css';

export default function WelcomePage({ isAuthenticated, onLogout, theme, onToggleTheme }) {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Top Navbar */}
      <header className="welcome-navbar">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <div className="brand-logo font-bold">TB</div>
          <div>
            <span className="brand-name">TrustBank</span>
            <span className="brand-subtitle">Online Banking System</span>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Theme Toggle Button */}
          <button 
            onClick={onToggleTheme} 
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                Go to Dashboard
              </button>
              <button 
                onClick={onLogout}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="btn-secondary flex items-center gap-1.5"
              >
                <LogIn size={16} />
                Log In
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="btn-primary flex items-center gap-1.5"
              >
                <UserPlus size={16} />
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <ShieldCheck size={16} />
          <span>Next-Generation Banking Platform</span>
        </div>
        <h1 className="hero-title">
          Secure & Intuitive <br />
          <span className="gradient-text">Financial Management</span>
        </h1>
        <p className="hero-subtitle">
          Manage accounts, execute instant fund transfers, track real-time transaction histories, and monitor financial operations with enterprise-grade security.
        </p>

        <div className="hero-buttons">
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-hero-primary"
            >
              Access Your Dashboard <ArrowRight size={18} />
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="btn-hero-primary"
              >
                Log In to Account <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="btn-hero-secondary"
              >
                Create New Account
              </button>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="features-title">Designed for Modern Banking</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon icon-indigo">
              <Lock size={22} />
            </div>
            <h3>Bank-Grade Security</h3>
            <p>JWT authentication and encrypted password hashing protect every transaction and user session.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-emerald">
              <Zap size={22} />
            </div>
            <h3>Instant Transfers</h3>
            <p>Direct peer-to-peer and intra-bank transfers with instant balance updates and real-time transaction logs.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-purple">
              <Building2 size={22} />
            </div>
            <h3>Multi-Account Support</h3>
            <p>Manage checking and savings accounts seamlessly with detailed balance metrics and status indicators.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-amber">
              <Globe size={22} />
            </div>
            <h3>24/7 Availability</h3>
            <p>Access your accounts, deposit funds, or process withdrawals anytime from any device.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <p>© 2026 TrustBank System. All rights reserved.</p>
      </footer>
    </div>
  );
}
