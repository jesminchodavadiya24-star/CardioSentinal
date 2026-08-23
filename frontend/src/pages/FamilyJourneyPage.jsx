import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import translations from '../i18n/translations.json';
import { HeartPulse, Globe, Calendar, Clock, MapPin, MessageSquare, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle, FileText, ArrowRight, ShieldAlert, Syringe } from 'lucide-react';


export default function FamilyJourneyPage() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem('family_language') || 'en');
  const [journey, setJourney] = useState(null);
  const [guidanceCards, setGuidanceCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('family_language', newLang);
  };

  const t = translations[lang] || translations.en;

  useEffect(() => {
    async function fetchData() {
      try {
        const [jRes, gRes] = await Promise.all([
          fetch(getApiUrl(`/api/family/journey/${childId || 'child-0121'}`)),
          fetch(getApiUrl(`/api/family/guidance/${childId || 'child-0121'}`))
        ]);

        if (jRes.ok) {
          const jData = await jRes.json();
          setJourney(jData);
        }
        if (gRes.ok) {
          const gData = await gRes.json();
          setGuidanceCards(gData.guidance_cards || []);
        }
      } catch (e) {
        console.error('Failed to load family journey data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [childId]);

  const handleDownloadPdf = () => {
    const targetId = journey?.referral_id || childId || 'child-0121';
    const url = getApiUrl(`/api/referrals/${targetId}/slip.pdf`);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Referral_Slip_${journey?.anonymized_code || 'CS-MEG-0121'}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCardAction = (card) => {
    const text = card.action_text || '';
    if (text.includes('Referral Slip') || text.includes('PDF')) {
      handleDownloadPdf();
    } else if (text.includes('Injection') || text.includes('Record') || card.type === 'prophylaxis_reminder') {
      navigate(`/family/prophylaxis/${childId || 'child-0121'}`);
    } else if (text.includes('Hospitals') || text.includes('Cardiology')) {
      navigate('/family/facilities');
    } else {
      navigate(`/family/journey/${childId || 'child-0121'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B0C] text-slate-100 selection:bg-[#2C7FB8] selection:text-white font-sans">
      {/* Fixed heart background image — z-index:0, pointer-events:none */}
      <div className="family-heart-bg" aria-hidden="true">
        <img src="/heart_bg.png" alt="" draggable="false" />
      </div>

      {/* Page content — z-index:2 via family-portal-content, sits above image + overlay */}
      <div className="family-portal-content p-6 md:p-10 space-y-8">
      {/* Top Navbar */}
      <header className="max-w-5xl mx-auto flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-10 h-10 rounded-xl bg-[#132030] border border-[#4EB8E0]/50 flex items-center justify-center text-[#4EB8E0] shadow-lg hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 text-[#4EB8E0]" />
          </Link>
          <div>
            <Link to="/" className="text-xl font-bold text-white font-serif hover:text-[#4EB8E0] transition-colors">CardioSentinel</Link>
            <p className="text-xs text-[#8DA0B0]">{t.title} • {t.subtitle}</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md">
          <Globe className="w-4 h-4 text-[#4EB8E0]" />
          <button
            onClick={() => handleLangChange('en')}
            className={`px-2.5 py-0.5 rounded-lg font-bold transition-all ${lang === 'en' ? 'bg-[#2C7FB8] text-white border border-[#4EB8E0]/40 shadow' : 'text-[#8DA0B0] hover:text-white'}`}
          >
            English
          </button>
          <button
            onClick={() => handleLangChange('hi')}
            className={`px-2.5 py-0.5 rounded-lg font-bold transition-all ${lang === 'hi' ? 'bg-[#2C7FB8] text-white border border-[#4EB8E0]/40 shadow' : 'text-[#8DA0B0] hover:text-white'}`}
          >
            हिंदी
          </button>
          <button
            onClick={() => handleLangChange('kh')}
            className={`px-2.5 py-0.5 rounded-lg font-bold transition-all ${lang === 'kh' ? 'bg-[#2C7FB8] text-white border border-[#4EB8E0]/40 shadow' : 'text-[#8DA0B0] hover:text-white'}`}
          >
            Khasi
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Urgency Header Banner for High-Risk Referral */}
        {journey?.risk_tier === 'high' && (
          <div className="glass-card p-4 rounded-xl border-[#E85D4A]/50 bg-[#E85D4A]/10 flex items-center justify-between gap-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-[#DDA43C] shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white font-serif">An Echocardiogram Specialist Visit Is Recommended Soon</h4>
                <p className="text-xs text-[#E6EBF0] leading-relaxed font-sans">
                  Screening acoustic analysis flagged soft valve sound variation. Completing your hospital visit is the most important next step for your child.
                </p>
              </div>
            </div>
            <Link to="/family/facilities" className="glass-button text-xs py-2 px-4 shrink-0 bg-[#2C7FB8] border-[#4EB8E0]/40 text-white font-bold flex items-center gap-1.5 shadow-md">
              <span>View Hospital Locations</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        )}

        {/* Prominent Flagship Feature Action Cards Area */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/family/facilities"
            className="glass-card p-5 border-white/10 hover:border-[#4EB8E0]/50 transition-all hover:scale-[1.01] flex items-center justify-between group bg-[#1A4A66]/20 rounded-2xl"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#4EB8E0] uppercase tracking-wider block font-mono">Flagship Capability</span>
              <h3 className="font-bold text-base text-white group-hover:text-[#4EB8E0] transition-colors flex items-center gap-2 font-serif">
                <MapPin className="w-5 h-5 text-[#4EB8E0]" />
                Nearest Cardiology Hospitals
              </h3>
              <p className="text-xs text-[#8DA0B0]">Geolocated pediatric echo facilities, distances, and contact details</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#4EB8E0] group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>

          <Link
            to="/family/ask"
            className="glass-card p-5 border-white/10 hover:border-[#4EB8E0]/50 transition-all hover:scale-[1.01] flex items-center justify-between group bg-[#1A4A66]/20 rounded-2xl"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#4EB8E0] uppercase tracking-wider block font-mono">Multilingual AI Chatbot</span>
              <h3 className="font-bold text-base text-white group-hover:text-[#4EB8E0] transition-colors flex items-center gap-2 font-serif">
                <MessageSquare className="w-5 h-5 text-[#4EB8E0]" />
                Ask Health Assistant
              </h3>
              <p className="text-xs text-[#8DA0B0]">Get immediate, reassuring answers to your questions about RHD care</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#4EB8E0] group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>
        </div>

        {/* Child Profile Header Card */}
        <div className="glass-card p-6 border-white/10 flex flex-wrap items-center justify-between gap-4 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#4EB8E0] uppercase tracking-wider block font-mono">Child Health Screening Record</span>
              <span className="px-2 py-0.5 rounded bg-[#3FA88A]/20 border border-[#3FA88A]/40 text-[#3FA88A] text-[10px] font-bold font-mono">LIVE REAL-TIME</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-serif mt-1">
              {journey?.full_name || journey?.patient_name || 'Chodavadiya Jesmin Dipakbhai'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#8DA0B0] mt-1 font-sans">
              <span>Code: <strong className="text-[#4EB8E0] font-mono">{journey?.anonymized_code || 'CS-MAW-5616'}</strong></span>
              <span>•</span>
              <span>Guardian: <strong className="text-white">{journey?.guardian_name || 'Chodavadiya Dipakbhai'}</strong></span>
              <span>•</span>
              <span>Age: <strong className="text-white">{journey?.age || 19} yrs ({journey?.sex || 'Male'})</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              className="glass-button-secondary text-xs py-2 px-4 text-[#E6EBF0] hover:border-[#4EB8E0]/40 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4 text-[#4EB8E0]" />
              <span>Download Referral Slip PDF</span>
            </button>
          </div>
        </div>

        {/* Next Step Guidance Cards */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#DDA43C]" />
            {t.next_steps_title}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {guidanceCards.map((card) => (
              <div key={card.id} className="glass-card p-5 border-white/10 space-y-2 relative overflow-hidden flex flex-col justify-between rounded-2xl shadow-xl">
                <div className="space-y-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase inline-block ${
                    card.severity === 'urgent' ? 'bg-[#E85D4A]/20 text-[#E85D4A] border border-[#E85D4A]/50' :
                    card.severity === 'warning' ? 'bg-[#DDA43C]/20 text-[#DDA43C] border border-[#DDA43C]/40' :
                    'bg-[#4EB8E0]/20 text-[#4EB8E0] border border-[#4EB8E0]/40'
                  }`}>
                    {card.severity === 'urgent' ? 'Urgent Specialist Priority' : card.severity === 'warning' ? 'Scheduled Warning Priority' : 'Routine Info Priority'}
                  </span>
                  <h4 className="font-bold text-white text-sm pt-1 font-serif">{card.title}</h4>
                  <p className="text-xs text-[#8DA0B0] leading-relaxed font-sans">{card.message}</p>
                </div>

                <button
                  onClick={() => handleCardAction(card)}
                  className="pt-3 text-xs font-bold text-[#4EB8E0] hover:text-white transition-colors flex items-center gap-1 text-left w-fit underline cursor-pointer font-mono"
                >
                  {card.action_text} →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Health Journey Timeline */}
        <div className="glass-card p-6 border-white/10 space-y-6 rounded-2xl shadow-xl">
          
          {/* Progress Indicator Header */}
          <div className="flex flex-col space-y-2 border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#4EB8E0]" />
                Care Journey Progression Timeline
              </h3>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#E85D4A]/20 border border-[#E85D4A]/50 text-[#E85D4A] shadow">
                {journey?.step_label || 'Step 3 of 4 — Active Specialist Referral Pending'}
              </span>
            </div>
            <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-[#3FA88A] via-[#DDA43C] to-[#E85D4A] h-full rounded-full transition-all duration-700 shadow-md"
                style={{ width: `${journey?.progress_percentage || 75}%` }}
              />
            </div>
          </div>

          <div className="relative ml-4 pl-6 space-y-8">
            {/* Animated Connecting Vertical Line */}
            <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-black/60 rounded-full">
              <div
                className="w-full bg-gradient-to-b from-[#3FA88A] via-[#DDA43C] to-[#E85D4A] transition-all duration-700"
                style={{ height: `${journey?.active_step === 4 ? 100 : (journey?.active_step === 3 ? 68 : 34)}%` }}
              />
            </div>

            {/* Step 1: School Health Screening */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-[#3FA88A]/20 border border-[#3FA88A]/50 flex items-center justify-center text-[#3FA88A] shadow">
                <CheckCircle2 className="w-4 h-4 text-[#3FA88A]" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm font-serif">{t.step_screening}</h4>
                <span className="text-[11px] font-mono text-[#3FA88A] bg-[#3FA88A]/10 px-2 py-0.5 rounded border border-[#3FA88A]/30">
                  Completed: {journey?.screening_date || 'July 12, 2026'}
                </span>
              </div>
              <p className="text-xs text-[#8DA0B0] mt-0.5 font-sans">Completed during school health screening camp in East Khasi Hills.</p>
            </div>

            {/* Step 2: AI Triage Assessment */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-[#3FA88A]/20 border border-[#3FA88A]/50 flex items-center justify-center text-[#3FA88A] shadow">
                <CheckCircle2 className="w-4 h-4 text-[#3FA88A]" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm font-serif">{t.step_triage}</h4>
                <span className="text-[11px] font-mono text-[#3FA88A] bg-[#3FA88A]/10 px-2 py-0.5 rounded border border-[#3FA88A]/30">
                  Evaluated: {journey?.triage_date || 'July 12, 2026'}
                </span>
              </div>
              <p className="text-xs text-[#8DA0B0] mt-0.5 font-sans">
                Assessment: <span className="font-bold text-[#E85D4A]">Requires Prompt Specialist Evaluation</span> ({((journey?.calibrated_probability || 0.784) * 100).toFixed(1)}% probability). Plain-language summary: Soft heart sound turbulence detected requiring specialist echo check.
              </p>
            </div>

            {/* Step 3: Active Specialist Referral Step */}
            {(journey?.active_step || 3) === 3 ? (
              <div className="relative p-4.5 rounded-xl bg-[#E85D4A]/10 border border-[#E85D4A]/40 shadow-xl space-y-2">
                <div className="absolute -left-[35px] top-4 w-7 h-7 rounded-full bg-[#E85D4A] border-2 border-white flex items-center justify-center text-white shadow-lg animate-pulse">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2 font-serif">
                    <span>{t.step_referral}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#E85D4A]/20 text-[#E85D4A] font-mono font-bold tracking-wider uppercase border border-[#E85D4A]/50">
                      ACTIVE STEP IN PROGRESS
                    </span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-[#E6EBF0] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    Issued: {journey?.referral_date || 'July 14, 2026'}
                  </span>
                </div>

                <p className="text-xs text-[#E6EBF0] leading-relaxed font-sans">
                  Referred to <span className="font-bold text-white font-serif">{journey?.referred_to_facility || 'NEIGRIHMS Cardiology Wing'}</span>. Hospital Verification Code: <span className="font-mono font-bold text-[#4EB8E0] bg-black/60 px-2 py-0.5 rounded border border-white/10">1234</span>.
                </p>

                <div className="pt-1.5 flex items-center gap-2">
                  <div className="text-[11px] font-bold text-[#DDA43C] bg-[#DDA43C]/10 border border-[#DDA43C]/30 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow">
                    <Calendar className="w-3.5 h-3.5 text-[#DDA43C]" />
                    <span>Recommended Visit Window: Within 7 days (Target: July 21, 2026)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-[#3FA88A]/20 border border-[#3FA88A]/50 flex items-center justify-center text-[#3FA88A]">
                  <CheckCircle2 className="w-4 h-4 text-[#3FA88A]" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm font-serif">{t.step_referral}</h4>
                  <span className="text-[11px] font-mono text-[#3FA88A] bg-[#3FA88A]/10 px-2 py-0.5 rounded border border-[#3FA88A]/30">
                    Completed: {journey?.referral_date || 'July 14, 2026'}
                  </span>
                </div>
                <p className="text-xs text-[#8DA0B0] mt-0.5 font-sans">
                  Echocardiogram evaluated at {journey?.referred_to_facility || 'NEIGRIHMS Cardiology Wing'}.
                </p>
              </div>
            )}

            {/* Step 4: Secondary Prophylaxis Step */}
            {(journey?.active_step || 3) === 4 ? (
              <div className="relative p-4.5 rounded-xl bg-[#E85D4A]/10 border border-[#E85D4A]/40 shadow-xl space-y-2">
                <div className="absolute -left-[35px] top-4 w-7 h-7 rounded-full bg-[#E85D4A] border-2 border-white flex items-center justify-center text-white shadow-lg animate-pulse">
                  <Syringe className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2 font-serif">
                    <span>{t.step_prophylaxis}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#E85D4A]/20 text-[#E85D4A] font-mono font-bold tracking-wider uppercase border border-[#E85D4A]/50">
                      ACTIVE STEP IN PROGRESS
                    </span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-[#E6EBF0] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    Scheduled Due: {journey?.prophylaxis_due_date || 'August 15, 2026'}
                  </span>
                </div>
                <p className="text-xs text-[#E6EBF0] leading-relaxed font-sans flex items-center justify-between">
                  <span>Secondary BPG injection plan active on scheduled track.</span>
                  <Link to={`/family/prophylaxis/${childId || 'child-0121'}`} className="text-xs font-bold text-[#4EB8E0] hover:text-white underline">
                    View Clinic Injection Record →
                  </Link>
                </p>
              </div>
            ) : (
              <div className="relative text-[#8DA0B0]">
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-[#8DA0B0]">
                  <Syringe className="w-4 h-4 text-[#8DA0B0]" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-300 text-sm font-serif">{t.step_prophylaxis}</h4>
                  <span className="text-[11px] font-mono text-[#8DA0B0] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    Scheduled Due: {journey?.prophylaxis_due_date || 'August 15, 2026'}
                  </span>
                </div>
                <p className="text-xs text-[#8DA0B0] mt-0.5 font-sans">
                  Secondary BPG prophylaxis injections will begin following specialist hospital evaluation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verbatim Standardized Clinical & Regulatory Guardrail Disclaimer */}
        <footer className="text-center text-xs text-[#8DA0B0] border-t border-white/10 pt-6 space-y-2">
          <p className="max-w-3xl mx-auto text-[11px] text-[#8DA0B0]/70 leading-relaxed font-sans">
            CardioSentinel is a software-only triage prioritization tool, NOT a diagnostic device. Every case flagged requires formal echocardiographic evaluation and clinical confirmation by a pediatric cardiologist.
          </p>
        </footer>
      </main>
      </div>{/* /family-portal-content */}
    </div>
  );
}
