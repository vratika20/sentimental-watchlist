import React, { useEffect, useMemo, useState } from 'react';
import { X, TrendingDown, TrendingUp } from 'lucide-react';

const money = (value) => `₹${Number(value ?? 0).toFixed(2)}`;
const percent = (value) => `${value >= 0 ? '+' : ''}${Number(value ?? 0).toFixed(2)}%`;

function PriceChart({ points }) {
  const [hovered, setHovered] = useState(null);
  const plotted = useMemo(() => {
    if (!points.length) return [];
    const prices = points.map((p) => Number(p.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    return points.map((p, i) => ({
      ...p,
      x: 12 + (i / Math.max(points.length - 1, 1)) * 336,
      y: 128 - ((Number(p.price) - min) / range) * 100
    }));
  }, [points]);
  if (!points.length) return <div className="chart-empty">Historical price data is unavailable.</div>;
  const line = plotted.map((p) => `${p.x},${p.y}`).join(' ');
  const active = hovered == null ? plotted[plotted.length - 1] : plotted[hovered];
  return <div className="price-chart">
    <svg viewBox="0 0 360 152" role="img" aria-label="Historical share price chart">
      {[28, 62, 96, 128].map((y) => <line key={y} x1="12" x2="348" y1={y} y2={y} className="chart-grid" />)}
      <polyline points={line} className="chart-line" />
      {plotted.map((p, index) => <circle key={p.timestamp} cx={p.x} cy={p.y} r="8" className="chart-hit" onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} />)}
      <circle cx={active.x} cy={active.y} r="4" className="chart-point" />
    </svg>
    <div className="chart-labels"><span>{new Date(points[0].timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><span>{new Date(points.at(-1).timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span></div>
    <div className="chart-tooltip"><span>{new Date(active.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><strong>{money(active.price)}</strong></div>
  </div>;
}

export default function StockDetailModal({ stock, onClose }) {
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState(false);
  useEffect(() => {
    if (!stock) return;
    setHistory([]); setHistoryError(false);
    fetch(`/api/market/stocks/${encodeURIComponent(stock.symbol)}/history`)
      .then((res) => { if (!res.ok) throw new Error('history unavailable'); return res.json(); })
      .then(setHistory).catch(() => setHistoryError(true));
  }, [stock]);
  if (!stock) return null;
  const positive = stock.priceChangePercent >= 0;
  const status = stock.changeSeverity === 'SIGNIFICANT' ? 'Notable movement' : stock.changeSeverity === 'MODERATE' ? 'Moderate movement' : 'Low activity';
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <aside className="stock-drawer" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog">
      <button className="icon-button drawer-close" onClick={onClose} aria-label="Close stock details"><X size={19} /></button>
      <div className="drawer-heading"><div><p className="eyebrow">Stock details</p><h2 className="mono">{stock.symbol}</h2><p>{stock.companyName}</p></div><span className="sector-chip">{stock.sector}</span></div>
      <div className="price-head"><strong>{money(stock.latestPrice)}</strong><span className={positive ? 'positive' : 'negative'}>{positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}{percent(stock.priceChangePercent)}</span></div>
      <section className="chart-section"><div className="section-head"><span>Price history</span><small>{historyError ? 'Last available data' : 'Market snapshots'}</small></div><PriceChart points={history} /></section>
      <dl className="metric-grid">
        <div><dt>Today’s change</dt><dd className={positive ? 'positive mono' : 'negative mono'}>{money(stock.priceChange)} · {percent(stock.priceChangePercent)}</dd></div>
        <div><dt>Last-visit price</dt><dd className="mono">{money(stock.previousPrice)}</dd></div>
        <div><dt>Volume change</dt><dd className="mono">{percent(stock.volumeChangePercent)}</dd></div>
        <div><dt>Status</dt><dd><span className={`status-pill ${stock.changeSeverity === 'SIGNIFICANT' ? 'status-notable' : stock.changeSeverity === 'MODERATE' ? 'status-moderate' : 'status-normal'}`}>{status}</span></dd></div>
      </dl>
      <p className="drawer-freshness">Last available: {stock.latestTimestamp ? new Date(stock.latestTimestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '—'}</p>
    </aside>
  </div>;
}
