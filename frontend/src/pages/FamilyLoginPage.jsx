import { getApiUrl } from '../config/apiConfig';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Lock, Phone, ShieldAlert, ArrowRight, HelpCircle, X, CheckCircle2, Globe } from 'lucide-react';

export default function FamilyLoginPage() {
  const navigate = useNavigate();
  
  // Multilingual state (en, hi, kh)
  const [lang, setLang] = useState(localStorage.getItem('family_language') || 'en');
  const [phoneNumber, setPhoneNumber] = useState(() => localStorage.getItem('auto_family_phone') || '9876543210');
  const [pin, setPin] = useState(() => localStorage.getItem('auto_family_pin') || '1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('family_language', newLang);
  };

  const i18n = {
    en: {
      title: "Parent & Family Portal",
      subtitle: "Check on your child's screening results, plain-language guidance, and next steps.",
      phoneLabel: "Registered Phone Number",
      pinLabel: "4-Digit Access PIN",
      forgotPin: "Forgot your PIN?",
      buttonText: "Access Child Health Journey",
      verifying: "Verifying PIN...",
      staffLink: "Are you a health worker or administrator? Staff sign-in here →",
      demoTitle: "Demo Parent Credentials:"
    },
    hi: {
      title: "अभिभावक एवं परिवार पोर्टल",
      subtitle: "अपने बच्चे की जांच के परिणाम, सरल भाषा मार्गदर्शन और आगे के कदम देखें।",
      phoneLabel: "पंजीकृत फोन नंबर",
      pinLabel: "4-अंकों का एक्सेस पिन",
      forgotPin: "पिन भूल गए?",
      buttonText: "बाल स्वास्थ्य यात्रा देखें",
      verifying: "पिन सत्यापित हो रहा है...",
      staffLink: "क्या आप स्वास्थ्य कार्यकर्ता हैं? कर्मचारी यहाँ लॉगिन करें →",
      demoTitle: "डेमो अभिभावक क्रेडेंशियल:"
    },
    kh: {
      title: "Portal baroh ki Kmie ki Kpa",
      subtitle: "Peit ia ki jingthoh jingkoit bad ki lynti na ka bynta i khun jong phi.",
      phoneLabel: "Numero Phone ba la thoh",
      pinLabel: "4-Digit PIN Akses",
      forgotPin: "Klet ia ka PIN?",
      buttonText: "Peit ia ka Jingleit Jingkoit",
      verifying: "Mynjur ia ka PIN...",
      staffLink: "Phi dei i nongtrei jingkoit? Staff rung hangne →",
      demoTitle: "Demo Kmie Kpa Credentials:"
    }
  };

  const t = i18n[lang] || i18n.en;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(getApiUrl('/api/family/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, pin })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid login details');
      }

      localStorage.setItem('guardian_token', data.token);
      localStorage.setItem('guardian_child_id', data.child_id);
      localStorage.setItem('family_language', lang);
      navigate(`/family/journey/${data.child_id}`);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0E13] text-[#E6EBF0] font-sans">
      {/* Animated Looping Background ECG Waveform Trace */}
      <div className="absolute inset-0 pointer-events-none opacity-15 flex items-center justify-center">
        <svg className="w-full h-64 stroke-[#E85D4A] fill-none stroke-2" viewBox="0 0 1200 150">
          <path
            className="ecg-path"
            d="M0,75 L200,75 L220,75 L230,30 L240,120 L250,10 L265,140 L280,75 L300,75 L500,75 L520,75 L530,30 L540,120 L550,10 L565,140 L580,75 L600,75 L800,75 L820,75 L830,30 L840,120 L850,10 L865,140 L880,75 L900,75 L1200,75"
          />
        </svg>
      </div>

      {/* Background Ambient Glows */}
      <div className="absolute w-96 h-96 rounded-full bg-[#2C7FB8]/20 blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 rounded-full bg-[#1A4A66]/30 blur-3xl pointer-events-none -bottom-20 -right-20" />

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-lg glass-card-primary p-8 space-y-6 border-[#4EB8E0]/30 shadow-2xl relative z-10 backdrop-blur-xl">
        
        {/* Multilingual Selector Bar */}
        <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 max-w-xs mx-auto">
          <Globe className="w-3.5 h-3.5 text-[#4EB8E0] shrink-0 ml-2" />
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-[#2C7FB8] text-white shadow border border-[#4EB8E0]/40' : 'text-[#8DA0B0] hover:text-white'}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('hi')}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'hi' ? 'bg-[#2C7FB8] text-white shadow border border-[#4EB8E0]/40' : 'text-[#8DA0B0] hover:text-white'}`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('kh')}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'kh' ? 'bg-[#2C7FB8] text-white shadow border border-[#4EB8E0]/40' : 'text-[#8DA0B0] hover:text-white'}`}
          >
            Khasi
          </button>
        </div>

        {/* Brand Header Navigation Link */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-[#E85D4A]/50 flex items-center justify-center text-[#E85D4A] mx-auto shadow-lg shadow-black/60 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-serif group-hover:text-[#4EB8E0] transition-colors mt-2">
              {t.title}
            </h1>
          </Link>
          <p className="text-xs text-[#8DA0B0] leading-relaxed max-w-sm mx-auto font-sans">
            {t.subtitle}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#E85D4A]/10 border border-[#E85D4A]/50 text-xs text-[#E85D4A] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#E85D4A]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#E6EBF0] block">{t.phoneLabel}</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#4EB8E0] absolute left-4 top-3.5 pointer-events-none z-10" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full glass-input glass-input-with-icon text-sm focus:ring-2 focus:ring-[#4EB8E0]/50 focus:border-[#4EB8E0]"
                style={{ paddingLeft: '3.25rem' }}
                placeholder="e.g. 9876543210"
                required
              />
            </div>
          </div>

          {/* PIN Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#E6EBF0] block">{t.pinLabel}</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-[#8DA0B0] hover:text-white underline font-sans"
              >
                {t.forgotPin}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4EB8E0] absolute left-4 top-3.5 pointer-events-none z-10" />
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full glass-input glass-input-with-icon text-sm tracking-widest font-mono focus:ring-2 focus:ring-[#4EB8E0]/50 focus:border-[#4EB8E0]"
                style={{ paddingLeft: '3.25rem' }}
                placeholder="••••"
                required
              />
            </div>
          </div>

          {/* Vibrant Reassuring Primary Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glass-button justify-center py-3 text-sm font-bold bg-[#2C7FB8] hover:bg-[#2C7FB8]/80 border-[#4EB8E0]/50 text-white shadow-xl shadow-black/60"
          >
            {loading ? t.verifying : t.buttonText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Styled Glass Pill */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center text-xs text-[#8DA0B0] space-y-1">
          <p className="font-bold text-[#E6EBF0]">{t.demoTitle}</p>
          <p className="font-mono text-[11px] text-[#4EB8E0]">Phone: <span className="text-white font-bold">9876543210</span> | PIN: <span className="text-white font-bold">1234</span></p>
        </div>

        {/* Staff Cross-Navigation Link */}
        <div className="pt-2 border-t border-white/10 text-center">
          <Link
            to="/login"
            className="text-xs text-[#8DA0B0] hover:text-white underline transition-colors inline-flex items-center gap-1 font-medium"
          >
            {t.staffLink}
          </Link>
        </div>
      </div>

      {/* Real-World PIN Recovery Guidance Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card-primary p-6 max-w-md space-y-4 border-[#4EB8E0]/50 relative shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-[#8DA0B0] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <HelpCircle className="w-6 h-6 text-[#DDA43C] shrink-0" />
              <h3 className="font-bold text-base text-white">How to Recover Your Access PIN</h3>
            </div>

            <p className="text-xs text-[#E6EBF0]/90 leading-relaxed font-sans">
              Your 4-digit referral PIN was printed directly on your child's physical referral slip handed to you during the school screening camp.
            </p>

            <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-sans text-[#E6EBF0] space-y-1">
              <p className="font-bold text-[#DDA43C]">If you have misplaced your slip:</p>
              <p className="text-[#8DA0B0]">
                Please contact your local village ASHA worker or screening camp administrator. They can re-issue your child's access PIN after verifying your linked phone number.
              </p>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full glass-button justify-center py-2.5 text-xs font-bold"
            >
              Understand & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
