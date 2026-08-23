import { getApiUrl } from '../config/apiConfig';
import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import { 
  MapPin, Navigation, CheckCircle2, Clock, Calendar, Compass, 
  AlertTriangle, ArrowRight, CheckSquare, Square, Car, ShieldAlert, 
  Sparkles, Layers, Info, UserCheck, HeartPulse
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_TILE_CONFIG } from '../config/mapTiles';

// Helper component to auto-recenter and fit map bounds to route stops with Sanity Checks
function MapBoundsFitter({ baseLocation, stops }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    try {
      const bounds = L.latLngBounds([]);
      // Sanity boundary check for East Khasi Hills, Meghalaya: lat [24.5, 26.5], lng [90.5, 93.5]
      const isSanelyLocated = (lat, lng) => lat >= 24.5 && lat <= 26.5 && lng >= 90.5 && lng <= 93.5;

      if (baseLocation && isSanelyLocated(baseLocation.latitude, baseLocation.longitude)) {
        bounds.extend([baseLocation.latitude, baseLocation.longitude]);
      } else if (baseLocation) {
        console.warn('Base HQ location failed bounds sanity check:', baseLocation);
      }

      stops.forEach((s) => {
        if (s.latitude && s.longitude && isSanelyLocated(s.latitude, s.longitude)) {
          bounds.extend([s.latitude, s.longitude]);
        } else {
          console.warn('Stop failed bounds sanity check:', s);
        }
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      } else {
        // Fallback centroid for East Khasi Hills, Meghalaya
        map.setView([25.4000, 91.7500], 11);
      }
    } catch (e) {
      console.warn('Map bounds fit error:', e);
    }
  }, [map, baseLocation, stops]);
  return null;
}

// Helper component to trigger invalidateSize and prevent blank canvas gray boxes
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Custom Leaflet DivIcon Creators
const createBaseIcon = () => {
  return L.divIcon({
    className: 'custom-base-marker',
    html: `
      <div style="
        width: 34px;
        height: 34px;
        background: #0A0E13;
        border: 3px solid #E85D4A;
        border-radius: 50%;
        box-shadow: 0 0 16px rgba(232, 93, 74, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #E85D4A;
        font-weight: bold;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

const createStopIcon = (visitOrder, isVisited) => {
  const bgColor = isVisited ? '#3FA88A' : '#2C7FB8';
  const borderColor = isVisited ? '#6EE7B7' : '#4EB8E0';
  const shadowColor = isVisited ? 'rgba(63, 168, 138, 0.9)' : 'rgba(78, 184, 224, 0.9)';
  const content = isVisited ? `✓` : `#${visitOrder}`;

  return L.divIcon({
    className: 'custom-stop-marker',
    html: `
      <div style="
        width: 34px;
        height: 34px;
        background: ${bgColor};
        border: 3px solid ${borderColor};
        border-radius: 50%;
        box-shadow: 0 0 16px ${shadowColor};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 800;
        font-size: 14px;
        font-family: monospace;
        transition: all 0.3s ease;
      ">
        ${content}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

import StudentSearchBar from '../components/StudentSearchBar';

export default function AshaRoutePage() {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStop, setExpandedStop] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRoute = async () => {
    try {
      const res = await fetch(getApiUrl('/api/asha/route-today'));
      if (res.ok) {
        const data = await res.json();
        setRouteData(data);
      }
    } catch (e) {
      console.error('Failed to fetch ASHA route:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const handleToggleVisited = async (stopId, currentVisited) => {
    setRouteData((prev) => {
      if (!prev) return prev;
      const updatedStops = prev.route_stops.map((s) => 
        s.id === stopId ? { ...s, visited: !currentVisited } : s
      );
      return { ...prev, route_stops: updatedStops };
    });

    try {
      await fetch(getApiUrl('/api/asha/toggle-stop-visited'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stop_id: stopId, visited: !currentVisited })
      });
    } catch (e) {
      console.error('Failed to toggle visited state:', e);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-96 text-[#E6EBF0]">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 animate-spin text-[#4EB8E0]" />
            <span className="font-semibold text-sm">Computing TSP Optimal Daily Route & Priority Ranks...</span>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const base = routeData?.base_location || {
    name: 'Sohra Community Health Centre (ASHA Base HQ)',
    latitude: 25.3350,
    longitude: 91.7850
  };

  const stops = routeData?.route_stops || [];
  const summary = routeData?.summary || {
    total_stops: stops.length,
    total_distance_km: 48.6,
    total_time_mins: 95,
    total_priority_rechecks: 9
  };

  // Build Polyline Segments
  const baseCoord = [base.latitude, base.longitude];
  const completedWaypoints = [baseCoord];
  const remainingWaypoints = [];

  let foundFirstUnvisited = false;
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    const coord = [s.latitude, s.longitude];
    if (s.visited && !foundFirstUnvisited) {
      completedWaypoints.push(coord);
    } else {
      if (!foundFirstUnvisited) {
        if (completedWaypoints.length > 0) {
          remainingWaypoints.push(completedWaypoints[completedWaypoints.length - 1]);
        }
        foundFirstUnvisited = true;
      }
      remainingWaypoints.push(coord);
    }
  }

  const completedCount = stops.filter(s => s.visited).length;
  const progressPct = stops.length > 0 ? Math.round((completedCount / stops.length) * 100) : 0;

  return (
    <DashboardShell>
      {/* Crisp Topographic Vector Background Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.08] bg-cover bg-center z-0"
        style={{ backgroundImage: `url('/camp_route_bg.png')` }}
      />

      <div className="relative z-10 space-y-6">
        {/* Header Title Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4EB8E0] uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#4EB8E0]" />
              <span>ASHA Worker Field Navigation • {routeData?.district_name || 'East Khasi Hills'}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1 font-serif">
              Smart Daily Camp Route & Priority Recheck Plan
            </h1>
            <p className="text-xs text-[#8DA0B0]">
              Traveling Salesperson (TSP) route optimization with Whittle-index priority-weighted recheck ranking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-[#132030] border border-white/10 flex items-center gap-2 text-xs text-[#8DA0B0]">
              <UserCheck className="w-4 h-4 text-[#3FA88A]" />
              <span>Assigned: <strong className="text-white font-semibold">{routeData?.asha_worker || 'Kavita Devi'}</strong></span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#1A4A66]/60 border border-[#4EB8E0]/40 flex items-center gap-2 text-xs font-bold text-[#4EB8E0]">
              <Sparkles className="w-4 h-4 text-[#DDA43C] animate-pulse" />
              <span>TSP Optimization Active</span>
            </div>
          </div>
        </div>

        {/* Top Summary Stat Strip (4 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 space-y-1 text-center border-white/10">
            <span className="text-[10px] text-[#8DA0B0] uppercase tracking-wider font-bold block">Total Camp Stops</span>
            <span className="text-2xl font-black text-white font-mono">{summary.total_stops} Camps</span>
            <span className="text-[10px] font-semibold text-[#3FA88A] block">{completedCount} of {summary.total_stops} Completed ({progressPct}%)</span>
          </div>

          <div className="glass-card p-4 space-y-1 text-center border-white/10">
            <span className="text-[10px] text-[#8DA0B0] uppercase tracking-wider font-bold block">Est. Route Distance</span>
            <span className="text-2xl font-black text-[#4EB8E0] font-mono">{summary.total_distance_km} km</span>
            <span className="text-[10px] text-[#8DA0B0] block">Calculated Loop Detour</span>
          </div>

          <div className="glass-card p-4 space-y-1 text-center border-white/10">
            <span className="text-[10px] text-[#8DA0B0] uppercase tracking-wider font-bold block">Est. Driving Time</span>
            <span className="text-2xl font-black text-[#DDA43C] font-mono">{Math.floor(summary.total_time_mins / 60)}h {summary.total_time_mins % 60}m</span>
            <span className="text-[10px] text-[#8DA0B0] block">Across Full 3-Stop Loop</span>
          </div>

          <div className="glass-card p-4 space-y-1 text-center border-white/10">
            <span className="text-[10px] text-[#8DA0B0] uppercase tracking-wider font-bold block">Priority Child Rechecks</span>
            <span className="text-2xl font-black text-[#E85D4A] font-mono">{summary.total_priority_rechecks} Children</span>
            <span className="text-[10px] text-[#8DA0B0] block">High & Moderate Priority</span>
          </div>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Leaflet Interactive Route Map (7 cols) */}
          <div className="lg:col-span-7 glass-card p-4 space-y-3 border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#4EB8E0]" />
                <h3 className="font-bold text-white text-base font-serif">District Route Navigation Map</h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-[#3FA88A] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3FA88A]" /> Completed Path
                </span>
                <span className="inline-flex items-center gap-1 text-[#E85D4A] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E85D4A]" /> Remaining Path
                </span>
              </div>
            </div>

            <div className="relative w-full h-[580px] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <MapContainer 
                center={[base.latitude, base.longitude]} 
                zoom={11} 
                style={{ height: '100%', width: '100%' }}
                className="w-full h-full"
                scrollWheelZoom={false}
              >
                {/* CARTO Voyager English-Only Map Tiles */}
                <TileLayer
                  attribution={MAP_TILE_CONFIG.attribution}
                  url={MAP_TILE_CONFIG.url}
                  maxZoom={MAP_TILE_CONFIG.maxZoom}
                  subdomains={MAP_TILE_CONFIG.subdomains}
                />

                <MapBoundsFitter baseLocation={base} stops={stops} />
                <MapResizeHandler />

                {/* Base HQ Marker */}
                <Marker position={baseCoord} icon={createBaseIcon()} zIndexOffset={500}>
                  <Popup>
                    <div className="p-1 space-y-1 font-sans text-[#14181D]">
                      <strong className="block text-xs font-bold text-[#E85D4A]">{base.name}</strong>
                      <span className="text-[11px] text-slate-700 block">ASHA Sector #4 Dispatch Headquarters</span>
                    </div>
                  </Popup>
                </Marker>

                {/* Numbered Stop Markers (#1, #2, #3...) */}
                {stops.map((stop) => (
                  <Marker 
                    key={stop.id} 
                    position={[stop.latitude, stop.longitude]} 
                    icon={createStopIcon(stop.visit_order, stop.visited)}
                    zIndexOffset={1000}
                  >
                    <Popup>
                      <div className="p-1 space-y-1 font-sans text-[#14181D]">
                        <span className="text-[10px] font-bold text-[#E85D4A] block uppercase">Stop #{stop.visit_order}</span>
                        <strong className="block text-xs font-bold text-[#0A0E13]">{stop.name}</strong>
                        <span className="text-[11px] text-slate-700 block font-medium">
                          {stop.priority_rechecks_count} Priority Rechecks ({stop.travel_distance_km} km away)
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Completed Polyline (Teal) */}
                {completedWaypoints.length > 1 && (
                  <Polyline 
                    positions={completedWaypoints} 
                    pathOptions={{ color: '#3FA88A', weight: 5, opacity: 0.9 }} 
                  />
                )}

                {/* Remaining Polyline (Coral Dashed) */}
                {remainingWaypoints.length > 1 && (
                  <Polyline 
                    positions={remainingWaypoints} 
                    pathOptions={{ color: '#E85D4A', weight: 4, dashArray: '8, 8', opacity: 0.9 }} 
                  />
                )}
              </MapContainer>

              {/* Explicit Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 bg-[#0A0E13]/90 backdrop-blur-md border border-white/20 p-2.5 rounded-xl text-xs space-y-1.5 z-[1000] text-[#E6EBF0]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8DA0B0] block border-b border-white/10 pb-1">Map Legend</span>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-[#E85D4A] flex items-center justify-center text-[9px] text-[#E85D4A] font-bold">🏠</span>
                  <span className="text-[11px]">ASHA Worker Base HQ (Sohra CHC)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2C7FB8] border border-[#4EB8E0] flex items-center justify-center text-[9px] text-white font-bold">#</span>
                  <span className="text-[11px]">Pending Camp Stop (#1, #2, #3)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#3FA88A] border border-[#6EE7B7] flex items-center justify-center text-[9px] text-white font-bold">✓</span>
                  <span className="text-[11px]">Visited Camp Stop</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Sequential Stop Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2 font-serif">
                <Layers className="w-5 h-5 text-[#4EB8E0]" />
                Optimized Visit Sequence ({stops.length} Stops)
              </h3>
              <span className="text-xs text-[#8DA0B0] font-mono font-semibold">
                {completedCount}/{stops.length} Completed
              </span>
            </div>

            {/* Student Search Bar (Addendum 50) */}
            <StudentSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search student rechecks by name or code…"
              totalCount={stops.reduce((acc, s) => acc + (s.recheck_children?.length || 0), 0)}
              filteredCount={stops.reduce((acc, s) => acc + (s.recheck_children?.filter(c => 
                !searchTerm.trim() || 
                (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase()))
              ).length || 0), 0)}
            />

            <div className="space-y-4">
              {stops.map((stop) => {
                const isVisited = stop.visited;
                const isExpanded = expandedStop === stop.id;

                return (
                  <div 
                    key={stop.id}
                    className={`transition-all duration-300 rounded-2xl p-5 border ${
                      isVisited 
                        ? 'bg-[#3FA88A]/10 border-[#3FA88A]/30 text-[#E6EBF0]' 
                        : 'glass-card border-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Numbered Badge */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 font-mono shadow-md ${
                          isVisited 
                            ? 'bg-[#3FA88A] text-white border border-[#6EE7B7]' 
                            : 'bg-[#2C7FB8] text-white border border-[#4EB8E0]'
                        }`}>
                          {isVisited ? <CheckCircle2 className="w-6 h-6" /> : `#${stop.visit_order}`}
                        </div>

                        <div className="space-y-1">
                          <h4 className={`font-bold text-base ${isVisited ? 'line-through text-[#3FA88A]' : 'text-white'}`}>
                            {stop.name}
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#8DA0B0] font-mono">
                            <span className="flex items-center gap-1">
                              <Car className="w-3.5 h-3.5 text-[#4EB8E0]" />
                              {stop.travel_distance_km} km • {stop.travel_time_mins} mins
                            </span>
                            <span className="flex items-center gap-1 text-[#DDA43C] font-semibold">
                              <ShieldAlert className="w-3.5 h-3.5 text-[#DDA43C]" />
                              {stop.priority_rechecks_count} Rechecks
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Mark as Visited Button */}
                      <button
                        onClick={() => handleToggleVisited(stop.id, isVisited)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
                          isVisited 
                            ? 'bg-[#3FA88A]/30 text-[#3FA88A] border border-[#3FA88A]/40 hover:bg-[#3FA88A]/50' 
                            : 'glass-button text-white hover:bg-[#2C7FB8]'
                        }`}
                      >
                        {isVisited ? (
                          <>
                            <CheckSquare className="w-4 h-4 text-[#3FA88A]" />
                            <span>Visited</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-4 h-4 text-[#8DA0B0]" />
                            <span>Mark Visited</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Rank Rationale Line */}
                    <div className="mt-3 pt-3 border-t border-white/10 text-xs text-[#E6EBF0] flex items-start gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#DDA43C] shrink-0 mt-0.5" />
                      <span className="italic leading-relaxed">{stop.rank_rationale}</span>
                    </div>

                    {/* Expandable Priority Children Recheck Panel */}
                    <div className="mt-3">
                      <button 
                        onClick={() => setExpandedStop(isExpanded ? null : stop.id)}
                        className="text-xs font-semibold text-[#4EB8E0] hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide' : 'Show'} Children Needing Recheck ({stop.recheck_children?.length || 0})</span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      {(isExpanded || true) && stop.recheck_children && (
                        <div className="mt-3 space-y-2">
                          {stop.recheck_children.map((child, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-white block">
                                  {child.name} <span className="font-mono text-[#4EB8E0] font-semibold">({child.code})</span>
                                </span>
                                <span className="text-[10px] text-[#8DA0B0] block">{child.reason}</span>
                              </div>

                              <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase border ${
                                child.tier === 'high' ? 'bg-[#E85D4A] text-white border-[#E85D4A]' :
                                child.tier === 'moderate' ? 'bg-[#DDA43C] text-[#14181D] border-[#DDA43C] shadow-sm' :
                                child.tier === 'priority_uncertain' ? 'bg-[#DDA43C] text-[#14181D] border-[#DDA43C] shadow-sm' :
                                'bg-[#3FA88A]/20 text-[#3FA88A] border-[#3FA88A]/40'
                              }`}>
                                {child.tier.replace('_', ' ')} • {child.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </DashboardShell>
  );
}
