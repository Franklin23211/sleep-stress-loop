import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

// ── Donut Chart Component ──────────────────────────────────────────────────
function DonutChart({ value, max, color, lacking, size = 120 }) {
  const r = 46;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const filledDash = circumference * pct;
  const emptyDash  = circumference * (1 - pct);

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="14"
      />
      {/* Lacking arc */}
      <circle cx={cx} cy={cy} r={r}
        fill="none"
        stroke={lacking}
        strokeWidth="14"
        strokeDasharray={`${emptyDash} ${filledDash}`}
        strokeDashoffset={-filledDash}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        opacity="0.35"
      />
      {/* Filled arc */}
      <circle cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeDasharray={`${filledDash} ${emptyDash}`}
        strokeDashoffset="0"
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
    </svg>
  );
}

// ── Attribute config ───────────────────────────────────────────────────────
const ATTRS = [
  {
    key:      "heart_rate_bpm",
    label:    "Heart Rate",
    unit:     "bpm",
    optimal:  { min: 60, max: 80 },
    max:      180,
    color:    "#f43f5e",
    lacking:  "#f43f5e",
    icon:     "❤️",
    goodMsg:  (v) => `Your resting heart rate of ${v} bpm is in the healthy zone. Keep up your current activity levels.`,
    badMsg:   (v, opt) => v > opt.max
      ? `Your heart rate of ${v} bpm is above optimal (${opt.min}-${opt.max} bpm). Try reducing caffeine and practicing deep breathing daily.`
      : `Your heart rate of ${v} bpm is below optimal. Light cardio like a 20-minute walk can help strengthen your heart.`,
    foodTip:  "Eat magnesium-rich foods like spinach, almonds, and dark chocolate to support heart health.",
    redirect: "food",
  },
  {
    key:      "spo2_pct",
    label:    "SpO2",
    unit:     "%",
    optimal:  { min: 95, max: 100 },
    max:      100,
    color:    "#00e5c3",
    lacking:  "#00e5c3",
    icon:     "🫁",
    goodMsg:  (v) => `Your SpO2 of ${v}% is excellent. Your blood oxygen levels are perfectly healthy.`,
    badMsg:   (v) => `Your SpO2 of ${v}% is below optimal. Practice deep breathing exercises and ensure good ventilation in your space.`,
    foodTip:  "Iron-rich foods like lentils, red meat, and leafy greens help improve oxygen transport.",
    redirect: "relief",
  },
  {
    key:      "sleep_duration_hrs",
    label:    "Sleep Duration",
    unit:     "hrs",
    optimal:  { min: 7, max: 9 },
    max:      12,
    color:    "#8b5cf6",
    lacking:  "#8b5cf6",
    icon:     "🌙",
    goodMsg:  (v) => `You slept ${v} hours — right in the optimal range. Consistent sleep is your superpower.`,
    badMsg:   (v, opt) => v < opt.min
      ? `You only slept ${v} hours. Aim for ${opt.min}-${opt.max} hours. Try sleeping 30 minutes earlier tonight.`
      : `You slept ${v} hours which is more than optimal. Oversleeping can increase fatigue. Try waking at a consistent time.`,
    foodTip:  "Tryptophan-rich foods like warm milk, bananas, and turkey promote better sleep naturally.",
    redirect: "food",
  },
  {
    key:      "sleep_quality_1_10",
    label:    "Sleep Quality",
    unit:     "/10",
    optimal:  { min: 7, max: 10 },
    max:      10,
    color:    "#f59e0b",
    lacking:  "#f59e0b",
    icon:     "⭐",
    goodMsg:  (v) => `Sleep quality of ${v}/10 is great! Your body is recovering well during sleep.`,
    badMsg:   (v) => `Sleep quality of ${v}/10 needs improvement. Avoid screens 1 hour before bed and keep your room cool and dark.`,
    foodTip:  "Avoid heavy meals, caffeine, and alcohol within 3 hours of bedtime to improve sleep quality.",
    redirect: "food",
  },
  {
    key:      "times_woke",
    label:    "Times Woke",
    unit:     "x",
    optimal:  { min: 0, max: 2 },
    max:      10,
    color:    "#06b6d4",
    lacking:  "#06b6d4",
    icon:     "😴",
    goodMsg:  (v) => `You only woke ${v} time(s) — your sleep continuity is excellent!`,
    badMsg:   (v) => `You woke ${v} times during sleep. Try the 4-7-8 breathing exercise before bed to improve sleep continuity.`,
    foodTip:  "Limit fluids 2 hours before bed. Chamomile tea or ashwagandha can reduce nighttime waking.",
    redirect: "relief",
  },
  {
    key:      "deep_sleep_pct",
    label:    "Deep Sleep",
    unit:     "%",
    optimal:  { min: 20, max: 60 },
    max:      60,
    color:    "#a855f7",
    lacking:  "#a855f7",
    icon:     "🔮",
    goodMsg:  (v) => `Deep sleep at ${v}% is excellent. This is when your body heals and your brain consolidates memory.`,
    badMsg:   (v) => `Deep sleep at ${v}% is below optimal (20-60%). Exercise regularly and avoid alcohol — both significantly increase deep sleep.`,
    foodTip:  "Magnesium glycinate supplements and foods like pumpkin seeds and cashews promote deeper sleep stages.",
    redirect: "food",
  },
  {
    key:      "activity_steps",
    label:    "Daily Steps",
    unit:     "steps",
    optimal:  { min: 7000, max: 10000 },
    max:      15000,
    color:    "#22c55e",
    lacking:  "#22c55e",
    icon:     "👟",
    goodMsg:  (v) => `${v.toLocaleString()} steps — you are hitting your daily movement goal. Keep it up!`,
    badMsg:   (v, opt) => `Only ${v.toLocaleString()} steps today. Try to reach ${opt.min.toLocaleString()} steps. A 20-minute walk after meals makes a big difference.`,
    foodTip:  "Eat complex carbs like oats and sweet potatoes before activity for sustained energy.",
    redirect: "food",
  },
];

// ── Summary Card ──────────────────────────────────────────────────────────
function SummaryCard({ label, value, sub, color }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-gray-400">{sub}</div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ── Attribute Donut Card ───────────────────────────────────────────────────
function AttrCard({ attr, value, navigate }) {
  const { optimal, max, color, lacking, label, unit, icon, goodMsg, badMsg, foodTip, redirect } = attr;
  const isGood = value >= optimal.min && value <= optimal.max;
  const lackingVal = isGood ? 0 : Math.max(0, optimal.min - value);
  const displayPct = Math.round((value / max) * 100);
  const msg = isGood ? goodMsg(value) : badMsg(value, optimal);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}22`,
        boxShadow: `0 4px 24px ${color}0a`,
      }}
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-bold text-white text-sm">{label}</div>
          <div className="text-xs text-gray-500">Optimal: {optimal.min}–{optimal.max}{unit}</div>
        </div>
        <div className="ml-auto">
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{
              background: isGood ? "rgba(34,197,94,0.15)" : "rgba(244,63,94,0.15)",
              color: isGood ? "#22c55e" : "#f43f5e",
            }}
          >
            {isGood ? "✓ Good" : "↑ Improve"}
          </span>
        </div>
      </div>

      {/* Donut + value */}
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <DonutChart value={value} max={max} color={color} lacking={lacking} size={110} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-white leading-none">
              {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}
            </div>
            <div className="text-xs text-gray-500">{unit}</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs text-gray-400">
              Your value:{" "}
              <span className="text-white font-semibold">
                {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}{unit}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 opacity-35" style={{ background: lacking }} />
            <span className="text-xs text-gray-400">
              {isGood
                ? <span className="text-green-400">Within optimal range ✓</span>
                : <>Gap: <span className="text-white font-semibold">{lackingVal}{unit} to reach optimal</ span></>
              }
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {displayPct}% of max range
          </div>
        </div>
      </div>

      {/* Suggestion */}
      <div
        className="rounded-xl p-3 flex flex-col gap-2"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs text-gray-300 leading-relaxed">{msg}</p>
        <p className="text-xs leading-relaxed" style={{ color: `${color}cc` }}>
          🍽️ {foodTip}
        </p>
        <button
          onClick={() => navigate(redirect === "food" ? "/food-lifestyle" : "/stress-relief")}
          className="text-xs font-bold px-3 py-1.5 rounded-lg self-start mt-1 transition-all hover:opacity-80"
          style={{ background: `${color}22`, color }}
        >
          {redirect === "food" ? "→ View Food Tips" : "→ Open Stress Relief"}
        </button>
      </div>
    </div>
  );
}

// ── Stress Score Arc ──────────────────────────────────────────────────────
function StressArc({ score }) {
  const angle = (score / 100) * 180;
  const r = 70;
  const cx = 90, cy = 90;
  const toRad = d => (d * Math.PI) / 180;
  const x = cx + r * Math.cos(toRad(180 - angle));
  const y = cy - r * Math.sin(toRad(180 - angle));
  const color = score <= 33 ? "#00e5c3" : score <= 66 ? "#f59e0b" : "#f43f5e";
  const label = score <= 33 ? "Low" : score <= 66 ? "Moderate" : "High";

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="100" viewBox="0 0 180 100">
        <path d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" strokeLinecap="round"/>
        <path d={`M 20 90 A 70 70 0 0 1 ${x} ${y}`}
          fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
        <circle cx={x} cy={y} r="7" fill="white"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}/>
      </svg>
      <div className="text-4xl font-bold -mt-4" style={{ color }}>{score}</div>
      <div className="text-sm font-semibold mt-1" style={{ color }}>{label} Stress</div>
      <div className="text-xs text-gray-500 mt-1">Latest prediction</div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard({ darkMode }) {
  const [history,  setHistory]  = useState([]);
  const [latest,   setLatest]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/history");
        const records = data.history || [];
        setHistory(records);
        if (records.length > 0) {
          setLatest(records[records.length - 1]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d14" }}>
        <div className="text-center">
          <div className="text-3xl mb-3 animate-pulse">🌙</div>
          <div className="text-gray-400 text-sm">Loading your wellness data...</div>
        </div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d14" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <div className="text-white font-bold text-lg mb-2">No data yet</div>
          <div className="text-gray-400 text-sm mb-6">Make your first prediction to see your dashboard</div>
          <button
            onClick={() => navigate("/predict")}
            className="px-6 py-3 rounded-xl font-bold text-black"
            style={{ background: "#00e5c3" }}
          >
            Go to Predict
          </button>
        </div>
      </div>
    );
  }

  const feat  = latest.input_features || {};
  const score = latest.predicted_stress || 0;

  // Summary stats from history
  const scores    = history.map(h => h.predicted_stress || 0);
  const avgStress = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const lowDays   = scores.filter(s => s <= 33).length;
  const highDays  = scores.filter(s => s > 66).length;
  const bestDay   = history[scores.indexOf(Math.min(...scores))]?.timestamp;
  const worstDay  = history[scores.indexOf(Math.max(...scores))]?.timestamp;

  const fmtDate = ts => ts ? new Date(ts).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "—";

  return (
    <div className="min-h-screen p-5" style={{ background: "#0d0d14" }}>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Showing your latest prediction · {history.length} records total
          </p>
        </div>

        {/* Stress Score Arc + Summary Cards */}
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <StressArc score={score} />

          <div className="grid grid-cols-2 gap-3 flex-1 w-full">
            <SummaryCard label="Avg Stress"   value={avgStress}        sub="across all records"     color="#f59e0b" />
            <SummaryCard label="Total Records" value={history.length}  sub="predictions saved"      color="#8b5cf6" />
            <SummaryCard label="Low Stress Days" value={lowDays}       sub={`Best: ${fmtDate(bestDay)}`}  color="#00e5c3" />
            <SummaryCard label="High Stress Days" value={highDays}     sub={`Worst: ${fmtDate(worstDay)}`} color="#f43f5e" />
          </div>
        </div>

        {/* Attribute Donut Grid */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">
            Your Health Attributes
            <span className="text-xs font-normal text-gray-500 ml-3">
              from latest prediction
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ATTRS.map(attr => {
              const val = feat[attr.key];
              if (val === undefined || val === null) return null;
              return (
                <AttrCard
                  key={attr.key}
                  attr={attr}
                  value={typeof val === "number" ? val : parseFloat(val)}
                  navigate={navigate}
                />
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/predict")}
            className="rounded-2xl p-4 text-left transition-all hover:scale-105"
            style={{ background: "rgba(0,229,195,0.08)", border: "1px solid rgba(0,229,195,0.2)" }}
          >
            <div className="text-xl mb-1">⚡</div>
            <div className="text-white font-bold text-sm">New Prediction</div>
            <div className="text-gray-500 text-xs">Update your stress score</div>
          </button>
          <button
            onClick={() => navigate("/stress-relief")}
            className="rounded-2xl p-4 text-left transition-all hover:scale-105"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <div className="text-xl mb-1">🧘</div>
            <div className="text-white font-bold text-sm">Stress Relief</div>
            <div className="text-gray-500 text-xs">Breathing, games, chatbot</div>
          </button>
        </div>

      </div>
    </div>
  );
}