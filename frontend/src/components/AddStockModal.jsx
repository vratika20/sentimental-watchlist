import React, { useMemo, useState } from 'react';
import { Check, Search, X } from 'lucide-react';

const STOCKS = [
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd' }, { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
  { symbol: 'INFY', name: 'Infosys Limited' }, { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' }, { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' }
];

export default function AddStockModal({ isOpen, onClose, onAddStock }) {
  const [query, setQuery] = useState(''); const [selected, setSelected] = useState(null); const [saving, setSaving] = useState(false);
  const results = useMemo(() => query.trim() ? STOCKS.filter((item) => `${item.symbol} ${item.name}`.toLowerCase().includes(query.toLowerCase())) : [], [query]);
  if (!isOpen) return null;
  const close = () => { if (!saving) { setQuery(''); setSelected(null); onClose(); } };
  const submit = async (event) => { event.preventDefault(); if (!selected) return; setSaving(true); const added = await onAddStock(selected.symbol); setSaving(false); if (added) close(); };
  return <div className="modal-backdrop" onMouseDown={close}>
    <section className="add-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
      <button className="icon-button modal-close" onClick={close} aria-label="Close"><X size={19} /></button>
      <p className="eyebrow">Watchlist</p><h2>Add a stock</h2><p className="modal-copy">Search by company name or NSE symbol.</p>
      <form onSubmit={submit}><div className="search-field"><Search size={17} /><input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} placeholder="Search stocks" /></div>
        <div className="search-results">{query && !results.length && <p className="no-results">No matching stocks in the available market data.</p>}
          {results.map((item) => <button type="button" key={item.symbol} className={`stock-result ${selected?.symbol === item.symbol ? 'selected' : ''}`} onClick={() => setSelected(item)}><span><strong className="mono">{item.symbol}</strong><small>{item.name}</small></span>{selected?.symbol === item.symbol && <Check size={17} />}</button>)}
          {!query && <p className="search-hint">Start typing to see matching stocks.</p>}
        </div>
        <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={close}>Cancel</button><button type="submit" className="btn btn-primary" disabled={!selected || saving}>{saving ? 'Adding…' : 'Add stock'}</button></div>
      </form>
    </section>
  </div>;
}
