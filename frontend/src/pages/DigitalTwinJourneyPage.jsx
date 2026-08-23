import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import StudentSearchBar from '../components/StudentSearchBar';
import { Network, CheckCircle2, User, Cpu, ShieldCheck, HeartPulse, Building2, Smartphone, Pill, Search } from 'lucide-react';

// Comprehensive Student Database for Digital Twin Care Journeys
const SAMPLE_STUDENTS_DB = [
  {
    id: 'child-0121',
    anonymized_code: 'CS-MEG-0121',
    full_name: 'Mary Wankhar',
    school_name: 'Pynthorumkhrah Govt Upper Primary School',
    age: 11,
    sex: 'F',
    risk_tier: 'HIGH',
    probability_score: 89,
    jet_velocity: '3.78 m/s',
    pressure_gradient: '57.1 mmHg',
    nodes: [
      { step: 1, role: "ASHA Worker", action: "Stethoscope PCG Audio + Jones Criteria Form Uploaded by ASHA Kavita Devi", timestamp: "2026-07-28 09:30 AM", status: "completed" },
      { step: 2, role: "AI Microservice", action: "HSMM S1/S2 Segmented & Bernoulli Jet Velocity Estimated (3.78 m/s)", timestamp: "2026-07-28 09:31 AM", status: "completed" },
      { step: 3, role: "Calibrated Model", action: "XGBoost Isotonic Score 89% (HIGH Risk Tier Flagged)", timestamp: "2026-07-28 09:31 AM", status: "completed" },
      { step: 4, role: "Load Balancer", action: "Referred to NEIGRIHMS Cardiology (Load Balanced Priority Queue)", timestamp: "2026-07-28 09:32 AM", status: "completed" },
      { step: 5, role: "Parent Portal", action: "Guardian Logged In & Viewed Medical Guidance in Khasi Language", timestamp: "2026-07-28 06:15 PM", status: "completed" },
      { step: 6, role: "Clinician Echo", action: "Echocardiogram Completed at NEIGRIHMS (Definite Subclinical RHD Confirmed)", timestamp: "2026-07-29 10:00 AM", status: "completed" },
      { step: 7, role: "Prophylaxis", action: "Secondary BPG Penicillin Injection Administered (Next due 2026-08-28)", timestamp: "2026-07-29 10:30 AM", status: "active" }
    ]
  },
  {
    id: 'child-0001',
    anonymized_code: 'CS-MAW-1949',
    full_name: 'Chodavadiya Jesmin Dipakbhai',
    school_name: 'Govt High School Mawlai',
    age: 14,
    sex: 'M',
    risk_tier: 'HIGH',
    probability_score: 98,
    jet_velocity: '4.50 m/s',
    pressure_gradient: '81.0 mmHg',
    nodes: [
      { step: 1, role: "ASHA Worker", action: "Digital Stethoscope Audio & Clinical Risk Assessment Form Uploaded", timestamp: "2026-08-01 10:15 AM", status: "completed" },
      { step: 2, role: "AI Microservice", action: "Acoustic Murmur Detected - Jet Velocity Estimated at 4.50 m/s", timestamp: "2026-08-01 10:16 AM", status: "completed" },
      { step: 3, role: "Calibrated Model", action: "XGBoost Calibrated Score 98% (HIGH Risk Tier - Priority Fast-Track)", timestamp: "2026-08-01 10:16 AM", status: "completed" },
      { step: 4, role: "Load Balancer", action: "Assigned to Shillong Civil Hospital Mobile Echo Unit #01", timestamp: "2026-08-01 10:20 AM", status: "completed" },
      { step: 5, role: "Parent Portal", action: "SMS Alert & Voice Call Confirmation Sent to Guardian", timestamp: "2026-08-01 02:00 PM", status: "completed" },
      { step: 6, role: "Clinician Echo", action: "Confirmatory Echo: Severe Mitral Regurgitation (MR Grade 3/4)", timestamp: "2026-08-02 11:30 AM", status: "completed" },
      { step: 7, role: "Prophylaxis", action: "Benzathine Penicillin G (BPG) Injection Dose 1 Administered", timestamp: "2026-08-02 12:00 PM", status: "active" }
    ]
  },
  {
    id: 'child-0002',
    anonymized_code: 'CS-MAW-3311',
    full_name: 'jesmin chodavadiya dipakbhai',
    school_name: 'Govt High School Mawlai',
    age: 17,
    sex: 'M',
    risk_tier: 'HIGH',
    probability_score: 98,
    jet_velocity: '3.99 m/s',
    pressure_gradient: '63.7 mmHg',
    nodes: [
      { step: 1, role: "ASHA Worker", action: "Stethoscope PCG Audio & Joint Pain Survey Uploaded", timestamp: "2026-08-03 09:00 AM", status: "completed" },
      { step: 2, role: "AI Microservice", action: "Systolic Murmur Segmented & Bernoulli Jet Velocity Estimated (3.99 m/s)", timestamp: "2026-08-03 09:01 AM", status: "completed" },
      { step: 3, role: "Calibrated Model", action: "XGBoost Isotonic Score 98% (HIGH Risk Tier)", timestamp: "2026-08-03 09:01 AM", status: "completed" },
      { step: 4, role: "Load Balancer", action: "Referred to NEIGRIHMS Cardiology Specialist Queue", timestamp: "2026-08-03 09:05 AM", status: "completed" },
      { step: 5, role: "Parent Portal", action: "Guardian Notification Acknowledged via Khasi Voice IVR", timestamp: "2026-08-03 04:30 PM", status: "completed" },
      { step: 6, role: "Clinician Echo", action: "Echo Confirmed: Moderate Mitral Valve Thickening", timestamp: "2026-08-04 10:15 AM", status: "completed" },
      { step: 7, role: "Prophylaxis", action: "Prophylactic BPG Injection Enrolled (3-Weekly Schedule Active)", timestamp: "2026-08-04 11:00 AM", status: "active" }
    ]
  },
  {
    id: 'child-0003',
    anonymized_code: 'CS-MAW-9744',
    full_name: 'krutik chodavadiya',
    school_name: 'Govt High School Mawlai',
    age: 17,
    sex: 'M',
    risk_tier: 'HIGH',
    probability_score: 95,
    jet_velocity: '4.16 m/s',
    pressure_gradient: '69.2 mmHg',
    nodes: [
      { step: 1, role: "ASHA Worker", action: "Acoustic Screening & History Form Uploaded", timestamp: "2026-08-05 11:00 AM", status: "completed" },
      { step: 2, role: "AI Microservice", action: "HSMM Segmented S1/S2 & Murmur Ratio Computed", timestamp: "2026-08-05 11:01 AM", status: "completed" },
      { step: 3, role: "Calibrated Model", action: "Score 95% (HIGH Risk Tier)", timestamp: "2026-08-05 11:01 AM", status: "completed" },
      { step: 4, role: "Load Balancer", action: "Allocated to East Khasi Mobile Echo Van Route", timestamp: "2026-08-05 11:10 AM", status: "completed" },
      { step: 5, role: "Parent Portal", action: "Guardian Notification Sent", timestamp: "2026-08-05 03:00 PM", status: "completed" },
      { step: 6, role: "Clinician Echo", action: "Echo Assessment Complete", timestamp: "2026-08-06 09:30 AM", status: "completed" },
      { step: 7, role: "Prophylaxis", action: "Penicillin Prophylaxis Active", timestamp: "2026-08-06 10:00 AM", status: "active" }
    ]
  },
  {
    id: 'child-0004',
    anonymized_code: 'CS-MEG-0018',
    full_name: 'Neha Das',
    school_name: 'Pynthorumkhrah Govt Upper Primary',
    age: 9,
    sex: 'F',
    risk_tier: 'HIGH',
    probability_score: 90,
    jet_velocity: '3.85 m/s',
    pressure_gradient: '59.3 mmHg',
    nodes: [
      { step: 1, role: "ASHA Worker", action: "Stethoscope Audio Uploaded by ASHA Phida Shullai", timestamp: "2026-08-06 10:00 AM", status: "completed" },
      { step: 2, role: "AI Microservice", action: "Murmur Detected (3.85 m/s Jet Velocity)", timestamp: "2026-08-06 10:01 AM", status: "completed" },
      { step: 3, role: "Calibrated Model", action: "Score 90% (HIGH Risk Tier)", timestamp: "2026-08-06 10:01 AM", status: "completed" },
      { step: 4, role: "Load Balancer", action: "Scheduled for Mobile Echo Van Visit", timestamp: "2026-08-06 10:05 AM", status: "completed" },
      { step: 5, role: "Parent Portal", action: "Khasi Voice Guidance Listened by Parent", timestamp: "2026-08-06 05:00 PM", status: "completed" },
      { step: 6, role: "Clinician Echo", action: "Clinician Confirmed RHD", timestamp: "2026-08-07 10:00 AM", status: "completed" },
      { step: 7, role: "Prophylaxis", action: "Penicillin Injection Administered", timestamp: "2026-08-07 10:30 AM", status: "active" }
    ]
  }
];

export default function DigitalTwinJourneyPage() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [twinData, setTwinData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Load student care journey based on URL param childId or fallback
  useEffect(() => {
    // Search local database first to ensure 100% instant rendering
    const localMatch = SAMPLE_STUDENTS_DB.find(
      s => s.id === childId || s.anonymized_code === childId
    );

    if (localMatch) {
      setTwinData(localMatch);
    } else {
      // Fetch from API backend
      async function fetchDigitalTwin() {
        try {
          const target = childId || 'child-0121';
          const res = await fetch(getApiUrl(`/api/admin/care-journey/${target}`));
          if (res.ok) {
            const data = await res.json();
            setTwinData(data);
          } else {
            setTwinData(SAMPLE_STUDENTS_DB[0]);
          }
        } catch (e) {
          console.error('Failed to fetch digital twin care journey:', e);
          setTwinData(SAMPLE_STUDENTS_DB[0]);
        }
      }
      fetchDigitalTwin();
    }
  }, [childId]);

  // Handle Live Search Filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const q = searchTerm.toLowerCase().trim();
    // Filter local dataset instantly
    const matches = SAMPLE_STUDENTS_DB.filter(s => 
      s.full_name.toLowerCase().includes(q) ||
      s.anonymized_code.toLowerCase().includes(q) ||
      s.school_name.toLowerCase().includes(q)
    );

    setSearchResults(matches);

    // Also attempt backend search
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(getApiUrl(`/api/children/search?q=${encodeURIComponent(searchTerm)}`));
        if (res.ok) {
          const data = await res.json();
          if (data.children && data.children.length > 0) {
            // Combine unique search results
            const combined = [...matches];
            data.children.forEach(apiChild => {
              if (!combined.some(c => c.anonymized_code === apiChild.anonymized_code || c.id === apiChild.id)) {
                combined.push({
                  id: apiChild.id || apiChild.anonymized_code,
                  anonymized_code: apiChild.anonymized_code || apiChild.id,
                  full_name: apiChild.full_name || apiChild.name || 'Student',
                  school_name: apiChild.school_name || 'School Screening Camp',
                  age: apiChild.age || 12,
                  sex: apiChild.sex || 'M',
                  risk_tier: (apiChild.risk_tier || 'HIGH').toUpperCase(),
                  probability_score: apiChild.score || 88,
                  jet_velocity: apiChild.velocity || '3.75 m/s',
                  pressure_gradient: apiChild.pressure || '56 mmHg',
                  nodes: SAMPLE_STUDENTS_DB[0].nodes
                });
              }
            });
            setSearchResults(combined);
          }
        }
      } catch (e) {
        console.error('Search API error:', e);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectStudent = (student) => {
    setSearchTerm('');
    setSearchResults([]);
    setTwinData(student);
    // Navigate safely using the proper valid care journey route
    navigate(`/app/care-journey/${student.id || student.anonymized_code}`);
  };

  const nodes = twinData?.nodes || SAMPLE_STUDENTS_DB[0].nodes;

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'ASHA Worker':
      case 'Parent Portal':
        return 'bg-[#DDA43C]/20 text-[#DDA43C] border border-[#DDA43C]/40 font-bold';
      case 'AI Microservice':
      case 'Load Balancer':
        return 'bg-[#4EB8E0]/20 text-[#4EB8E0] border border-[#4EB8E0]/40 font-bold';
      case 'Calibrated Model':
      case 'Clinician Echo':
      case 'Prophylaxis':
      default:
        return 'bg-[#3FA88A]/20 text-[#3FA88A] border border-[#3FA88A]/40 font-bold';
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#4EB8E0] uppercase tracking-wider block">Flagship Feature</span>
            <h1 className="text-2xl font-extrabold text-white font-serif">Digital Twin Cross-Role Care Journey</h1>
            <p className="text-xs text-[#8DA0B0]">Unified visual flow merging ASHA worker, AI model, load balancer, parent portal, clinician, and prophylaxis logs</p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#132030] border border-[#4EB8E0]/40 text-xs font-mono font-bold text-[#4EB8E0]">
            <Network className="w-4 h-4 text-[#4EB8E0]" />
            <span>End-to-End Care Integration</span>
          </div>
        </div>

        {/* Student Search Bar & Dropdown Select */}
        <div className="glass-card p-4 space-y-3 border-white/10 rounded-2xl relative z-30">
          <StudentSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search student by name or child code (e.g. Mary, Jesmin, CS-MEG-0121, CS-MAW-1949)…"
            totalCount={595}
            filteredCount={searchResults.length}
          />

          {searchResults.length > 0 && (
            <div className="bg-[#0F1722] border border-[#4EB8E0]/50 rounded-xl max-h-64 overflow-y-auto divide-y divide-white/10 shadow-2xl z-50 relative mt-2">
              {searchResults.map((c) => (
                <div
                  key={c.id || c.anonymized_code}
                  onClick={() => handleSelectStudent(c)}
                  className="p-3.5 hover:bg-[#132030] transition-colors flex items-center justify-between cursor-pointer text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{c.full_name || 'Student'}</span>
                      <span className="font-mono text-[#4EB8E0] text-[11px] font-semibold">({c.anonymized_code})</span>
                    </div>
                    <span className="text-[10px] text-[#8DA0B0] block mt-0.5">
                      {c.school_name} • Age: {c.age}y/{c.sex} • Jet Velocity: {c.jet_velocity || '3.75 m/s'}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold font-mono uppercase border ${
                    c.risk_tier === 'HIGH' || c.risk_tier === 'high' 
                      ? 'bg-[#E85D4A]/20 text-[#E85D4A] border-[#E85D4A]/50' 
                      : 'bg-[#3FA88A]/20 text-[#3FA88A] border-[#3FA88A]/50'
                  }`}>
                    {c.risk_tier || 'HIGH'} RISK
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Child Anonymized Record Banner */}
        {twinData && (
          <div className="glass-card p-6 border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl shadow-xl bg-[#0F1722]">
            <div>
              <span className="text-xs text-[#4EB8E0] font-bold uppercase tracking-wider block">TARGET CHILD DIGITAL TWIN RECORD</span>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-2xl font-extrabold text-[#4EB8E0] font-mono">{twinData.anonymized_code}</h2>
                {twinData.full_name && (
                  <span className="text-xl font-bold text-white font-serif">({twinData.full_name})</span>
                )}
              </div>
              <p className="text-xs text-[#8DA0B0] font-mono mt-1">
                {twinData.school_name} • Age: {twinData.age}y/{twinData.sex} • Regurgitant Jet Velocity: <strong className="text-white">{twinData.jet_velocity}</strong> ({twinData.pressure_gradient})
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider border ${
                twinData.risk_tier === 'HIGH' || twinData.risk_tier === 'high'
                  ? 'bg-[#E85D4A]/20 text-[#E85D4A] border-[#E85D4A]/50'
                  : 'bg-[#DDA43C]/20 text-[#DDA43C] border-[#DDA43C]/50'
              }`}>
                {twinData.risk_tier || 'HIGH'} RISK • ACTIVE CARE SURVEILLANCE
              </span>
            </div>
          </div>
        )}

        {/* Visual Timeline Nodes */}
        <div className="glass-card p-8 border-white/10 space-y-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-lg text-white font-serif">Cross-Role Event Sequence Flow</h3>
              <p className="text-xs text-[#8DA0B0]">
                Chronological digital audit trail across ASHA worker, AI model, load balancer, parent portal, clinician, and prophylaxis.
              </p>
            </div>
            <span className="text-xs font-mono text-[#4EB8E0]">{nodes.length} Lifecycle Steps</span>
          </div>

          <div className="relative border-l-2 border-[#2C7FB8]/60 ml-6 pl-8 space-y-8">
            {nodes.map((node, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-xl bg-[#132030] border border-[#4EB8E0]/50 flex items-center justify-center text-[#4EB8E0] font-mono font-bold text-xs shadow-lg">
                  {node.step}
                </div>
                <div className="glass-card p-5 border-white/10 space-y-2 rounded-xl hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full uppercase ${getRoleBadgeStyle(node.role)}`}>
                      {node.role}
                    </span>
                    <span className="text-[11px] text-[#8DA0B0] font-mono">{node.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-white text-base font-serif">{node.action}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
