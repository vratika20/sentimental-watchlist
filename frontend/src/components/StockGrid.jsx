import React from 'react';
import { TrendingUp, TrendingDown, Minus, Trash2, Plus, Volume2 } from 'lucide-react';

export default function StockGrid({ stocks, onDeleteStock, onOpenAddModal }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Watchlist Movements</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
            Delta breakdown of price and volume shifts across monitored stocks
          </p>
        </div>

        <button 
          className="btn-primary" 
          onClick={onOpenAddModal}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={18} />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Empty State */}
      {(!stocks || stocks.length === 0) ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No stocks in watchlist. Click "Add Stock" to start tracking movements!
          </p>
        </div>
      ) : (
        /* Stock Cards Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {stocks.map((stock) => {
            const pct = stock.priceChangePercent || 0;
            const volPct = stock.volumeChangePercent || 0;
            const severity = stock.changeSeverity || 'NORMAL';
            const isSurge = pct >= 3.0;
            const isPlunge = pct <= -3.0;
            const isModerate = Math.abs(pct) >= 1.5 && Math.abs(pct) < 3.0;

            // Card highlight class
            let cardClass = 'glass-card';
            if (isSurge) cardClass += ' card-significant-surge';
            else if (isPlunge) cardClass += ' card-significant-plunge';
            else if (isModerate) cardClass += ' card-moderate';

            // Badge styling
            let badgeClass = 'badge badge-normal';
            let IconClass = Minus;
            let iconColor = '#60a5fa';

            if (pct > 0) {
              IconClass = TrendingUp;
              iconColor = '#34d399';
            } else if (pct < 0) {
              IconClass = TrendingDown;
              iconColor = '#f87171';
            }

            if (isSurge) badgeClass = 'badge badge-significant-surge';
            else if (isPlunge) badgeClass = 'badge badge-significant-plunge';
            else if (isModerate) badgeClass = 'badge badge-moderate';

            return (
              <div key={stock.symbol} className={cardClass} style={{ position: 'relative' }}>
                
                {/* Top Row: Symbol, Sector, Delete */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                        {stock.symbol}
                      </span>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-muted)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        {stock.sector}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                      {stock.companyName}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteStock(stock.symbol)}
                    title="Remove from Watchlist"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Middle Row: Price & Movement Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>LATEST PRICE</span>
                    <span className="mono" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                      ₹{stock.latestPrice?.toFixed(2)}
                    </span>
                  </div>

                  <div className={badgeClass}>
                    <IconClass size={14} color={iconColor} />
                    <span>{stock.movementSummary}</span>
                  </div>
                </div>

                {/* Bottom Row: Delta Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.78rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>PREVIOUS PRICE</span>
                    <span className="mono" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                      ₹{stock.previousPrice?.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Volume2 size={12} /> VOLUME DELTA
                    </span>
                    <span className="mono" style={{ color: volPct >= 0 ? '#34d399' : '#f87171', fontWeight: 600 }}>
                      {volPct >= 0 ? `+${volPct}%` : `${volPct}%`}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
