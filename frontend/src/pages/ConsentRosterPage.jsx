import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import StudentSearchBar from '../components/StudentSearchBar';
import { UserCheck, Search, Filter, CheckCircle2, Clock, XCircle, AlertCircle, Phone } from 'lucide-react';

export default function ConsentRosterPage() {
  const [roster, setRoster] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchRoster() {
      try {
        const res = await fetch(getApiUrl('/api/admin/roster?camp_id=camp-01'));
        if (res.ok) {
          const data = await res.json();
          setRoster(data);
        }
      } catch (e) {
        console.error('Failed to fetch roster:', e);
      }
    }
    fetchRoster();
  }, []);

  const handleToggleCheckIn = async (rosterId, currentCheckedIn) => {
    const nextState = !currentCheckedIn;
    // Optimistic UI update
    setRoster(prev => prev.map(item => item.id === rosterId ? {
      ...item,
      checked_in: nextState ? 1 : 0,
      check_in_time: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
    } : item));

    try {
      await fetch(getApiUrl('/api/admin/roster/check-in'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roster_id: rosterId, checked_in: nextState })
      });
    } catch (e) {
      console.error('Failed to update check in status:', e);
    }
  };

  const handleUpdateConsent = async (rosterId, newConsentStatus) => {
    setRoster(prev => prev.map(item => item.id === rosterId ? { ...item, consent_status: newConsentStatus } : item));
    try {
      await fetch(getApiUrl('/api/admin/roster/consent'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roster_id: rosterId, consent_status: newConsentStatus })
      });
    } catch (e) {
      console.error('Failed to update consent status:', e);
    }
  };

  const filteredRoster = roster.filter(item => {
    const matchesSearch = (item.anonymized_code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.guardian_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.consent_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const checkedInCount = roster.filter(r => r.checked_in).length;
  const consentReceivedCount = roster.filter(r => r.consent_status === 'received').length;
  const consentDeclinedCount = roster.filter(r => r.consent_status === 'declined').length;
  const totalRoster = roster.length || 30;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#4EB8E0] uppercase tracking-wider block">School Camp Logistics</span>
            <h1 className="text-2xl font-extrabold text-white font-serif">Consent & Attendance Roster Manager</h1>
            <p className="text-xs text-[#8DA0B0]">
              Pre-camp parental consent tracking & camp-day student check-in register (Pynthorumkhrah Primary Camp)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#3FA88A]/20 border border-[#3FA88A]/40 text-[#3FA88A] text-xs font-bold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#3FA88A]" />
              <span>{checkedInCount} / {totalRoster} Checked In</span>
            </span>
          </div>
        </div>

        {/* Live Attendance Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-[#8DA0B0] uppercase tracking-wider font-bold block">Total Registered</span>
            <span className="text-2xl font-extrabold text-white font-mono">{totalRoster} Students</span>
            <span className="text-[10px] text-[#8DA0B0] block">Enrolled Roster</span>
          </div>

          <div className="glass-card p-4 rounded-xl space-y-1 border-[#3FA88A]/30">
            <span className="text-[10px] text-[#3FA88A] uppercase tracking-wider font-bold block">Consent Received</span>
            <span className="text-2xl font-extrabold text-[#3FA88A] font-mono">{consentReceivedCount} ({Math.round((consentReceivedCount / totalRoster) * 100)}%)</span>
            <span className="text-[10px] text-[#3FA88A]/70 block">Ready for Screening</span>
          </div>

          <div className="glass-card p-4 rounded-xl space-y-1 border-[#DDA43C]/30">
            <span className="text-[10px] text-[#DDA43C] uppercase tracking-wider font-bold block">Attendance Checked In</span>
            <span className="text-2xl font-extrabold text-[#DDA43C] font-mono">{checkedInCount} Present</span>
            <span className="text-[10px] text-[#DDA43C]/70 block">Camp Floor Active</span>
          </div>

          <div className="glass-card p-4 rounded-xl space-y-1 border-[#E85D4A]/30">
            <span className="text-[10px] text-[#E85D4A] uppercase tracking-wider font-bold block">Declined / Opted Out</span>
            <span className="text-2xl font-extrabold text-[#E85D4A] font-mono">{consentDeclinedCount} Students</span>
            <span className="text-[10px] text-[#E85D4A]/70 block">Parental Decline</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 rounded-2xl border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <StudentSearchBar
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search by student code, name, or guardian name..."
              totalCount={roster.length}
              filteredCount={filteredRoster.length}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Filter className="w-4 h-4 text-[#4EB8E0] shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input text-xs px-3 py-2 bg-[#0F1722]/90 border border-slate-700/80 rounded-xl text-white outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0A0E13]">All Consent Statuses</option>
              <option value="received" className="bg-[#0A0E13]">Consent Received</option>
              <option value="pending" className="bg-[#0A0E13]">Consent Pending</option>
              <option value="declined" className="bg-[#0A0E13]">Consent Declined</option>
            </select>
          </div>
        </div>

        {/* Roster Table */}
        <div className="glass-card p-6 rounded-2xl border-white/10 space-y-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E6EBF0]">
            <thead>
              <tr className="border-b border-white/10 text-[#8DA0B0] font-bold uppercase tracking-wider text-[11px] font-mono">
                <th className="pb-3 px-2">Child Code</th>
                <th className="pb-3 px-2">Student Name</th>
                <th className="pb-3 px-2">Age / Sex</th>
                <th className="pb-3 px-2">Guardian Phone</th>
                <th className="pb-3 px-2">Parental Consent</th>
                <th className="pb-3 px-2">Camp Attendance</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRoster.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-all">
                  <td className="py-3 px-2 font-mono font-semibold text-[#4EB8E0] text-xs">{item.anonymized_code}</td>
                  <td className="py-3 px-2 font-bold text-white">
                    <div>{item.full_name || `Student ${item.anonymized_code}`}</div>
                    <div className="text-[10px] text-[#8DA0B0] font-mono">Guardian: {item.guardian_name || 'Guardian'}</div>
                  </td>
                  <td className="py-3 px-2 font-mono text-[#E6EBF0]">{item.age}y / {item.sex}</td>
                  <td className="py-3 px-2 font-mono text-[#4EB8E0] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#4EB8E0]" />
                    <span>{item.guardian_phone || '+91 9876543210'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={item.consent_status}
                      onChange={(e) => handleUpdateConsent(item.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider outline-none cursor-pointer border transition-all ${
                        item.consent_status === 'received' 
                          ? 'bg-[#00F5D4]/20 text-[#00F5D4] border-[#00F5D4]/60 shadow-md' :
                        item.consent_status === 'pending' 
                          ? 'bg-[#F5C242]/20 text-[#F5C242] border-[#F5C242]/80 shadow-md font-bold' :
                          'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/60 shadow-md'
                      }`}
                    >
                      <option value="received" className="bg-[#0A0E13] text-[#00F5D4] font-bold">RECEIVED</option>
                      <option value="pending" className="bg-[#0A0E13] text-[#F5C242] font-bold">PENDING</option>
                      <option value="declined" className="bg-[#0A0E13] text-[#FF6B6B] font-bold">DECLINED</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    {item.checked_in ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3FA88A]/20 text-[#3FA88A] border border-[#3FA88A]/40 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-[#3FA88A]" />
                        <span>Present ({item.check_in_time || '09:15 AM'})</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-[#8DA0B0] border border-slate-700 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" />
                        <span>Not Checked In</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleToggleCheckIn(item.id, item.checked_in)}
                      className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                        item.checked_in 
                          ? 'glass-button-secondary text-xs hover:border-[#E85D4A]/50 text-[#8DA0B0] hover:text-[#E85D4A]' 
                          : 'bg-[#3FA88A] hover:bg-[#3FA88A]/80 text-[#0A0E13] shadow-md shadow-[#3FA88A]/30'
                      }`}
                    >
                      {item.checked_in ? 'Undo Check-In' : 'Check In Student'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
