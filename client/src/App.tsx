import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PairingModal } from './components/PairingModal';
import { SwipeDeck, CatalogQuestion } from './components/SwipeDeck';
import { MatchesView, SharedMatchItem } from './components/MatchesView';
import { DaresView, ChallengeItem } from './components/DaresView';
import { IntimacyTracker, IntimacyLogItem } from './components/IntimacyTracker';
import { AICoachView } from './components/AICoachView';
import { E2EEChatView } from './components/E2EEChatView';

import {
  registerDevice,
  createCouple,
  joinCouple,
  fetchQuestions,
  submitAnswer,
  fetchMatches,
  fetchDares,
  createDare,
  logIntimacy,
  fetchIntimacyLogs
} from './services/api';
import { getOrCreateDeviceId, getOrCreatePublicKey, computeAnswerHash, encryptPayload } from './services/crypto';
import { socketClient } from './services/socket';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('swipe');
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);

  // User & Couple state
  const [userId, setUserId] = useState<string | null>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [coupleSalt, setCoupleSalt] = useState<string>('Default_Salt_123');
  const [isPartnerConnected, setIsPartnerConnected] = useState(false);

  // Data state
  const [questions, setQuestions] = useState<CatalogQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedIntensity, setSelectedIntensity] = useState('ALL');
  const [matches, setMatches] = useState<SharedMatchItem[]>([]);
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [intimacyLogs, setIntimacyLogs] = useState<IntimacyLogItem[]>([]);
  const [intimacyMetrics, setIntimacyMetrics] = useState({ totalSessions: 0, avgDuration: 0, avgMood: '5.0' });

  // 1. Initialize User & Device Registration
  useEffect(() => {
    async function init() {
      try {
        const deviceId = getOrCreateDeviceId();
        const pubKey = getOrCreatePublicKey();
        const res = await registerDevice(deviceId, pubKey);

        if (res.success && res.user) {
          setUserId(res.user.id);
          if (res.user.coupleId) {
            setCoupleId(res.user.coupleId);
          }
        }
      } catch (e) {
        console.error('Initialization error:', e);
      }
    }
    init();
  }, []);

  // 2. Load Questions catalog
  useEffect(() => {
    async function loadQ() {
      try {
        const res = await fetchQuestions(selectedCategory, selectedIntensity);
        if (res.success) {
          setQuestions(res.questions);
        }
      } catch (e) {
        console.error('Fetch questions error:', e);
      }
    }
    loadQ();
  }, [selectedCategory, selectedIntensity]);

  // 3. Sync WebSockets & Load Couple Data when linked
  useEffect(() => {
    if (userId && coupleId) {
      socketClient.connect(userId, coupleId);

      const unsub = socketClient.subscribe((packet) => {
        if (packet.type === 'MATCH_DISCOVERED') {
          reloadMatches();
        } else if (packet.type === 'CHALLENGE_ISSUED') {
          reloadChallenges();
        } else if (packet.type === 'COUPLE_LINKED') {
          setIsPartnerConnected(true);
        }
      });

      reloadMatches();
      reloadChallenges();
      reloadIntimacy();

      return () => unsub();
    }
  }, [userId, coupleId]);

  const reloadMatches = async () => {
    if (!coupleId) return;
    try {
      const res = await fetchMatches(coupleId);
      if (res.success) {
        setMatches(res.matches);
        if (res.matches.length > 0) {
          setIsPartnerConnected(true);
        }
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

  const reloadIntimacy = async () => {
    if (!coupleId) return;
    try {
      const res = await fetchIntimacyLogs(coupleId);
      if (res.success) {
        setIntimacyLogs(res.logs);
        setIntimacyMetrics(res.metrics);
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
      if (res.success) {
        setCoupleId(res.couple.id);
        setPairCode(res.couple.pairCode);
        setCoupleSalt(res.couple.coupleSalt);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinCouple = async (code: string) => {
    if (!userId) return;
    try {
      const res = await joinCouple(userId, code);
      if (res.success) {
        setCoupleId(res.couple.id);
        setPairCode(res.couple.pairCode);
        setCoupleSalt(res.couple.coupleSalt);
        setIsPairingModalOpen(false);
        setIsPartnerConnected(true);
      }
    } catch (e) {
      alert('קוד צימוד לא נמצא או שפג תוקפו');
    }
  };

  // Handler for Swiping Card Answer
  const handleAnswer = async (questionId: string, value: 'YES' | 'MAYBE' | 'NO') => {
    if (!userId) return;

    // Compute client-side SHA-256 hash for double-blind privacy
    const answerHash = await computeAnswerHash(questionId, value, coupleSalt);
    const encryptedVal = encryptPayload(value);

    await submitAnswer(userId, questionId, encryptedVal, answerHash, value);

    // Refresh matches list
    if (coupleId) reloadMatches();
  };

  // Handler for Creating Dare
  const handleCreateDare = async (title: string, description: string, hours: number) => {
    if (!coupleId) return;
    await createDare(coupleId, title, description, hours);
    reloadChallenges();
  };

  // Handler for Intimacy Log
  const handleLogIntimacy = async (
    activityType: string,
    duration: number,
    location: string,
    protection: boolean,
    mood: number
  ) => {
    if (!coupleId) return;
    await logIntimacy(coupleId, activityType, duration, location, protection, mood);
    reloadIntimacy();
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pairCode={pairCode}
        openPairingModal={() => setIsPairingModalOpen(true)}
        isPartnerConnected={isPartnerConnected}
      />

      {/* Main Tab Views */}
      <main className="mt-4">
        {activeTab === 'swipe' && (
          <SwipeDeck
            questions={questions}
            onAnswer={handleAnswer}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedIntensity={selectedIntensity}
            setSelectedIntensity={setSelectedIntensity}
          />
        )}

        {activeTab === 'matches' && <MatchesView matches={matches} />}

        {activeTab === 'dares' && (
          <DaresView challenges={challenges} onCreateDare={handleCreateDare} />
        )}

        {activeTab === 'intimacy' && (
          <IntimacyTracker
            logs={intimacyLogs}
            metrics={intimacyMetrics}
            onLogSession={handleLogIntimacy}
          />
        )}

        {activeTab === 'ai' && <AICoachView coupleId={coupleId} />}

        {activeTab === 'chat' && <E2EEChatView userId={userId} coupleId={coupleId} />}
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
