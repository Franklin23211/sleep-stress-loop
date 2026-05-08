import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Moon, LogOut, User, BarChart2, Brain, Leaf, Home, Sun } from "lucide-react";
import toast from "react-hot-toast";

const navLinks = [
  { to: "/",          label: "Home",      icon: Home },
  { to: "/predict",   label: "Predict",   icon: Brain },
  { to: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { to: "/relief",    label: "Relief",    icon: Moon },
  { to: "/food",      label: "Lifestyle", icon: Leaf },
];

export default function Navbar({ darkMode, toggleTheme }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/landing");
  };

  if (!user) return null;

  return (
    <>
      {/* Top navbar - desktop */}
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border)] px-6 py-3 hidden md:flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg grad-text select-none">
          Sleep Stress Loop
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-[var(--teal)] text-[var(--bg)] font-semibold"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5"
                }`}>
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Dark/Light toggle */}
          <button onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-all">
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link to="/profile"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all">
            <User size={14} />
            <span>{user.username}</span>
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--rose)] hover:bg-white/5 transition-all">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </nav>

      {/* Top bar - mobile */}
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex md:hidden items-center justify-between">
        <Link to="/" className="font-display font-bold text-base grad-text">
          Sleep Stress Loop
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--muted)]">
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link to="/profile"
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--muted)]">
            <User size={15} />
          </Link>
          <button onClick={handleLogout}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--rose)]">
            <LogOut size={15} />
          </button>
        </div>
      </nav>

      {/* Bottom navbar - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-[var(--border)] px-2 py-2 flex items-center justify-around">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? "text-[var(--teal)]" : "text-[var(--muted)]"
              }`}>
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom padding on mobile */}
      <div className="h-16 md:hidden" />
    </>
  );
}