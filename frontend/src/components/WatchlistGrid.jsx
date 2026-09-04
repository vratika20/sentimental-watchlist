import React from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export default function WatchlistGrid({ stocks, onDeleteStock, onOpenAddModal }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>My Watchlist</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
            Monitor real-time prices and snapshot deltas across your active stocks
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Empty Watchlist State */}
      {(!stocks || stocks.length === 0) ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', background: 'var(--bg-secondary)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
            Your watchlist is empty
          </p>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Add your first stock</span>
          </button>
        </div>
      ) : (
        /* Watchlist Grid */
        <div className="grid-responsive">
          {stocks.map((stock) => {
            const pct = stock.priceChangePercent || 0;
            const volPct = stock.volumeChangePercent || 0;
            const isPositive = pct >= 0;

            return (
              <div key={stock.symbol} className="card" style={{ background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                <div>
                  {/* Symbol & Sector Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, display: 'block' }}>
                        {stock.symbol}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {stock.companyName}
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
                      {stock.sector}
                    </span>
                  </div>

                  {/* Current Price */}
                  <div style={{ margin: '14px 0' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>CURRENT PRICE</span>
                    <span className="mono" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                      ₹{stock.latestPrice?.toFixed(2)}
                    </span>
                  </div>

                  {/* Delta Table */}
                  <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Today</span>
                      <strong className="mono" style={{ color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)' }}>
                        {isPositive ? `+${pct}%` : `${pct}%`}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Since last visit</span>
                      <strong className="mono" style={{ color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)' }}>
                        {isPositive ? `+${pct}%` : `${pct}%`}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Volume</span>
                      <strong className="mono" style={{ color: volPct >= 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {volPct >= 0 ? `+${volPct}%` : `${volPct}%`}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Remove Action Button */}
                <button
                  className="btn btn-secondary"
                  onClick={() => onDeleteStock(stock.symbol)}
                  style={{ width: '100%', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--red-negative)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
