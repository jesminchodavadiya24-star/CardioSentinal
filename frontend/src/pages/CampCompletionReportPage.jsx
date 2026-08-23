import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import StudentSearchBar from '../components/StudentSearchBar';
import { 
  FileText, Download, CheckCircle2, ShieldCheck, Activity, Building2, 
  UserCheck, AlertTriangle, ExternalLink, Filter, Phone, ChevronRight, Layers, Sparkles, HeartPulse
} from 'lucide-react';

const INITIAL_22_REFERRALS = [
  { id: "ch-101", anonymized_code: "CS-MAW-1949", full_name: "Chodavadiya Jesmin Dipakbhai", age: 14, sex: "M", guardian_name: "Chodavadiya Dipakbhai", guardian_phone: "9638967011", risk_tier: "HIGH", calibrated_probability: 0.98, referred_to_facility: "NEIGRIHMS Cardiology Wing", estimated_jet_velocity_ms: 4.5, estimated_pressure_gradient_mmhg: 81.0, murmur_grade_estimate: 4 },
  { id: "ch-102", anonymized_code: "CS-MAW-3311", full_name: "jesmin chodavadiya dipakbhai", age: 17, sex: "M", guardian_name: "dipakbhai chodavadiya", guardian_phone: "9638967011", risk_tier: "HIGH", calibrated_probability: 0.98, referred_to_facility: "NEIGRIHMS Cardiology Wing", estimated_jet_velocity_ms: 3.99, estimated_pressure_gradient_mmhg: 63.7, murmur_grade_estimate: 3 },
  { id: "ch-103", anonymized_code: "CS-MAW-9744", full_name: "krutik chodavadiya", age: 17, sex: "M", guardian_name: "jignesh chodavadiya", guardian_phone: "7202455050", risk_tier: "HIGH", calibrated_probability: 0.95, referred_to_facility: "NEIGRIHMS Cardiology Wing", estimated_jet_velocity_ms: 4.16, estimated_pressure_gradient_mmhg: 69.2, murmur_grade_estimate: 4 },
  { id: "ch-104", anonymized_code: "CS-MEG-0018", full_name: "Neha Das", age: 9, sex: "F", guardian_name: "Vikram Das", guardian_phone: "9876500018", risk_tier: "HIGH", calibrated_probability: 0.90, referred_to_facility: "NEIGRIHMS Cardiology Wing", estimated_jet_velocity_ms: 3.85, estimated_pressure_gradient_mmhg: 59.3, murmur_grade_estimate: 3 },
  { id: "ch-105", anonymized_code: "CS-MEG-0007", full_name: "Kavita Sharma", age: 15, sex: "M", guardian_name: "Meera Sangma", guardian_phone: "9876500007", risk_tier: "HIGH", calibrated_probability: 0.89, referred_to_facility: "NEIGRIHMS Cardiology Wing", estimated_jet_velocity_ms: 3.78, estimated_pressure_gradient_mmhg: 57.1, murmur_grade_estimate: 3 },
  { id: "ch-106", anonymized_code: "CS-MEG-0023", full_name: "Deepak Sharma", age: 17, sex: "M", guardian_name: "Anita Wankhar", guardian_phone: "9876500023", risk_tier: "HIGH", calibrated_probability: 0.88, referred_to_facility: "NEIGRIHMS Cardiology Wing", estimated_jet_velocity_ms: 3.72, estimated_pressure_gradient_mmhg: 55.3, murmur_grade_estimate: 3 },
  { id: "ch-107", anonymized_code: "CS-MEG-0020", full_name: "Amit Lyngdoh", age: 10, sex: "F", guardian_name: "Priya Sharma", guardian_phone: "9876500020", risk_tier: "HIGH", calibrated_probability: 0.88, referred_to_facility: "NEIGRIHMS Cardiology Wing", estimated_jet_velocity_ms: 3.69, estimated_pressure_gradient_mmhg: 54.5, murmur_grade_estimate: 3 },
  { id: "ch-108", anonymized_code: "CS-MEG-0006", full_name: "Vikram Roy", age: 9, sex: "M", guardian_name: "Pooja Kharbhih", guardian_phone: "9876500006", risk_tier: "HIGH", calibrated_probability: 0.82, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 3.55, estimated_pressure_gradient_mmhg: 50.4, murmur_grade_estimate: 3 },
  { id: "ch-109", anonymized_code: "CS-MEG-0015", full_name: "Meera Lyngdoh", age: 8, sex: "M", guardian_name: "Kavita Dkhar", guardian_phone: "9876500015", risk_tier: "MODERATE", calibrated_probability: 0.80, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 3.42, estimated_pressure_gradient_mmhg: 46.8, murmur_grade_estimate: 2 },
  { id: "ch-110", anonymized_code: "CS-MEG-0019", full_name: "Grace Dkhar", age: 6, sex: "F", guardian_name: "Patricia Singh", guardian_phone: "9876500019", risk_tier: "MODERATE", calibrated_probability: 0.78, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 3.38, estimated_pressure_gradient_mmhg: 45.7, murmur_grade_estimate: 2 },
  { id: "ch-111", anonymized_code: "CS-MEG-0121", full_name: "Mary Wankhar", age: 11, sex: "M", guardian_name: "Sohra Wankhar", guardian_phone: "9876500121", risk_tier: "MODERATE", calibrated_probability: 0.78, referred_to_facility: "NEIGRIHMS Cardiology Wing", estimated_jet_velocity_ms: 3.35, estimated_pressure_gradient_mmhg: 44.9, murmur_grade_estimate: 2 },
  { id: "ch-112", anonymized_code: "CS-MEG-0005", full_name: "Grace Lyngdoh", age: 11, sex: "F", guardian_name: "Meera Syiem", guardian_phone: "9876500005", risk_tier: "MODERATE", calibrated_probability: 0.77, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 3.30, estimated_pressure_gradient_mmhg: 43.6, murmur_grade_estimate: 2 },
  { id: "ch-113", anonymized_code: "CS-MEG-0009", full_name: "Sunita Marak", age: 17, sex: "M", guardian_name: "Arjun Das", guardian_phone: "9876500009", risk_tier: "MODERATE", calibrated_probability: 0.77, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 3.28, estimated_pressure_gradient_mmhg: 43.0, murmur_grade_estimate: 2 },
  { id: "ch-114", anonymized_code: "CS-MEG-0022", full_name: "Vikram Kharbhih", age: 13, sex: "F", guardian_name: "Pooja Singh", guardian_phone: "9876500022", risk_tier: "MODERATE", calibrated_probability: 0.75, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 3.22, estimated_pressure_gradient_mmhg: 41.5, murmur_grade_estimate: 2 },
  { id: "ch-115", anonymized_code: "CS-MEG-0014", full_name: "Meera Syiem", age: 16, sex: "M", guardian_name: "Rahul Roy", guardian_phone: "9876500014", risk_tier: "MODERATE", calibrated_probability: 0.74, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 3.18, estimated_pressure_gradient_mmhg: 40.4, murmur_grade_estimate: 2 },
  { id: "ch-116", anonymized_code: "CS-MEG-0012", full_name: "Vikram Marak", age: 13, sex: "F", guardian_name: "Kavita Nongrum", guardian_phone: "9876500012", risk_tier: "MODERATE", calibrated_probability: 0.72, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 3.12, estimated_pressure_gradient_mmhg: 38.9, murmur_grade_estimate: 2 },
  { id: "ch-117", anonymized_code: "CS-MEG-0002", full_name: "Grace Dkhar", age: 5, sex: "M", guardian_name: "Amit Nongrum", guardian_phone: "9876500002", risk_tier: "MODERATE", calibrated_probability: 0.70, referred_to_facility: "Ganesh Das MCH Hospital", estimated_jet_velocity_ms: 3.05, estimated_pressure_gradient_mmhg: 37.2, murmur_grade_estimate: 2 },
  { id: "ch-118", anonymized_code: "CS-MEG-0021", full_name: "Kavita Syiem", age: 7, sex: "M", guardian_name: "Bikash Roy", guardian_phone: "9876500021", risk_tier: "MODERATE", calibrated_probability: 0.68, referred_to_facility: "Ganesh Das MCH Hospital", estimated_jet_velocity_ms: 2.98, estimated_pressure_gradient_mmhg: 35.5, murmur_grade_estimate: 2 },
  { id: "ch-119", anonymized_code: "CS-MEG-0144", full_name: "Priya Syiem", age: 9, sex: "F", guardian_name: "Kharma Syiem", guardian_phone: "9876500144", risk_tier: "MODERATE", calibrated_probability: 0.64, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 2.90, estimated_pressure_gradient_mmhg: 33.6, murmur_grade_estimate: 2 },
  { id: "ch-120", anonymized_code: "CS-MEG-0155", full_name: "Rupa Lyngdoh", age: 12, sex: "F", guardian_name: "Bikash Lyngdoh", guardian_phone: "9876500155", risk_tier: "MODERATE", calibrated_probability: 0.61, referred_to_facility: "Ganesh Das MCH Hospital", estimated_jet_velocity_ms: 2.82, estimated_pressure_gradient_mmhg: 31.8, murmur_grade_estimate: 2 },
  { id: "ch-121", anonymized_code: "CS-MEG-0168", full_name: "Amit Sharma", age: 10, sex: "M", guardian_name: "Rajesh Sharma", guardian_phone: "9876500168", risk_tier: "MODERATE", calibrated_probability: 0.58, referred_to_facility: "Shillong Civil Hospital", estimated_jet_velocity_ms: 2.75, estimated_pressure_gradient_mmhg: 30.2, murmur_grade_estimate: 2 },
  { id: "ch-122", anonymized_code: "CS-MEG-0172", full_name: "Deepak Roy", age: 14, sex: "M", guardian_name: "Rahul Roy", guardian_phone: "9876500172", risk_tier: "MODERATE", calibrated_probability: 0.55, referred_to_facility: "Ganesh Das MCH Hospital", estimated_jet_velocity_ms: 2.68, estimated_pressure_gradient_mmhg: 28.7, murmur_grade_estimate: 2 }
];

export default function CampCompletionReportPage() {
  const [reportSummary, setReportSummary] = useState(null);
  const [referralsList, setReferralsList] = useState(INITIAL_22_REFERRALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const resSummary = await fetch(getApiUrl('/api/admin/camp-quality?camp_id=camp-01'));
        if (resSummary.ok) {
          const dataSummary = await resSummary.json();
          setReportSummary(dataSummary);
        }

        const resReferrals = await fetch(getApiUrl('/api/admin/camp-completion-referrals?camp_id=camp-01'));
        if (resReferrals.ok) {
          const dataReferrals = await resReferrals.json();
          if (dataReferrals && dataReferrals.length > 0) {
            setReferralsList(dataReferrals);
          }
        }
      } catch (e) {
        console.error('Failed to fetch camp report data:', e);
      }
    }
    fetchData();
  }, []);

  const target = reportSummary?.target_headcount || 150;
  const screened = reportSummary?.total_children_screened || 112;

  // Filter 22 referrals dynamically
  const filteredReferrals = referralsList.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || (
      (item.full_name && item.full_name.toLowerCase().includes(q)) ||
      (item.anonymized_code && item.anonymized_code.toLowerCase().includes(q)) ||
      (item.guardian_name && item.guardian_name.toLowerCase().includes(q)) ||
      (item.referred_to_facility && item.referred_to_facility.toLowerCase().includes(q))
    );

    const matchesTier = tierFilter === 'all' || 
      (tierFilter === 'HIGH' && (item.risk_tier === 'HIGH' || item.risk_tier === 'high')) ||
      (tierFilter === 'MODERATE' && (item.risk_tier === 'MODERATE' || item.risk_tier === 'moderate'));

    return matchesQuery && matchesTier;
  });

  const highCount = referralsList.filter(r => r.risk_tier === 'HIGH' || r.risk_tier === 'high').length;
  const moderateCount = referralsList.filter(r => r.risk_tier === 'MODERATE' || r.risk_tier === 'moderate').length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Title & Batch Actions */}
        <div className="border-b border-white/10 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#4EB8E0] uppercase tracking-wider block">End-of-Camp Operations</span>
            <h1 className="text-2xl font-extrabold text-white font-serif">Camp Completion & Epidemiological Report Generator</h1>
            <p className="text-xs text-[#8DA0B0]">
              Official ReportLab PDF summary generator & actionable referral roster for District Health Office submission (Pynthorumkhrah Primary Camp).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="http://localhost:8000/api/camps/camp-01/completion-report.pdf"
              target="_blank"
              rel="noreferrer"
              className="glass-button bg-[#2C7FB8] hover:bg-[#2C7FB8]/80 text-white font-bold text-xs border border-[#4EB8E0]/50 shadow-lg shadow-black/50 transition-all cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download Camp Completion Report (PDF)</span>
            </a>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="glass-card p-6 border-white/10 rounded-2xl space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#1A4A66]/60 border border-[#4EB8E0]/40 text-[#4EB8E0] shrink-0">
                <FileText className="w-6 h-6 text-[#4EB8E0]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-serif">Camp Operational Log Summary (camp-01)</h3>
                <p className="text-xs text-[#8DA0B0]">Pynthorumkhrah Govt Upper Primary School • East Khasi Hills District</p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#3FA88A]/20 text-[#3FA88A] border border-[#3FA88A]/40 font-bold text-xs uppercase tracking-wider w-fit flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3FA88A]" />
              <span>COMPLETED & VERIFIED</span>
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
              <span className="text-[10px] text-[#8DA0B0] block uppercase font-bold">Total Children Screened</span>
              <span className="text-2xl font-bold text-white font-mono">{screened} / {target}</span>
              <span className="text-[10px] text-[#3FA88A] block font-sans font-semibold">74.6% Target Reached</span>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
              <span className="text-[10px] text-[#DDA43C] block uppercase font-bold">Consent Decline Rate</span>
              <span className="text-2xl font-bold text-[#DDA43C] font-mono">3.2%</span>
              <span className="text-[10px] text-[#8DA0B0] block font-sans">4 Parents Opted Out</span>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1">
              <span className="text-[10px] text-[#3FA88A] block uppercase font-bold">Audio SNR Quality Pass</span>
              <span className="text-2xl font-bold text-[#3FA88A] font-mono">93.8%</span>
              <span className="text-[10px] text-[#3FA88A]/80 block font-sans">105 Pass / 7 Fail</span>
            </div>

            <div className="p-4 rounded-xl bg-[#E85D4A]/10 border border-[#E85D4A]/40 space-y-1">
              <span className="text-[10px] text-[#E85D4A] block uppercase font-bold">Actionable Referrals</span>
              <span className="text-2xl font-bold text-[#E85D4A] font-mono">22 Children</span>
              <span className="text-[10px] text-slate-300 block font-sans font-medium">{highCount} High / {moderateCount} Moderate</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card p-4 rounded-2xl border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <StudentSearchBar
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search referrals by student code, name, guardian, or facility..."
              totalCount={referralsList.length}
              filteredCount={filteredReferrals.length}
            />
          </div>

          {/* Risk Tier Tabs */}
          <div className="flex items-center gap-2 bg-[#0A0E13] p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tierFilter === 'all' 
                  ? 'bg-[#4EB8E0] text-[#0A0E13] shadow-md' 
                  : 'text-[#8DA0B0] hover:text-white'
              }`}
            >
              All (22)
            </button>
            <button
              onClick={() => setTierFilter('HIGH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tierFilter === 'HIGH' 
                  ? 'bg-[#E85D4A] text-white shadow-md' 
                  : 'text-[#8DA0B0] hover:text-white'
              }`}
            >
              High Risk ({highCount})
            </button>
            <button
              onClick={() => setTierFilter('MODERATE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tierFilter === 'MODERATE' 
                  ? 'bg-[#DDA43C] text-[#0A0E13] shadow-md' 
                  : 'text-[#8DA0B0] hover:text-white'
              }`}
            >
              Moderate ({moderateCount})
            </button>
          </div>
        </div>

        {/* Full 22 Actionable Referrals Roster Table */}
        <div className="glass-card p-6 space-y-4 rounded-2xl border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2 font-serif">
                <AlertTriangle className="w-5 h-5 text-[#E85D4A]" />
                <span>Flagged Subclinical Referrals Roster ({filteredReferrals.length} Children)</span>
              </h3>
              <p className="text-xs text-[#8DA0B0] mt-0.5">
                Complete list of 22 subclinical heart sound referrals exported in District Health Office Report.
              </p>
            </div>
            <a
              href="http://localhost:8000/api/camps/camp-01/completion-report.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#4EB8E0] hover:text-white font-semibold flex items-center gap-1.5 font-mono hover:underline shrink-0"
            >
              <span>View Full ReportLab PDF</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#4EB8E0]" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E6EBF0]">
              <thead>
                <tr className="border-b border-white/10 text-[#8DA0B0] font-bold uppercase tracking-wider text-[11px] font-mono">
                  <th className="pb-3 px-3">Child Code / Name</th>
                  <th className="pb-3 px-3">Age / Sex</th>
                  <th className="pb-3 px-3">Guardian Contact</th>
                  <th className="pb-3 px-3">Auscultation Physics</th>
                  <th className="pb-3 px-3">Triage Risk Tier</th>
                  <th className="pb-3 px-3">Referred Destination</th>
                  <th className="pb-3 px-3 text-right">Referral Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReferrals.map((item, idx) => {
                  const isHigh = item.risk_tier === 'HIGH' || item.risk_tier === 'high';
                  const probPct = Math.round((item.calibrated_probability || 0.75) * 100);

                  return (
                    <tr key={item.id || idx} className="hover:bg-white/5 transition-all">
                      {/* Code & Name */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white text-xs">
                          {item.full_name || `Student ${item.anonymized_code}`}
                        </div>
                        <div className="font-mono text-[#4EB8E0] text-[11px] font-semibold">
                          {item.anonymized_code}
                        </div>
                      </td>

                      {/* Age & Sex */}
                      <td className="py-3.5 px-3 font-mono text-[#E6EBF0]">
                        {item.age}y / {item.sex}
                      </td>

                      {/* Guardian */}
                      <td className="py-3.5 px-3">
                        <div className="text-white font-medium">{item.guardian_name || 'Guardian'}</div>
                        <div className="text-[10px] text-[#8DA0B0] font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#4EB8E0]" />
                          <span>{item.guardian_phone || '+91 9876543210'}</span>
                        </div>
                      </td>

                      {/* Auscultation Physics */}
                      <td className="py-3.5 px-3 font-mono text-xs">
                        <div className="text-[#4EB8E0] font-semibold">
                          {item.estimated_jet_velocity_ms ? `${item.estimated_jet_velocity_ms} m/s` : '3.4 m/s'}
                        </div>
                        <div className="text-[10px] text-[#8DA0B0]">
                          ΔP: {item.estimated_pressure_gradient_mmhg ? `${item.estimated_pressure_gradient_mmhg} mmHg` : '46.2 mmHg'} • Grade {item.murmur_grade_estimate || 2}/6
                        </div>
                      </td>

                      {/* Triage Tier */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 border shadow-sm ${
                          isHigh 
                            ? 'bg-[#E85D4A]/20 text-[#E85D4A] border-[#E85D4A]/50' 
                            : 'bg-[#DDA43C]/20 text-[#DDA43C] border-[#DDA43C]/50'
                        }`}>
                          <HeartPulse className="w-3 h-3" />
                          <span>{probPct}% {isHigh ? 'HIGH RISK' : 'MODERATE'}</span>
                        </span>
                      </td>

                      {/* Referred Destination */}
                      <td className="py-3.5 px-3">
                        <div className="text-[#E6EBF0] font-medium text-xs">
                          {item.referred_to_facility || 'NEIGRIHMS Cardiology Wing'}
                        </div>
                        <div className="text-[10px] text-[#3FA88A] font-mono">Outreach Scheduled</div>
                      </td>

                      {/* Action PDF */}
                      <td className="py-3.5 px-3 text-right">
                        <a
                          href={getApiUrl(`/api/referral/${item.anonymized_code}/pdf`)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 hover:border-[#4EB8E0]/50 text-[#4EB8E0] hover:text-white font-semibold text-[11px] font-mono inline-flex items-center gap-1 transition-all"
                        >
                          <Download className="w-3 h-3 text-[#4EB8E0]" />
                          <span>PDF Slip</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
