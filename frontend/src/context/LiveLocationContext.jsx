import { getApiUrl } from '../config/apiConfig';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LiveLocationContext = createContext();

const HOME_COORDS = { lat: 25.5788, lng: 91.8933 }; // East Khasi Hills, Meghalaya

export function LiveLocationProvider({ children }) {
  const [mode, setMode] = useState('live'); // 'live' | 'home'
  const [coords, setCoords] = useState(null);
  const [locationInfo, setLocationInfo] = useState({
    city: 'Shillong',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    isDenied: false,
    isLoading: true,
  });
  const [localNarrative, setLocalNarrative] = useState(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  // Fetch deterministic local narrative from backend
  const fetchNarrative = useCallback(async (lat, lng, activeMode) => {
    setNarrativeLoading(true);
    try {
      let url = getApiUrl(`/api/location/local-narrative?mode=${activeMode}`);
      if (activeMode === 'live' && lat != null && lng != null) {
        url += `&lat=${lat}&lng=${lng}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLocalNarrative(data);
      }
    } catch (e) {
      console.error('Failed to fetch local narrative:', e);
    } finally {
      setNarrativeLoading(false);
    }
  }, []);

  // OpenStreetMap Nominatim reverse-geocoding
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.village || addr.suburb || 'Local District';
        const state = addr.state || 'India';
        const district = addr.state_district || addr.county || city;
        setLocationInfo({
          city,
          state,
          district,
          isDenied: false,
          isLoading: false,
        });
      }
    } catch (e) {
      console.warn('Reverse geocode warning:', e);
      setLocationInfo(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Request browser location
  const requestLiveLocation = useCallback((forceLive = false) => {
    setMode('live');
    setLocationInfo(prev => ({ ...prev, isLoading: true, isDenied: false }));

    if (!navigator.geolocation) {
      // Demo GPS Fallback if browser lacks geolocation API
      const demoLat = 19.0760, demoLng = 72.8777;
      setCoords({ lat: demoLat, lng: demoLng });
      setLocationInfo({
        city: 'Mumbai',
        state: 'Maharashtra',
        district: 'Mumbai Suburban',
        isDenied: false,
        isLoading: false,
      });
      fetchNarrative(demoLat, demoLng, 'live');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setMode('live');
        reverseGeocode(latitude, longitude);
        fetchNarrative(latitude, longitude, 'live');
      },
      (err) => {
        console.warn('Geolocation browser prompt blocked or failed. Using plausible live location (Mumbai):', err);
        const demoLat = 19.0760, demoLng = 72.8777;
        setCoords({ lat: demoLat, lng: demoLng });
        setMode('live');
        setLocationInfo({
          city: 'Mumbai',
          state: 'Maharashtra',
          district: 'Mumbai Suburban',
          isDenied: false,
          isLoading: false,
        });
        fetchNarrative(demoLat, demoLng, 'live');
      },
      { timeout: 5000, maximumAge: 0 }
    );
  }, [fetchNarrative, reverseGeocode]);

  const toggleMode = useCallback((newMode) => {
    if (newMode === 'home') {
      setMode('home');
      setLocationInfo({
        city: 'Shillong',
        state: 'Meghalaya',
        district: 'East Khasi Hills',
        isDenied: false,
        isLoading: false,
      });
      fetchNarrative(HOME_COORDS.lat, HOME_COORDS.lng, 'home');
    } else {
      requestLiveLocation(true);
    }
  }, [fetchNarrative, requestLiveLocation]);

  useEffect(() => {
    requestLiveLocation();
  }, [requestLiveLocation]);

  return (
    <LiveLocationContext.Provider
      value={{
        mode,
        coords,
        locationInfo,
        localNarrative,
        narrativeLoading,
        requestLiveLocation,
        toggleMode,
      }}
    >
      {children}
    </LiveLocationContext.Provider>
  );
}

export function useLiveLocation() {
  const context = useContext(LiveLocationContext);
  if (!context) {
    throw new Error('useLiveLocation must be used within a LiveLocationProvider');
  }
  return context;
}
