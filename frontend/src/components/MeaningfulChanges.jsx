import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Info } from 'lucide-react';

export default function MeaningfulChanges({ stocks, onSelectStock }) {
  if (!stocks || stocks.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          WHAT CHANGED SINCE YOUR LAST VISIT
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
          Click any stock to inspect detailed price & volume metrics
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {stocks.map((stock) => {
          const pct = stock.priceChangePercent || 0;
          const severity = stock.changeSeverity || 'NORMAL';
          const isPositive = pct >= 0;

          let badgeClass = 'badge badge-normal';
          let label = 'Normal';
          let Icon = Minus;

          if (severity === 'SIGNIFICANT') {
            badgeClass = isPositive ? 'badge badge-significant' : 'badge badge-plunge';
            label = 'Significant';
            Icon = isPositive ? ArrowUpRight : ArrowDownRight;
          } else if (severity === 'MODERATE') {
            badgeClass = 'badge badge-moderate';
            label = 'Moderate';
            Icon = isPositive ? ArrowUpRight : ArrowDownRight;
          } else {
            Icon = isPositive ? ArrowUpRight : ArrowDownRight;
          }

          return (
            <div
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className="card"
              style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                background: 'var(--bg-secondary)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--blue-brand)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, width: '120px' }}>
                  {stock.symbol}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {stock.companyName}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span className="mono" style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)'
                  }}>
                    {isPositive ? `+${pct}%` : `${pct}%`}
                  </span>
                </div>

                <div className={badgeClass} style={{ minWidth: '100px', justifyContent: 'center' }}>
                  <Icon size={14} />
                  <span>{label}</span>
                </div>

                <Info size={16} color="#64748b" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
