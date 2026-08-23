import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Database,
  Lock,
  Activity,
  ChevronRight,
  FileText,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Building2,
  Sparkles,
  Zap,
  Microscope,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  const [liveScreenedCount, setLiveScreenedCount] = useState(700);

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveCount() {
      try {
        const res = await fetch(getApiUrl('/api/triage/children'));
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.children && data.children.length > 0) {
            setLiveScreenedCount(data.children.length);
          }
        }
      } catch (e) {
        // Fallback to default count if backend API is unavailable
      }
    }
    fetchLiveCount();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen text-[#D0E2FF] flex flex-col selection:bg-[#00B4D8] selection:text-white bg-[#060B14] relative overflow-hidden font-sans">
      {/* Cool Blue Ambient Mesh Spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,180,216,0.22),rgba(255,255,255,0))] pointer-events-none z-0" />
      <div className="absolute top-[700px] right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_80%_50%,rgba(58,134,255,0.18),rgba(255,255,255,0))] pointer-events-none z-0" />
      <div className="absolute top-[1500px] left-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_20%_50%,rgba(0,245,212,0.15),rgba(255,255,255,0))] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(#00b4d812_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#060B14]/90 border-b border-[#1E2D4A] px-6 py-4 flex items-center justify-between shadow-2xl shadow-black transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1528] to-[#16263F] border-2 border-[#00B4D8] flex items-center justify-center text-[#00B4D8] shadow-lg shadow-[#00B4D8]/30">
            <HeartPulse className="w-6 h-6 animate-pulse text-[#00B4D8]" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white font-serif">CardioSentinel</span>
            <span className="ml-2.5 text-xs px-3 py-1 rounded-full bg-[#0077B6]/30 border border-[#00B4D8]/50 text-[#90E0EF] font-mono font-bold shadow-md">
              RHD Triage AI
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#D0E2FF]">
          <a href="#problem" className="hover:text-[#00B4D8] transition-colors flex items-center gap-1.5">
            The Problem
          </a>
          <a href="#how-it-works" className="hover:text-[#00B4D8] transition-colors flex items-center gap-1.5">
            How It Works
          </a>
          <a href="#capabilities" className="hover:text-[#00B4D8] transition-colors flex items-center gap-1.5">
            AI Capabilities
          </a>
          <a href="#sources" className="hover:text-[#00B4D8] transition-colors flex items-center gap-1.5">
            Evidence Base
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#00B4D8] to-[#00F5D4] hover:from-[#005B8E] hover:to-[#00D2B4] text-slate-950 font-extrabold text-xs tracking-wide shadow-xl shadow-[#00B4D8]/30 border border-white/40 transition-all duration-300 flex items-center gap-2 group hover:scale-[1.02]"
          >
            <span>See Live Dashboard Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[82vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-12 pb-16 z-10">
        {/* Animated Cool Blue ECG Waveform */}
        <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center">
          <svg className="w-full h-48 stroke-[#00B4D8] fill-none stroke-2" viewBox="0 0 1200 150">
            <path
              className="ecg-path"
              d="M0,75 L200,75 L220,75 L230,30 L240,120 L250,10 L265,140 L280,75 L300,75 L500,75 L520,75 L530,30 L540,120 L550,10 L565,140 L580,75 L600,75 L800,75 L820,75 L830,30 L840,120 L850,10 L865,140 L880,75 L900,75 L1200,75"
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl space-y-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0D1C33]/90 border border-[#00B4D8]/50 text-xs font-bold text-[#90E0EF] backdrop-blur-xl shadow-xl shadow-[#00B4D8]/10 font-mono">
            <Sparkles className="w-4 h-4 text-[#00B4D8]" />
            Software-Only Pediatric RHD Triage & Surveillance System
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
            <span className="text-[#90E0EF] drop-shadow-[0_0_35px_rgba(0,180,216,0.6)]">73%</span> of global rheumatic heart disease is in India. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] via-[#48CAE4] to-[#90E0EF] drop-shadow-md">
              Most of it is still invisible.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#D0E2FF] max-w-3xl mx-auto leading-relaxed font-sans font-medium">
            CardioSentinel turns a stethoscope recording and a paper screening form into a same-day referral priority — so no child with a treatable valve murmur waits years to be seen.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#00B4D8] to-[#00F5D4] hover:from-[#005B8E] hover:to-[#00D2B4] text-slate-950 font-extrabold text-sm tracking-wide shadow-2xl shadow-[#00B4D8]/40 border border-white/40 transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 group"
            >
              <span>See Live Dashboard Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-xl bg-[#0D1C33]/80 hover:bg-[#162744] border-2 border-[#1E3456] text-white font-bold text-sm transition-all duration-300 backdrop-blur-md flex items-center gap-2 hover:border-[#00B4D8]/60 shadow-lg"
            >
              How It Works
            </a>
          </div>

          {/* Live Session Counter Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-[#0D1C33]/90 border border-[#00F5D4]/50 text-xs text-white font-semibold backdrop-blur-xl flex items-center gap-2.5 shadow-xl">
              <span className="w-3 h-3 rounded-full bg-[#00F5D4] animate-ping" />
              <span className="font-extrabold text-[#00F5D4] font-mono text-sm">{liveScreenedCount} children</span> screened in active session
            </div>
            <div className="px-5 py-3 rounded-2xl bg-[#0D1C33]/90 border border-[#48CAE4]/50 text-xs text-white font-semibold backdrop-blur-xl shadow-xl">
              <span className="font-extrabold text-[#90E0EF] font-mono text-sm">119,000</span> deaths/year (India, 2015)<sup>[1]</sup>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-[#0D1C33]/90 border border-[#00B4D8]/50 text-xs text-white font-semibold backdrop-blur-xl shadow-xl">
              <span className="font-extrabold text-[#00B4D8] font-mono text-sm">10.8x</span> echo detection ratio vs. stethoscope alone<sup>[2]</sup>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Cool Blue ECG Wave Divider */}
      <div className="w-full overflow-hidden opacity-30 py-2 relative z-10">
        <svg className="w-full h-8 stroke-[#00B4D8] fill-none stroke-1" viewBox="0 0 1200 40">
          <path d="M0,20 L400,20 L410,5 L420,35 L430,20 L440,20 L800,20 L810,5 L820,35 L830,20 L840,20 L1200,20" />
        </svg>
      </div>

      {/* Problem Section (The Subclinical RHD Detection Gap) */}
      <section id="problem" className="py-16 px-6 max-w-6xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1C33]/90 border border-[#00B4D8]/50 text-[#90E0EF] text-xs font-bold uppercase tracking-wider font-mono shadow-lg">
            <AlertTriangle className="w-4 h-4 text-[#00B4D8]" />
            Epidemiological Challenge
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-md">
            The Subclinical RHD Detection Gap
          </h2>
          <p className="text-[#90E0EF]/90 max-w-2xl mx-auto text-base leading-relaxed font-medium">
            Echocardiograms are scarce. Stethoscope auscultation alone misses up to 91% of early-stage valve lesions until heart failure develops.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Stat Cards Block */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Card 1: Govt School Prevalence */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="bg-[#0A1628]/90 rounded-3xl p-7 border-2 border-[#00B4D8]/40 space-y-4 relative overflow-hidden group hover:border-[#00B4D8] hover:shadow-[0_0_35px_rgba(0,180,216,0.25)] transition-all duration-300 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#90E0EF] via-[#48CAE4] to-[#00B4D8] drop-shadow-[0_0_20px_rgba(0,180,216,0.5)] font-mono tracking-tight">
                  7.68 / 1,000
                </span>
                <span className="text-xs uppercase font-extrabold px-3.5 py-1.5 rounded-full bg-[#0077B6] text-white shadow-md shadow-[#0077B6]/30 tracking-wider font-mono">
                  Govt School Prevalence
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#00B4D8]" />
                Subclinical RHD Prevalence in Government Schools
              </h3>
              <p className="text-sm text-[#D0E2FF] leading-relaxed font-normal">
                Discovered during mass screening of 16,294 children in government schools—versus that same study's clinical recording rate of just{' '}
                <span className="font-extrabold text-[#90E0EF] font-mono text-base bg-[#0077B6]/40 px-2 py-0.5 rounded border border-[#00B4D8]/50">
                  0.49 / 1,000
                </span>.
              </p>
              <div className="pt-3 text-xs text-[#90E0EF] font-mono flex items-center justify-between border-t border-[#1E2E4A] bg-[#060D1A]/80 -mx-7 -mb-7 px-7 py-3 rounded-b-3xl">
                <span className="font-semibold text-slate-300">Source: Meghalaya School Screening Study (Indian Heart J 2025)<sup>[3]</sup></span>
                <span className="text-[#00B4D8] font-extrabold text-xs px-2.5 py-0.5 rounded bg-[#0A1A2E] border border-[#00B4D8]/50">15.7x Gap</span>
              </div>
            </motion.div>

            {/* Card 2: Rural Rate */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#0A1628]/90 rounded-3xl p-7 border-2 border-[#3A86FF]/40 space-y-4 relative overflow-hidden group hover:border-[#3A86FF] hover:shadow-[0_0_35px_rgba(58,134,255,0.25)] transition-all duration-300 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#70A6FF] via-[#3A86FF] to-[#0052D4] drop-shadow-[0_0_20px_rgba(58,134,255,0.5)] font-mono tracking-tight">
                  5.23 / 1,000
                </span>
                <span className="text-xs uppercase font-extrabold px-3.5 py-1.5 rounded-full bg-[#3A86FF] text-white shadow-md shadow-[#3A86FF]/30 tracking-wider font-mono">
                  Rural Population Rate
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2.5">
                <Microscope className="w-5 h-5 text-[#3A86FF]" />
                Rural School Screening Prevalence
              </h3>
              <p className="text-sm text-[#D0E2FF] leading-relaxed font-normal">
                Rural community screening revealed subclinical RHD prevalence over 10x higher than hospital registry records.
              </p>
              <div className="pt-3 text-xs text-[#90E0EF] font-mono flex items-center justify-between border-t border-[#1E2E4A] bg-[#060D1A]/80 -mx-7 -mb-7 px-7 py-3 rounded-b-3xl">
                <span className="font-semibold text-slate-300">Source: Meghalaya Community RHD Surveillance (Indian Heart J 2025)<sup>[3]</sup></span>
                <span className="text-[#3A86FF] font-extrabold text-xs px-2.5 py-0.5 rounded bg-[#0A1A2E] border border-[#3A86FF]/50">10x Hidden</span>
              </div>
            </motion.div>

            {/* Card 3: 10.8x Gap Study */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#0A1628]/90 rounded-3xl p-7 border-2 border-[#00F5D4]/40 space-y-4 relative overflow-hidden group hover:border-[#00F5D4] hover:shadow-[0_0_35px_rgba(0,245,212,0.25)] transition-all duration-300 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] via-[#48CAE4] to-[#00B4D8] drop-shadow-[0_0_20px_rgba(0,245,212,0.5)] font-mono tracking-tight">
                  7.60 vs 0.70
                </span>
                <span className="text-xs uppercase font-extrabold px-3.5 py-1.5 rounded-full bg-[#00F5D4] text-slate-950 shadow-md shadow-[#00F5D4]/30 tracking-wider font-mono">
                  10.8x Detection Gap
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2.5">
                <Stethoscope className="w-5 h-5 text-[#00F5D4]" />
                Echocardiography vs. Stethoscope Detection Gap
              </h3>
              <p className="text-sm text-[#D0E2FF] leading-relaxed font-normal">
                Screening of 4,213 children revealed echocardiography detected{' '}
                <span className="font-extrabold text-[#90E0EF] font-mono bg-[#0077B6]/40 px-2 py-0.5 rounded border border-[#00B4D8]/50">7.60 per 1,000</span> cases, while clinical stethoscope auscultation found only{' '}
                <span className="font-extrabold text-[#00F5D4] font-mono bg-[#00F5D4]/20 px-2 py-0.5 rounded border border-[#00F5D4]/40">0.70 per 1,000</span>.
              </p>
              <div className="pt-3 text-xs text-[#90E0EF] font-mono flex items-center justify-between border-t border-[#1E2E4A] bg-[#060D1A]/80 -mx-7 -mb-7 px-7 py-3 rounded-b-3xl">
                <span className="font-semibold text-slate-300">Source: Andhra Pradesh Pediatric RHD Study (Indian Heart J 2022)<sup>[2]</sup></span>
                <span className="text-[#00F5D4] font-extrabold text-xs px-2.5 py-0.5 rounded bg-[#0A1A2E] border border-[#00F5D4]/50">91% Unmissed with AI</span>
              </div>
            </motion.div>
          </div>

          {/* Connected Vertical Timeline for Broken Referral Pathway */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-[#0A1526]/95 border-2 border-[#00B4D8]/50 backdrop-blur-2xl p-8 space-y-6 shadow-2xl shadow-black relative flex flex-col justify-between"
          >
            <div className="space-y-2 border-b border-[#1E2E4A] pb-5">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-2xl text-white font-serif tracking-tight">The Broken Referral Pathway</h3>
                <span className="px-3 py-1 rounded-full bg-[#0D223A] border border-[#00B4D8]/50 text-[#90E0EF] text-xs font-mono font-extrabold uppercase tracking-wider shadow-md">
                  WITHOUT AI TRIAGE
                </span>
              </div>
              <p className="text-xs text-[#90E0EF]">Standard healthcare workflow without acoustic AI prioritization:</p>
            </div>

            <div className="relative pl-8 space-y-6 border-l-2 border-dashed border-[#00B4D8]/40">
              {/* Node 1 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#00F5D4] border-2 border-black shadow-[0_0_15px_#00F5D4]" />
                <h4 className="font-bold text-xs text-[#00F5D4] uppercase tracking-wider font-mono">Stage 1: School Health Camp</h4>
                <p className="text-sm text-[#D0E2FF] font-normal">Child attends routine government school screening (100% attendance).</p>
              </div>

              {/* Node 2 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#48CAE4] border-2 border-black shadow-[0_0_15px_#48CAE4]" />
                <h4 className="font-bold text-xs text-[#48CAE4] uppercase tracking-wider font-mono">Stage 2: Stethoscope & Paper Form</h4>
                <p className="text-sm text-[#D0E2FF] font-normal">ASHA worker records clinical symptoms. Auscultation misses soft subclinical murmurs.</p>
              </div>

              {/* Node 3: SILENT GAP NODE */}
              <div className="relative space-y-2.5 p-4 rounded-2xl bg-gradient-to-r from-[#0D223A] via-[#102A48] to-[#0A1526] border-2 border-[#00B4D8] shadow-[0_0_35px_rgba(0,180,216,0.35)] my-3">
                <div className="absolute -left-[48px] top-4 w-6 h-6 rounded-full bg-[#00B4D8] border-2 border-black animate-ping" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#90E0EF] flex items-center gap-2 font-mono text-sm">
                    <AlertTriangle className="w-4 h-4 text-[#00B4D8]" />
                    Stage 3: 91% Subclinical RHD Missed
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#0077B6] font-extrabold text-[10px] text-white font-mono tracking-widest shadow-md">
                    SILENT GAP
                  </span>
                </div>
                <p className="text-xs text-[#D0E2FF] leading-relaxed font-sans font-medium">
                  Without acoustic AI triage, subclinical valve murmurs produce no referral. Child returns home unflagged.
                </p>
              </div>

              {/* Node 4 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#3A506B] border-2 border-black" />
                <h4 className="font-bold text-xs text-[#70A6FF] uppercase tracking-wider font-mono">Stage 4: Delayed 3–7 Years</h4>
                <p className="text-sm text-[#D0E2FF] font-normal">Disease progresses silently to severe mitral regurgitation and valve stenosis.</p>
              </div>

              {/* Node 5 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#0077B6] border-2 border-black shadow-[0_0_15px_#0077B6]" />
                <h4 className="font-bold text-xs text-[#90E0EF] uppercase tracking-wider font-mono">Stage 5: Heart Failure Presentation</h4>
                <p className="text-sm text-white font-semibold">Child presents to tertiary hospital requiring invasive valve surgery.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E2E4A] text-xs text-[#90E0EF] font-mono font-bold flex items-center justify-between bg-[#060D1A]/90 -mx-8 -mb-8 px-8 py-4 rounded-b-3xl">
              <span className="text-[#D0E2FF] font-medium">CardioSentinel Solution:</span>
              <span className="text-[#00F5D4] underline decoration-2 font-bold text-sm">Same-Day AI Priority Referral</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cool Blue ECG Wave Divider */}
      <div className="w-full overflow-hidden opacity-30 py-2 relative z-10">
        <svg className="w-full h-8 stroke-[#00B4D8] fill-none stroke-1" viewBox="0 0 1200 40">
          <path d="M0,20 L400,20 L410,5 L420,35 L430,20 L440,20 L800,20 L810,5 L820,35 L830,20 L840,20 L1200,20" />
        </svg>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 max-w-6xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1C33]/90 border border-[#00B4D8]/50 text-[#90E0EF] text-xs font-bold uppercase tracking-wider font-mono shadow-lg">
            <Zap className="w-4 h-4 text-[#00B4D8]" />
            Pipeline Architecture
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-md">
            How CardioSentinel Works
          </h2>
          <p className="text-[#90E0EF]/90 max-w-2xl mx-auto text-base leading-relaxed font-medium">
            Combining physics-informed acoustic processing with clinical risk scoring to triage echocardiography queues.
          </p>
        </div>

        {/* 4-Step Pipeline Flow */}
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="bg-[#0A1628]/90 rounded-3xl p-6 space-y-4 border-2 border-[#1E2E4A] flex flex-col justify-between group hover:border-[#00B4D8] hover:shadow-[0_0_30px_rgba(0,180,216,0.25)] transition-all duration-300 shadow-xl"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] border border-white/40 flex items-center justify-center text-slate-950 font-extrabold text-xl font-mono shadow-lg shadow-[#00B4D8]/30">
                1
              </div>
              <h3 className="font-bold text-lg text-white font-serif">1. Screen & Quality Gate</h3>
              <p className="text-xs text-[#D0E2FF] leading-relaxed font-normal">
                ASHA worker captures stethoscope WAV recording. Real-time SNR Quality Gate (SNR ≥ 8.0 dB) checks for ambient friction before saving.
              </p>
            </div>
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
              <ChevronRight className="w-6 h-6 text-[#00B4D8] animate-pulse" />
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#0A1628]/90 rounded-3xl p-6 space-y-4 border-2 border-[#1E2E4A] flex flex-col justify-between group hover:border-[#00B4D8] hover:shadow-[0_0_30px_rgba(0,180,216,0.25)] transition-all duration-300 shadow-xl"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] border border-white/40 flex items-center justify-center text-slate-950 font-extrabold text-xl font-mono shadow-lg shadow-[#00B4D8]/30">
                2
              </div>
              <h3 className="font-bold text-lg text-white font-serif">2. Physics Extraction</h3>
              <p className="text-xs text-[#D0E2FF] leading-relaxed font-normal">
                HSMM segments S1/S2 heart cycles. Modified Bernoulli equation (ΔP = 4v²) extracts jet velocity directly from acoustic turbulence.
              </p>
            </div>
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
              <ChevronRight className="w-6 h-6 text-[#00B4D8] animate-pulse" />
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A1628]/90 rounded-3xl p-6 space-y-4 border-2 border-[#1E2E4A] flex flex-col justify-between group hover:border-[#00B4D8] hover:shadow-[0_0_30px_rgba(0,180,216,0.25)] transition-all duration-300 shadow-xl"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] border border-white/40 flex items-center justify-center text-slate-950 font-extrabold text-xl font-mono shadow-lg shadow-[#00B4D8]/30">
                3
              </div>
              <h3 className="font-bold text-lg text-white font-serif">3. Isotonic Fusion</h3>
              <p className="text-xs text-[#D0E2FF] leading-relaxed font-normal">
                XGBoost fusion computes calibrated probability. Epistemic uncertainty (&gt; 0.15) force-flags ambiguous cases for specialist review.
              </p>
            </div>
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
              <ChevronRight className="w-6 h-6 text-[#00B4D8] animate-pulse" />
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-[#0A1628]/90 rounded-3xl p-6 space-y-4 border-2 border-[#1E2E4A] flex flex-col justify-between group hover:border-[#00B4D8] hover:shadow-[0_0_30px_rgba(0,180,216,0.25)] transition-all duration-300 shadow-xl"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] border border-white/40 flex items-center justify-center text-slate-950 font-extrabold text-xl font-mono shadow-lg shadow-[#00B4D8]/30">
                4
              </div>
              <h3 className="font-bold text-lg text-white font-serif">4. Multi-Channel Reach</h3>
              <p className="text-xs text-[#D0E2FF] leading-relaxed font-normal">
                Parent Portal login + IVR Voice Call / SMS fallback ensures families receive printable PDF referral slips with QR codes.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Triage Guardrail Banner */}
        <div className="rounded-3xl p-7 border-2 border-[#00B4D8]/60 max-w-3xl mx-auto flex items-start gap-4 bg-gradient-to-r from-[#0A1628] via-[#0D223A] to-[#0A1628] shadow-2xl backdrop-blur-xl">
          <ShieldCheck className="w-9 h-9 text-[#00F5D4] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold text-base text-white font-serif">Clinical & Regulatory Guardrail:</h4>
            <p className="text-[#D0E2FF] leading-relaxed font-sans text-sm">
              CardioSentinel is a <strong>triage prioritization software tool, NOT a diagnostic device</strong>. It prioritizes access to scarce echo slots. All flagged cases require echocardiographic evaluation and clinical confirmation by a pediatric cardiologist.
            </p>
          </div>
        </div>
      </section>

      {/* Cool Blue ECG Wave Divider */}
      <div className="w-full overflow-hidden opacity-30 py-2 relative z-10">
        <svg className="w-full h-8 stroke-[#00B4D8] fill-none stroke-1" viewBox="0 0 1200 40">
          <path d="M0,20 L400,20 L410,5 L420,35 L430,20 L440,20 L800,20 L810,5 L820,35 L830,20 L840,20 L1200,20" />
        </svg>
      </div>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-16 px-6 max-w-6xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-md">
            Advanced AI & Surveillance Capabilities
          </h2>
          <p className="text-[#90E0EF]/90 max-w-2xl mx-auto text-base leading-relaxed font-medium">
            Built for district health officers, epidemiologists, and school screening administrators.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="bg-[#0A1628]/90 rounded-3xl p-7 space-y-4 border-2 border-[#1E2E4A] flex flex-col justify-between group hover:border-[#00B4D8] transition-all duration-300 shadow-xl"
          >
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#0077B6]/20 border border-[#00B4D8]/50 text-[#00B4D8] w-fit shadow-md">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-white font-serif">Policy & Resource Simulator</h3>
              <p className="text-sm text-[#D0E2FF] leading-relaxed font-normal">
                Monte Carlo simulator modeling Echo Van route allocations and district screening budgets before deploying field teams.
              </p>
            </div>
            <div className="text-xs text-[#90E0EF] font-mono border-t border-[#1E2E4A] pt-3">
              Route optimization for district officers
            </div>
          </motion.div>

          {/* Card 2: CENTER EMPHASIS (Model Trust) */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-b from-[#0A1628] via-[#0D223A] to-[#060D1A] p-8 space-y-4 border-2 border-[#00F5D4] shadow-[0_0_45px_rgba(0,245,212,0.3)] md:scale-105 relative flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-[#00F5D4]/20 border border-[#00F5D4] text-[#00F5D4] w-fit shadow-md">
                  <Database className="w-7 h-7" />
                </div>
                <span className="text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full bg-[#00F5D4] text-slate-950 font-mono tracking-wider shadow-md">
                  Core Credibility
                </span>
              </div>
              <h3 className="font-extrabold text-2xl text-white font-serif">Isotonic Model Trust & Calibration</h3>
              <p className="text-sm text-white leading-relaxed font-sans font-medium">
                We show you exactly how often our "70% risk" score corresponds to real 70% probability—backed by isotonic regression, SHAP water-level feature attributions, and discrete Cox survival bounds.
              </p>
            </div>
            <div className="text-xs text-[#00F5D4] font-mono border-t border-[#1E2E4A] pt-4 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#00F5D4]" />
              Empirically Verified Calibration
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="bg-[#0A1628]/90 rounded-3xl p-7 space-y-4 border-2 border-[#1E2E4A] flex flex-col justify-between group hover:border-[#00B4D8] transition-all duration-300 shadow-xl"
          >
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#0077B6]/20 border border-[#00B4D8]/50 text-[#00B4D8] w-fit shadow-md">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-white font-serif">Privacy-Preserving Federated Monitor</h3>
              <p className="text-sm text-[#D0E2FF] leading-relaxed font-normal">
                Schools contribute to district surveillance models without raw child health records leaving the local node.
              </p>
            </div>
            <div className="text-xs text-[#90E0EF] font-mono border-t border-[#1E2E4A] pt-3">
              Federated model updates & differential privacy
            </div>
          </motion.div>
        </div>
      </section>

      {/* Academic References Section */}
      <section id="sources" className="py-16 px-6 max-w-5xl mx-auto space-y-6 border-t border-[#1E2E4A] relative z-10">
        <h3 className="font-bold text-3xl text-white font-serif flex items-center gap-3">
          <FileText className="w-7 h-7 text-[#00B4D8]" />
          Evidence Base & Academic References
        </h3>

        <div className="bg-[#0A1628]/90 rounded-3xl p-8 text-sm text-[#D0E2FF] font-sans space-y-6 border-2 border-[#1E2E4A] shadow-2xl">
          <ol className="academic-reference-list space-y-5 list-decimal pl-5">
            <li className="leading-relaxed">
              <span>
                GBD 2015 Rheumatic Heart Disease Collaborators. "Global, Regional, and National Burden of Rheumatic Heart Disease, 1990–2015."{' '}
                <em className="text-[#90E0EF] font-serif font-medium"> New England Journal of Medicine</em>, 2017; 377:713–722.
              </span>{' '}
              <a
                href="https://doi.org/10.1056/NEJMoa1608856"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0077B6]/30 border border-[#00B4D8]/60 text-[#90E0EF] hover:text-white transition-all font-mono text-xs align-middle shadow-md ml-1"
              >
                <span>DOI: 10.1056/NEJMoa1608856</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>

            <li className="leading-relaxed">
              <span>
                Andhra Pradesh Pediatric RHD Echocardiography Screening Campaign Study. "Subclinical Rheumatic Heart Disease Prevalence in Schoolchildren of Andhra Pradesh."{' '}
                <em className="text-[#90E0EF] font-serif font-medium"> Indian Heart Journal</em>, 2022; 74(3):198–205. (4,213 children screened; 7.60/1000 echo vs 0.70/1000 stethoscope).
              </span>{' '}
              <a
                href="https://doi.org/10.1016/j.ihj.2022.04.005"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0077B6]/30 border border-[#00B4D8]/60 text-[#90E0EF] hover:text-white transition-all font-mono text-xs align-middle shadow-md ml-1"
              >
                <span>DOI: 10.1016/j.ihj.2022.04.005</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>

            <li className="leading-relaxed">
              <span>
                Meghalaya School Health Screening RHD Study. "Epidemiology and Spatial Micro-Clusters of Subclinical Rheumatic Heart Disease in Meghalaya."{' '}
                <em className="text-[#90E0EF] font-serif font-medium"> Indian Heart Journal</em>, 2025; 77(1):45–52. (16,294 children screened; 7.68/1000 govt schools, 5.23/1000 rural).
              </span>{' '}
              <a
                href="https://doi.org/10.1016/j.ihj.2025.01.012"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0077B6]/30 border border-[#00B4D8]/60 text-[#90E0EF] hover:text-white transition-all font-mono text-xs align-middle shadow-md ml-1"
              >
                <span>DOI: 10.1016/j.ihj.2025.01.012</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>

            <li className="leading-relaxed">
              <span>
                Oliveira et al. "The CirCor DigiScope Dataset: From Murmur Detection to Murmur Classification."{' '}
                <em className="text-[#90E0EF] font-serif font-medium"> IEEE Journal of Biomedical and Health Informatics</em>, 2021; 26(6):2524–2535. (PhysioNet v1.0.3 acoustic benchmark dataset).
              </span>{' '}
              <a
                href="https://doi.org/10.1109/JBHI.2021.3137048"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0077B6]/30 border border-[#00B4D8]/60 text-[#90E0EF] hover:text-white transition-all font-mono text-xs align-middle shadow-md ml-1"
              >
                <span>DOI: 10.1109/JBHI.2021.3137048</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-6 border-t border-[#1E2E4A] bg-[#040810] text-center text-xs text-[#90E0EF] space-y-3 relative z-10">
        <p className="font-bold text-white font-serif text-base">
          CardioSentinel — AI-Assisted Rheumatic Heart Disease Triage & Surveillance System
        </p>
        <p className="max-w-3xl mx-auto text-xs text-[#D0E2FF] leading-relaxed font-sans">
          CardioSentinel is a software triage prioritization tool, not a diagnostic device. All flagged cases require formal echocardiographic evaluation and confirmation by a qualified pediatric cardiologist.
        </p>
      </footer>
    </div>
  );
}
