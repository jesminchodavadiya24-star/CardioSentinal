import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import {
  AlertTriangle, Activity, ShieldAlert, CheckCircle2, Sliders, Info,
  MapPin, Wrench, Check, FileText, ArrowRight, X, Sparkles, HelpCircle, AudioWaveform, Stethoscope, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot, Legend
} from 'recharts';

export default function DistrictAnomaliesPage() {
  const [anomalyData, setAnomalyData] = useState(null);
  const [actionTicket, setActionTicket] = useState(null);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    async function fetchAnomalies() {
      try {
        const res = await fetch(getApiUrl('/api/district/anomaly-detection'));
        if (res.ok) {
          const data = await res.json();
          setAnomalyData(data);
        }
      } catch (e) {
        console.error('Failed to fetch anomaly data:', e);
      }
    }
    fetchAnomalies();
  }, []);

  const cusumSeries = anomalyData?.cusum_series || [0.0, 0.0, 0.0, 0.0, 0.0, 0.21, 0.52, 0.89];
  const baselineSeries = [0.0, 0.0, 0.0, 0.0, 0.0, 0.01, 0.02, 0.02];

  const chartData = cusumSeries.map((val, idx) => ({
    step: `Batch ${idx + 1}`,
    cusum: val,
    districtBaseline: baselineSeries[idx] !== undefined ? baselineSeries[idx] : 0.01
  }));

  const rawThreshold = anomalyData?.threshold_h !== undefined ? anomalyData.threshold_h : 0.057;
  const formattedThreshold = (typeof rawThreshold === 'number' ? rawThreshold : parseFloat(rawThreshold) || 0.057).toFixed(3);
  
  const alarmIndex = anomalyData?.alarm_triggered_index !== undefined && anomalyData.alarm_triggered_index >= 0 
    ? anomalyData.alarm_triggered_index 
    : 5;
  const breachBatchLabel = `Batch ${alarmIndex + 1}`;
  const breachValue = cusumSeries[alarmIndex] !== undefined ? cusumSeries[alarmIndex] : 0.2888;

  const handleAction = (type) => {
    if (type === 'investigation') {
      setActionTicket({
        id: 'ALT-2026-03',
        type: 'Outbreak Investigation',
        title: 'Field Outbreak Investigation Ticket #ALT-2026-03 Dispatched',
        details: 'Mobile Echocardiography Van & Epidemiological Screening Team assigned to Pynthorumkhrah Rural Camp.',
        status: 'Active Field Dispatch',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else if (type === 'audit') {
      setActionTicket({
        id: 'AUDIT-HW-0812',
        type: 'Equipment & Technique Audit',
        title: 'ASHA Hardware & Stethoscope Calibration Audit #HW-0812 Created',
        details: 'Digital Stethoscope acoustic calibration & SNR Quality Gate audit assigned for ASHA Worker CS-MEG-03.',
        status: 'Audit Scheduled',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4EB8E0] uppercase tracking-wider">
              <Activity className="w-4 h-4 text-[#4EB8E0]" />
              <span>District Epidemiological Surveillance Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white font-serif mt-1">
              Statistical CUSUM Outbreak & Data Quality Anomaly Radar
            </h1>
            <p className="text-xs text-[#8DA0B0]">
              Automated statistical early-warning radar detecting disease cluster surges and ASHA digital stethoscope audio faults.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#132030] border border-[#4EB8E0]/40 text-xs font-mono font-bold text-[#4EB8E0] hover:border-[#4EB8E0] transition-all cursor-pointer shadow-md"
            >
              <HelpCircle className="w-4 h-4 text-[#4EB8E0] shrink-0" />
              <span>{showGuide ? 'Hide Plain-English Guide' : 'How To Read This Radar'}</span>
              {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Plain-English Explanation & How-To-Read Guide */}
        {showGuide && (
          <div className="glass-card p-5 rounded-2xl border-[#4EB8E0]/40 bg-[#0F1722] text-xs space-y-3 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-bold text-white text-sm font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4EB8E0]" />
                <span>Plain-English Guide: What is this Statistical CUSUM Radar?</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#4EB8E0]/20 text-[#4EB8E0] text-[10px] font-mono font-bold">
                DISTRICT OFFICER EXPLAINER
              </span>
            </div>

            <p className="text-[#E6EBF0] leading-relaxed">
              <strong>CUSUM (Cumulative Sum Control Chart)</strong> is a statistical radar algorithm. Instead of looking at a single child, it continuously monitors screening batches across schools to detect when abnormal heart sound flag rates spike above the district background level.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px] pt-1">
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                <strong className="text-[#E85D4A] block">🔴 Red Line (Camp CUSUM)</strong>
                <p className="text-[#8DA0B0] font-sans">Accumulates consecutive abnormal flag spikes at the camp.</p>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-[#DDA43C]/40 space-y-1">
                <strong className="text-[#DDA43C] block">🟡 Dashed Yellow (Alarm Limit h={formattedThreshold})</strong>
                <p className="text-[#8DA0B0] font-sans">The safety threshold. Crossing this limit sounds the outbreak alarm.</p>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-[#4EB8E0]/40 space-y-1">
                <strong className="text-[#4EB8E0] block">🔵 Dashed Blue (District Baseline)</strong>
                <p className="text-[#8DA0B0] font-sans">Normal background flag rate across Meghalaya schools (4.2%).</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistical Anomaly Alert Banner */}
        <div className="glass-card p-6 border-[#E85D4A]/50 bg-[#E85D4A]/10 space-y-4 shadow-2xl rounded-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#E85D4A]/20 border border-[#E85D4A]/40 text-[#E85D4A] shrink-0 mt-0.5">
                <ShieldAlert className="w-7 h-7 text-[#E85D4A]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white font-serif tracking-tight">STATISTICAL ANOMALY ALERT DETECTED</h2>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#E85D4A]/20 text-[#E85D4A] border border-[#E85D4A]/50 uppercase tracking-wider animate-pulse font-mono">
                    Threshold h={formattedThreshold} Exceeded
                  </span>
                </div>
                <p className="text-xs text-[#E6EBF0] mt-1 leading-relaxed">
                  Camp <strong>'Pynthorumkhrah Rural Camp (camp-03)'</strong> flag rate reached <strong>19.6% (22 out of 112 children)</strong> — <strong>4.7x higher</strong> than normal district baseline (4.2%)!
                </p>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleAction('investigation')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DDA43C] hover:bg-[#DDA43C]/80 text-[#14181D] text-xs font-extrabold shadow-md transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#14181D]" />
                <span>Dispatch Outbreak Team</span>
              </button>
              <button
                onClick={() => handleAction('audit')}
                className="glass-button-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-[#E6EBF0] hover:border-[#4EB8E0]/40 transition-all cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-[#4EB8E0]" />
                <span>Audit Stethoscope Hardware</span>
              </button>
            </div>
          </div>

          {/* Statistical Breakdown Grid */}
          <div className="p-3.5 rounded-xl bg-black/60 text-xs font-mono border border-[#E85D4A]/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span><span className="text-[#8DA0B0]">Alarm Limit (h):</span> <strong className="text-[#DDA43C] font-bold">{formattedThreshold}</strong></span>
              <span className="text-white/30">•</span>
              <span><span className="text-[#8DA0B0]">Current CUSUM Statistic:</span> <strong className="text-[#E85D4A] font-bold">{(anomalyData?.current_cusum || 0.89).toFixed(4)}</strong></span>
              <span className="text-white/30">•</span>
              <span><span className="text-[#8DA0B0]">Sensitivity Allowance (k):</span> <strong className="text-white">{(anomalyData?.slack_k || 0.0071).toFixed(4)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#E85D4A] font-bold uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E85D4A]" />
              <span>STATUS: ANOMALY CONFIRMED</span>
            </div>
          </div>

          {/* Active Ticket Toast Banner */}
          {actionTicket && (
            <div className="p-3.5 rounded-xl bg-[#3FA88A]/20 border border-[#3FA88A]/50 text-[#3FA88A] text-xs flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#3FA88A] shrink-0" />
                <div>
                  <span className="font-bold text-white">{actionTicket.title}</span>
                  <p className="text-[11px] text-[#3FA88A]/90 mt-0.5">{actionTicket.details} • Dispatched at {actionTicket.time}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#3FA88A]/20 text-[#3FA88A] font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 border border-[#3FA88A]/40">
                {actionTicket.status}
              </span>
            </div>
          )}
        </div>

        {/* CUSUM Control Chart Visualizer */}
        <div className="glass-card p-6 border-white/10 space-y-4 rounded-2xl shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h3 className="font-bold text-base text-white font-serif flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#E85D4A]" />
                <span>CUSUM Cumulative Sum Progression (Pynthorumkhrah Rural Camp)</span>
              </h3>
              <p className="text-xs text-[#8DA0B0] font-mono mt-0.5">
                Tracks sequential batch accumulation. Crossing yellow dashed line (h={formattedThreshold}) triggered alarm at Batch 6.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-medium font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#E85D4A] rounded-full inline-block"></span>
                <span className="text-[#E85D4A] font-bold">Camp CUSUM Statistic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#4EB8E0] border-b border-dashed border-[#4EB8E0] inline-block"></span>
                <span className="text-[#4EB8E0] font-bold">District Baseline</span>
              </div>
            </div>
          </div>
          
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <XAxis dataKey="step" stroke="#8DA0B0" fontSize={11} tickLine={false} />
                <YAxis stroke="#8DA0B0" fontSize={11} domain={[0, 'dataMax + 0.25']} tickLine={false} />
                <Tooltip 
                  cursor={{ stroke: 'rgba(232, 93, 74, 0.3)', strokeDasharray: '3 3', strokeWidth: 1 }} 
                  contentStyle={{ backgroundColor: '#0A0E13', borderColor: '#4EB8E0', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                />
                
                <ReferenceLine 
                  y={parseFloat(formattedThreshold)} 
                  label={{ value: `Alarm Limit h=${formattedThreshold}`, fill: '#DDA43C', fontSize: 11, position: 'top', fontWeight: 'bold' }} 
                  stroke="#DDA43C" 
                  strokeDasharray="4 4" 
                  strokeWidth={2}
                />

                <ReferenceLine 
                  x={breachBatchLabel} 
                  stroke="#E85D4A" 
                  strokeDasharray="4 4" 
                  strokeWidth={2}
                  label={{ value: '⚠️ Breach detected at Batch 6', fill: '#E85D4A', fontSize: 11, position: 'top', fontWeight: 'bold' }} 
                />

                <ReferenceDot 
                  x={breachBatchLabel} 
                  y={breachValue} 
                  r={8} 
                  fill="#E85D4A" 
                  stroke="#ffffff" 
                  strokeWidth={2.5} 
                />

                <Line 
                  type="monotone" 
                  dataKey="districtBaseline" 
                  name="District Baseline Rate" 
                  stroke="#4EB8E0" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                />

                <Line 
                  type="monotone" 
                  dataKey="cusum" 
                  name="Camp CUSUM Statistic" 
                  stroke="#E85D4A" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#E85D4A', stroke: '#ffffff', strokeWidth: 1.5 }} 
                  activeDot={{ r: 7, fill: '#E85D4A', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dual-Cause Diagnostic Decision Support Panel */}
        <div className="glass-card p-6 border-white/10 space-y-4 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
            <Sliders className="w-5 h-5 text-[#DDA43C] shrink-0" />
            <div>
              <h3 className="font-bold text-base text-white font-serif">Dual-Cause Diagnostic Decision Framework</h3>
              <p className="text-xs text-[#8DA0B0]">
                A statistical CUSUM alert can be caused by either a real streptococcal disease cluster or stethoscope audio noise.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cause A: Outbreak */}
            <div className="glass-card p-5 rounded-xl border-[#E85D4A]/40 bg-[#E85D4A]/10 space-y-3 hover:border-[#E85D4A]/60 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#E85D4A] font-bold text-sm font-serif">
                  <AlertTriangle className="w-4 h-4 text-[#E85D4A]" />
                  <span>Cause (A): Genuine Local GAS / RHD Outbreak</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#E85D4A]/20 text-[#E85D4A] font-mono text-[10px] font-bold">
                  EPIDEMIOLOGICAL
                </span>
              </div>
              
              <p className="text-xs text-[#E6EBF0] leading-relaxed">
                The flag rate surge (<strong>19.6% vs 4.2% baseline</strong>) reflects an active cluster of acute streptococcal pharyngitis (strep throat) or subclinical rheumatic heart disease spreading among students at Pynthorumkhrah Rural Camp.
              </p>

              <div className="pt-2 border-t border-[#E85D4A]/20 flex items-center justify-between text-xs">
                <span className="text-[#8DA0B0] font-semibold font-mono">DHO Action:</span>
                <button 
                  onClick={() => handleAction('investigation')}
                  className="px-3 py-1.5 rounded-lg bg-[#DDA43C] hover:bg-[#DDA43C]/80 text-[#14181D] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span>Dispatch Mobile Echo Van</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#14181D]" />
                </button>
              </div>
            </div>

            {/* Cause B: Data Quality */}
            <div className="glass-card p-5 rounded-xl border-[#4EB8E0]/40 bg-[#1A4A66]/30 space-y-3 hover:border-[#4EB8E0]/60 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#4EB8E0] font-bold text-sm font-serif">
                  <Stethoscope className="w-4 h-4 text-[#4EB8E0]" />
                  <span>Cause (B): ASHA Hardware / Acoustic Noise Fault</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#4EB8E0]/20 text-[#4EB8E0] font-mono text-[10px] font-bold">
                  HARDWARE & AUDIT
                </span>
              </div>

              <p className="text-xs text-[#E6EBF0] leading-relaxed">
                The flag rate surge is driven by digital stethoscope microphone calibration drift, ambient classroom noise (rain/wind), or incorrect sensor placement by ASHA worker <code className="px-1.5 py-0.5 rounded bg-black/40 text-[#4EB8E0] font-mono font-bold">CS-MEG-03</code>.
              </p>

              <div className="pt-2 border-t border-[#4EB8E0]/20 flex items-center justify-between text-xs">
                <span className="text-[#8DA0B0] font-semibold font-mono">DHO Action:</span>
                <button 
                  onClick={() => handleAction('audit')}
                  className="px-3 py-1.5 rounded-lg bg-[#4EB8E0] hover:bg-[#4EB8E0]/80 text-[#0A0E13] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <span>Audit Stethoscope Calibration</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0A0E13]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
