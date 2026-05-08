import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Brain, BarChart2, Moon, Leaf, ArrowRight } from "lucide-react";

const cards = [
  {
    to: "/predict",
    icon: Brain,
    color: "var(--teal)",
    title: "Predict Stress",
    desc: "Input your sleep & health data to get an instant AI-powered stress score.",
  },
  {
    to: "/dashboard",
    icon: BarChart2,
    color: "var(--violet)",
    title: "Dashboard",
    desc: "Visualise your historical stress, sleep quality, and HRV trends over time.",
  },
  {
    to: "/relief",
    icon: Moon,
    color: "var(--amber)",
    title: "Stress Relief",
    desc: "Guided breathing, meditation timer, memory games, and a calming chatbot.",
  },
  {
    to: "/food",
    icon: Leaf,
    color: "var(--rose)",
    title: "Food & Lifestyle",
    desc: "Diet tips, sleep hygiene advice, and daily routine improvements.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="max-w-5xl mx-auto px-4 py-14 fade-up">
      {/* Hero */}
      <div className="mb-14 text-center">
        <p className="text-[var(--muted)] text-sm mb-2 font-display tracking-widest uppercase">
          Welcome back
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
          Hello, <span className="grad-text">{user?.username}</span> 👋
        </h1>
        <p className="text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
          Sleep Stress Loop uses machine learning to decode how your sleep patterns affect your
          stress levels — helping you build healthier habits, one night at a time.
        </p>
      </div>

      {/* Benefit pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-14">
        {["🧠 AI-powered predictions","📊 Track trends over time","🌙 Personalised tips","🎮 Stress-relief games"].map((b) => (
          <span key={b} className="glass px-4 py-1.5 rounded-full text-sm text-[var(--muted)]">{b}</span>
        ))}
      </div>

      {/* Nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cards.map(({ to, icon: Icon, color, title, desc }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="glass p-6 text-left group hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${color}22` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <h3 className="font-display font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
              Get started <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}