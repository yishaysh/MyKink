import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Onboarding } from './components/Onboarding';
import { PairingModal } from './components/PairingModal';
import { ConfirmModal } from './components/ConfirmModal';
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
  updateDareStatus,
  updateUserProfileInDB,
  fetchUserAnswers,
  resetUserAccountInDB,
  CatalogQuestion
} from './services/api';
import { getOrCreateDeviceId, getOrCreatePublicKey, computeAnswerHash, encryptPayload } from './services/crypto';
import { Language } from './services/i18n';
import { supabase } from './services/supabase';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('onboarding');
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

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

  // User Answered Question IDs restored from DB
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);

  // Data state
  const [questions, setQuestions] = useState<CatalogQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedIntensity, setSelectedIntensity] = useState('ALL');
  const [matches, setMatches] = useState<SharedMatchItem[]>([]);
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);

  // Tab navigation handler with persistence
  const changeActiveTab = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('mykink_active_tab', tab);
  };

  // Helper to load user DB state (profile, answers, couple)
  const syncUserDBState = async (userRecord: any, gUserObj?: any) => {
    if (!userRecord) return;
    setUserId(userRecord.id);
    if (gUserObj) setGoogleUser(gUserObj);

    // 1. Fetch user's answered questions from DB
    const ansRes = await fetchUserAnswers(userRecord.id);
    if (ansRes.success && ansRes.answers) {
      setAnsweredQuestionIds(ansRes.answers.map((a: any) => a.questionId));
    }

    // 2. Restore Profile & Active Tab from LocalStorage or DB
    const savedProf = localStorage.getItem('mykink_user_profile');
    const savedTab = localStorage.getItem('mykink_active_tab');

    if (savedProf) {
      const parsed = JSON.parse(savedProf);
      setUserProfile(parsed);
      if (savedTab && savedTab !== 'onboarding') {
        setActiveTab(savedTab);
      } else {
        setActiveTab('swipe');
      }
    } else if (
      userRecord.anonymousAlias &&
      userRecord.anonymousAlias !== 'PENDING' &&
      userRecord.anonymousAlias.trim() !== ''
    ) {
      const restoredProf = {
        alias: userRecord.anonymousAlias,
        role: 'SWITCH',
        categories: ['Sensual', 'BDSM', 'Roleplay', 'Toys', 'ENM'],
        intensity: 'SPICY'
      };
      setUserProfile(restoredProf);
      localStorage.setItem('mykink_user_profile', JSON.stringify(restoredProf));
      if (savedTab && savedTab !== 'onboarding') {
        setActiveTab(savedTab);
      } else {
        setActiveTab('swipe');
      }
    } else {
      setActiveTab('onboarding');
    }

    // 3. Connect Couple if exists
    if (userRecord.coupleId) {
      setCoupleId(userRecord.coupleId);
      setIsPartnerConnected(true);
    }
  };

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

        const deviceId = getOrCreateDeviceId();
        const pubKey = getOrCreatePublicKey();
        const res = await registerDevice(deviceId, pubKey, false);

        if (res.success && res.user) {
          await syncUserDBState(res.user, res.googleUser);
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
        const res = await registerDevice(deviceId, pubKey, true);

        if (res.user) {
          await syncUserDBState(res.user, session.user);
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

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    localStorage.removeItem('mykink_user_profile');
    localStorage.removeItem('mykink_active_tab');
    localStorage.removeItem('mykink_device_id');
    localStorage.removeItem('mykink_public_key');
    setUserProfile(null);
    setGoogleUser(null);
    setUserId(null);
    setCoupleId(null);
    setPairCode(null);
    setIsPartnerConnected(false);
    setAnsweredQuestionIds([]);
    setActiveTab('onboarding');
  };

  // Execute Account Reset & Wiping DB records
  const executeResetAccount = async () => {
    try {
      await resetUserAccountInDB(userId, googleUser?.id);
    } catch (e) {
      console.warn('Delete user data error:', e);
    }
    await handleSignOut();
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

  // Helper to ensure a registered DB user ID exists when user takes action
  const ensureActiveUserId = async (): Promise<string | null> => {
    if (userId) return userId;
    const deviceId = getOrCreateDeviceId();
    const pubKey = getOrCreatePublicKey();
    const res = await registerDevice(deviceId, pubKey, true);
    if (res.user?.id) {
      setUserId(res.user.id);
      return res.user.id;
    }
    return null;
  };

  // Handlers for Pairing
  const handleCreateCouple = async () => {
    const activeId = await ensureActiveUserId();
    if (!activeId) return;
    try {
      const res = await createCouple(activeId);
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
    const activeId = await ensureActiveUserId();
    if (!activeId) return;
    try {
      const res = await joinCouple(activeId, code);
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

  const handleCompleteOnboarding = async (profile: {
    alias: string;
    role: string;
    categories: string[];
    intensity: string;
    gender?: string;
    pronouns?: string;
    goal?: string;
    relationshipDynamic?: string;
    warmupAnswer?: string;
  }) => {
    setUserProfile(profile);
    localStorage.setItem('mykink_user_profile', JSON.stringify(profile));

    const activeId = await ensureActiveUserId();
    if (activeId) {
      await updateUserProfileInDB(activeId, profile.alias);
    }

    changeActiveTab('swipe');
  };

  // Handler for Swiping Card Answer
  const handleAnswer = async (questionId: string, value: 'YES' | 'MAYBE' | 'NO') => {
    if (!userId) return;
    const answerHash = await computeAnswerHash(questionId, value, coupleSalt);
    const encryptedVal = encryptPayload(value);

    await submitAnswer(userId, questionId, encryptedVal, answerHash, value);
    setAnsweredQuestionIds((prev) => [...prev, questionId]);

    if (coupleId) reloadMatches();
  };

  // Handler for Creating Dare
  const handleCreateDare = async (title: string, description: string, hours: number) => {
    if (!coupleId) return;
    await createDare(coupleId, title, description, hours);
    reloadChallenges();
  };

  // Handler for Updating Dare Status (Mark as Completed or Cancelled)
  const handleUpdateDareStatus = async (challengeId: string, status: 'COMPLETED' | 'EXPIRED') => {
    await updateDareStatus(coupleId || 'default', challengeId, status);
    reloadChallenges();
  };

  return (
    <div className="min-h-screen pb-36 md:pb-16 bg-[#141218] text-[#e7e0e9]">
      {/* Hide Header and Bottom Nav entirely during Onboarding so there is ZERO background clutter */}
      {activeTab !== 'onboarding' && (
        <Header
          activeTab={activeTab}
          setActiveTab={changeActiveTab}
          pairCode={pairCode}
          openPairingModal={() => setIsPairingModalOpen(true)}
          isPartnerConnected={isPartnerConnected}
          userAlias={userProfile?.alias}
          lang={lang}
          onToggleLang={handleToggleLang}
          onSignOut={handleSignOut}
          onResetAccount={() => setIsResetModalOpen(true)}
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
            answeredQuestionIds={answeredQuestionIds}
            onAnswer={handleAnswer}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedIntensity={selectedIntensity}
            setSelectedIntensity={setSelectedIntensity}
            onGoToMatches={() => changeActiveTab('matches')}
            lang={lang}
          />
        )}

        {activeTab === 'matches' && <MatchesView matches={matches} lang={lang} />}

        {activeTab === 'dares' && (
          <DaresView
            challenges={challenges}
            onCreateDare={handleCreateDare}
            onUpdateDareStatus={handleUpdateDareStatus}
            lang={lang}
          />
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

      {/* Styled Reset / Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={executeResetAccount}
        title={lang === 'he' ? 'איפוס ומחיקת חשבון מוחלטת' : 'Reset Account & Delete Data'}
        description={
          lang === 'he'
            ? 'פעולה זו תמחק לחלוטין את החשבון והתשובות שלך מ-PostgreSQL ותחזיר אותך לתהליך ה-Onboarding מהתחלה. האם להמשיך?'
            : 'This action will permanently delete your user profile and answers from PostgreSQL and return you to the initial Onboarding flow. Proceed?'
        }
        confirmText={lang === 'he' ? 'מחק והתחל מחדש' : 'Delete & Restart'}
        cancelText={lang === 'he' ? 'ביטול' : 'Cancel'}
        lang={lang}
      />
    </div>
  );
};
