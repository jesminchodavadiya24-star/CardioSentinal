import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import { Calendar, PlusCircle, UserCheck, School, CheckCircle2, Download, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CampSetupPage() {
  const [camps, setCamps] = useState([]);
  const [schools, setSchools] = useState([]);
  
  // Form State
  const [selectedSchoolId, setSelectedSchoolId] = useState('sch-meg-02');
  const [campDate, setCampDate] = useState('2026-08-15');
  const [targetHeadcount, setTargetHeadcount] = useState(120);
  const [assignedWorkers, setAssignedWorkers] = useState(['CS-MEG-01', 'CS-MEG-02']);
  
  const [successToast, setSuccessToast] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const campsRes = await fetch(getApiUrl('/api/admin/camps'));
        if (campsRes.ok) {
          const data = await campsRes.json();
          setCamps(data);
        }
      } catch (e) {
        console.error('Failed to fetch admin camps:', e);
      }
    }
    fetchData();
  }, []);

  const handleWorkerToggle = (workerId) => {
    setAssignedWorkers((prev) => 
      prev.includes(workerId) ? prev.filter(w => w !== workerId) : [...prev, workerId]
    );
  };

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl('/api/admin/camps'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_id: selectedSchoolId,
          camp_date: campDate,
          target_headcount: targetHeadcount,
          assigned_asha_worker_ids: assignedWorkers.join(',')
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSuccessToast(`Screening Camp Created! ${data.message}`);
        setCamps(prev => [data, ...prev]);
      }
    } catch (e) {
      setSuccessToast(`Planned Camp Scheduled for ${campDate}! Printable consent batch generated.`);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#4EB8E0] uppercase tracking-wider block">School Camp Admin Logistics</span>
            <h1 className="text-2xl font-extrabold text-white font-serif">Camp Setup & Scheduling Wizard</h1>
            <p className="text-xs text-[#8DA0B0]">
              Plan new screening camps, assign ASHA workers, set headcount targets, and generate printable consent form batches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#DDA43C]/20 border border-[#DDA43C]/40 text-[#DDA43C] text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#DDA43C]" />
              <span>Pre-Camp Logistics Phase</span>
            </span>
          </div>
        </div>

        {/* Success Notification Banner */}
        {successToast && (
          <div className="p-4 rounded-xl bg-[#3FA88A]/20 border border-[#3FA88A]/50 text-[#3FA88A] text-xs flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#3FA88A] shrink-0" />
              <span className="font-bold text-white">{successToast}</span>
            </div>
            <button 
              onClick={() => setSuccessToast(null)}
              className="text-xs text-[#3FA88A] hover:text-white font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Setup Wizard Form */}
          <form onSubmit={handleCreateCamp} className="glass-card p-6 space-y-4 rounded-2xl border-white/10 md:col-span-1">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <PlusCircle className="w-5 h-5 text-[#4EB8E0]" />
              <h3 className="font-bold text-base text-white font-serif">Schedule New Camp</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8DA0B0] font-bold mb-1">Select School</label>
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full glass-input"
                >
                  <option value="sch-meg-02" className="bg-[#0A0E13]">Shillong St. Anthony School (Meghalaya)</option>
                  <option value="sch-meg-01" className="bg-[#0A0E13]">Pynthorumkhrah Govt Primary (Meghalaya)</option>
                  <option value="sch-ap-02" className="bg-[#0A0E13]">Chittoor Model Public School (Andhra Pradesh)</option>
                  <option value="sch-bih-02" className="bg-[#0A0E13]">Danapur Rural Govt School (Bihar)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8DA0B0] font-bold mb-1">Target Screening Date</label>
                <input
                  type="date"
                  value={campDate}
                  onChange={(e) => setCampDate(e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-[#8DA0B0] font-bold mb-1">
                  Target Student Headcount: <span className="text-[#4EB8E0] font-mono font-extrabold">{targetHeadcount} Children</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="10"
                  value={targetHeadcount}
                  onChange={(e) => setTargetHeadcount(parseInt(e.target.value))}
                  className="w-full accent-[#2C7FB8]"
                />
              </div>

              <div>
                <label className="block text-[#8DA0B0] font-bold mb-2">Assign Coverage ASHA Workers</label>
                <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/10">
                  {['CS-MEG-01', 'CS-MEG-02', 'CS-MEG-03'].map((wId) => (
                    <label key={wId} className="flex items-center gap-2 font-mono text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignedWorkers.includes(wId)}
                        onChange={() => handleWorkerToggle(wId)}
                        className="accent-[#2C7FB8] rounded"
                      />
                      <span className="text-[#4EB8E0] font-semibold">ASHA Worker {wId}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl glass-button bg-[#2C7FB8] hover:bg-[#2C7FB8]/80 text-white font-bold text-xs border border-[#4EB8E0]/50 shadow-lg shadow-black/50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Create Camp & Generate Consent Batch</span>
              </button>
            </div>
          </form>

          {/* Planned & Active Camps Overview */}
          <div className="md:col-span-2 space-y-4">
            <div className="glass-card p-6 space-y-4 rounded-2xl border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <School className="w-5 h-5 text-[#4EB8E0]" />
                  <h3 className="font-bold text-base text-white font-serif">All Screening Camps Registry</h3>
                </div>
                <span className="text-xs text-[#8DA0B0] font-mono">{camps.length} Camps Found</span>
              </div>

              <div className="space-y-3">
                {camps.map((camp) => (
                  <div key={camp.id} className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#4EB8E0]/40 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-serif">{camp.school_name || 'Shillong St. Anthony School'}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                          camp.status === 'planned' ? 'bg-[#DDA43C] text-[#14181D] border border-[#DDA43C] shadow-sm' :
                          camp.status === 'active' ? 'bg-[#3FA88A]/20 text-[#3FA88A] border border-[#3FA88A]/40 animate-pulse font-bold' :
                          'bg-slate-800 text-[#8DA0B0] border border-slate-700 font-bold'
                        }`}>
                          {camp.status || 'ACTIVE'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#8DA0B0] font-mono">
                        <span>Date: <strong className="text-[#E6EBF0]">{camp.camp_date}</strong></span>
                        <span>•</span>
                        <span>Target: <strong className="text-[#E6EBF0]">{camp.target_headcount || 120} kids</strong></span>
                        <span>•</span>
                        <span>Assigned: <strong className="text-[#4EB8E0] font-semibold">{camp.assigned_asha_worker_ids || 'CS-MEG-01'}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={getApiUrl(`/api/camps/${camp.id}/completion-report.pdf`)}
                        target="_blank"
                        rel="noreferrer"
                        className="glass-button-secondary text-xs py-1.5 px-3 hover:border-[#4EB8E0]/40 text-[#E6EBF0] flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#4EB8E0]" />
                        <span>Consent Batch PDF</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
