import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { User, Activity } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/history").then(({ data }) => {
      const h = data.history || [];
      if (!h.length) return;
      const scores = h.map((r) => r.predicted_stress);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const low  = h.filter((r) => r.stress_category === "Low").length;
      const mod  = h.filter((r) => r.stress_category === "Moderate").length;
      const high = h.filter((r) => r.stress_category === "High").length;
      setStats({ count: h.length, avg: avg.toFixed(1), low, mod, high });
    });
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 fade-up">
      <div className="glass p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--teal)] to-[var(--violet)] flex items-center justify-center">
            <User size={30} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{user?.username}</h1>
            <p className="text-[var(--muted)] text-sm">Sleep Stress Loop member</p>
          </div>
        </div>

        {stats ? (
          <div>
            <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Activity size={16} style={{ color: "var(--teal)" }} /> Your Stats
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Predictions", value: stats.count },
                { label: "Avg Stress",  value: stats.avg, unit: "/100" },
                { label: "Low days",    value: stats.low,  color: "var(--teal)" },
                { label: "High days",   value: stats.high, color: "var(--rose)" },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="glass p-4 text-center">
                  <p className="font-display text-2xl font-bold" style={{ color }}>
                    {value}{unit}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[var(--muted)] text-sm">No prediction history yet. Head to Predict to get started!</p>
        )}
      </div>
    </main>
  );
}