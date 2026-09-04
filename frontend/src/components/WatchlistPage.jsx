import React, { useEffect, useRef } from 'react';
import { Plus, Trash2, Pin } from 'lucide-react';
import FocusedStockPanel from './FocusedStockPanel';

export default function WatchlistPage({ stocks, onDeleteStock, onOpenAddModal, onSelectStock, focusedStock, onFocusStock, onClearFocus, historyRange, useHistoryRange }) {
  const focusedPanelRef = useRef(null);

  useEffect(() => {
    focusedPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [focusedStock?.symbol]);
  return (
    <div>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Watchlist</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
            Your tracked stocks and changes since the last check.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Empty State */}
      {(!stocks || stocks.length === 0) ? (
        <div className="card-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
            Your watchlist is empty
          </p>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Add your first stock</span>
          </button>
        </div>
      ) : (
        /* Clean Fintech Table */
        <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="fintech-table watchlist-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Price</th>
                <th>Today</th>
                <th>Since Last Visit</th>
                <th>Volume</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => {
                const pct = stock.priceChangePercent || 0;
                const volPct = stock.volumeChangePercent || 0;
                const isPositive = pct >= 0;
                const severity = stock.changeSeverity || 'NORMAL';

                let pillClass = 'status-pill status-normal';
                let label = 'Normal';
                if (severity === 'SIGNIFICANT') {
                  pillClass = isPositive ? 'status-pill status-notable' : 'status-pill status-plunge';
                  label = 'Significant';
                } else if (severity === 'MODERATE') {
                  pillClass = 'status-pill status-moderate';
                  label = 'Moderate';
                }

                const isFocused = focusedStock?.symbol === stock.symbol;
                return (
                  <tr key={stock.symbol} onClick={() => onSelectStock(stock)} style={{ cursor: 'pointer' }}>
                    
                    {/* Stock Symbol & Company */}
                    <td>
                      <span className="mono" style={{ fontWeight: 800, fontSize: '0.95rem', display: 'block' }}>
                        {stock.symbol}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                        {stock.companyName}
                      </span>
                    </td>

                    {/* Price */}
                    <td data-label="Price" className="mono" style={{ fontWeight: 700 }}>
                      ₹{stock.latestPrice?.toFixed(2)}
                    </td>

                    {/* Today % */}
                    <td data-label="Today" className="mono" style={{ fontWeight: 700, color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)' }}>
                      {isPositive ? `+${pct}%` : `${pct}%`}
                    </td>

                    {/* Since Last Visit % */}
                    <td data-label="Since last visit" className="mono" style={{ fontWeight: 700, color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)' }}>
                      {isPositive ? `+${pct}%` : `${pct}%`}
                    </td>

                    {/* Volume % */}
                    <td data-label="Volume" className="mono" style={{ color: volPct >= 0 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                      {volPct >= 0 ? `+${volPct}%` : `${volPct}%`}
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span className={pillClass}>
                        {label}
                      </span>
                    </td>

                    {/* Remove Action */}
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button className={`btn btn-ghost focus-pin ${isFocused ? 'is-focused' : ''}`} onClick={() => onFocusStock(isFocused ? null : stock)} title={isFocused ? 'Clear stock focus' : `Focus ${stock.symbol}`} aria-label={isFocused ? 'Clear stock focus' : `Focus ${stock.symbol}`}><Pin size={16} /></button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => onDeleteStock(stock.symbol)}
                        style={{ color: 'var(--text-tertiary)', padding: '6px' }}
                        title="Remove Stock"
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--red-negative)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {focusedStock && <div ref={focusedPanelRef}><FocusedStockPanel stock={focusedStock} onClear={onClearFocus} range={historyRange} useRange={useHistoryRange} /></div>}

    </div>
  );
}
