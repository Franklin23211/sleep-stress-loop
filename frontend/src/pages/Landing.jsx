import { useNavigate } from "react-router-dom";
import { Brain, BarChart2, Moon, Leaf, ArrowRight, Activity } from "lucide-react";

const features = [
  { icon: Brain,    color: "var(--teal)",   title: "AI Stress Prediction",  desc: "Machine learning model trained on 2000+ records predicts your stress score instantly." },
  { icon: BarChart2,color: "var(--violet)", title: "Visual Dashboard",       desc: "Track your sleep and stress trends over time with beautiful interactive charts." },
  { icon: Moon,     color: "var(--amber)",  title: "Stress Relief Zone",     desc: "Breathing exercises, meditation timer, memory games and a wellness chatbot." },
  { icon: Leaf,     color: "var(--rose)",   title: "Food & Lifestyle Tips",  desc: "Personalised diet, sleep hygiene and daily routine recommendations." },
];

const stats = [
  { value: "2000+", label: "Training Records" },
  { value: "85%",   label: "Model Accuracy" },
  { value: "7",     label: "Health Metrics" },
  { value: "100",   label: "Stress Scale" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 glass border-b border-[var(--border)]">
        <span className="font-display font-bold text-xl grad-text">Sleep Stress Loop</span>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")}
            className="btn-secondary px-4 py-2 text-sm">
            Login
          </button>
          <button onClick={() => navigate("/signup")}
            className="btn-primary px-4 py-2 text-sm">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 fade-up">
        <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-[var(--muted)] mb-6">
          <Activity size={12} style={{ color: "var(--teal)" }} />
          ML-Powered Wellness Tracking
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Track Sleep.<br />
          <span className="grad-text">Beat Stress.</span>
        </h1>
        <p className="text-[var(--muted)] max-w-xl text-lg leading-relaxed mb-10">
          Sleep Stress Loop uses machine learning to analyse your sleep patterns
          and predict stress levels — helping you build healthier habits every day.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => navigate("/signup")}
            className="btn-primary px-8 py-3 text-base flex items-center gap-2">
            Start for Free <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate("/login")}
            className="btn-secondary px-8 py-3 text-base">
            Sign In
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4 mb-20">
        {stats.map(({ value, label }) => (
          <div key={label} className="glass p-6 text-center">
            <p className="font-display text-3xl font-extrabold grad-text">{value}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 mb-24">
        <h2 className="font-display text-3xl font-bold text-center mb-10">
          Everything you need to <span className="grad-text">feel better</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass p-6 hover:-translate-y-1 transition-transform duration-200">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}22` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4 py-20 glass mx-4 mb-10 rounded-2xl max-w-3xl md:mx-auto">
        <h2 className="font-display text-3xl font-bold mb-4">Ready to sleep better?</h2>
        <p className="text-[var(--muted)] mb-8">Join now and get your first stress prediction in under a minute.</p>
        <button onClick={() => navigate("/signup")}
          className="btn-primary px-10 py-3 text-base flex items-center gap-2 mx-auto">
          Get Started Free <ArrowRight size={16} />
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-[var(--muted)] py-6">
        Sleep Stress Loop © 2026 · Built with ML & React
      </footer>
    </div>
  );
}