import React from 'react';
import { Plus } from 'lucide-react';

export default function DiscoverPage({ recommendations, onAddStock }) {
  const displayList = recommendations ? recommendations.slice(0, 6) : [];

  return (
    <div>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Discover</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
          Stocks related to what you already follow.
        </p>
      </div>

      {(!displayList || displayList.length === 0) ? (
        <div className="card-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No new discovery recommendations available at this time.
          </p>
        </div>
      ) : (
        /* Recommendations Grid */
        <div className="grid-responsive">
          {displayList.map((rec) => {
            const pct = rec.recentPriceChangePercent || 0;
            const isPositive = pct >= 0;

            return (
              <div 
                key={rec.symbol} 
                className="card-panel" 
                style={{ 
                  background: 'var(--bg-surface)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justify: 'space-between',
                  padding: '20px' 
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--blue-accent)' }}>
                        {rec.symbol}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>
                        {rec.companyName}
                      </span>
                    </div>

                    <span style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-tertiary)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {rec.sector}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
                    <span className="mono" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                      ₹{rec.currentPrice?.toFixed(2)}
                    </span>
                    
                    <span className="mono" style={{
                      color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {isPositive ? `+${pct}%` : `${pct}%`}
                    </span>

                    <span className="status-pill status-normal" style={{ fontSize: '0.72rem' }}>
                      Low Volatility
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '16px' }}>
                    {rec.reason || 'Same sector as stocks in your watchlist'}
                  </p>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => onAddStock(rec.symbol)}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  <Plus size={15} />
                  <span>Add to watchlist</span>
                </button>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
