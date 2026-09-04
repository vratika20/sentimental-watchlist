import React from 'react';
import { Clock, Zap, History } from 'lucide-react';

const TIMESTAMPS = [
  { label: '10:00 AM', iso: '2026-09-04T10:00:00+05:30', tag: 'Market Open' },
  { label: '11:00 AM', iso: '2026-09-04T11:00:00+05:30', tag: 'Morning Trade' },
  { label: '12:00 PM', iso: '2026-09-04T12:00:00+05:30', tag: 'Midday' },
  { label: '01:00 PM', iso: '2026-09-04T13:00:00+05:30', tag: 'Afternoon' },
  { label: '02:00 PM', iso: '2026-09-04T14:00:00+05:30', tag: 'Latest Snapshot' }
];

export default function TimeMachineControl({
  isTimeMachineMode,
  setIsTimeMachineMode,
  fromIndex,
  toIndex,
  onFromChange,
  onToChange
}) {
  return (
    <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
      
      {/* Top Header & Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: isTimeMachineMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            padding: '8px',
            borderRadius: '10px',
            color: isTimeMachineMode ? '#a78bfa' : '#60a5fa'
          }}>
            {isTimeMachineMode ? <History size={20} /> : <Zap size={20} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              {isTimeMachineMode ? 'Time Machine Controller' : 'What Changed Since Last Check'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {isTimeMachineMode
                ? 'Compare stock snapshots between any two historical market timestamps'
                : 'Automatically measures price & volume changes since your last visit'}
            </p>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setIsTimeMachineMode(false)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: !isTimeMachineMode ? 'var(--accent-blue)' : 'transparent',
              color: !isTimeMachineMode ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Last Visit Mode
          </button>
          <button
            onClick={() => setIsTimeMachineMode(true)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: isTimeMachineMode ? 'var(--accent-purple)' : 'transparent',
              color: isTimeMachineMode ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Time Machine Slider
          </button>
        </div>
      </div>

      {/* Time Machine Slider Controls */}
      {isTimeMachineMode && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '18px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginTop: '12px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '16px' }}>
            
            {/* FROM Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>FROM Timestamp:</span>
                <span className="mono" style={{ fontWeight: 700, color: '#a78bfa' }}>
                  {TIMESTAMPS[fromIndex].label} ({TIMESTAMPS[fromIndex].tag})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={toIndex - 1}
                value={fromIndex}
                onChange={(e) => onFromChange(parseInt(e.target.value))}
                className="time-slider"
              />
            </div>

            {/* TO Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>TO Timestamp:</span>
                <span className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
                  {TIMESTAMPS[toIndex].label} ({TIMESTAMPS[toIndex].tag})
                </span>
              </div>
              <input
                type="range"
                min={fromIndex + 1}
                max={TIMESTAMPS.length - 1}
                value={toIndex}
                onChange={(e) => onToChange(parseInt(e.target.value))}
                className="time-slider"
              />
            </div>

          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>QUICK PRESETS:</span>
            
            <button
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={() => { onFromChange(0); onToChange(4); }}
            >
              Full Day (10:00 AM → 2:00 PM)
            </button>

            <button
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={() => { onFromChange(0); onToChange(2); }}
            >
              Morning Half (10:00 AM → 12:00 PM)
            </button>

            <button
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={() => { onFromChange(2); onToChange(4); }}
            >
              Afternoon Half (12:00 PM → 2:00 PM)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export { TIMESTAMPS };
