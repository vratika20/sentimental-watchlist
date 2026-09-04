import React from 'react';
import { ArrowRight } from 'lucide-react';

const TIMESTAMPS = [
  { label: '10:00 AM', short: '10 AM', iso: '2026-09-04T10:00:00+05:30' },
  { label: '11:00 AM', short: '11 AM', iso: '2026-09-04T11:00:00+05:30' },
  { label: '12:00 PM', short: '12 PM', iso: '2026-09-04T12:00:00+05:30' },
  { label: '01:00 PM', short: '1 PM', iso: '2026-09-04T13:00:00+05:30' },
  { label: '02:00 PM', short: '2 PM', iso: '2026-09-04T14:00:00+05:30' }
];

export default function HistoryPage({
  fromIndex,
  toIndex,
  onFromChange,
  onToChange,
  stocks,
  onResetToLastVisit
}) {
  // Sort stocks so meaningful/notable changes appear first
  const sortedStocks = stocks ? [...stocks].sort((a, b) => {
    const sevScore = { SIGNIFICANT: 3, MODERATE: 2, NORMAL: 1 };
    return (sevScore[b.changeSeverity] || 1) - (sevScore[a.changeSeverity] || 1);
  }) : [];

  return (
    <div>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Market History</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
          Compare how your watchlist changed between two market times.
        </p>
      </div>

      {/* Control Panel */}
      <div className="card-panel" style={{ marginBottom: '32px' }}>
        
        {/* FROM and TO Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '16px', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '6px' }}>
              FROM
            </label>
            <select
              value={fromIndex}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val < toIndex) onFromChange(val);
              }}
              className="input-field mono"
              style={{ fontWeight: 700 }}
            >
              {TIMESTAMPS.map((t, idx) => (
                <option key={t.label} value={idx} disabled={idx >= toIndex}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
            <ArrowRight size={20} color="#64748b" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '6px' }}>
              TO
            </label>
            <select
              value={toIndex}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > fromIndex) onToChange(val);
              }}
              className="input-field mono"
              style={{ fontWeight: 700 }}
            >
              {TIMESTAMPS.map((t, idx) => (
                <option key={t.label} value={idx} disabled={idx <= fromIndex}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clean Horizontal Timeline */}
        <div style={{ position: 'relative', padding: '0 12px', marginBottom: '28px' }}>
          <div style={{
            height: '2px',
            background: 'var(--border-subtle)',
            position: 'relative',
            top: '8px',
            zIndex: 1
          }} />

          <div style={{
            height: '2px',
            background: 'var(--blue-accent)',
            position: 'relative',
            top: '6px',
            zIndex: 2,
            left: `${(fromIndex / (TIMESTAMPS.length - 1)) * 100}%`,
            width: `${((toIndex - fromIndex) / (TIMESTAMPS.length - 1)) * 100}%`
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 3, top: '-8px' }}>
            {TIMESTAMPS.map((t, idx) => {
              const isSelected = idx >= fromIndex && idx <= toIndex;
              return (
                <div key={t.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--blue-accent)' : 'var(--bg-card)',
                    border: `2px solid ${isSelected ? '#ffffff' : 'var(--border-subtle)'}`,
                    margin: '0 auto 6px'
                  }} />
                  <span className="mono" style={{ fontSize: '0.75rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                    {t.short}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="history-sliders">
          <label>From <input type="range" min="0" max={Math.max(0, toIndex - 1)} value={fromIndex} onChange={(e) => onFromChange(Number(e.target.value))} /></label>
          <label>To <input type="range" min={Math.min(4, fromIndex + 1)} max="4" value={toIndex} onChange={(e) => onToChange(Number(e.target.value))} /></label>
        </div>
        <p className="selected-range">{TIMESTAMPS[fromIndex].label} → {TIMESTAMPS[toIndex].label} <span>· {toIndex - fromIndex} hour{toIndex - fromIndex === 1 ? '' : 's'}</span></p>

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, marginRight: '4px' }}>
            QUICK PRESETS:
          </span>

          <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '4px 12px' }} onClick={onResetToLastVisit}>
            Last Visit
          </button>

          <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '4px 12px' }} onClick={() => { onFromChange(0); onToChange(2); }}>
            Morning
          </button>

          <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '4px 12px' }} onClick={() => { onFromChange(2); onToChange(4); }}>
            Afternoon
          </button>

          <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '4px 12px' }} onClick={() => { onFromChange(0); onToChange(4); }}>
            Full Day
          </button>
        </div>

      </div>

      {/* Comparison Results */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
          Changes between {TIMESTAMPS[fromIndex].label} and {TIMESTAMPS[toIndex].label}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedStocks.map((stock) => {
            const pct = stock.priceChangePercent || 0;
            const isPositive = pct >= 0;

            return (
              <div
                key={stock.symbol}
                style={{
                  padding: '14px 18px',
                  background: 'var(--bg-surface)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span className="mono" style={{ fontWeight: 800, fontSize: '0.95rem', marginRight: '8px' }}>
                    {stock.symbol}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {stock.companyName}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div className="mono" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    ₹{stock.previousPrice?.toFixed(2)} → <strong style={{ color: 'var(--text-primary)' }}>₹{stock.latestPrice?.toFixed(2)}</strong>
                  </div>

                  <span className="mono" style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)',
                    minWidth: '65px',
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

export { TIMESTAMPS };
