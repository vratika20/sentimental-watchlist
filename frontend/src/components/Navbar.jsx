import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar({ user, activeTab, setActiveTab, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="nav-wrap">

        {/* Logo & Navigation */}
        <div className="nav-main">
          
          <div 
            onClick={() => setActiveTab('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              SENTINEL
            </span>
          </div>

          {/* Clean App Navigation */}
          <nav className="primary-nav" aria-label="Primary navigation">
            <button
              onClick={() => setActiveTab('home')}
              className="btn btn-ghost"
              style={{
                color: activeTab === 'home' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'home' ? 700 : 500,
                background: activeTab === 'home' ? 'rgba(255,255,255,0.06)' : 'transparent'
              }}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className="btn btn-ghost"
              style={{
                color: activeTab === 'watchlist' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'watchlist' ? 700 : 500,
                background: activeTab === 'watchlist' ? 'rgba(255,255,255,0.06)' : 'transparent'
              }}
            >
              Watchlist
            </button>

            <button
              onClick={() => setActiveTab('discover')}
              className="btn btn-ghost"
              style={{
                color: activeTab === 'discover' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'discover' ? 700 : 500,
                background: activeTab === 'discover' ? 'rgba(255,255,255,0.06)' : 'transparent'
              }}
            >
              Discover
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className="btn btn-ghost"
              style={{
                color: activeTab === 'history' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'history' ? 700 : 500,
                background: activeTab === 'history' ? 'rgba(255,255,255,0.06)' : 'transparent'
              }}
            >
              History
            </button>
          </nav>

        </div>

        {/* User Profile Menu Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: '8px'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={15} color="var(--text-secondary)" />
            </div>
            <span className="profile-name">{user ? user.name : 'Sentinel Demo User'}</span>
            <ChevronDown size={14} color="#64748b" />
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 6px)',
              width: '210px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '6px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              zIndex: 110
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>{user?.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.email}
                </span>
              </div>

              <button
                onClick={() => { setDropdownOpen(false); onLogout(); }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  color: 'var(--red-negative)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
