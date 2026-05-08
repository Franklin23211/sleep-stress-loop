import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import StressGauge from "../components/StressGauge";
import { Brain, Upload, Download, AlertCircle } from "lucide-react";

const FIELDS = [
  { key: "heart_rate_bpm",     label: "Heart Rate (bpm)",     min: 50,  max: 180, step: 0.1, placeholder: "e.g. 72" },
  { key: "spo2_pct",           label: "SpO2 (%)",             min: 80,  max: 100, step: 0.1, placeholder: "e.g. 97" },
  { key: "sleep_duration_hrs", label: "Sleep Duration (hrs)", min: 3,   max: 12,  step: 0.1, placeholder: "e.g. 7.5" },
  { key: "sleep_quality_1_10", label: "Sleep Quality (1–10)", min: 1,   max: 10,  step: 0.1, placeholder: "e.g. 6" },
  { key: "times_woke",         label: "Times Woke Up",        min: 0,   max: 20,  step: 1,   placeholder: "e.g. 2" },
  { key: "deep_sleep_pct",     label: "Deep Sleep (%)",       min: 0,   max: 100, step: 0.1, placeholder: "e.g. 20" },
  { key: "activity_steps",     label: "Daily Steps",          min: 0,   max: 50000, step: 1, placeholder: "e.g. 6000" },
  { key: "hrv",                label: "HRV (ms) — optional",  min: 0,   max: 300, step: 0.1, placeholder: "e.g. 55 (display only)" },
];

const emptyForm = () =>
  Object.fromEntries(FIELDS.map((f) => [f.key, ""]));

export default function Predict() {
  const [form, setForm]         = useState(emptyForm());
  const [errors, setErrors]     = useState({});
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);

  // ── Validate client-side ───────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    const sleep = parseFloat(form.sleep_duration_hrs);
    const deep  = parseFloat(form.deep_sleep_pct);
    const hr    = parseFloat(form.heart_rate_bpm);
    const spo2  = parseFloat(form.spo2_pct);

    if (!sleep || sleep < 3 || sleep > 12) errs.sleep_duration_hrs = "Must be 3–12 hours";
    if (!hr    || hr < 50   || hr > 180)   errs.heart_rate_bpm     = "Must be 50–180 bpm";
    if (!spo2  || spo2 < 80 || spo2 > 100) errs.spo2_pct           = "Must be 80–100%";
    if (deep > 100 || deep < 0)             errs.deep_sleep_pct     = "Must be 0–100%";
    if (parseInt(form.times_woke) < 0)      errs.times_woke         = "Cannot be negative";
    return errs;
  };

  // ── Predict ────────────────────────────────────────────────────────────────
  const handlePredict = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form)
          .filter(([k]) => k !== "hrv")
          .map(([k, v]) => [k, Number(v)])
      );
      const { data } = await api.post("/predict", payload);
      setResult({ ...data, hrv: form.hrv });
    } catch (err) {
      const msg = err.response?.data?.error || "Prediction failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Push data ──────────────────────────────────────────────────────────────
  const handlePush = async () => {
    if (!result) { toast.error("Run a prediction first"); return; }
    try {
      const input_features = Object.fromEntries(
        Object.entries(form).filter(([k]) => k !== "hrv").map(([k, v]) => [k, Number(v)])
      );
      await api.post("/push-data", {
        input_features,
        predicted_stress: result.stress_score,
        stress_category: result.stress_category,
        hrv: form.hrv ? Number(form.hrv) : null,
      });
      toast.success("Data saved to your profile ✅");
    } catch {
      toast.error("Failed to save data");
    }
  };

  // ── Retrieve data ──────────────────────────────────────────────────────────
  const handleRetrieve = async () => {
    try {
      const { data } = await api.get("/retrieve-data");
      if (!data.data) { toast("No saved data found"); return; }
      const saved = data.data.input_features;
      setForm((prev) => ({
        ...prev,
        ...Object.fromEntries(Object.entries(saved).map(([k, v]) => [k, String(v)])),
        hrv: data.data.hrv ? String(data.data.hrv) : "",
      }));
      toast.success("Last saved data loaded ✅");
    } catch {
      toast.error("Failed to retrieve data");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 fade-up">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--teal)]/20 flex items-center justify-center">
          <Brain size={20} style={{ color: "var(--teal)" }} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Predict Stress</h1>
          <p className="text-sm text-[var(--muted)]">Enter your sleep & health data for an AI prediction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Form */}
        <form onSubmit={handlePredict} className="glass p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map(({ key, label, min, max, step, placeholder }) => (
              <div key={key}>
                <label className="text-sm text-[var(--muted)] mb-1.5 block">
                  {label}
                  {key === "hrv" && (
                    <span className="ml-2 text-xs text-[var(--violet)]">(not used by model)</span>
                  )}
                </label>
                <input
                  type="number"
                  min={min} max={max} step={step}
                  className={`input-field ${errors[key] ? "border-[var(--rose)]" : ""}`}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => {
                    setForm({ ...form, [key]: e.target.value });
                    if (errors[key]) setErrors({ ...errors, [key]: null });
                  }}
                  required={key !== "hrv"}
                />
                {errors[key] && (
                  <p className="flex items-center gap-1 text-xs text-[var(--rose)] mt-1">
                    <AlertCircle size={11} /> {errors[key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Stress category dropdown (display-only, reflects result) */}
          <div className="mt-4">
            <label className="text-sm text-[var(--muted)] mb-1.5 block">Stress Category (predicted)</label>
            <select
              className="input-field"
              value={result?.stress_category || ""}
              readOnly
              disabled
            >
              <option value="">— will appear after prediction —</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
              <Brain size={15} />
              {loading ? "Predicting…" : "Predict Stress"}
            </button>
            <button type="button" onClick={handlePush} className="btn-secondary px-4 py-2.5 text-sm flex items-center gap-2">
              <Upload size={14} /> Push Data
            </button>
            <button type="button" onClick={handleRetrieve} className="btn-secondary px-4 py-2.5 text-sm flex items-center gap-2">
              <Download size={14} /> Retrieve Data
            </button>
          </div>
        </form>

        {/* Result panel */}
        <div className="glass p-6 flex flex-col items-center justify-center min-h-[300px]">
          {result ? (
            <>
              <StressGauge score={result.stress_score} />
              <div className="mt-4 text-center px-2">
                <p className="text-sm text-[var(--muted)] leading-relaxed">{result.interpretation}</p>
                {result.hrv && (
                  <p className="mt-3 text-xs text-[var(--violet)]">HRV recorded: {result.hrv} ms</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-[var(--muted)]">
              <Brain size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Your stress score will appear here after prediction</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}