import React from 'react';
import { RefreshCw, Activity, User } from 'lucide-react';

export default function Header({ user, isConnected, onRefresh, isLoading }) {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                SENTINEL
              </h1>
              <span style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                WATCHLIST
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
              Delta Monitoring & Historical Time Machine Engine
            </p>
          </div>
        </div>

        {/* User Info & Connection Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            fontSize: '0.82rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#10b981' : '#ef4444',
              boxShadow: isConnected ? '0 0 8px #10b981' : '0 0 8px #ef4444'
            }} />
            <span style={{ color: 'var(--text-muted)' }}>Backend:</span>
            <span style={{ fontWeight: 600, color: isConnected ? '#34d399' : '#f87171' }}>
              {isConnected ? 'LIVE (8080)' : 'DISCONNECTED'}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem'
          }}>
            <User size={16} color="#94a3b8" />
            <span style={{ fontWeight: 600 }}>{user ? user.name : 'Demo User'}</span>
          </div>

          <button 
            className="btn-secondary"
            onClick={onRefresh}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

      </div>
    </header>
  );
}
