import React from 'react';
import { Sparkles, Plus, TrendingUp } from 'lucide-react';

export default function RecommendationsPanel({ recommendations, onAddStock }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          padding: '8px',
          borderRadius: '10px',
          color: '#ffffff',
          display: 'flex'
        }}>
          <Sparkles size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AI Smart Recommendations</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Cross-sector stock opportunities matching your portfolio profile and market momentum
          </p>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {recommendations.map((rec) => (
          <div key={rec.symbol} style={{
            background: 'rgba(139, 92, 246, 0.06)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a78bfa' }}>
                    {rec.symbol}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                    {rec.companyName}
                  </span>
                </div>
                <span style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#c4b5fd',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}>
                  {rec.sector}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  ₹{rec.currentPrice?.toFixed(2)}
                </span>
                <span style={{
                  color: '#34d399',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <TrendingUp size={12} /> +{rec.recentPriceChangePercent}%
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '14px' }}>
                {rec.reason}
              </p>
            </div>

            <button
              className="btn-secondary"
              onClick={() => onAddStock(rec.symbol)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                color: '#ddd6fe'
              }}
            >
              <Plus size={16} />
              <span>Add {rec.symbol} to Watchlist</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
