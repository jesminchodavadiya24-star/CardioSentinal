import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import { Link } from 'react-router-dom';
import { queueOfflineScreening, getPendingOfflineCount, flushOfflineQueue } from '../utils/offlineSync';
import {
  Plus,
  FileText,
  Upload,
  AlertTriangle,
  FileDown,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  Music,
  Mic,
  WifiOff,
  Sparkles,
  Info,
  Phone,
  UserCheck,
  ShieldCheck,
  Building2,
  Navigation,
  HeartPulse
} from 'lucide-react';
import { useLiveLocation } from '../context/LiveLocationContext';

import StudentSearchBar from '../components/StudentSearchBar';

export default function CampTriageView() {
  const { mode, locationInfo, localNarrative } = useLiveLocation();
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [cohortFilter, setCohortFilter] = useState('demo');
  const [searchTerm, setSearchTerm] = useState('');

  // Voice to form state
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceText, setVoiceText] = useState("bacche ko pichhle saal teen baar gale mein dard hua tha, family mein kisi ko rheumatic fever nahi hua");
  const [isVoiceConfirmed, setIsVoiceConfirmed] = useState(false);
  const [voiceExtracting, setVoiceExtracting] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  // Offline queue state
  const [pendingOffline, setPendingOffline] = useState(0);

  // Identity & Guardian Contact fields
  const [studentFullName, setStudentFullName] = useState('');
  const [guardianFullName, setGuardianFullName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('parent');
  const [createdGuardianPin, setCreatedGuardianPin] = useState(null);
  const [newlyCreatedChildId, setNewlyCreatedChildId] = useState(null);

  // New Child Form state
  const [age, setAge] = useState(10);
  const [sex, setSex] = useState('M');
  const [isRural, setIsRural] = useState(true);
  const [isGovt, setIsGovt] = useState(true);
  
  // Jones criteria form fields
  const [soreThroat, setSoreThroat] = useState(2);
  const [famHist, setFamHist] = useState(false);
  const [overcrowding, setOvercrowding] = useState(3);
  const [jointPain, setJointPain] = useState(false);
  const [chorea, setChorea] = useState(false);
  const [nodules, setNodules] = useState(false);
  const [socioeconomic, setSocioeconomic] = useState(3);
  const [audioFile, setAudioFile] = useState(null);

  const fetchTriageData = async () => {
    try {
      const res = await fetch(getApiUrl('/api/triage/children'));
      if (res.ok) {
        const data = await res.json();
        setChildrenList(data.children || []);
      }
    } catch (e) {
      console.error('Failed to fetch triage data:', e);
    } finally {
      setLoading(false);
      updateOfflineCount();
    }
  };

  const updateOfflineCount = async () => {
    const count = await getPendingOfflineCount();
    setPendingOffline(count);
  };

  const handleSyncOffline = async () => {
    setLoading(true);
    await flushOfflineQueue();
    await fetchTriageData();
  };

  const handleVoiceExtract = async () => {
    setVoiceExtracting(true);
    setVoiceError(null);
    try {
      const res = await fetch('http://localhost:8001/voice/extract-jones-criteria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript_text: voiceText })
      });
      if (res.ok) {
        const data = await res.json();
        const draft = data.draft_form || {};
        if (draft.prior_sore_throat_episodes_12mo !== undefined) setSoreThroat(draft.prior_sore_throat_episodes_12mo);
        if (draft.family_history_rheumatic_fever !== undefined) setFamHist(Boolean(draft.family_history_rheumatic_fever));
        if (draft.overcrowding_index !== undefined) setOvercrowding(draft.overcrowding_index);
        if (draft.prior_joint_pain_migratory !== undefined) setJointPain(Boolean(draft.prior_joint_pain_migratory));
      } else {
        setVoiceError("Failed to extract criteria from transcript. Please check the speech text or retry.");
      }
    } catch (e) {
      console.error('Failed to extract voice criteria:', e);
      setVoiceError("Could not connect to AI Voice Extraction Service. You can manually complete the form.");
    } finally {
      setVoiceExtracting(false);
    }
  };

  useEffect(() => {
    fetchTriageData();
  }, []);

  const handleAddChild = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('student_full_name', studentFullName || `Student ${Date.now().toString().slice(-4)}`);
    formData.append('guardian_full_name', guardianFullName || 'Guardian');
    formData.append('guardian_phone', guardianPhone || '9876543210');
    formData.append('guardian_relationship', guardianRelationship);

    formData.append('age', age);
    formData.append('sex', sex);
    formData.append('is_rural', isRural);
    formData.append('is_govt_school', isGovt);
    formData.append('prior_sore_throat_episodes_12mo', soreThroat);
    formData.append('family_history_rheumatic_fever', famHist);
    formData.append('overcrowding_index', overcrowding);
    formData.append('prior_joint_pain_migratory', jointPain);
    formData.append('prior_chorea_history', chorea);
    formData.append('prior_subcutaneous_nodules', nodules);
    formData.append('socioeconomic_score', socioeconomic);

    if (audioFile) {
      formData.append('audio_file', audioFile);
    }

    try {
      const res = await fetch(getApiUrl('/api/triage/add-child'), {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const resData = await res.json();
        setCohortFilter('all');
        setShowAddModal(false);
        if (resData.child_id) {
          setNewlyCreatedChildId(resData.child_id);
        }
        await fetchTriageData();
        if (resData.guardian_pin) {
          setCreatedGuardianPin({
            pin: resData.guardian_pin,
            name: studentFullName || resData.full_name || 'Child',
            code: resData.anonymized_code,
            phone: guardianPhone || resData.guardian_phone,
            child_id: resData.child_id
          });
        }
      } else {
        const res2 = await fetch(getApiUrl('/analyze'), {
          method: 'POST',
          body: formData
        });
        if (res2.ok) {
          const resData2 = await res2.json();
          setCohortFilter('all');
          setShowAddModal(false);
          if (resData2.child_id) {
            setNewlyCreatedChildId(resData2.child_id);
          }
          await fetchTriageData();
          if (resData2.guardian_pin) {
            setCreatedGuardianPin({
              pin: resData2.guardian_pin,
              name: studentFullName || 'Child',
              code: resData2.anonymized_code,
              phone: guardianPhone,
              child_id: resData2.child_id
            });
          }
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintSlip = (referralId) => {
    window.open(getApiUrl(`/api/referrals/${referralId}/slip.pdf`), '_blank');
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">Camp-Mode Batch Triage Queue</h1>
            <p className="text-xs text-[#8DA0B0]">
              Active Screening Camp: <span className="text-[#4EB8E0] font-semibold">Mawsynram Govt School (East Khasi Hills)</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pendingOffline > 0 && (
              <button
                onClick={handleSyncOffline}
                className="px-3 py-1.5 rounded-xl bg-[#DDA43C]/20 border border-[#DDA43C]/50 text-[#DDA43C] text-xs font-semibold flex items-center gap-2 animate-pulse"
                title="Sync offline records to server"
              >
                <WifiOff className="w-4 h-4 text-[#DDA43C]" />
                <span>{pendingOffline} Offline Pending Sync</span>
              </button>
            )}

            <button
              onClick={() => setShowVoiceModal(true)}
              className="glass-button text-sm border-[#DDA43C]/40 text-[#DDA43C] hover:text-white"
            >
              <Mic className="w-4 h-4 text-[#DDA43C]" />
              Voice-to-Form Entry
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="glass-button text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Child Screening
            </button>
          </div>
        </div>

        {/* Provisioned Guardian PIN Success Banner */}
        {createdGuardianPin && (
          <div className="p-4 rounded-xl bg-[#3FA88A]/20 border border-[#3FA88A]/50 text-[#E6EBF0] flex flex-wrap items-center justify-between gap-4 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#3FA88A] shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">
                  Guardian Access PIN Provisioned: <span className="text-[#3FA88A] font-mono text-base font-extrabold">{createdGuardianPin.pin}</span>
                </h4>
                <p className="text-xs text-[#8DA0B0]">
                  Provisioned for <strong className="text-white">{createdGuardianPin.name}</strong> ({createdGuardianPin.code}) linked to Phone: <span className="font-mono text-[#3FA88A]">{createdGuardianPin.phone}</span>. Communicated to family and printed on hospital referral slip.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/family/login"
                onClick={() => {
                  if (createdGuardianPin.phone) localStorage.setItem('auto_family_phone', createdGuardianPin.phone);
                  if (createdGuardianPin.pin) localStorage.setItem('auto_family_pin', createdGuardianPin.pin);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#3FA88A] text-black hover:bg-[#3FA88A]/90 text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
              >
                <span>Login as Parent ({createdGuardianPin.phone}) →</span>
              </Link>
              <button
                onClick={() => setCreatedGuardianPin(null)}
                className="px-3 py-1.5 rounded-lg bg-black/40 border border-[#3FA88A]/40 text-[#8DA0B0] hover:text-white text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}


        {/* Triage Queue Table */}
        <div className="glass-card overflow-hidden border-white/10">
          {/* Cohort Selection Toggle & Header Bar */}
          <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E6EBF0]">
                <Activity className="w-4 h-4 text-[#4EB8E0]" />
                <span>Prioritized Referral List</span>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  type="button"
                  onClick={() => setCohortFilter('demo')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    cohortFilter === 'demo'
                      ? 'bg-[#2C7FB8] border border-[#4EB8E0]/60 text-white shadow-md font-bold'
                      : 'text-[#8DA0B0] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#DDA43C]" />
                  Demo Cohort (20 Curated)
                </button>
                <button
                  type="button"
                  onClick={() => setCohortFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    cohortFilter === 'all'
                      ? 'bg-[#2C7FB8] border border-[#4EB8E0]/60 text-white shadow-md font-bold'
                      : 'text-[#8DA0B0] hover:text-white'
                  }`}
                >
                  Full Queue (All Records)
                </button>
              </div>
            </div>

            {(() => {
              const demoSet = childrenList.filter((c) => Boolean(c.is_demo_cohort) || (c.anonymized_code && c.anonymized_code.startsWith('CS-MEG-01')));
              const activeList = cohortFilter === 'demo' ? (demoSet.length > 0 ? demoSet : childrenList.slice(0, 20)) : childrenList;
              return (
                <span className="text-xs px-3 py-1 rounded-full bg-[#1A4A66]/60 border border-[#4EB8E0]/40 text-[#4EB8E0] font-mono font-bold">
                  Total Screened: {activeList.length}
                </span>
              );
            })()}
          </div>

          {/* Student Search Bar (Addendum 50) */}
          <div className="pt-2">
            <StudentSearchBar
              searchTerm={searchTerm}
              onSearchChange={(val) => {
                setSearchTerm(val);
                if (val && cohortFilter !== 'all') {
                  setCohortFilter('all');
                }
              }}
              placeholder="Search by student name or child code (e.g. Mary, CS-MEG-0039)..."
              totalCount={childrenList.length}
              filteredCount={(() => {
                if (!searchTerm.trim()) {
                  const demoSet = childrenList.filter((c) => Boolean(c.is_demo_cohort) || (c.anonymized_code && c.anonymized_code.startsWith('CS-MEG-01')));
                  return (cohortFilter === 'demo' ? (demoSet.length > 0 ? demoSet : childrenList.slice(0, 20)) : childrenList).length;
                }
                const term = searchTerm.toLowerCase().trim();
                return childrenList.filter(c =>
                  (c.full_name && c.full_name.toLowerCase().includes(term)) ||
                  (c.anonymized_code && c.anonymized_code.toLowerCase().includes(term))
                ).length;
              })()}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E6EBF0]">
              <thead className="bg-black/50 text-[#8DA0B0] font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
                <tr>
                  <th className="p-3.5">Student / Child ID</th>
                  <th className="p-3.5">Age / Sex</th>
                  <th className="p-3.5">School / Location</th>
                  <th className="p-3.5">Jones Risk Factors</th>
                  <th className="p-3.5">Jet Velocity (ΔP)</th>
                  <th className="p-3.5">XGB Score</th>
                  <th className="p-3.5">Calibrated Risk</th>
                  <th className="p-3.5">Triage Tier</th>
                  <th className="p-3.5">Next Screening Due</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(() => {
                  const demoSet = childrenList.filter((c) => Boolean(c.is_demo_cohort) || (c.anonymized_code && c.anonymized_code.startsWith('CS-MEG-01')));
                  let activeList = cohortFilter === 'demo' ? (demoSet.length > 0 ? demoSet : childrenList.slice(0, 20)) : [...childrenList];

                  if (searchTerm.trim()) {
                    const term = searchTerm.toLowerCase().trim();
                    activeList = childrenList.filter(c =>
                      (c.full_name && c.full_name.toLowerCase().includes(term)) ||
                      (c.anonymized_code && c.anonymized_code.toLowerCase().includes(term))
                    );
                  }

                  if (newlyCreatedChildId) {
                    const matchIdx = activeList.findIndex(c => c.id === newlyCreatedChildId || c.anonymized_code === newlyCreatedChildId);
                    if (matchIdx > -1) {
                      const [foundItem] = activeList.splice(matchIdx, 1);
                      activeList = [foundItem, ...activeList];
                    }
                  }
                  return activeList;
                })().map((child) => {
                  const isNewlyAdded = child.id === newlyCreatedChildId || child.anonymized_code === newlyCreatedChildId;
                  const isUncertain = child.risk_tier === 'priority_uncertain';
                  const hasAudio = Boolean(child.audio_upload_id || child.estimated_jet_velocity_ms);
                  const hasForm = Boolean(child.prior_sore_throat_episodes_12mo != null);
                  const hasPhone = Boolean(child.guardian_link_phone || child.guardian_phone);

                  const displaySchool = child.school_name || (child.is_govt_school ? 'Mawsynram Govt School' : 'Private School');
                  const displayLocation = child.district_name || (child.is_rural ? 'East Khasi Hills (Rural)' : 'Urban Zone');

                  return (
                    <tr
                      key={child.id}
                      className={`hover:bg-white/5 transition-colors ${
                        isNewlyAdded
                          ? 'bg-[#3FA88A]/20 border-2 border-[#3FA88A] font-bold shadow-lg'
                          : isUncertain ? 'bg-[#DDA43C]/5 font-semibold' : ''
                      }`}
                    >
                      {/* Child ID & Student Name + High-Contrast Anonymized Code */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white block text-sm">
                              {child.full_name ? child.full_name : child.anonymized_code}
                            </span>
                            {isNewlyAdded && (
                              <span className="px-2 py-0.5 rounded bg-[#3FA88A] text-black font-extrabold text-[10px] uppercase font-mono shadow animate-pulse">
                                ⚡ LIVE REAL-TIME
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#4EB8E0]">
                            <span>{child.anonymized_code}</span>
                            {/* Data Completeness Icons */}
                            <div className="flex items-center gap-1 ml-1" title="Data completeness: Audio, Form, Guardian Phone">
                              {hasAudio ? (
                                <Mic className="w-3.5 h-3.5 text-[#3FA88A]" title="Audio Uploaded" />
                              ) : (
                                <Mic className="w-3.5 h-3.5 text-slate-600 opacity-40" title="No Audio Uploaded" />
                              )}
                              {hasForm ? (
                                <FileText className="w-3.5 h-3.5 text-[#3FA88A]" title="Risk Form Complete" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-slate-600 opacity-40" title="Risk Form Incomplete" />
                              )}
                              {hasPhone ? (
                                <Phone className="w-3.5 h-3.5 text-[#3FA88A]" title="Guardian Contact Linked" />
                              ) : (
                                <Phone className="w-3.5 h-3.5 text-slate-600 opacity-40" title="No Guardian Contact" />
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-medium">
                        {child.age} yrs ({child.sex})
                      </td>

                      {/* School / Location */}
                      <td className="p-3.5">
                        <span className="block text-white font-medium">
                          {displaySchool}
                        </span>
                        <span className="text-[11px] text-[#8DA0B0]">
                          {displayLocation}
                        </span>
                      </td>

                      {/* Jones Risk Factor Tags */}
                      <td className="p-3.5 max-w-xs">
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          {child.prior_sore_throat_episodes_12mo >= 3 ? (
                            <span className="px-1.5 py-0.5 rounded bg-[#E85D4A]/20 border border-[#E85D4A]/50 text-[#E85D4A] font-bold">
                              {child.prior_sore_throat_episodes_12mo}x Throat
                            </span>
                          ) : null}

                          {Boolean(child.family_history_rheumatic_fever) ? (
                            <span className="px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 font-bold">
                              Fam Hist
                            </span>
                          ) : null}

                          {Boolean(child.prior_joint_pain_migratory) ? (
                            <span className="px-1.5 py-0.5 rounded bg-[#DDA43C] text-[#14181D] font-bold">
                              Joint Pain
                            </span>
                          ) : null}

                          {Boolean(child.prior_chorea_history) ? (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-bold">
                              Chorea
                            </span>
                          ) : null}

                          {Boolean(child.prior_subcutaneous_nodules) ? (
                            <span className="px-1.5 py-0.5 rounded bg-pink-950/60 border border-pink-500/40 text-pink-300 font-bold">
                              Nodules
                            </span>
                          ) : null}

                          {child.overcrowding_index >= 3 ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-[#DDA43C] font-semibold">
                              Overcrowded ({child.overcrowding_index}/5)
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Jet Velocity */}
                      <td className="p-3.5">
                        {child.estimated_jet_velocity_ms ? (
                          <span className="font-mono text-[#4EB8E0] font-bold">
                            {child.estimated_jet_velocity_ms} m/s ({child.estimated_pressure_gradient_mmhg || (4.0 * (child.estimated_jet_velocity_ms**2)).toFixed(1)} mmHg)
                          </span>
                        ) : (
                          <span className="text-[#8DA0B0] text-[10px] italic">No Audio</span>
                        )}
                      </td>

                      <td className="p-3.5 font-mono text-[#E6EBF0] font-semibold">
                        {child.xgboost_raw_score != null ? child.xgboost_raw_score.toFixed(2) : '--'}
                      </td>

                      {/* Calibrated Risk */}
                      <td className="p-3.5 font-mono font-bold text-white">
                        <div className="flex items-center gap-1">
                          <span>
                            {child.calibrated_probability != null
                              ? `${(child.calibrated_probability * 100).toFixed(0)}%`
                              : '--'}
                          </span>
                          <div
                            className="group relative cursor-help text-[#4EB8E0] hover:text-white"
                            title={`Formula Chain:\nRaw XGBoost Score: ${child.xgboost_raw_score?.toFixed(2) || '--'}\nIsotonic Calibrated Probability: ${(child.calibrated_probability * 100).toFixed(1)}%\nEpistemic Uncertainty: ${child.epistemic_uncertainty?.toFixed(3) || '0.040'}\nTier: ${child.risk_tier || 'N/A'}`}
                          >
                            <Info className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
                          </div>
                        </div>
                      </td>

                      {/* Triage Tier Badges (Addendum 49 Solid Fill Dark Text Rule) */}
                      <td className="p-3.5">
                        {isUncertain ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DDA43C] text-[#14181D] text-[11px] font-extrabold cursor-help shadow-sm"
                            title={`Epistemic Uncertainty Override: Ranked above higher raw-score cases because model confidence is low. High uncertainty = ambiguous signal requiring clinical review.`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-[#14181D]" />
                            Priority Uncertain
                          </span>
                        ) : child.risk_tier === 'high' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E85D4A] text-white text-[11px] font-extrabold">
                            High Priority
                          </span>
                        ) : child.risk_tier === 'moderate' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DDA43C]/20 border border-[#DDA43C]/40 text-[#DDA43C] text-[11px] font-bold">
                            Moderate
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3FA88A]/20 border border-[#3FA88A]/40 text-[#3FA88A] text-[11px] font-bold">
                            Low
                          </span>
                        )}
                      </td>

                      {/* Next Screening Due Column */}
                      <td className="p-3.5 font-mono text-[#E6EBF0] font-medium" title={child.screening_interval_rationale || 'Adaptive screening interval calculated.'}>
                        {child.recommended_next_screening_date || '2026-08-28'}
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        <Link
                          to={`/app/waveform/${child.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#132030] border border-white/10 hover:border-[#4EB8E0]/40 text-[#E6EBF0] hover:text-white inline-flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#4EB8E0]" />
                          View Waveform
                        </Link>
                        <button
                          onClick={() => handlePrintSlip(child.referral_id || child.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#1A4A66]/60 border border-[#4EB8E0]/40 text-[#4EB8E0] hover:bg-[#2C7FB8] hover:text-white inline-flex items-center gap-1 transition-all font-semibold"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          PDF Slip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Add Child & Jones Criteria Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-card-primary p-6 space-y-6 border-[#4EB8E0]/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-xl font-bold text-white font-serif">
                Add New Child Screening Record
              </h2>
              <span className="text-xs text-[#4EB8E0] font-mono">Auto-Provisions Guardian Family Portal</span>
            </div>

            <form onSubmit={handleAddChild} className="space-y-4 text-xs">
              {/* Identity & Guardian Contact Fields */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <h4 className="font-bold text-[#4EB8E0] text-xs uppercase tracking-wider">Child & Guardian Contact Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#E6EBF0] font-semibold mb-1">Student Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Syiem"
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      className="w-full glass-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#E6EBF0] font-semibold mb-1">Guardian Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mary Syiem"
                      value={guardianFullName}
                      onChange={(e) => setGuardianFullName(e.target.value)}
                      className="w-full glass-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#E6EBF0] font-semibold mb-1">Guardian Phone Number (10-Digit)</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full glass-input font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#E6EBF0] font-semibold mb-1">Relationship to Child</label>
                    <select
                      value={guardianRelationship}
                      onChange={(e) => setGuardianRelationship(e.target.value)}
                      className="w-full glass-input"
                    >
                      <option value="parent" className="bg-[#0A0E13]">Parent (Mother/Father)</option>
                      <option value="guardian" className="bg-[#0A0E13]">Legal Guardian</option>
                      <option value="grandparent" className="bg-[#0A0E13]">Grandparent</option>
                      <option value="other" className="bg-[#0A0E13]">Other Relative</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E6EBF0] font-semibold mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full glass-input"
                    min="5"
                    max="18"
                  />
                </div>
                <div>
                  <label className="block text-[#E6EBF0] font-semibold mb-1">Sex</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full glass-input"
                  >
                    <option value="M" className="bg-[#0A0E13]">Male</option>
                    <option value="F" className="bg-[#0A0E13]">Female</option>
                  </select>
                </div>
              </div>

              {/* Jones Criteria inputs */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-[#4EB8E0]">Jones Criteria & Clinical Risk Factors:</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#E6EBF0] mb-1">Sore Throat Episodes (12 Mo)</label>
                    <input
                      type="number"
                      value={soreThroat}
                      onChange={(e) => setSoreThroat(parseInt(e.target.value))}
                      className="w-full glass-input"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-[#E6EBF0] mb-1">Overcrowding Index (1-5)</label>
                    <input
                      type="number"
                      value={overcrowding}
                      onChange={(e) => setOvercrowding(parseInt(e.target.value))}
                      className="w-full glass-input"
                      min="1"
                      max="5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={famHist}
                      onChange={(e) => setFamHist(e.target.checked)}
                      className="w-4 h-4 rounded border-[#4EB8E0]/40 bg-black/60 text-[#2C7FB8]"
                    />
                    <span className="text-[#E6EBF0]">Family History of Rheumatic Fever</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jointPain}
                      onChange={(e) => setJointPain(e.target.checked)}
                      className="w-4 h-4 rounded border-[#4EB8E0]/40 bg-black/60 text-[#2C7FB8]"
                    />
                    <span className="text-[#E6EBF0]">Migratory Joint Pain</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chorea}
                      onChange={(e) => setChorea(e.target.checked)}
                      className="w-4 h-4 rounded border-[#4EB8E0]/40 bg-black/60 text-[#2C7FB8]"
                    />
                    <span className="text-[#E6EBF0]">Sydenham Chorea History</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nodules}
                      onChange={(e) => setNodules(e.target.checked)}
                      className="w-4 h-4 rounded border-[#4EB8E0]/40 bg-black/60 text-[#2C7FB8]"
                    />
                    <span className="text-[#E6EBF0]">Subcutaneous Nodules</span>
                  </label>
                </div>
              </div>

              {/* Stethoscope Audio File Dropzone */}
              <div className="space-y-1 pt-3">
                <label className="block text-[#E6EBF0] font-semibold">Stethoscope Audio Recording (.wav)</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files[0])}
                  className="w-full text-xs text-[#E6EBF0] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1A4A66] file:text-[#4EB8E0] hover:file:bg-[#2C7FB8] hover:file:text-white transition-all cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="glass-button-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="glass-button text-xs">
                  Submit & Run Fusion AI Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voice-to-Form Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-card p-6 space-y-6 border-[#DDA43C]/40 relative animate-in fade-in">
            <div className="flex items-center gap-3 border-b border-[#DDA43C]/20 pb-3">
              <div className="p-2.5 rounded-xl bg-[#DDA43C]/20 border border-[#DDA43C]/40 text-[#DDA43C]">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-serif">Voice-to-Form Structured Speech Entry</h2>
                <p className="text-xs text-[#8DA0B0]">Speak naturally in Hindi or regional language to fill Jones criteria</p>
              </div>
            </div>

            {voiceError && (
              <div className="p-3 rounded-xl bg-[#E85D4A]/20 border border-[#E85D4A]/50 text-xs text-[#E85D4A] flex items-center justify-between">
                <span>{voiceError}</span>
                <button onClick={handleVoiceExtract} className="underline text-white font-semibold">Retry</button>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#DDA43C] block">ASHA Worker Speech Transcript</label>
                <textarea
                  rows={3}
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  className="w-full glass-input text-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleVoiceExtract}
                disabled={voiceExtracting}
                className="w-full py-2 rounded-xl bg-[#DDA43C]/20 border border-[#DDA43C]/50 text-[#DDA43C] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#DDA43C]/30 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#DDA43C]" />
                {voiceExtracting ? 'Extracting Structured Fields...' : 'Extract Jones Criteria Form Fields'}
              </button>

              {/* Draft Extracted Fields Preview */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-[#DDA43C] block uppercase tracking-wider text-[10px]">AI Draft Extracted Fields (Requires Human Confirmation)</span>
                <div className="grid grid-cols-2 gap-2 text-[#8DA0B0]">
                  <div>Sore Throat (12mo): <strong className="text-white">{soreThroat} episodes</strong></div>
                  <div>Family History RHD: <strong className="text-white">{famHist ? 'Yes' : 'No'}</strong></div>
                  <div>Overcrowding Index: <strong className="text-white">{overcrowding}/5</strong></div>
                  <div>Migratory Joint Pain: <strong className="text-white">{jointPain ? 'Yes' : 'No'}</strong></div>
                </div>
              </div>

              {/* MANDATORY Safety Confirm Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-[#DDA43C]/10 border border-[#DDA43C]/30">
                <input
                  type="checkbox"
                  checked={isVoiceConfirmed}
                  onChange={(e) => setIsVoiceConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#DDA43C]/40 bg-black text-[#DDA43C] focus:ring-[#DDA43C]"
                />
                <span className="text-xs text-[#DDA43C] font-semibold">
                  I have reviewed and confirmed all AI-extracted clinical form fields above for accuracy.
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowVoiceModal(false)}
                  className="glass-button-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isVoiceConfirmed}
                  onClick={() => {
                    setShowVoiceModal(false);
                    setShowAddModal(true);
                  }}
                  className={`py-2 px-5 rounded-xl font-semibold text-xs transition-all ${
                    isVoiceConfirmed
                      ? 'glass-button text-white cursor-pointer hover:scale-105'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  Save Confirmed Draft & Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
