import React, { useEffect, useState, useCallback } from 'react';
import { X, Play, Terminal, AlertTriangle, Code2, Plus, RefreshCw } from 'lucide-react';
import { API_BASE } from '../config/api';
import { SANDBOX_DEFAULT_INPUTS, runFallbackSandbox } from '../data/portfolioFallback';

export default function ProjectSandboxModal({ sandboxSlug, onClose }) {
  const [payload, setPayload] = useState(() =>
    sandboxSlug ? JSON.parse(JSON.stringify(SANDBOX_DEFAULT_INPUTS[sandboxSlug] || {})) : null
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const [newTxMerchant, setNewTxMerchant] = useState('Cloud Hosting VPS');
  const [newTxAmount, setNewTxAmount] = useState(1499);

  const executeSandbox = useCallback(async (slug, currentPayload) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/sandbox/${slug}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPayload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch {
      const local = runFallbackSandbox(slug, currentPayload);
      setResult(local);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sandboxSlug || !payload) return;
    executeSandbox(sandboxSlug, payload);
  }, [sandboxSlug, executeSandbox]); // initial run on mount per modal key

  if (!sandboxSlug || !payload) return null;

  const titles = {
    finsight: 'FinSight AI — Live Cash-Flow & Leak Sandbox',
    paymatch: 'PayMatch AI — Multi-Pass Reconciliation Sandbox',
    finsim: 'FinSim — Macroeconomic Shock & Runway Simulator',
  };

  const toggleGatewayRecordAnomaly = (idx) => {
    const nextRecords = payload.gateway_records.map((rec, i) => {
      if (i !== idx) return rec;
      if (rec.status === 'pending') {
        return { ...rec, status: 'settled' };
      }
      const nextFee = rec.fee === 90 ? 220 : rec.fee === 360 ? 240 : 90;
      return { ...rec, fee: nextFee, net: rec.gross - nextFee };
    });
    const updated = { ...payload, gateway_records: nextRecords };
    setPayload(updated);
    executeSandbox('paymatch', updated);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '980px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: 'clamp(18px, 3vw, 28px)',
          background: 'rgba(10, 15, 28, 0.98)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: '22px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '11px',
                background: 'rgba(0, 242, 254, 0.12)',
                border: '1px solid rgba(0, 242, 254, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan)',
              }}
            >
              <Terminal size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                {titles[sandboxSlug] || 'Live Sandbox'}
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span>Live interactive backend execution without login</span>
                {result && (
                  <span className="tech-pill tech-pill-emerald" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    {result.engine} • {result.execution_ms}ms
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sandbox"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Inputs */}
        {sandboxSlug === 'finsight' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Monthly Income (INR)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={payload.monthly_income}
                  onChange={(e) => setPayload({ ...payload, monthly_income: Number(e.target.value) })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Starting Balance (INR)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={payload.current_balance}
                  onChange={(e) => setPayload({ ...payload, current_balance: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Add Sample Transaction (match &quot;Cloud Hosting VPS&quot; to test leak detection)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newTxMerchant}
                  onChange={(e) => setNewTxMerchant(e.target.value)}
                />
              </div>
              <div style={{ flex: '0 1 130px', minWidth: '100px' }}>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Amount
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={newTxAmount}
                  onChange={(e) => setNewTxAmount(Number(e.target.value))}
                />
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (!newTxMerchant.trim()) return;
                  const updated = {
                    ...payload,
                    transactions: [
                      ...payload.transactions,
                      { date: '2026-10-28', merchant: newTxMerchant.trim(), amount: Number(newTxAmount) || 0, category: 'Subscriptions' },
                    ],
                  };
                  setPayload(updated);
                  executeSandbox('finsight', updated);
                }}
              >
                <Plus size={15} />
                <span>Add &amp; Analyze</span>
              </button>
            </div>
          </div>
        )}

        {sandboxSlug === 'paymatch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '10px' }}>
                  Fee Tolerance (INR): <strong>{payload.fee_tolerance}</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={payload.fee_tolerance}
                  onChange={(e) => {
                    const updated = { ...payload, fee_tolerance: Number(e.target.value) };
                    setPayload(updated);
                    executeSandbox('paymatch', updated);
                  }}
                />
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Click any gateway row below to inject/fix a fee or settlement anomaly live:
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '8px' }}>
                  GATEWAY STREAM ({payload.gateway_records.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {payload.gateway_records.map((gw, idx) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => toggleGatewayRecordAnomaly(idx)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 9px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.35)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: '#e2e8f0',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span><strong>{gw.id}</strong> • {gw.ref}</span>
                      <span style={{ color: '#94a3b8' }}>Net ₹{gw.net} (Fee {gw.fee}) • {gw.status}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#c084fc', marginBottom: '8px' }}>
                  INTERNAL BANK LEDGER ({payload.ledger_records.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {payload.ledger_records.map((ld) => (
                    <div
                      key={ld.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 9px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.28)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: '#cbd5e1',
                        fontSize: '0.75rem',
                      }}
                    >
                      <span><strong>{ld.id}</strong> • {ld.ref}</span>
                      <span style={{ color: '#94a3b8' }}>Exp ₹{ld.expected_net} (Fee {ld.recorded_fee})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {sandboxSlug === 'finsim' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: '12px', marginBottom: '18px' }}>
            {[
              { key: 'liquid_savings', label: 'Liquid Savings (₹)', min: 20000, max: 600000, step: 10000 },
              { key: 'income_drop_pct', label: 'Income Shock (%)', min: 0, max: 90, step: 5 },
              { key: 'inflation_pct', label: 'Annual Inflation (%)', min: 0, max: 25, step: 1 },
              { key: 'emergency_shock', label: 'Day-1 Emergency Cost (₹)', min: 0, max: 200000, step: 10000 },
            ].map((slider) => (
              <div key={slider.key} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>{slider.label}</span>
                  <strong style={{ color: 'var(--cyan)' }}>{payload[slider.key]}</strong>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={payload[slider.key]}
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    const updated = { ...payload, [slider.key]: Number(e.target.value) };
                    setPayload(updated);
                    executeSandbox('finsim', updated);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Controls Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => executeSandbox(sandboxSlug, payload)}
              disabled={loading}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.84rem' }}
            >
              <Play size={15} />
              <span>{loading ? 'Executing Engine...' : 'Run Simulation'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const reset = JSON.parse(JSON.stringify(SANDBOX_DEFAULT_INPUTS[sandboxSlug] || {}));
                setPayload(reset);
                executeSandbox(sandboxSlug, reset);
              }}
              className="btn-secondary"
              style={{ padding: '9px 14px', fontSize: '0.8rem' }}
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowRawJson(!showRawJson)}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <Code2 size={14} />
            <span>{showRawJson ? 'Visual View' : 'Inspect Raw API JSON'}</span>
          </button>
        </div>

        {/* Output */}
        {result && showRawJson ? (
          <pre
            style={{
              background: '#05070c',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '0.78rem',
              fontFamily: 'JetBrains Mono, monospace',
              color: '#a5f3fc',
              overflowX: 'auto',
              maxHeight: '360px',
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : (
          result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sandboxSlug === 'finsight' && result.summary && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '12px' }}>
                    <MetricCard label="Total Spend" value={`₹${result.summary.total_spend}`} />
                    <MetricCard label="Net Cash-Flow" value={`₹${result.summary.net_monthly_cashflow}`} accent="#10b981" />
                    <MetricCard label="Savings Rate" value={`${result.summary.savings_rate_pct}%`} accent="var(--cyan)" />
                    <MetricCard label="Liquidity Risk" value={result.summary.risk_level} accent="#fbbf24" />
                  </div>

                  {/* 3-Month Forecast + Category Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '12px' }}>
                    <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                        90-Day Balance Projection
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '110px', paddingTop: '10px' }}>
                        {result.forecast_3m?.map((f, i) => {
                          const maxBal = Math.max(...result.forecast_3m.map((x) => Math.abs(x.projected_balance)), 1);
                          const heightPct = Math.max(18, Math.round((Math.abs(f.projected_balance) / maxBal) * 100));
                          return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: f.projected_balance >= 0 ? '#34d399' : '#f87171' }}>
                                ₹{Math.round(f.projected_balance / 1000)}k
                              </span>
                              <div
                                style={{
                                  width: '100%',
                                  maxWidth: '52px',
                                  height: `${heightPct}%`,
                                  borderRadius: '8px 8px 4px 4px',
                                  background: f.projected_balance >= 0
                                    ? 'linear-gradient(180deg, #00f2fe 0%, #0284c7 100%)'
                                    : 'linear-gradient(180deg, #f87171 0%, #991b1b 100%)',
                                }}
                              />
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                        Category Spend Share
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {result.category_breakdown?.slice(0, 5).map((cat, idx) => (
                          <div key={idx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                              <span>{cat.category}</span>
                              <span>₹{cat.amount} ({cat.share_pct}%)</span>
                            </div>
                            <div style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.07)' }}>
                              <div style={{ width: `${Math.min(100, cat.share_pct)}%`, height: '100%', borderRadius: '4px', background: 'var(--cyan)' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Leaks */}
                  <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={15} color="#fbbf24" />
                      <span>Detected Recurring / Duplicate Spend Leaks ({result.leaks?.length || 0})</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {result.leaks?.map((leak, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.82rem', padding: '8px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                          <div>
                            <strong style={{ color: '#fff' }}>{leak.merchant}</strong>{' '}
                            <span style={{ color: 'var(--text-muted)' }}>({leak.occurrences}x) — {leak.reason}</span>
                          </div>
                          <span style={{ color: '#fbbf24', fontWeight: '700' }}>₹{leak.total_impact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {sandboxSlug === 'paymatch' && result.counts && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 145px), 1fr))', gap: '12px' }}>
                    <MetricCard label="Exact Matched" value={result.counts.MATCHED} accent="#10b981" />
                    <MetricCard label="Fuzzy Matched" value={result.counts.FUZZY_MATCHED} accent="var(--cyan)" />
                    <MetricCard label="Fee Anomalies" value={result.counts.FEE_ANOMALY} accent="#fbbf24" />
                    <MetricCard label="Delayed" value={result.counts.DELAYED_SETTLEMENT} accent="#38bdf8" />
                    <MetricCard label="Missing in Ledger" value={result.counts.MISSING_IN_LEDGER} accent="#f87171" />
                    <MetricCard label="Discrepancy Total" value={`₹${result.total_discrepancy_amount}`} accent="#f87171" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.records?.map((rec, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                          fontSize: '0.82rem',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#fff' }}>{rec.gateway_id}</strong> ({rec.ref}) —{' '}
                          <span style={{ color: 'var(--text-secondary)' }}>{rec.note}</span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '3px 9px',
                            borderRadius: '8px',
                            background: rec.status === 'MATCHED' ? 'rgba(16,185,129,0.16)' : rec.status === 'FUZZY_MATCHED' ? 'rgba(0,242,254,0.14)' : 'rgba(239,68,68,0.16)',
                            color: rec.status === 'MATCHED' ? '#34d399' : rec.status === 'FUZZY_MATCHED' ? 'var(--cyan)' : '#fca5a5',
                          }}
                        >
                          {rec.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {sandboxSlug === 'finsim' && result.summary && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '12px' }}>
                    <MetricCard label="Runway Survived" value={`${result.summary.runway_months} Months`} accent="var(--cyan)" />
                    <MetricCard label="Post-Shock Reserve" value={`₹${result.summary.initial_post_shock_reserve}`} />
                    <MetricCard label="Stressed Income" value={`₹${result.summary.stressed_monthly_income}/mo`} />
                    <MetricCard label="Verdict" value={result.summary.verdict} accent={result.summary.verdict.startsWith('CRITICAL') ? '#f87171' : '#10b981'} />
                  </div>

                  {/* Interactive SVG Baseline vs Stressed Trajectory Graph */}
                  <FinSimTrajectoryChart trajectory={result.trajectory || []} />
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function FinSimTrajectoryChart({ trajectory }) {
  if (!trajectory.length) return null;
  const width = 720;
  const height = 190;
  const padX = 36;
  const padY = 18;

  const allValues = trajectory.flatMap((t) => [t.baseline_balance, t.stressed_balance, 0]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues, 1);
  const span = Math.max(1, maxVal - minVal);

  const toX = (idx) => padX + (idx / Math.max(1, trajectory.length - 1)) * (width - padX * 2);
  const toY = (val) => padY + ((maxVal - val) / span) * (height - padY * 2);

  const basePath = trajectory.map((t, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(t.baseline_balance).toFixed(1)}`).join(' ');
  const stressPath = trajectory.map((t, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(t.stressed_balance).toFixed(1)}`).join(' ');
  const zeroY = toY(0);

  return (
    <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff' }}>Baseline vs Stressed Cash Trajectory ({trajectory.length} Months)</span>
        <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem' }}>
          <span style={{ color: '#38bdf8' }}>● Baseline</span>
          <span style={{ color: '#f59e0b' }}>● Stressed</span>
          <span style={{ color: '#ef4444' }}>--- Zero Reserve Line</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <line x1={padX} y1={zeroY} x2={width - padX} y2={zeroY} stroke="rgba(239, 68, 68, 0.45)" strokeDasharray="5 4" strokeWidth="1.2" />
        <path d={basePath} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        <path d={stressPath} fill="none" stroke="#f59e0b" strokeWidth="2.8" strokeLinecap="round" />
        {trajectory.map((t, i) => (
          <g key={t.month}>
            <circle cx={toX(i)} cy={toY(t.stressed_balance)} r="3.4" fill={t.stressed_balance < 0 ? '#ef4444' : '#f59e0b'} />
            <text x={toX(i)} y={height - 3} textAnchor="middle" fill="#64748b" fontSize="10">
              M{t.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MetricCard({ label, value, accent = '#fff' }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.05rem', fontWeight: '800', color: accent }}>{value}</div>
    </div>
  );
}
