import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import WatchlistPage from './components/WatchlistPage';
import DiscoverPage from './components/DiscoverPage';
import HistoryPage, { TIMESTAMPS } from './components/HistoryPage';
import AddStockModal from './components/AddStockModal';
import StockDetailModal from './components/StockDetailModal';
import Toast from './components/Toast';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sentinel_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation Tab State ('home', 'watchlist', 'discover', 'history')
  const [activeTab, setActiveTab] = useState('home');

  // Dashboard & Loading States
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Time Machine States
  const [fromIndex, setFromIndex] = useState(0); // 10:00 AM
  const [toIndex, setToIndex] = useState(4); // 02:00 PM
  const [isCustomTimeMachine, setIsCustomTimeMachine] = useState(false);

  // Modals & Toast State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStockDetail, setSelectedStockDetail] = useState(null);
  const [focusedStock, setFocusedStock] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch Dashboard Data
  const fetchDashboard = async () => {
    if (!user) return;
    setLoading(true);
    setError(false);

    try {
      let url = `/api/users/${user.id || 1}/dashboard`;
      if (isCustomTimeMachine && activeTab === 'history') {
        const fromIso = encodeURIComponent(TIMESTAMPS[fromIndex].iso);
        const toIso = encodeURIComponent(TIMESTAMPS[toIndex].iso);
        url = `/api/users/${user.id || 1}/dashboard/time-machine?from=${fromIso}&to=${toIso}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDashboard(data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user, activeTab, isCustomTimeMachine, fromIndex, toIndex]);

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setActiveTab('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('sentinel_user');
    setUser(null);
    setDashboard(null);
  };

  // Add Stock Handler
  const handleAddStock = async (symbol) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id || 1}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol })
      });

      if (res.ok) {
        setToastMessage(`Added ${symbol} to your watchlist`);
        await fetchDashboard();
        return true;
      } else {
        const err = await res.json();
        setToastMessage(err.message || 'Could not add stock');
        return false;
      }
    } catch {
      setToastMessage('Unable to connect to server');
      return false;
    }
  };

  // Delete Stock Handler
  const handleDeleteStock = async (symbol) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id || 1}/watchlist/${symbol}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setToastMessage(`Removed ${symbol} from watchlist`);
        if (focusedStock?.symbol === symbol) setFocusedStock(null);
        fetchDashboard();
      } else {
        setToastMessage('Could not remove stock');
      }
    } catch {
      setToastMessage('Unable to remove stock');
    }
  };

  // Render Authentication Screen if user is not logged in
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      
      {/* Top Application Navbar */}
      <Navbar 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Screen Container */}
      <main style={{ maxWidth: '1140px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Error State */}
        {error ? (
          <div className="card-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <AlertCircle size={36} color="var(--red-negative)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Unable to load market data</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Please check your connection to the backend server.
            </p>
            <button className="btn btn-primary" onClick={fetchDashboard}>
              <RefreshCw size={15} />
              <span>Try again</span>
            </button>
          </div>
        ) : loading && !dashboard ? (
          /* Skeleton Loader */
          <div>
            <div className="skeleton" style={{ height: '32px', width: '220px', marginBottom: '12px' }} />
            <div className="skeleton" style={{ height: '18px', width: '160px', marginBottom: '24px' }} />
            <div className="skeleton" style={{ height: '140px', width: '100%', marginBottom: '24px' }} />
            <div className="skeleton" style={{ height: '220px', width: '100%' }} />
          </div>
        ) : (
          /* Screen Router */
          <div>
            
            {/* 1. HOME SCREEN */}
            {activeTab === 'home' && (
              <HomePage
                user={user}
                dashboard={dashboard}
                onNavigateToWatchlist={() => setActiveTab('watchlist')}
                onSelectStock={(s) => setSelectedStockDetail(s)}
              />
            )}

            {/* 2. WATCHLIST SCREEN */}
            {activeTab === 'watchlist' && (
              <WatchlistPage
                stocks={dashboard?.watchlistStocks}
                onDeleteStock={handleDeleteStock}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onSelectStock={(s) => setSelectedStockDetail(s)}
                focusedStock={focusedStock}
                onFocusStock={setFocusedStock}
                onClearFocus={() => setFocusedStock(null)}
                historyRange={{ from: TIMESTAMPS[fromIndex].iso, to: TIMESTAMPS[toIndex].iso }}
                useHistoryRange={isCustomTimeMachine}
              />
            )}

            {/* 3. DISCOVER SCREEN */}
            {activeTab === 'discover' && (
              <DiscoverPage
                recommendations={dashboard?.recommendations}
                onAddStock={handleAddStock}
              />
            )}

            {/* 4. HISTORY SCREEN */}
            {activeTab === 'history' && (
              <HistoryPage
                fromIndex={fromIndex}
                toIndex={toIndex}
                onFromChange={(idx) => { setFromIndex(idx); setIsCustomTimeMachine(true); }}
                onToChange={(idx) => { setToIndex(idx); setIsCustomTimeMachine(true); }}
                stocks={dashboard?.watchlistStocks}
                onResetToLastVisit={() => setIsCustomTimeMachine(false)}
              />
            )}

          </div>
        )}

      </main>

      {/* Add Stock Search Modal */}
      <AddStockModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStock={handleAddStock}
      />

      {/* Stock Details Modal/Drawer */}
      <StockDetailModal
        stock={selectedStockDetail}
        onClose={() => setSelectedStockDetail(null)}
      />

      {/* Success Toast Notification */}
      <Toast 
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />

      {/* Application Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '32px 0',
        color: 'var(--text-tertiary)',
        fontSize: '0.8rem',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '60px'
      }}>
        Sentinel Watchlist • Intelligent Market Change Monitoring Application
      </footer>

    </div>
  );
}
