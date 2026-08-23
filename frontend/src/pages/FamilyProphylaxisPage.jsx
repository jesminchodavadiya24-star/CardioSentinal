import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft, Calendar, ShieldCheck, CheckCircle2, AlertTriangle, Clock, Bell, Info, ChevronDown, ChevronUp, Syringe, Award, MapPin } from 'lucide-react';

export default function FamilyProphylaxisPage() {
  const { childId } = useParams();
  const targetId = childId || 'child-0121';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(true);

  useEffect(() => {
    async function fetchProphylaxis() {
      try {
        const res = await fetch(getApiUrl(`/api/family/prophylaxis/${targetId}`));
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setReminderEnabled(json.reminder_enabled || false);
        }
      } catch (e) {
        console.error('Failed to fetch prophylaxis records:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchProphylaxis();
  }, [targetId]);

  const handleReminderToggle = async () => {
    setToggleLoading(true);
    const nextState = !reminderEnabled;
    try {
      const res = await fetch(getApiUrl('/api/family/prophylaxis/reminder-toggle'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: targetId, enabled: nextState })
      });
      if (res.ok) {
        setReminderEnabled(nextState);
      }
    } catch (e) {
      console.error('Failed to toggle reminder:', e);
    } finally {
      setToggleLoading(false);
    }
  };

  const child = data?.child || {
    anonymized_code: 'CS-MEG-0121',
    patient_name: 'Mebakerlin Pyngrope',
    age: 10,
    sex: 'Female',
    guardian_name: 'Wanpli Pyngrope',
    referred_facility: 'NEIGRIHMS Cardiology Wing'
  };

  const records = data?.records || [];
  const adherenceRate = data?.adherence_rate || 85.7;
  const streak = data?.consecutive_streak || 4;
  const upcoming = data?.upcoming_dose || { next_due_date: '2026-08-15', dose_number: 8, administering_facility: 'Sohra CHC' };

  return (
    <div className="min-h-screen bg-[#0D0B0C] text-slate-100 font-sans selection:bg-[#2C7FB8] selection:text-white">
      <div className="family-heart-bg" aria-hidden="true">
        <img src="/heart_bg.png" alt="" draggable="false" />
      </div>
      <div className="family-portal-content p-6 md:p-10 space-y-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link to={`/family/journey/${targetId}`} className="p-2.5 rounded-xl bg-[#132030] border border-[#4EB8E0]/40 text-[#4EB8E0] hover:text-white hover:scale-105 transition-all shadow-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2 font-serif">
                <Syringe className="w-5 h-5 text-[#4EB8E0]" />
                Secondary Prophylaxis Adherence Record
              </h1>
              <p className="text-xs text-[#8DA0B0] font-sans">Benzathine Penicillin G (BPG) Long-Term Rheumatic Heart Prevention</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-[#3FA88A]/20 border border-[#3FA88A]/40 px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#3FA88A] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#3FA88A]" />
            <span>Active Prevention Plan</span>
          </div>
        </header>

        {/* Child Profile & Next Scheduled Dose Banner */}
        <div className="glass-card p-6 border-white/10 grid md:grid-cols-3 gap-6 items-center rounded-2xl shadow-xl">
          <div className="md:col-span-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#4EB8E0] uppercase tracking-wider">Child Anonymized Code:</span>
              <span className="text-sm font-mono font-extrabold text-[#4EB8E0] bg-black/60 px-2 py-0.5 rounded border border-white/10">{child.anonymized_code}</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-serif">{child.patient_name}</h2>
            <p className="text-xs text-[#8DA0B0] font-sans">Age: {child.age} yrs • Gender: {child.sex} • Guardian: {child.guardian_name} • Facility: <span className="text-white font-semibold">{child.referred_facility}</span></p>
          </div>

          {/* Next Due Highlight Banner */}
          <div className="bg-[#132030] border border-[#4EB8E0]/40 p-4 rounded-xl shadow-xl space-y-1.5 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs text-[#4EB8E0] font-mono font-bold">
              <Clock className="w-4 h-4 text-[#4EB8E0] animate-pulse" />
              <span>NEXT DUE DOSE #{upcoming.dose_number || 8}</span>
            </div>
            <div className="text-2xl font-extrabold text-[#DDA43C] font-mono">{upcoming.next_due_date || '2026-08-15'}</div>
            <p className="text-[11px] text-[#8DA0B0] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#4EB8E0]" />
              {upcoming.administering_facility || 'Sohra CHC Outpatient'}
            </p>
          </div>
        </div>

        {/* Adherence Rate & Consecutive Streak Scorecard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 border-white/10 space-y-1 rounded-2xl shadow-xl">
            <span className="text-xs font-mono font-bold text-[#4EB8E0] uppercase tracking-wider block">Adherence Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{adherenceRate}%</span>
              <span className="text-xs font-bold text-[#3FA88A] bg-[#3FA88A]/10 px-2 py-0.5 rounded border border-[#3FA88A]/30">On Track</span>
            </div>
            <p className="text-xs text-[#8DA0B0]">{data?.on_time_count || 6} of {data?.total_past_doses || 7} past doses received on schedule</p>
          </div>

          <div className="glass-card p-5 border-white/10 space-y-1 rounded-2xl shadow-xl">
            <span className="text-xs font-mono font-bold text-[#4EB8E0] uppercase tracking-wider block flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#DDA43C]" />
              Consecutive On-Time Streak
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#DDA43C] font-mono">{streak} Doses</span>
              <span className="text-xs font-bold text-[#DDA43C] font-mono">⚡ Active Streak</span>
            </div>
            <p className="text-xs text-[#8DA0B0]">Unbroken streak of on-time protection</p>
          </div>

          {/* Proactive SMS Reminder Toggle Card */}
          <div className="glass-card p-5 border-white/10 bg-[#132030]/60 flex flex-col justify-between space-y-3 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#4EB8E0]" />
                <span className="text-xs font-bold text-white font-serif">Automated SMS Reminders</span>
              </div>
              <button
                onClick={handleReminderToggle}
                disabled={toggleLoading}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${reminderEnabled ? 'bg-[#2C7FB8]' : 'bg-slate-800 border-slate-600'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${reminderEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <p className="text-[11px] text-[#8DA0B0] leading-snug font-sans">
              {reminderEnabled ? '✓ SMS alert will be sent 2 days before each dose.' : 'Enable to receive SMS reminders 2 days prior to due date.'}
            </p>
          </div>
        </div>

        {/* Plain-Language Explainer Collapsible Card */}
        <div className="glass-card p-5 border-white/10 space-y-3 rounded-2xl shadow-xl">
          <button
            onClick={() => setExplainerOpen(!explainerOpen)}
            className="w-full flex items-center justify-between text-left font-bold text-sm text-white hover:text-[#4EB8E0] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 font-serif text-base">
              <Info className="w-5 h-5 text-[#4EB8E0]" />
              What are these injections for and why do they continue for years?
            </span>
            {explainerOpen ? <ChevronUp className="w-5 h-5 text-[#4EB8E0]" /> : <ChevronDown className="w-5 h-5 text-[#4EB8E0]" />}
          </button>

          {explainerOpen && (
            <div className="pt-2 border-t border-white/10 text-xs text-[#8DA0B0] leading-relaxed space-y-2 font-sans">
              <p>
                Benzathine Penicillin G (BPG) injections protect against repeat streptococcal throat infections (strep throat), which are the primary trigger for recurrent heart valve inflammation in Rheumatic Heart Disease (RHD).
              </p>
              <p className="font-bold text-[#E6EBF0]">
                Continuing these injections regularly every 3-4 weeks as scheduled — even when your child feels 100% healthy, energetic, and symptom-free — is the single most effective clinical intervention to prevent further heart valve damage and protect their heart for life.
              </p>
            </div>
          )}
        </div>

        {/* Visual Adherence Timeline */}
        <div className="glass-card p-6 border-white/10 space-y-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-white font-serif border-b border-white/10 pb-3 flex items-center justify-between">
            <span>Chronological Injection Administration Timeline</span>
            <span className="text-xs text-[#8DA0B0] font-mono font-normal">Total Records: {records.length}</span>
          </h3>

          <div className="relative border-l-2 border-[#3FA88A]/40 ml-4 pl-6 space-y-8">
            {records.map((rec, idx) => {
              const status = rec.adherence_status;
              return (
                <div key={rec.id || idx} className={`relative p-4 rounded-xl transition-all ${
                  status === 'upcoming' ? 'bg-[#E85D4A]/10 border border-[#E85D4A]/40 shadow-lg' :
                  status === 'on_time' ? 'bg-[#132030]/60 border border-white/10' :
                  status === 'late' ? 'bg-[#DDA43C]/10 border border-[#DDA43C]/40' :
                  'bg-[#E85D4A]/10 border border-[#E85D4A]/40'
                }`}>
                  {/* Timeline Node Badge */}
                  <div className={`absolute -left-[37px] top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow ${
                    status === 'on_time' ? 'bg-[#3FA88A]/20 border border-[#3FA88A]/50 text-[#3FA88A]' :
                    status === 'late' ? 'bg-[#DDA43C]/20 border border-[#DDA43C]/50 text-[#DDA43C]' :
                    status === 'missed' ? 'bg-[#E85D4A]/20 border border-[#E85D4A]/50 text-[#E85D4A]' :
                    'bg-[#2C7FB8] border-2 border-white animate-ping'
                  }`}>
                    {status === 'on_time' ? <CheckCircle2 className="w-4 h-4 text-[#3FA88A]" /> :
                     status === 'late' ? <Clock className="w-4 h-4 text-[#DDA43C]" /> :
                     status === 'missed' ? <AlertTriangle className="w-4 h-4 text-[#E85D4A]" /> :
                     <Syringe className="w-3.5 h-3.5 text-white" />}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">Dose #{rec.dose_number || idx + 1}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                        status === 'on_time' ? 'bg-[#3FA88A]/20 text-[#3FA88A] border border-[#3FA88A]/40' :
                        status === 'late' ? 'bg-[#DDA43C]/20 text-[#DDA43C] border border-[#DDA43C]/40' :
                        status === 'missed' ? 'bg-[#E85D4A]/20 text-[#E85D4A] border border-[#E85D4A]/50' :
                        'bg-[#2C7FB8]/20 text-[#4EB8E0] border border-[#4EB8E0]/40 animate-pulse'
                      }`}>
                        {status === 'on_time' ? 'Administered On Schedule' :
                         status === 'late' ? 'Administered 7 Days Late' :
                         status === 'missed' ? 'Missed Dose' :
                         'Next Scheduled Dose'}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-[#8DA0B0]">
                      Scheduled: {rec.next_due_date || rec.penicillin_dose_date}
                    </span>
                  </div>

                  <div className="pt-2 grid sm:grid-cols-3 gap-2 text-xs font-sans">
                    <div>
                      <span className="text-[#4EB8E0] block text-[10px] uppercase font-mono font-bold">Date Administered</span>
                      <span className="font-semibold text-white font-mono">{rec.penicillin_dose_date || 'Pending'}</span>
                    </div>
                    <div>
                      <span className="text-[#4EB8E0] block text-[10px] uppercase font-mono font-bold">Batch Number</span>
                      <span className="font-mono font-bold text-[#4EB8E0]">{rec.penicillin_batch_no || 'BPG-2026-042'}</span>
                    </div>
                    <div>
                      <span className="text-[#4EB8E0] block text-[10px] uppercase font-mono font-bold">Facility & Nurse</span>
                      <span className="font-semibold text-white">{rec.administering_facility || 'Sohra CHC'} ({rec.administering_nurse || 'Nurse Mary'})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <footer className="text-center text-xs text-[#8DA0B0] border-t border-white/10 pt-6">
          <p className="max-w-3xl mx-auto text-[11px] text-[#8DA0B0]/70 leading-relaxed font-sans">
            CardioSentinel is a software-only triage prioritization tool, NOT a diagnostic device. Every case flagged requires formal echocardiographic evaluation and clinical confirmation by a pediatric cardiologist.
          </p>
        </footer>
      </div>
      </div>{/* /family-portal-content */}
    </div>
  );
}
