import React from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Clock } from 'lucide-react';
import WatchlistActivity from './WatchlistActivity';

export default function HomePage({ user, dashboard, onNavigateToWatchlist, onSelectStock }) {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const stocks = dashboard?.watchlistStocks || [];
  const health = dashboard?.watchlistHealth || {};

  // Filter 1-3 notable stock movements
  const notableStocks = stocks.filter(
    (s) => s.changeSeverity === 'SIGNIFICANT' || s.changeSeverity === 'MODERATE'
  ).slice(0, 3);

  // If no notable stocks, fallback to top stocks
  const displayMovements = notableStocks.length > 0 ? notableStocks : stocks.slice(0, 2);

  // Compact watchlist preview (max 3)
  const previewStocks = stocks.slice(0, 3);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Top Greeting */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          {greeting}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
          Here's what changed since you last checked.
        </p>
      </div>

      <div className="home-meta"><span><Clock size={14} /> Last checked {dashboard?.lastCheckedTime ? new Date(dashboard.lastCheckedTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'recently'}</span><span>{dashboard?.timeAway || '—'} since last visit</span><span>{dashboard?.dataFreshness?.includes('STALE') ? 'Data delayed' : 'Updated from latest snapshot'}</span></div>

      {/* Since Last Visit Summary Card */}
      <div className="card-panel" style={{ marginBottom: '32px', background: 'var(--bg-surface)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="eyebrow">Since your last visit</div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>{(health.significantCount || 0) + (health.moderateCount || 0)} notable movements</span>
        </div>

        {/* Notable Stock Movements List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {displayMovements.map((stock) => {
            const pct = stock.priceChangePercent || 0;
            const isPositive = pct >= 0;
            const label = stock.changeSeverity === 'SIGNIFICANT' ? 'Notable' : stock.changeSeverity === 'MODERATE' ? 'Moderate' : 'Normal';

            return (
              <div 
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-elevated)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <span className="mono" style={{ fontWeight: 800, fontSize: '0.95rem', marginRight: '10px' }}>
                    {stock.symbol}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {stock.companyName}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className="mono" style={{
                    fontWeight: 700,
                    color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)',
                    fontSize: '0.95rem'
                  }}>
                    {isPositive ? `+${pct}%` : `${pct}%`}
                  </span>

                  <span className={`status-pill ${stock.changeSeverity === 'SIGNIFICANT' ? 'status-notable' : stock.changeSeverity === 'MODERATE' ? 'status-moderate' : 'status-normal'}`}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Counter Pill */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>
            {(health.significantCount || 0) + (health.moderateCount || 0)} notable change(s)
          </strong> tracked across your active watchlist.
        </div>

      </div>

      <WatchlistActivity health={health} />

      {/* Compact Watchlist Preview */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Watchlist Preview</h3>
          <button 
            className="btn btn-ghost" 
            onClick={onNavigateToWatchlist}
            style={{ fontSize: '0.85rem', color: 'var(--blue-accent)', padding: 0 }}
          >
            <span>View full watchlist</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {previewStocks.map((stock) => {
            const pct = stock.priceChangePercent || 0;
            const isPositive = pct >= 0;

            return (
              <div 
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: 'var(--bg-surface)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <span className="mono" style={{ fontWeight: 800, fontSize: '0.95rem', display: 'inline-block', width: '120px' }}>
                    {stock.symbol}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {stock.companyName}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    ₹{stock.latestPrice?.toFixed(2)}
                  </span>
                  <span className="mono" style={{
                    fontWeight: 700,
                    color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)',
                    width: '65px',
                    textAlign: 'right'
                  }}>
                    {isPositive ? `+${pct}%` : `${pct}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
