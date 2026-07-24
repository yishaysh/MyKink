# MyKink (KINK-NEXUS) 🔒💖

A privacy-first, zero-knowledge, double-blind fantasy matching and intimacy app for couples. Built for 100% free, local, private execution.

## Features

- 🔐 **Double-Blind Matching**: Zero-Knowledge architecture. `NO` choices are hashed client-side with a unique couple salt and stay completely hidden from your partner and the server.
- 🔄 **Asymmetric Role Logic**: Cross-matching between `GIVER` and `RECEIVER` roles for paired questions (e.g. Dominance/Submission, Spanking, Massage).
- 🎴 **Interactive Preference Deck**: 100+ curated items across BDSM, Sensual, Roleplay, Toys, ENM with intensity filters (*Vanilla*, *Spicy*, *Adventurous*).
- ⏱️ **Gamification & Timed Dares**: Interactive card deck, 24h & 48h timed challenges, and point rewards ledger.
- 📅 **Intimacy Tracker & Calendar**: Log sessions, mood (1-5), duration, location, protection, and track mutual agreement metrics.
- 🤖 **Free AI Intimacy Coach & Scenario Generator (Aria AI)**: Generates tailored 4-step romantic & kink evening scenarios based strictly on verified shared mutual matches.
- 💬 **End-to-End Encrypted (E2EE) Chat**: Real-time encrypted partner chat over WebSockets.

## How to Run Locally

1. Open terminal in the project directory:
   ```bash
   cd "C:\Users\yishay.shavlev\Desktop\Private Projects\MyKink"
   ```

2. Run setup (installs dependencies and initializes the local SQLite database):
   ```bash
   npm run setup
   ```

3. Start both backend and frontend dev servers:
   ```bash
   npm run dev
   ```

- Frontend: `http://localhost:5173`
- Backend API & WebSockets: `http://localhost:4000`
