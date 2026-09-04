import React from 'react';
import { Clock } from 'lucide-react';

export default function DashboardSummary({ user, dashboard }) {
  // Determine greeting based on current time of day
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const userName = user ? user.name.split(' ')[0] : 'Trader';

  // Format last checked time
  const formatTime = (ts) => {
    if (!ts) return '10:00 AM';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '10:00 AM';
    }
  };

  const lastChecked = formatTime(dashboard?.lastCheckedTime);
  const health = dashboard?.watchlistHealth || {};

  return (
    <div style={{ marginBottom: '28px' }}>
      
      {/* Header Greeting & Data Freshness */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {greeting}, {userName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <Clock size={15} color="#94a3b8" />
            <span>Last checked: <strong style={{ color: 'var(--text-primary)' }}>{lastChecked}</strong></span>
          </div>
        </div>

        {/* Subtle Data Freshness Label */}
        {dashboard?.dataFreshness && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.04)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
            {dashboard.dataFreshness}
          </span>
        )}
      </div>

      {/* Summary Box */}
      <div className="card" style={{ padding: '20px 24px', background: 'var(--bg-secondary)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>
          Here's what changed since your last visit.
        </h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          
          <div className="badge badge-significant" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            <strong>{health.significantCount || 0}</strong> significant change
          </div>

          <div className="badge badge-moderate" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            <strong>{health.moderateCount || 0}</strong> moderate change(s)
          </div>

          <div className="badge badge-normal" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            <strong>{health.normalCount || 0}</strong> normal
          </div>

        </div>
      </div>

    </div>
  );
}
