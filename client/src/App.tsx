import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Onboarding } from './components/Onboarding';
import { PairingModal } from './components/PairingModal';
import { SwipeDeck } from './components/SwipeDeck';
import { MatchesView, SharedMatchItem } from './components/MatchesView';
import { DaresView, ChallengeItem } from './components/DaresView';
import { AICoachView } from './components/AICoachView';

import {
  registerDevice,
  createCouple,
  joinCouple,
  fetchQuestions,
  submitAnswer,
  fetchMatches,
  fetchDares,
  createDare,
  CatalogQuestion
} from './services/api';
import { getOrCreateDeviceId, getOrCreatePublicKey, computeAnswerHash, encryptPayload } from './services/crypto';
import { Language } from './services/i18n';
import { supabase } from './services/supabase';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('onboarding');
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);

  // i18n Language State
  const [lang, setLang] = useState<Language>('en');

  // User Profile state
  const [userProfile, setUserProfile] = useState<{
    alias: string;
    role: string;
    categories: string[];
    intensity: string;
  } | null>(null);

  // User & Couple & Google Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [coupleSalt, setCoupleSalt] = useState<string>('Salt_Default123');
  const [isPartnerConnected, setIsPartnerConnected] = useState(false);

  // Data state
  const [questions, setQuestions] = useState<CatalogQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedIntensity, setSelectedIntensity] = useState('ALL');
  const [matches, setMatches] = useState<SharedMatchItem[]>([]);
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);

  // 1. Initialize User Registration, Google Session, Saved Profile & Deep Link check
  useEffect(() => {
    async function init() {
      try {
        const savedLang = localStorage.getItem('mykink_lang') as Language;
        if (savedLang) {
          setLang(savedLang);
          document.documentElement.dir = savedLang === 'he' ? 'rtl' : 'ltr';
          document.documentElement.lang = savedLang;
        }

        const savedProf = localStorage.getItem('mykink_user_profile');
        if (savedProf) {
          const parsed = JSON.parse(savedProf);
          setUserProfile(parsed);
          setActiveTab('swipe');
        }

        const deviceId = getOrCreateDeviceId();
        const pubKey = getOrCreatePublicKey();
        const res = await registerDevice(deviceId, pubKey);

        if (res.success && res.user) {
          setUserId(res.user.id);
          if (res.googleUser) setGoogleUser(res.googleUser);

          if (res.user.coupleId) {
            setCoupleId(res.user.coupleId);
            setIsPartnerConnected(true);
          }
        }

        // Deep link ?pair=ABC123 auto pairing check
        const urlParams = new URLSearchParams(window.location.search);
        const urlPair = urlParams.get('pair');
        if (urlPair && res.user?.id) {
          handleJoinCouple(urlPair);
        }
      } catch (e) {
        console.error('Init error:', e);
      }
    }
    init();

    // Listen for Supabase OAuth Callback events (Google Auth)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setGoogleUser(session.user);
        const deviceId = getOrCreateDeviceId();
        const pubKey = getOrCreatePublicKey();
        const res = await registerDevice(deviceId, pubKey);

        if (res.user) {
          setUserId(res.user.id);
          if (res.user.coupleId) {
            setCoupleId(res.user.coupleId);
            setIsPartnerConnected(true);
          }
        }

        // Clear access token hash cleanly from address bar
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Language Toggle Handler
  const handleToggleLang = () => {
    const nextLang: Language = lang === 'en' ? 'he' : 'en';
    setLang(nextLang);
    localStorage.setItem('mykink_lang', nextLang);
    document.documentElement.dir = nextLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  // Sign Out & Reset Profile Handler
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    localStorage.removeItem('mykink_user_profile');
    localStorage.removeItem('mykink_device_id');
    localStorage.removeItem('mykink_public_key');
    setUserProfile(null);
    setGoogleUser(null);
    setUserId(null);
    setCoupleId(null);
    setPairCode(null);
    setIsPartnerConnected(false);
    setActiveTab('onboarding');
  };

  // 2. Load Questions catalog
  useEffect(() => {
    async function loadQ() {
      try {
        const res = await fetchQuestions(selectedCategory, selectedIntensity);
        if (res.success) {
          setQuestions(res.questions);
        }
      } catch (e) {
        console.error('Questions load error:', e);
      }
    }
    loadQ();
  }, [selectedCategory, selectedIntensity]);

  // 3. Load Matches & Dares when coupled
  useEffect(() => {
    if (coupleId) {
      reloadMatches();
      reloadChallenges();
    }
  }, [coupleId]);

  const reloadMatches = async () => {
    if (!coupleId) return;
    try {
      const res = await fetchMatches(coupleId);
      if (res.success) {
        setMatches(res.matches);
        if (res.matches.length > 0) setIsPartnerConnected(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const reloadChallenges = async () => {
    if (!coupleId) return;
    try {
      const res = await fetchDares(coupleId);
      if (res.success) {
        setChallenges(res.challenges);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handlers for Pairing
  const handleCreateCouple = async () => {
    if (!userId) return;
    try {
      const res = await createCouple(userId);
      if (res.success && res.couple) {
        setCoupleId(res.couple.id);
        setPairCode(res.couple.pairCode);
        setCoupleSalt(res.couple.coupleSalt || 'Salt_Default123');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinCouple = async (code: string) => {
    if (!userId) return;
    try {
      const res = await joinCouple(userId, code);
      if (res.success && res.couple) {
        setCoupleId(res.couple.id);
        setPairCode(res.couple.pairCode);
        setCoupleSalt(res.couple.coupleSalt || 'Salt_Default123');
        setIsPairingModalOpen(false);
        setIsPartnerConnected(true);
      } else {
        alert(res.error || 'Pair code not found');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteOnboarding = (profile: {
    alias: string;
    role: string;
    categories: string[];
    intensity: string;
  }) => {
    setUserProfile(profile);
    localStorage.setItem('mykink_user_profile', JSON.stringify(profile));
    setActiveTab('swipe');
  };

  // Handler for Swiping Card Answer
  const handleAnswer = async (questionId: string, value: 'YES' | 'MAYBE' | 'NO') => {
    if (!userId) return;
    const answerHash = await computeAnswerHash(questionId, value, coupleSalt);
    const encryptedVal = encryptPayload(value);

    await submitAnswer(userId, questionId, encryptedVal, answerHash, value);
    if (coupleId) reloadMatches();
  };

  // Handler for Creating Dare
  const handleCreateDare = async (title: string, description: string, hours: number) => {
    if (!coupleId) return;
    await createDare(coupleId, title, description, hours);
    reloadChallenges();
  };

  return (
    <div className="min-h-screen pb-36 md:pb-16 bg-[#141218] text-[#e7e0e9]">
      {/* Hide Header and Bottom Nav entirely during Onboarding so there is ZERO background clutter */}
      {activeTab !== 'onboarding' && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pairCode={pairCode}
          openPairingModal={() => setIsPairingModalOpen(true)}
          isPartnerConnected={isPartnerConnected}
          userAlias={userProfile?.alias}
          lang={lang}
          onToggleLang={handleToggleLang}
          onSignOut={handleSignOut}
        />
      )}

      {/* Main Tab Views */}
      <main className={activeTab === 'onboarding' ? '' : 'mt-2 md:mt-6 pb-32'}>
        {activeTab === 'onboarding' && (
          <Onboarding
            pairCode={pairCode}
            onCreateCouple={handleCreateCouple}
            onJoinCouple={handleJoinCouple}
            onCompleteOnboarding={handleCompleteOnboarding}
            lang={lang}
            googleUser={googleUser}
          />
        )}

        {activeTab === 'swipe' && (
          <SwipeDeck
            questions={questions}
            onAnswer={handleAnswer}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedIntensity={selectedIntensity}
            setSelectedIntensity={setSelectedIntensity}
            onGoToMatches={() => setActiveTab('matches')}
            lang={lang}
          />
        )}

        {activeTab === 'matches' && <MatchesView matches={matches} lang={lang} />}

        {activeTab === 'dares' && (
          <DaresView challenges={challenges} onCreateDare={handleCreateDare} lang={lang} />
        )}

        {activeTab === 'ai' && <AICoachView coupleId={coupleId} lang={lang} />}
      </main>

      {/* Pairing Modal */}
      <PairingModal
        isOpen={isPairingModalOpen}
        onClose={() => setIsPairingModalOpen(false)}
        pairCode={pairCode}
        onCreateCouple={handleCreateCouple}
        onJoinCouple={handleJoinCouple}
      />
    </div>
  );
};
