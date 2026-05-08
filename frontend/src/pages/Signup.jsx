import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/signup", form);
      login(data.token, data.username);
      toast.success("Account created! Welcome 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <div className="glass p-8 w-full max-w-md fade-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--violet)] to-[var(--teal)] flex items-center justify-center mb-4">
            <Sparkles size={22} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold">Create account</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Start tracking your wellness</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { key: "username", label: "Username", type: "text", placeholder: "johndoe" },
            { key: "email",    label: "Email",    type: "email", placeholder: "you@example.com" },
            { key: "password", label: "Password", type: "password", placeholder: "Min. 6 characters" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-sm text-[var(--muted)] mb-1.5 block">{label}</label>
              <input
                type={type}
                className="input-field"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 mt-2 text-sm"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--teal)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}