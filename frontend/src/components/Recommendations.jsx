import React from 'react';
import { Plus, Compass, TrendingUp } from 'lucide-react';

export default function Recommendations({ recommendations, onAddStock }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div style={{ marginBottom: '36px' }}>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={18} color="var(--blue-brand)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            STOCKS YOU MAY WANT TO WATCH
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
          Suggested stocks based on your active watchlist sectors and current market activity
        </p>
      </div>

      <div className="grid-responsive">
        {recommendations.slice(0, 3).map((rec) => {
          const pct = rec.recentPriceChangePercent || 0;
          const isPositive = pct >= 0;

          return (
            <div key={rec.symbol} className="card" style={{ background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--blue-brand)' }}>
                      {rec.symbol}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block' }}>
                      {rec.companyName}
                    </span>
                  </div>

                  <span style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {rec.sector}
                  </span>
                </div>

                {/* Price & Movement & Volatility */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' }}>
                  <span className="mono" style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                    ₹{rec.currentPrice?.toFixed(2)}
                  </span>
                  
                  <span style={{
                    color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {isPositive ? `+${pct}%` : `${pct}%`}
                  </span>

                  <span className="badge badge-normal" style={{ fontSize: '0.72rem' }}>
                    Low Volatility
                  </span>
                </div>

                {/* Discovery Reason */}
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '16px' }}>
                  {rec.reason || 'Same sector as stocks in your watchlist'}
                </p>

              </div>

              {/* Action Button */}
              <button
                className="btn btn-primary"
                onClick={() => onAddStock(rec.symbol)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <Plus size={16} />
                <span>Add to Watchlist</span>
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
