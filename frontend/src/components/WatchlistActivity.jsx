import React from 'react';

export default function WatchlistActivity({ health }) {
  if (!health) return null;
  const label = health.status === 'HIGH_ALERT' ? 'High activity' : health.status === 'MODERATE_ATTENTION' ? 'Moderate activity' : 'Low activity';
  const notable = (health.significantCount || 0) + (health.moderateCount || 0);
  return <section className="activity-meter card-panel"><div><p className="eyebrow">Watchlist activity</p><strong className="activity-score">{health.score ?? 100}</strong><p className="activity-label">{label}</p></div><div className="activity-copy"><p><strong>{notable} notable movement{notable === 1 ? '' : 's'}</strong></p><p>{health.normalCount || 0} relatively unchanged</p><div className="meter-track"><span style={{ width: `${Math.max(8, health.score ?? 100)}%` }} /></div></div></section>;
}
