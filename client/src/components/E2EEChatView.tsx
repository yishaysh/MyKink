import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, ShieldCheck, Lock, Eye, Sparkles } from 'lucide-react';
import { socketClient } from '../services/socket';
import { encryptPayload, decryptPayload } from '../services/crypto';

interface E2EEChatViewProps {
  userId: string | null;
  coupleId: string | null;
}

export const E2EEChatView: React.FC<E2EEChatViewProps> = ({ userId, coupleId }) => {
  const [messages, setMessages] = useState<Array<{ senderId: string; text: string; time: string }>>([
    {
      senderId: 'SYSTEM',
      text: 'ערוץ התקשורת מוצפן מקצה לקצה (End-to-End Encrypted). הודעות ותמונות אינן ניתנות לפענוח בשרת.',
      time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const unsubscribe = socketClient.subscribe((packet) => {
      if (packet.type === 'EPHEMERAL_CHAT_PAYLOAD') {
        const decrypted = decryptPayload(packet.payload.text);
        setMessages((prev) => [
          ...prev,
          {
            senderId: packet.payload.senderId,
            text: decrypted,
            time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userId || !coupleId) return;

    const rawText = inputText.trim();
    setInputText('');

    const encrypted = encryptPayload(rawText);

    // Send via WebSocket
    socketClient.send('EPHEMERAL_CHAT_PAYLOAD', {
      senderId: userId,
      coupleId,
      text: encrypted
    });

    // Add locally to view
    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        text: rawText,
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="glass-card p-6 border border-slate-700/80">
        {/* Header Banner */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-pink-400" />
            <div>
              <h2 className="text-lg font-bold text-white">צ'אט מוצפן מקצה לקצה (E2EE)</h2>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> מוצפן ב-AES-256-GCM
              </span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            הודעות נמחקות אוטומטית
          </div>
        </div>

        {/* Message Log */}
        <div className="h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4">
          {messages.map((m, idx) => {
            const isMe = m.senderId === userId;
            const isSystem = m.senderId === 'SYSTEM';

            if (isSystem) {
              return (
                <div key={idx} className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center text-xs text-purple-300">
                  🔒 {m.text}
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{m.time}</span>
              </div>
            );
          })}
        </div>

        {/* Input Controls */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="רשום הודעה מוצפנת לבן/בת הזוג..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
          />
          <button type="submit" className="btn-neon px-5 py-2.5 text-xs flex items-center gap-1">
            <Send className="w-4 h-4" />
            <span>שלח</span>
          </button>
        </form>
      </div>
    </div>
  );
};
