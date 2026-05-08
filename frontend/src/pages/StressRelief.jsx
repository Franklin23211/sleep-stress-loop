import { useState, useEffect } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
const icons = {
  breathing: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      <circle cx="32" cy="32" r="28" stroke="#00e5c3" strokeWidth="3" fill="none" opacity="0.3"/>
      <circle cx="32" cy="32" r="18" stroke="#00e5c3" strokeWidth="3" fill="none" opacity="0.6"/>
      <circle cx="32" cy="32" r="8" fill="#00e5c3"/>
    </svg>
  ),
  meditation: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      <path d="M32 8 C32 8 20 20 20 32 C20 44 32 56 32 56 C32 56 44 44 44 32 C44 20 32 8 32 8Z" stroke="#8b5cf6" strokeWidth="3" fill="none"/>
      <circle cx="32" cy="32" r="5" fill="#8b5cf6"/>
      <line x1="10" y1="32" x2="22" y2="32" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
      <line x1="42" y1="32" x2="54" y2="32" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  memory: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      <rect x="8" y="8" width="20" height="20" rx="4" stroke="#f59e0b" strokeWidth="3" fill="none"/>
      <rect x="36" y="8" width="20" height="20" rx="4" stroke="#f59e0b" strokeWidth="3" fill="none"/>
      <rect x="8" y="36" width="20" height="20" rx="4" stroke="#f59e0b" strokeWidth="3" fill="none"/>
      <rect x="36" y="36" width="20" height="20" rx="4" stroke="#f59e0b" strokeWidth="3" fill="none"/>
      <text x="14" y="24" fill="#f59e0b" fontSize="12" fontWeight="bold">?</text>
      <text x="42" y="24" fill="#f59e0b" fontSize="12" fontWeight="bold">?</text>
      <text x="14" y="52" fill="#f59e0b" fontSize="12" fontWeight="bold">?</text>
      <text x="42" y="52" fill="#f59e0b" fontSize="12" fontWeight="bold">?</text>
    </svg>
  ),
  chatbot: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      <rect x="6" y="10" width="52" height="36" rx="8" stroke="#f43f5e" strokeWidth="3" fill="none"/>
      <circle cx="20" cy="28" r="4" fill="#f43f5e"/>
      <circle cx="32" cy="28" r="4" fill="#f43f5e"/>
      <circle cx="44" cy="28" r="4" fill="#f43f5e"/>
      <path d="M20 46 L28 54 L28 46" stroke="#f43f5e" strokeWidth="3" fill="none" strokeLinejoin="round"/>
    </svg>
  ),
  stepcounter: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
      <path d="M20 52 L20 28 L14 22 L22 12 L30 22 L24 28 L24 52Z" stroke="#10b981" strokeWidth="3" fill="none" strokeLinejoin="round"/>
      <path d="M38 52 L38 36 L32 30 L40 20 L48 30 L42 36 L42 52Z" stroke="#10b981" strokeWidth="3" fill="none" strokeLinejoin="round"/>
      <circle cx="22" cy="8" r="4" stroke="#10b981" strokeWidth="3" fill="none"/>
      <circle cx="40" cy="16" r="4" stroke="#10b981" strokeWidth="3" fill="none"/>
    </svg>
  ),
};

// ── Breathing Exercise ─────────────────────────────────────────────────────
function BreathingExercise({ onClose }) {
  const textPrimary   = "white";
  const textSecondary = "#9ca3af";

  const phases = [
    { name: "Inhale",  duration: 4, color: "#00e5c3" },
    { name: "Hold",    duration: 7, color: "#8b5cf6" },
    { name: "Exhale",  duration: 8, color: "#f43f5e" },
  ];

  const [phase,    setPhase]    = useState("idle");
  const [count,    setCount]    = useState(0);
  const [cycles,   setCycles]   = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [running,  setRunning]  = useState(false);
  const [timer,    setTimer]    = useState(null);

  const start = () => {
    setRunning(true);
    setPhaseIdx(0);
    setCount(phases[0].duration);
    setPhase(phases[0].name);
    const iv = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhaseIdx(p => {
            const next = (p + 1) % 3;
            setPhase(phases[next].name);
            setCount(phases[next].duration);
            if (next === 0) setCycles(cy => cy + 1);
            return next;
          });
          return phases[(phaseIdx + 1) % 3].duration;
        }
        return c - 1;
      });
    }, 1000);
    setTimer(iv);
  };

  const stop = () => {
    clearInterval(timer);
    setRunning(false);
    setPhase("idle");
    setCount(0);
  };

  const currentColor = phases[phaseIdx]?.color || "#00e5c3";

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-xl font-bold" style={{ color: textPrimary }}>
        4-7-8 Breathing
      </h2>
      <p className="text-sm text-center" style={{ color: textSecondary }}>
        Inhale 4s → Hold 7s → Exhale 8s
      </p>

      <div className="relative flex items-center justify-center">
        <div
          className="rounded-full flex items-center justify-center transition-all duration-1000"
          style={{
            width:  running ? (phase === "Inhale" ? 180 : phase === "Hold" ? 180 : 120) : 140,
            height: running ? (phase === "Inhale" ? 180 : phase === "Hold" ? 180 : 120) : 140,
            background:  `radial-gradient(circle, ${currentColor}33, ${currentColor}11)`,
            border:      `3px solid ${currentColor}`,
            boxShadow:   running ? `0 0 30px ${currentColor}55` : "none",
          }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold" style={{ color: textPrimary }}>
              {running ? count : "▶"}
            </div>
            <div className="text-sm mt-1" style={{ color: currentColor }}>
              {running ? phase : "Start"}
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm" style={{ color: textSecondary }}>
        Cycles completed:{" "}
        <span className="font-bold" style={{ color: textPrimary }}>{cycles}</span>
      </div>

      <div className="flex gap-3">
        {!running ? (
          <button
            onClick={start}
            className="px-6 py-2 rounded-xl font-bold"
            style={{ background: "#00e5c3", color: "#0d0d14" }}
          >
            Start
          </button>
        ) : (
          <button
            onClick={stop}
            className="px-6 py-2 rounded-xl font-bold text-white bg-red-500"
          >
            Stop
          </button>
        )}
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-xl font-bold"
          style={{ background: "rgba(128,128,128,0.2)", color: textPrimary }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ── Meditation Timer ───────────────────────────────────────────────────────
function MeditationTimer({ onClose }) {
  const textPrimary   = "white";
  const textSecondary = "#9ca3af";

  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [timer,   setTimer]   = useState(null);
  const [done,    setDone]    = useState(false);

  const start = () => {
    setDone(false);
    setRunning(true);
    const iv = setInterval(() => {
      setSeconds(s => {
        if (s === 0) {
          setMinutes(m => {
            if (m === 0) {
              clearInterval(iv);
              setRunning(false);
              setDone(true);
              return 0;
            }
            return m - 1;
          });
          return 59;
        }
        return s - 1;
      });
    }, 1000);
    setTimer(iv);
  };

  const stop = () => {
    clearInterval(timer);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(timer);
    setRunning(false);
    setMinutes(5);
    setSeconds(0);
    setDone(false);
  };

  const progress = ((minutes * 60 + seconds) / (5 * 60)) * 100;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-xl font-bold" style={{ color: textPrimary }}>
        Meditation Timer
      </h2>
      <p className="text-sm" style={{ color: textSecondary }}>
        Close your eyes and breathe slowly
      </p>

      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="80"
            stroke="rgba(128,128,128,0.2)"
            strokeWidth="8" fill="none"
          />
          <circle cx="90" cy="90" r="80"
            stroke="#8b5cf6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 80}`}
            strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold" style={{ color: textPrimary }}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          {done && (
            <div className="text-sm text-purple-400 mt-1">🎉 Done!</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm" style={{ color: textSecondary }}>Duration:</span>
        {[3, 5, 10, 15].map(m => (
          <button
            key={m}
            onClick={() => { reset(); setMinutes(m); setSeconds(0); }}
            className="px-3 py-1 rounded-lg text-sm font-bold"
            style={{
              background: minutes === m ? "#8b5cf6" : "rgba(128,128,128,0.15)",
              color: minutes === m ? "white" : textPrimary,
            }}
          >
            {m}m
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        {!running ? (
          <button
            onClick={start}
            className="px-6 py-2 rounded-xl font-bold text-white"
            style={{ background: "#8b5cf6" }}
          >
            Start
          </button>
        ) : (
          <button
            onClick={stop}
            className="px-6 py-2 rounded-xl font-bold text-white bg-red-500"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="px-6 py-2 rounded-xl font-bold"
          style={{ background: "rgba(128,128,128,0.2)", color: textPrimary }}
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-xl font-bold"
          style={{ background: "rgba(128,128,128,0.2)", color: textPrimary }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ── Memory Game ────────────────────────────────────────────────────────────
function MemoryGame({ onClose }) {
  const textPrimary   = "white";
  const textSecondary = "#9ca3af";
  const cardFace      = "rgba(255,255,255,0.05)";
  const cardFlipped   = "rgba(255,255,255,0.15)";

  const emojis = ["🌙", "⭐", "🌊", "🌸", "🍃", "🦋", "🌈", "🔮"];

  const createBoard = () =>
    [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));

  const [cards,   setCards]   = useState(createBoard);
  const [flipped, setFlipped] = useState([]);
  const [moves,   setMoves]   = useState(0);
  const [won,     setWon]     = useState(false);

  const flip = (id) => {
    if (flipped.length === 2) return;
    if (cards[id].flipped || cards[id].matched) return;

    const newCards   = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    const newFlipped = [...flipped, id];
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        const matched = newCards.map(c =>
          c.id === a || c.id === b ? { ...c, matched: true } : c
        );
        setCards(matched);
        setFlipped([]);
        if (matched.every(c => c.matched)) setWon(true);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === a || c.id === b ? { ...c, flipped: false } : c
            )
          );
          setFlipped([]);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <h2 className="text-xl font-bold" style={{ color: textPrimary }}>
        Memory Match
      </h2>
      <div className="flex gap-6 text-sm" style={{ color: textSecondary }}>
        <span>
          Moves:{" "}
          <span className="font-bold" style={{ color: textPrimary }}>{moves}</span>
        </span>
        <span>
          Matched:{" "}
          <span className="font-bold" style={{ color: textPrimary }}>
            {cards.filter(c => c.matched).length / 2}/8
          </span>
        </span>
      </div>

      {won && (
        <div className="text-center">
          <div className="text-2xl">🎉</div>
          <div className="font-bold" style={{ color: textPrimary }}>
            You won in {moves} moves!
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flip(card.id)}
            className="w-14 h-14 rounded-xl text-2xl font-bold transition-all duration-300 flex items-center justify-center"
            style={{
              background: card.flipped || card.matched
                ? card.matched ? "rgba(245,158,11,0.3)" : cardFlipped
                : cardFace,
              border: card.matched
                ? "2px solid #f59e0b"
                : card.flipped
                ? "2px solid rgba(128,128,128,0.4)"
                : "2px solid rgba(128,128,128,0.15)",
              transform: card.flipped || card.matched ? "scale(1)" : "scale(0.95)",
            }}
          >
            {card.flipped || card.matched ? card.emoji : ""}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setCards(createBoard());
            setFlipped([]);
            setMoves(0);
            setWon(false);
          }}
          className="px-5 py-2 rounded-xl font-bold"
          style={{ background: "#f59e0b", color: "#0d0d14" }}
        >
          New Game
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl font-bold"
          style={{ background: "rgba(128,128,128,0.2)", color: textPrimary }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ── Chatbot ────────────────────────────────────────────────────────────────
function Chatbot({ onClose }) {
  const textPrimary   = "white";
  const textSecondary = "#9ca3af";
  const inputBg       = "rgba(255,255,255,0.08)";
  const inputBorder   = "rgba(255,255,255,0.1)";
  const botBubble     = "rgba(255,255,255,0.08)";
  const chipBg        = "rgba(255,255,255,0.08)";

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How are you feeling right now? 💬" },
  ]);
  const [input, setInput] = useState("");

  const replies = {
    stressed:    "I hear you. Try the 4-7-8 breathing exercise to calm your nervous system. 🌬️",
    anxious:     "Anxiety is tough. Focus on 5 things you can see around you right now. 👁️",
    tired:       "Rest is important! Try to get at least 7 hours of sleep tonight. 🌙",
    sad:         "It's okay to feel sad. Be gentle with yourself today. 💙",
    angry:       "Take a deep breath. Count to 10 slowly before reacting. 🔢",
    happy:       "That's wonderful! Keep nurturing the habits that make you feel this way! ✨",
    lonely:      "You are not alone. Reach out to someone you trust today. 🤝",
    overwhelmed: "Break things into small steps. Focus on just one task at a time. 📋",
    hello:       "Hello! I'm here to support your wellness journey. 🌿",
    hi:          "Hi there! Tell me how you're feeling and I'll help. 😊",
    help:        "I can help with stress, anxiety, sleep, mood, and more. Just tell me how you feel!",
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg  = { from: "user", text: input };
    const lower    = input.toLowerCase();
    const key      = Object.keys(replies).find(k => lower.includes(k));
    const botReply = {
      from: "bot",
      text: key
        ? replies[key]
        : "I understand. Remember — every feeling is temporary and it's okay to seek help. 💚",
    };
    setMessages(m => [...m, userMsg, botReply]);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-3 py-2" style={{ height: 380 }}>
      <h2 className="text-xl font-bold text-center" style={{ color: textPrimary }}>
        Wellness Chatbot
      </h2>

      <div
        className="flex-1 overflow-y-auto flex flex-col gap-2 px-1"
        style={{ maxHeight: 260 }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="px-4 py-2 rounded-2xl text-sm max-w-xs"
              style={{
                background:
                  m.from === "user"
                    ? "linear-gradient(135deg, #00e5c3, #8b5cf6)"
                    : botBubble,
                color: textPrimary,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {["stressed", "anxious", "tired", "sad", "happy"].map(chip => (
          <button
            key={chip}
            onClick={() => setInput(chip)}
            className="px-3 py-1 rounded-full text-xs font-bold capitalize"
            style={{ background: chipBg, color: textSecondary }}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="How are you feeling?"
          className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
          style={{
            background: inputBg,
            border: `1px solid ${inputBorder}`,
            color: textPrimary,
          }}
        />
        <button
          onClick={send}
          className="px-4 py-2 rounded-xl font-bold text-sm text-white"
          style={{ background: "#f43f5e" }}
        >
          Send
        </button>
      </div>

      <button
        onClick={onClose}
        className="text-sm text-center"
        style={{ color: textSecondary }}
      >
        ← Back
      </button>
    </div>
  );
}

// ── Step Counter ───────────────────────────────────────────────────────────
function StepCounter({ onClose }) {
  const textPrimary   = "white";
  const textSecondary = "#9ca3af";
  const color         = "#10b981";
  const GOAL          = 20;

  const [steps,     setSteps]     = useState(0);
  const [running,   setRunning]   = useState(false);
  const [timeLeft,  setTimeLeft]  = useState(30);
  const [done,      setDone]      = useState(false);
  const [listening, setListening] = useState(false);
  const [lastY,     setLastY]     = useState(null);
  const [message,   setMessage]   = useState("");

  // ── Motion detection ──────────────────────────────────────────────────
  useEffect(() => {
    if (!running) return;

    const handleMotion = (e) => {
      const ay = e.accelerationIncludingGravity?.y;
      if (ay === null || ay === undefined) return;
      setLastY(prev => {
        if (prev !== null) {
          const diff = Math.abs(ay - prev);
          if (diff > 3.5) {
            setSteps(s => {
              const next = s + 1;
              if (next >= GOAL) setMessage("🎉 Goal reached! Amazing job!");
              return next;
            });
          }
        }
        return ay;
      });
    };

    window.addEventListener("devicemotion", handleMotion);
    setListening(true);
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      setListening(false);
    };
  }, [running]);

  // ── Countdown timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(iv);
          setRunning(false);
          setDone(true);
          setSteps(s => {
            setMessage(s >= GOAL
              ? "🎉 You crushed it! Goal achieved!"
              : `Good effort! You got ${s} steps in 30 seconds!`
            );
            return s;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running]);

  const start = () => {
    setSteps(0);
    setTimeLeft(30);
    setDone(false);
    setMessage("");
    setLastY(null);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setSteps(0);
    setTimeLeft(30);
    setDone(false);
    setMessage("");
    setLastY(null);
    setListening(false);
  };

  const pct  = Math.min(steps / GOAL, 1);
  const r    = 54;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <h2 className="text-xl font-bold" style={{ color: textPrimary }}>
        Step Counter
      </h2>
      <p className="text-sm text-center" style={{ color: textSecondary }}>
        Walk or march in place for 30 seconds · Goal: {GOAL} steps
      </p>

      {/* Donut */}
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="14"
          />
          <circle cx="80" cy="80" r={r}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            style={{
              filter: `drop-shadow(0 0 8px ${color}88)`,
              transition: "stroke-dasharray 0.3s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <div className="text-4xl font-bold" style={{ color }}>{steps}</div>
          <div className="text-xs" style={{ color: textSecondary }}>/ {GOAL} steps</div>
          {running && (
            <div
              className="text-xs font-bold mt-1"
              style={{ color: timeLeft <= 10 ? "#f43f5e" : textSecondary }}
            >
              {timeLeft}s left
            </div>
          )}
        </div>
      </div>

      {/* Sensor status */}
      {running && (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
          style={{
            background: listening
              ? "rgba(16,185,129,0.15)"
              : "rgba(255,255,255,0.05)",
            color: listening ? color : textSecondary,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: listening ? color : "#6b7280" }}
          />
          {listening
            ? "Motion detected — keep walking!"
            : "Waiting for motion sensor..."}
        </div>
      )}

      {/* Manual tap button */}
      {running && (
        <>
          <button
            onClick={() => setSteps(s => Math.min(s + 1, GOAL + 10))}
            className="w-28 h-28 rounded-full text-4xl transition-all active:scale-90"
            style={{
              background: `radial-gradient(circle, ${color}33, ${color}11)`,
              border: `3px solid ${color}`,
              boxShadow: `0 0 20px ${color}44`,
            }}
          >
            👟
          </button>
          <p className="text-xs text-center" style={{ color: textSecondary }}>
            No motion sensor? Tap the shoe for each step!
          </p>
        </>
      )}

      {/* Message */}
      {message !== "" && (
        <div
          className="px-5 py-3 rounded-xl text-sm font-semibold text-center"
          style={{
            background: "rgba(16,185,129,0.15)",
            color,
            border: `1px solid ${color}33`,
          }}
        >
          {message}
        </div>
      )}

      {/* Result summary */}
      {done && (
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-bold" style={{ color }}>{steps}</div>
            <div className="text-xs" style={{ color: textSecondary }}>Steps taken</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: textPrimary }}>
              {steps >= GOAL ? "✓" : `${Math.round((steps / GOAL) * 100)}%`}
            </div>
            <div className="text-xs" style={{ color: textSecondary }}>
              Goal {steps >= GOAL ? "reached" : "progress"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: textPrimary }}>30s</div>
            <div className="text-xs" style={{ color: textSecondary }}>Duration</div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        {!running && !done && (
          <button
            onClick={start}
            className="px-6 py-2 rounded-xl font-bold"
            style={{ background: color, color: "#0d0d14" }}
          >
            Start
          </button>
        )}
        {done && (
          <button
            onClick={start}
            className="px-6 py-2 rounded-xl font-bold"
            style={{ background: color, color: "#0d0d14" }}
          >
            Try Again
          </button>
        )}
        {running && (
          <button
            onClick={reset}
            className="px-6 py-2 rounded-xl font-bold text-white bg-red-500"
          >
            Stop
          </button>
        )}
        <button
          onClick={() => { reset(); onClose(); }}
          className="px-6 py-2 rounded-xl font-bold"
          style={{ background: "rgba(128,128,128,0.2)", color: textPrimary }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ── Activity config ────────────────────────────────────────────────────────
const activities = [
  {
    key:    "breathing",
    label:  "4-7-8 Breathing",
    desc:   "Calm your nervous system",
    color:  "#00e5c3",
    bg:     "rgba(0,229,195,0.08)",
    border: "rgba(0,229,195,0.25)",
  },
  {
    key:    "meditation",
    label:  "Meditation Timer",
    desc:   "Focus and find peace",
    color:  "#8b5cf6",
    bg:     "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
  },
  {
    key:    "memory",
    label:  "Memory Game",
    desc:   "Distract and recharge",
    color:  "#f59e0b",
    bg:     "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
  },
  {
    key:    "chatbot",
    label:  "Wellness Chatbot",
    desc:   "Talk about how you feel",
    color:  "#f43f5e",
    bg:     "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.25)",
  },
  {
    key:    "stepcounter",
    label:  "Step Counter",
    desc:   "Walk and reduce stress",
    color:  "#10b981",
    bg:     "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
];

// ── Main StressRelief Page ─────────────────────────────────────────────────
export default function StressRelief({ darkMode }) {
  const [active, setActive] = useState(null);

  return (
    <div className="min-h-screen p-6" style={{ background: "#0d0d14" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        {!active && (
          <>
            <h1 className="text-3xl font-bold mb-2 text-white">
              Stress Relief
            </h1>
            <p className="mb-8 text-gray-400">
              Choose an activity to begin your wellness session
            </p>
          </>
        )}

        {/* Icon Grid */}
        {!active && (
          <div className="grid grid-cols-2 gap-5">
            {activities.map(act => (
              <button
                key={act.key}
                onClick={() => setActive(act.key)}
                className="flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: act.bg,
                  border:     `1.5px solid ${act.border}`,
                  boxShadow:  `0 4px 24px ${act.color}15`,
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, ${act.color}22, ${act.color}08)`,
                    border:     `2px solid ${act.border}`,
                    boxShadow:  `0 0 20px ${act.color}30`,
                  }}
                >
                  {icons[act.key]}
                </div>

                <div className="text-center">
                  <div className="font-bold text-base text-white">
                    {act.label}
                  </div>
                  <div className="text-sm mt-1 text-gray-400">
                    {act.desc}
                  </div>
                </div>

                <div
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: `${act.color}22`, color: act.color }}
                >
                  Tap to open →
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Active Activity Panel */}
        {active && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border:     "1.5px solid rgba(255,255,255,0.1)",
            }}
          >
            {active === "breathing"   && <BreathingExercise onClose={() => setActive(null)} />}
            {active === "meditation"  && <MeditationTimer   onClose={() => setActive(null)} />}
            {active === "memory"      && <MemoryGame        onClose={() => setActive(null)} />}
            {active === "chatbot"     && <Chatbot           onClose={() => setActive(null)} />}
            {active === "stepcounter" && <StepCounter       onClose={() => setActive(null)} />}
          </div>
        )}

      </div>
    </div>
  );
}