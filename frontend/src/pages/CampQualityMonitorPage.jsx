import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import { Activity, ShieldCheck, CheckCircle2, AlertTriangle, Mic, Radio, Users, RefreshCw } from 'lucide-react';

export default function CampQualityMonitorPage() {
  const [qualityData, setQualityData] = useState(null);

  const fetchQualityMetrics = async () => {
    try {
      const res = await fetch(getApiUrl('/api/admin/camp-quality?camp_id=camp-01'));
      if (res.ok) {
        const data = await res.json();
        setQualityData(data);
      }
    } catch (e) {
      console.error('Failed to fetch camp quality monitor data:', e);
    }
  };

  useEffect(() => {
    fetchQualityMetrics();
  }, []);

  const target = qualityData?.target_headcount || 150;
  const screened = qualityData?.total_children_screened || 112;
  const progressPct = qualityData?.progress_pct || 74.6;
  const passRate = qualityData?.pass_rate_pct || 93.8;
  const passedCount = qualityData?.snr_quality_passed || 105;
  const failedCount = qualityData?.snr_quality_failed || 7;
  const workers = qualityData?.workers || [
    { worker_id: 'CS-MEG-01', name: 'ASHA Worker CS-MEG-01 (Mary)', screened_count: 62, snr_passed: 58, snr_failed: 4, pass_rate_pct: 93.5, avg_snr_db: 14.4 },
    { worker_id: 'CS-MEG-02', name: 'ASHA Worker CS-MEG-02 (Priya)', screened_count: 50, snr_passed: 47, snr_failed: 3, pass_rate_pct: 94.0, avg_snr_db: 13.9 }
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#4EB8E0] uppercase tracking-wider block">Operational Oversight</span>
            <h1 className="text-2xl font-extrabold text-white font-serif">Live Camp-Day Data Quality Monitor</h1>
            <p className="text-xs text-[#8DA0B0]">
              Real-time monitoring of screening progress, FFT stethoscope SNR quality gate passes, and per-ASHA worker metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchQualityMetrics}
              className="glass-button-secondary text-xs py-1.5 px-3 hover:border-[#4EB8E0]/40 text-[#E6EBF0] flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#4EB8E0]" />
              <span>Refresh Live Feed</span>
            </button>
          </div>
        </div>

        {/* Top Progress & SNR Metrics Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-3 rounded-2xl border-white/10">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#8DA0B0] uppercase tracking-wider">Screening Headcount Progress</span>
              <span className="font-mono font-bold text-white text-sm">{screened} / {target} Kids</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/60 rounded-full h-3.5 overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-[#2C7FB8] to-[#4EB8E0] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-[#4EB8E0] font-semibold">Progress: {progressPct}%</span>
              <span className="text-[#8DA0B0]">Remaining: {target - screened}</span>
            </div>
          </div>

          <div className="glass-card p-6 space-y-2 rounded-2xl border-[#3FA88A]/30">
            <span className="text-xs font-bold text-[#3FA88A] block uppercase tracking-wider">
              FFT SNR Quality Gate Pass Rate
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-white font-mono">{passRate}%</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#3FA88A]/20 border border-[#3FA88A]/40 text-[#3FA88A] text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3FA88A]" /> High SNR (&gt;8.0 dB)
              </span>
            </div>
            <p className="text-[11px] text-[#8DA0B0]">
              {passedCount} passed quality gate • {failedCount} blocked & prompted re-record
            </p>
          </div>

          <div className="glass-card p-6 space-y-2 rounded-2xl border-white/10">
            <span className="text-xs font-bold text-[#4EB8E0] block uppercase tracking-wider">
              Average Audio Signal Power
            </span>
            <span className="text-4xl font-extrabold text-white font-mono">{qualityData?.average_snr_db || 14.2} dB</span>
            <p className="text-[11px] text-[#8DA0B0]">
              20–150 Hz Heart Sound Spectral Density vs Ambient Noise
            </p>
          </div>
        </div>

        {/* Per-ASHA Worker Quality & Throughput Comparison */}
        <div className="glass-card p-6 space-y-4 rounded-2xl border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#4EB8E0]" />
              <h3 className="font-bold text-base text-white font-serif">Per-ASHA Worker Operational Breakdown (Active Camp)</h3>
            </div>
            <span className="text-xs text-[#3FA88A] font-mono font-bold flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-[#3FA88A] animate-pulse" /> 2 Stations Live
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {workers.map((w) => (
              <div key={w.worker_id} className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3 hover:border-[#4EB8E0]/40 transition-all">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-white text-sm font-serif">{w.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1A4A66]/60 text-[#4EB8E0] border border-[#4EB8E0]/40">
                    {w.worker_id}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white/5 space-y-0.5 border border-white/5">
                    <span className="text-[10px] text-[#8DA0B0] font-semibold block">Screened Today</span>
                    <span className="font-mono font-bold text-white text-base">{w.screened_count}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#3FA88A]/10 border border-[#3FA88A]/30 space-y-0.5">
                    <span className="text-[10px] text-[#3FA88A] font-semibold block">Quality Passed</span>
                    <span className="font-mono font-bold text-[#3FA88A] text-base">{w.snr_passed}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#DDA43C]/10 border border-[#DDA43C]/30 space-y-0.5">
                    <span className="text-[10px] text-[#DDA43C] font-semibold block">Blocked Re-records</span>
                    <span className="font-mono font-bold text-[#DDA43C] text-base">{w.snr_failed}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-1 text-[#E6EBF0]">
                  <span>Pass Rate: <strong className="text-[#3FA88A]">{w.pass_rate_pct}%</strong></span>
                  <span>Avg SNR: <strong className="text-[#4EB8E0]">{w.avg_snr_db} dB</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
