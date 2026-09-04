import React, { useEffect, useMemo, useState } from 'react';
import { Pin, X } from 'lucide-react';

const money = (value) => `₹${Number(value ?? 0).toFixed(2)}`;
const pct = (value) => `${Number(value ?? 0) >= 0 ? '+' : ''}${Number(value ?? 0).toFixed(2)}%`;

function PriceChart({ points, selectedIndex, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const plotted = useMemo(() => {
    if (!points.length) return { values: [], min: 0, max: 0 };
    const prices = points.map((p) => Number(p.price)); const min = Math.min(...prices); const max = Math.max(...prices); const range = max - min || 1;
    return { min, max, values: points.map((point, index) => ({ ...point, x: 38 + index / Math.max(points.length - 1, 1) * 306, y: 122 - (Number(point.price) - min) / range * 94 })) };
  }, [points]);
  if (!points.length) return <div className="focus-chart-empty">Historical price data is unavailable.</div>;
  const activeIndex = hovered ?? selectedIndex;
  const active = plotted.values[activeIndex] || plotted.values.at(-1);
  return <div className="focus-chart">
    <svg viewBox="0 0 360 150" role="img" aria-label="Focused stock historical price chart">
      {[28, 60, 92, 122].map((y) => <line className="chart-grid" key={y} x1="38" x2="344" y1={y} y2={y} />)}
      <text x="0" y="31" className="chart-axis-label">{money(plotted.max)}</text><text x="0" y="125" className="chart-axis-label">{money(plotted.min)}</text>
      <polyline className="chart-line" points={plotted.values.map((point) => `${point.x},${point.y}`).join(' ')} />
      {plotted.values.map((point, index) => <circle key={point.timestamp} className="chart-hit" cx={point.x} cy={point.y} r="10" onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onClick={() => onSelect(index)} />)}
      <circle className="chart-point" cx={active.x} cy={active.y} r="4" />
    </svg>
    <div className="chart-labels"><span>{new Date(points[0].timestamp).toLocaleTimeString([], { hour: 'numeric' })}</span><span>{new Date(points.at(-1).timestamp).toLocaleTimeString([], { hour: 'numeric' })}</span></div>
    <div className="focus-tooltip"><span>{new Date(active.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><strong>{money(active.price)}</strong></div>
  </div>;
}

export default function FocusedStockPanel({ stock, range, useRange, onClear }) {
  const [history, setHistory] = useState([]); const [selectedIndex, setSelectedIndex] = useState(0); const [error, setError] = useState(false);
  const rangeFrom = range?.from;
  const rangeTo = range?.to;
  useEffect(() => {
    if (!stock) return; setHistory([]); setError(false);
    fetch(`/api/market/stocks/${encodeURIComponent(stock.symbol)}/history`).then((response) => { if (!response.ok) throw new Error('history failed'); return response.json(); }).then((points) => { setHistory(points); setSelectedIndex(points.length - 1); }).catch(() => setError(true));
  }, [stock]);
  const displayed = useMemo(() => {
    if (!useRange || !rangeFrom || !rangeTo) return history;
    const from = new Date(rangeFrom).getTime(); const to = new Date(rangeTo).getTime();
    const filtered = history.filter((point) => { const time = new Date(point.timestamp).getTime(); return time >= from && time <= to; });
    return filtered.length ? filtered : history;
  }, [history, rangeFrom, rangeTo, useRange]);
  useEffect(() => { if (displayed.length) setSelectedIndex(displayed.length - 1); }, [displayed]);
  if (!stock) return null;
  const first = displayed[0]; const last = displayed.at(-1); const priceChange = first && last ? Number(last.price) - Number(first.price) : 0; const pricePercent = first ? (priceChange / Number(first.price)) * 100 : 0;
  const selected = displayed[selectedIndex] || last; const positive = stock.priceChangePercent >= 0;
  return <section className="focused-stock card-panel">
    <div className="focused-head"><div><p className="eyebrow"><Pin size={12} /> Focused stock</p><h2><span className="mono">{stock.symbol}</span> <small>{stock.companyName}</small></h2></div><button className="btn btn-ghost" onClick={onClear}><X size={16} /> Clear focus</button></div>
    <div className="focused-summary"><div><span>Current price</span><strong>{money(stock.latestPrice)}</strong></div><div><span>Today’s change</span><strong className={positive ? 'positive' : 'negative'}>{pct(stock.priceChangePercent)}</strong></div><div><span>Since last visit</span><strong className={positive ? 'positive' : 'negative'}>{pct(stock.priceChangePercent)}</strong></div><div><span>Volume change</span><strong>{pct(stock.volumeChangePercent)}</strong></div></div>
    <div className="focused-chart-wrap"><div className="section-head"><span>Price movement</span><small>{useRange ? 'Selected History range' : 'Market snapshots'}</small></div>{error ? <div className="focus-chart-empty">Could not load historical price data.</div> : <PriceChart points={displayed} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />}</div>
    {!!displayed.length && <><div className="focus-timeline" role="group" aria-label="Historical price timeline">{displayed.map((point, index) => <button key={point.timestamp} className={index === selectedIndex ? 'active' : ''} onClick={() => setSelectedIndex(index)}><i /><span>{new Date(point.timestamp).toLocaleTimeString([], { hour: 'numeric' })}</span></button>)}</div>
      <div className="selected-price"><span>Selected: <strong>{new Date(selected.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</strong></span><strong className="mono">{money(selected.price)}</strong></div>
      <div className="focus-comparison"><span>{new Date(first.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} → {new Date(last.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><span className="mono">{money(first.price)} → {money(last.price)}</span><strong className={priceChange >= 0 ? 'positive mono' : 'negative mono'}>{pct(pricePercent)}</strong></div>
    </>}
  </section>;
}
