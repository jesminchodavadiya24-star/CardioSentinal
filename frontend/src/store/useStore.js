import { getApiUrl } from '../config/apiConfig';
import { create } from 'zustand';

export const useStore = create((set, get) => ({
  user: {
    id: 'user-01',
    full_name: 'ASHA Worker Kavita Devi',
    email: 'asha@cardiosentinel.org',
    role: 'asha_worker',
    district_id: 'dist-meghalaya-01',
    has_acknowledged_disclaimer: true
  },
  isAuthenticated: true,
  selectedDistrict: 'dist-meghalaya-01',
  activeRole: 'asha_worker',
  
  // Disclaimer acknowledgment state
  hasAcknowledgedDisclaimer: true,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    activeRole: user?.role || 'asha_worker',
    hasAcknowledgedDisclaimer: user?.has_acknowledged_disclaimer ?? true
  }),
  
  setSelectedDistrict: (districtId) => set({ selectedDistrict: districtId }),
  
  acknowledgeDisclaimer: async () => {
    const user = get().user;
    if (user?.id) {
      try {
        await fetch(getApiUrl('/api/users/acknowledge-disclaimer'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id })
        });
      } catch (e) {
        console.error('Failed to persist disclaimer acknowledgment:', e);
      }
    }
    set((state) => ({
      user: state.user ? { ...state.user, has_acknowledged_disclaimer: true } : null,
      hasAcknowledgedDisclaimer: true
    }));
  },

  logout: () => set({
    user: null,
    isAuthenticated: false,
    hasAcknowledgedDisclaimer: false
  })
}));
