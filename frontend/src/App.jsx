import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Dashboard from "./pages/Dashboard";
import StressRelief from "./pages/StressRelief";
import FoodLifestyle from "./pages/FoodLifestyle";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-[var(--muted)]">Loading…</div>;
  return user ? children : <Navigate to="/landing" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <AuthProvider>
      <div className={`noise min-h-screen ${darkMode ? "" : "light-mode"}`}>
        <Routes>
          <Route path="/landing"   element={<Landing darkMode={darkMode} toggleTheme={toggleTheme} />} />
          <Route path="/login"     element={<PublicRoute><><Navbar darkMode={darkMode} toggleTheme={toggleTheme} /><Login /></></PublicRoute>} />
          <Route path="/signup"    element={<PublicRoute><><Navbar darkMode={darkMode} toggleTheme={toggleTheme} /><Signup /></></PublicRoute>} />
          <Route path="/"          element={<PrivateRoute><><Navbar darkMode={darkMode} toggleTheme={toggleTheme} /><Home /></></PrivateRoute>} />
          <Route path="/predict"   element={<PrivateRoute><><Navbar darkMode={darkMode} toggleTheme={toggleTheme} /><Predict /></></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><><Navbar darkMode={darkMode} toggleTheme={toggleTheme} /><Dashboard /></></PrivateRoute>} />
          <Route path="/relief"    element={<PrivateRoute><><Navbar darkMode={darkMode} toggleTheme={toggleTheme} /><StressRelief /></></PrivateRoute>} />
          <Route path="/food"      element={<PrivateRoute><><Navbar darkMode={darkMode} toggleTheme={toggleTheme} /><FoodLifestyle /></></PrivateRoute>} />
          <Route path="/profile"   element={<PrivateRoute><><Navbar darkMode={darkMode} toggleTheme={toggleTheme} /><Profile /></></PrivateRoute>} />
          <Route path="*"          element={<Navigate to="/landing" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}