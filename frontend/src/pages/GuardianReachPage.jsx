import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import StudentSearchBar from '../components/StudentSearchBar';
import { 
  Smartphone, PhoneCall, MessageSquare, AlertCircle, CheckCircle2, 
  RefreshCw, Send, Users, ShieldAlert, Sparkles, Filter, CheckSquare, Square, Layers, Clock, Info
} from 'lucide-react';

export default function GuardianReachPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const fetchReachStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/asha/guardian-reach-status'));
      if (res.ok) {
        const data = await res.json();
        setRecords(data.reach_records || []);
      }
    } catch (e) {
      console.error('Failed to fetch guardian reach status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReachStatus();
  }, []);

  // Handle Full Roster Search API integration (Addendum 50)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(getApiUrl(`/api/children/search?q=${encodeURIComponent(searchTerm)}`));
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.children || []);
        }
      } catch (e) {
        console.error('Search API error:', e);
      } finally {
        setSearching(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleTriggerFallback = async (childId, channel) => {
    try {
      const res = await fetch(getApiUrl('/api/family/notify-fallback'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, channel })
      });
      if (res.ok) {
        const data = await res.json();
        setActionMessage(data.message);
        setTimeout(() => setActionMessage(null), 4000);
        await fetchReachStatus();
      }
    } catch (e) {
      console.error('Failed to trigger fallback:', e);
    }
  };

  const handleBatchTriggerFallback = async (channel = 'both') => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch(getApiUrl('/api/family/notify-fallback-batch'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_ids: selectedIds, channel })
      });
      if (res.ok) {
        const data = await res.json();
        setActionMessage(data.message);
        setSelectedIds([]);
        setTimeout(() => setActionMessage(null), 4000);
        await fetchReachStatus();
      }
    } catch (e) {
      console.error('Failed to trigger batch fallback:', e);
    }
  };

  const toggleSelectAllUnreached = () => {
    const unreachedIds = records.filter(r => !r.app_reached && !r.ivr_reached && !r.sms_reached).map(r => r.child_id);
    if (selectedIds.length === unreachedIds.length && unreachedIds.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(unreachedIds);
    }
  };

  const toggleSelectRow = (childId) => {
    if (selectedIds.includes(childId)) {
      setSelectedIds(selectedIds.filter(id => id !== childId));
    } else {
      setSelectedIds([...selectedIds, childId]);
    }
  };

  // Funnel Breakdown Counts
  const totalCount = records.length;
  const appCount = records.filter(r => r.reach_badge === 'app_login').length;
  const ivrCount = records.filter(r => r.reach_badge === 'ivr_call').length;
  const smsCount = records.filter(r => r.reach_badge === 'sms').length;
  const unreachedCount = records.filter(r => r.reach_badge === 'unreached').length;

  const appPct = totalCount > 0 ? Math.round((appCount / totalCount) * 100) : 0;
  const ivrPct = totalCount > 0 ? Math.round((ivrCount / totalCount) * 100) : 0;
  const smsPct = totalCount > 0 ? Math.round((smsCount / totalCount) * 100) : 0;
  const unreachedPct = totalCount > 0 ? Math.round((unreachedCount / totalCount) * 100) : 0;

  // Filtered List Logic (Addendum 50: Search across full roster)
  const getDisplayRecords = () => {
    if (!searchTerm.trim()) return records;

    const term = searchTerm.toLowerCase().trim();
    const localFiltered = records.filter(r => 
      (r.full_name && r.full_name.toLowerCase().includes(term)) ||
      (r.anonymized_code && r.anonymized_code.toLowerCase().includes(term))
    );

    // Merge search results from full database query
    const localChildIds = new Set(localFiltered.map(r => r.child_id));
    const additionalResults = searchResults
      .filter(c => !localChildIds.has(c.id))
      .map(c => ({
        child_id: c.id,
        anonymized_code: c.anonymized_code,
        full_name: c.full_name || 'Student',
        guardian_name: c.guardian_name || 'Guardian',
        guardian_phone: c.guardian_phone || '--',
        risk_tier: c.risk_tier || 'low',
        days_since_flagged: 0,
        app_reached: false,
        ivr_reached: false,
        sms_reached: false,
        reach_badge: 'not_in_outreach',
        outreach_status_note: 'Screened — Low Risk (Not in Outreach Queue)'
      }));

    return [...localFiltered, ...additionalResults];
  };

  const displayRecords = getDisplayRecords();

  return (
    <DashboardShell role="asha_worker">
      <div className="space-y-6">
        {/* Header Title Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-serif">Guardian Reach Status & Fallback Dispatch</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1A4A66]/60 border border-[#4EB8E0]/40 text-[#4EB8E0] text-xs font-mono">
                Multi-Channel Outreach
              </span>
            </div>
            <p className="text-xs text-[#8DA0B0] mt-1">
              Track parent portal logins, automated IVR phone call acknowledgments, and SMS broadcast fallbacks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchReachStatus}
              className="glass-button text-xs py-2 hover:border-[#4EB8E0]/50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#4EB8E0] ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionMessage && (
          <div className="p-4 rounded-xl bg-[#3FA88A]/20 border border-[#3FA88A] text-white text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-lg shadow-[#3FA88A]/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#3FA88A]" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-xs text-[#8DA0B0] hover:text-white">Dismiss</button>
          </div>
        )}

        {/* 4-Level Outreach Channel Funnel Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Channel 1: Parent App */}
          <div className="glass-card p-4 space-y-2 border-[#3FA88A]/40 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#3FA88A] flex items-center gap-1.5 font-mono">
                <Smartphone className="w-4 h-4 text-[#3FA88A]" />
                1. Parent App Logins
              </span>
              <span className="px-2 py-0.5 rounded bg-[#3FA88A]/20 text-[#3FA88A] font-bold font-mono text-[10px]">
                {appPct}% Reached
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{appCount} / {totalCount}</div>
            <p className="text-[11px] text-[#8DA0B0]">Direct login using provisioned 4-digit PIN</p>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-[#3FA88A] transition-all duration-500" style={{ width: `${appPct}%` }} />
            </div>
          </div>

          {/* Channel 2: IVR Voice Calls */}
          <div className="glass-card p-4 space-y-2 border-[#4EB8E0]/40 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#4EB8E0] flex items-center gap-1.5 font-mono">
                <PhoneCall className="w-4 h-4 text-[#4EB8E0]" />
                2. IVR Call Fallbacks
              </span>
              <span className="px-2 py-0.5 rounded bg-[#4EB8E0]/20 text-[#4EB8E0] font-bold font-mono text-[10px]">
                {ivrPct}% Reached
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{ivrCount} / {totalCount}</div>
            <p className="text-[11px] text-[#8DA0B0]">Voice call dispatched; DTMF key 1 pressed</p>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-[#4EB8E0] transition-all duration-500" style={{ width: `${ivrPct}%` }} />
            </div>
          </div>

          {/* Channel 3: SMS Broadcast */}
          <div className="glass-card p-4 space-y-2 border-[#DDA43C]/40 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#DDA43C] flex items-center gap-1.5 font-mono">
                <MessageSquare className="w-4 h-4 text-[#DDA43C]" />
                3. SMS Link Sent
              </span>
              <span className="px-2 py-0.5 rounded bg-[#DDA43C]/20 text-[#DDA43C] font-bold font-mono text-[10px]">
                {smsPct}% Reached
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{smsCount} / {totalCount}</div>
            <p className="text-[11px] text-[#8DA0B0]">Direct SMS referral slip URL delivered</p>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-[#DDA43C] transition-all duration-500" style={{ width: `${smsPct}%` }} />
            </div>
          </div>

          {/* Channel 4: Unreached Cases */}
          <div className="glass-card p-4 space-y-2 border-[#E85D4A]/50 relative overflow-hidden bg-[#E85D4A]/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#E85D4A] flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-4 h-4 text-[#E85D4A]" />
                4. Unreached / Action Needed
              </span>
              <span className="px-2 py-0.5 rounded bg-[#E85D4A] text-white font-bold font-mono text-[10px]">
                {unreachedPct}% Pending
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#E85D4A] font-mono">{unreachedCount} / {totalCount}</div>
            <p className="text-[11px] text-[#E6EBF0]">No response on app/IVR/SMS — Home visit required</p>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-[#E85D4A] transition-all duration-500" style={{ width: `${unreachedPct}%` }} />
            </div>
          </div>
        </div>

        {/* Reach Status Table & Batch Actions */}
        <div className="glass-card overflow-hidden border-white/10 space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
            <div>
              <h3 className="font-bold text-base text-white font-serif">Flagged Referrals Guardian Engagement Log</h3>
              <p className="text-xs text-[#8DA0B0]">Search by student name or code across full district roster</p>
            </div>

            {/* Batch Action Control Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAllUnreached}
                className="px-3 py-1.5 rounded-xl bg-[#132030] border border-white/20 text-xs text-[#E6EBF0] font-semibold hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {selectedIds.length > 0 ? <CheckSquare className="w-4 h-4 text-[#DDA43C]" /> : <Square className="w-4 h-4 text-[#8DA0B0]" />}
                <span>Select Unreached ({unreachedCount})</span>
              </button>

              <button
                onClick={() => handleBatchTriggerFallback('both')}
                disabled={selectedIds.length === 0}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 shadow-md ${
                  selectedIds.length > 0 
                    ? 'glass-button bg-[#2C7FB8] text-white cursor-pointer hover:bg-[#2C7FB8]/80' 
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Trigger IVR + SMS for Selected ({selectedIds.length})</span>
              </button>
            </div>
          </div>

          {/* Student Name / Code Search Bar (Addendum 50) */}
          <StudentSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by student name or child code (e.g. Mary, CS-MEG-0039)..."
            totalCount={595}
            filteredCount={displayRecords.length}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 text-[#8DA0B0] font-bold uppercase tracking-wider text-[11px] border-b border-white/10 font-mono">
                <tr>
                  <th className="p-3 w-10 text-center">Select</th>
                  <th className="p-3">Student Name & Code</th>
                  <th className="p-3">Triage Tier</th>
                  <th className="p-3">Days Flagged</th>
                  <th className="p-3">Parent App</th>
                  <th className="p-3">IVR Call</th>
                  <th className="p-3">SMS Broadcast</th>
                  <th className="p-3">Multi-Channel Status</th>
                  <th className="p-3 text-right">Fallback Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {displayRecords.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-[#8DA0B0]">
                      No student records found matching "{searchTerm}".
                    </td>
                  </tr>
                ) : (
                  displayRecords.map((r) => {
                    const isUnreached = r.reach_badge === 'unreached';
                    const isSelected = selectedIds.includes(r.child_id);

                    return (
                      <tr 
                        key={r.child_id} 
                        className={`transition-colors ${
                          isSelected 
                            ? 'bg-[#2C7FB8]/20 border-l-4 border-l-[#4EB8E0]' 
                            : isUnreached 
                            ? 'bg-[#E85D4A]/5 hover:bg-[#E85D4A]/10' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(r.child_id)}
                            className="w-4 h-4 accent-[#2C7FB8] cursor-pointer"
                          />
                        </td>

                        {/* Two-Line Name / Code Format (Addendum 50) */}
                        <td className="p-3">
                          <div className="font-bold text-white text-sm">{r.full_name || 'Student'}</div>
                          <div className="text-[11px] text-[#4EB8E0] font-mono font-semibold">{r.anonymized_code}</div>
                        </td>
                        
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] uppercase border ${
                            r.risk_tier === 'high' ? 'bg-[#E85D4A] text-white border-[#E85D4A]' : 
                            r.risk_tier === 'priority_uncertain' ? 'bg-[#DDA43C] text-[#14181D] border-[#DDA43C] shadow-sm' :
                            'bg-[#3FA88A]/20 text-[#3FA88A] border-[#3FA88A]/40'
                          }`}>
                            {r.risk_tier ? r.risk_tier.replace('_', ' ') : 'low'}
                          </span>
                        </td>

                        <td className="p-3 font-mono text-slate-300">
                          {r.days_since_flagged != null ? `${r.days_since_flagged} days` : '--'}
                        </td>

                        {/* Channel 1: App */}
                        <td className="p-3">
                          {r.app_reached ? (
                            <span className="inline-flex items-center gap-1 text-[#3FA88A] font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Logged In
                            </span>
                          ) : (
                            <span className="text-[#8DA0B0] text-[11px]">Not Logged In</span>
                          )}
                        </td>

                        {/* Channel 2: IVR */}
                        <td className="p-3">
                          {r.ivr_reached ? (
                            <span className="inline-flex items-center gap-1 text-[#4EB8E0] font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                            </span>
                          ) : (
                            <span className="text-[#8DA0B0] text-[11px]">Pending Call</span>
                          )}
                        </td>

                        {/* Channel 3: SMS */}
                        <td className="p-3">
                          {r.sms_reached ? (
                            <span className="inline-flex items-center gap-1 text-[#DDA43C] font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                            </span>
                          ) : (
                            <span className="text-[#8DA0B0] text-[11px]">Not Sent</span>
                          )}
                        </td>

                        {/* Multi-Channel Status Badge */}
                        <td className="p-3">
                          {r.reach_badge === 'app_login' && (
                            <span className="px-2 py-0.5 rounded bg-[#3FA88A]/20 text-[#3FA88A] border border-[#3FA88A]/40 text-[10px] font-bold">
                              App Logged In
                            </span>
                          )}
                          {r.reach_badge === 'ivr_call' && (
                            <span className="px-2 py-0.5 rounded bg-[#4EB8E0]/20 text-[#4EB8E0] border border-[#4EB8E0]/40 text-[10px] font-bold">
                              IVR Confirmed
                            </span>
                          )}
                          {r.reach_badge === 'sms' && (
                            <span className="px-2 py-0.5 rounded bg-[#DDA43C]/20 text-[#DDA43C] border border-[#DDA43C]/40 text-[10px] font-bold">
                              SMS Sent
                            </span>
                          )}
                          {r.reach_badge === 'unreached' && (
                            <span className="px-2 py-0.5 rounded bg-[#E85D4A] text-white text-[10px] font-bold shadow-sm">
                              Unreached
                            </span>
                          )}
                          {r.reach_badge === 'not_in_outreach' && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium flex items-center gap-1">
                              <Info className="w-3 h-3 text-[#4EB8E0]" />
                              Screened — Low Risk (Not in Outreach Queue)
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleTriggerFallback(r.child_id, 'ivr')}
                              title="Trigger Automated IVR Phone Call"
                              className="px-2.5 py-1 rounded bg-[#132030] hover:bg-[#2C7FB8]/30 border border-white/20 text-[#4EB8E0] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <PhoneCall className="w-3 h-3" /> IVR
                            </button>

                            <button
                              onClick={() => handleTriggerFallback(r.child_id, 'sms')}
                              title="Trigger Instant SMS Broadcast"
                              className="px-2.5 py-1 rounded bg-[#132030] hover:bg-[#DDA43C]/30 border border-white/20 text-[#DDA43C] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" /> SMS
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
