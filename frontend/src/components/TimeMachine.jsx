import React from 'react';
import { History, ArrowRight } from 'lucide-react';

const TIMESTAMPS = [
  { label: '10:00 AM', iso: '2026-09-04T10:00:00+05:30' },
  { label: '11:00 AM', iso: '2026-09-04T11:00:00+05:30' },
  { label: '12:00 PM', iso: '2026-09-04T12:00:00+05:30' },
  { label: '01:00 PM', iso: '2026-09-04T13:00:00+05:30' },
  { label: '02:00 PM', iso: '2026-09-04T14:00:00+05:30' }
];

export default function TimeMachine({
  fromIndex,
  toIndex,
  onFromChange,
  onToChange,
  stocks,
  onResetToLastVisit
}) {
  return (
    <div className="card" style={{ marginBottom: '36px', background: 'var(--bg-secondary)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <History size={20} color="var(--blue-brand)" />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>MARKET TIME MACHINE</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
        See how your watchlist changed between two points in time.
      </p>

      {/* Horizontal Timeline Visualizer */}
      <div style={{
        position: 'relative',
        padding: '0 20px',
        marginBottom: '28px'
      }}>
        {/* Timeline Bar */}
        <div style={{
          height: '4px',
          background: 'var(--border-light)',
          position: 'relative',
          top: '12px',
          zIndex: 1
        }} />

        {/* Highlighted Range Bar */}
        <div style={{
          height: '4px',
          background: 'var(--blue-brand)',
          position: 'relative',
          top: '8px',
          zIndex: 2,
          left: `${(fromIndex / (TIMESTAMPS.length - 1)) * 100}%`,
          width: `${((toIndex - fromIndex) / (TIMESTAMPS.length - 1)) * 100}%`
        }} />

        {/* Marked Market Nodes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 3, top: '-8px' }}>
          {TIMESTAMPS.map((t, idx) => {
            const isSelected = idx >= fromIndex && idx <= toIndex;
            return (
              <div key={t.label} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--blue-brand)' : 'var(--bg-card)',
                  border: `2px solid ${isSelected ? '#ffffff' : 'var(--border-light)'}`,
                  margin: '0 auto 6px'
                }} />
                <span className="mono" style={{ fontSize: '0.78rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                  {t.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Controls: FROM and TO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
            FROM
          </label>
          <select
            value={fromIndex}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val < toIndex) onFromChange(val);
            }}
            className="form-input mono"
            style={{ fontWeight: 600 }}
          >
            {TIMESTAMPS.map((t, idx) => (
              <option key={t.label} value={idx} disabled={idx >= toIndex}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
            TO
          </label>
          <select
            value={toIndex}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > fromIndex) onToChange(val);
            }}
            className="form-input mono"
            style={{ fontWeight: 600 }}
          >
            {TIMESTAMPS.map((t, idx) => (
              <option key={t.label} value={idx} disabled={idx <= fromIndex}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Quick Presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>
          PRESETS:
        </span>

        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.78rem', padding: '4px 12px' }}
          onClick={onResetToLastVisit}
        >
          Last Visit
        </button>

        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.78rem', padding: '4px 12px' }}
          onClick={() => { onFromChange(0); onToChange(2); }}
        >
          Morning (10:00 - 12:00)
        </button>

        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.78rem', padding: '4px 12px' }}
          onClick={() => { onFromChange(2); onToChange(4); }}
        >
          Afternoon (12:00 - 2:00)
        </button>

        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.78rem', padding: '4px 12px' }}
          onClick={() => { onFromChange(0); onToChange(4); }}
        >
          Full Day (10:00 - 2:00)
        </button>
      </div>

      {/* Time Machine Output Comparison */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--blue-brand)' }}>
            {TIMESTAMPS[fromIndex].label}
          </span>
          <ArrowRight size={16} color="#94a3b8" />
          <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--blue-brand)' }}>
            {TIMESTAMPS[toIndex].label}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stocks && stocks.map((stock) => {
            const pct = stock.priceChangePercent || 0;
            const isPositive = pct >= 0;

            return (
              <div
                key={stock.symbol}
                style={{
                  background: 'var(--bg-card)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="mono" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    ₹{stock.previousPrice?.toFixed(2)} → <strong style={{ color: 'var(--text-primary)' }}>₹{stock.latestPrice?.toFixed(2)}</strong>
                  </div>

                  <span className="mono" style={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: isPositive ? 'var(--green-positive)' : 'var(--red-negative)',
                    minWidth: '60px',
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
