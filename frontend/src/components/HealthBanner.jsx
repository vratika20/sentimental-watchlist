import React from 'react';
import { ShieldCheck, AlertTriangle, Activity, Clock, Layers } from 'lucide-react';

export default function HealthBanner({ dashboard }) {
  if (!dashboard) return null;

  const health = dashboard.watchlistHealth || {};
  const score = health.score || 100;
  const status = health.status || 'STABLE';
  const summary = health.summary || 'Watchlist is stable.';
  const risk = dashboard.volatilityRiskBadge || 'LOW';

  // Status color logic
  let statusBg = 'rgba(16, 185, 129, 0.15)';
  let statusBorder = 'rgba(16, 185, 129, 0.3)';
  let statusColor = '#34d399';
  let IconComponent = ShieldCheck;

  if (status === 'MODERATE_ATTENTION') {
    statusBg = 'rgba(245, 158, 11, 0.15)';
    statusBorder = 'rgba(245, 158, 11, 0.3)';
    statusColor = '#fbbf24';
    IconComponent = AlertTriangle;
  } else if (status === 'HIGH_ALERT') {
    statusBg = 'rgba(239, 68, 68, 0.15)';
    statusBorder = 'rgba(239, 68, 68, 0.3)';
    statusColor = '#f87171';
    IconComponent = AlertTriangle;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', marginBottom: '24px' }}>
      
      {/* Health Score Gauge Panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            WATCHLIST HEALTH
          </span>
          <span style={{
            background: statusBg,
            border: `1px solid ${statusBorder}`,
            color: statusColor,
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            fontWeight: 700
          }}>
            {status}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: statusColor, lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 600 }}>/ 100</span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '10px'
        }}>
          <div style={{
            width: `${score}%`,
            height: '100%',
            background: statusColor,
            borderRadius: '4px',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {summary}
        </p>
      </div>

      {/* Meaningful Changes & Metrics Banner */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Activity size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Meaningful Change Report</h3>
            </div>
            <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', fontWeight: 600, marginTop: '4px' }}>
              {dashboard.meaningfulChangeStatus || 'All stocks within normal range.'}
            </p>
          </div>

          {/* Time Away Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            color: '#60a5fa'
          }}>
            <Clock size={14} />
            <span>Interval: <strong>{dashboard.timeAway}</strong></span>
          </div>
        </div>

        {/* Counters & Volatility Risk */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-color)'
        }}>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block' }}>SIGNIFICANT</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171' }}>
              {health.significantCount || 0}
            </span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block' }}>MODERATE</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
              {health.moderateCount || 0}
            </span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block' }}>NORMAL</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa' }}>
              {health.normalCount || 0}
            </span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block' }}>VOLATILITY RISK</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px', display: 'block' }}>
              {risk} RISK
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
