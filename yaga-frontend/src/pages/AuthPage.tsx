import { useState, type FC, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Share2,
  Server,
  Zap,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Key,
  Wallet,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const AuthPage: FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    bio: "",
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          bio: formData.bio || undefined,
        });
      } else {
        await login({
          usernameOrEmail: formData.username || formData.email,
          password: formData.password,
        });
      }
      navigate("/feed");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        setError(String(err.response.data.message));
      } else {
        setError(
          isSignUp
            ? "Registration failed. Please check your inputs."
            : "Invalid credentials. Please verify your username/email and password.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#111428] via-[#1e1b4b] to-[#4338ca] p-4 text-slate-100 lg:p-12">
      {/* Main Container */}
      <div className="grid min-h-[85vh] w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Hero Section (Graph & Brand) */}
        <div className="flex h-full flex-col justify-between py-6 pr-0 lg:col-span-7 lg:pr-8">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Relaymesh
              </h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
                Distributed Social
              </p>
            </div>
          </div>

          {/* Graph Abstract Visualization */}
          <div className="relative my-12 flex items-center justify-center">
            <svg
              className="h-56 w-full max-w-lg"
              viewBox="0 0 500 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Edges */}
              <line
                x1="80"
                y1="100"
                x2="160"
                y2="40"
                stroke="#818cf8"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <line
                x1="80"
                y1="100"
                x2="160"
                y2="160"
                stroke="#818cf8"
                strokeWidth="2"
              />
              <line
                x1="160"
                y1="40"
                x2="280"
                y2="90"
                stroke="#a5b4fc"
                strokeWidth="2.5"
              />
              <line
                x1="160"
                y1="160"
                x2="280"
                y2="90"
                stroke="#818cf8"
                strokeWidth="2"
              />
              <line
                x1="280"
                y1="90"
                x2="380"
                y2="30"
                stroke="#c7d2fe"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line
                x1="280"
                y1="90"
                x2="390"
                y2="150"
                stroke="#818cf8"
                strokeWidth="2"
              />

              {/* Nodes */}
              <g transform="translate(80, 100)">
                <circle r="18" fill="#4f46e5" />
                <circle r="8" fill="#ffffff" />
              </g>
              <g transform="translate(160, 40)">
                <circle r="14" fill="#6366f1" opacity="0.9" />
              </g>
              <g transform="translate(160, 160)">
                <circle r="14" fill="#6366f1" opacity="0.9" />
              </g>
              <g transform="translate(280, 90)">
                <circle r="24" fill="#4338ca" />
                <circle r="12" fill="#ffffff" />
                <circle r="6" fill="#4f46e5" />
              </g>
              <g transform="translate(380, 30)">
                <circle r="12" fill="#818cf8" />
              </g>
              <g transform="translate(390, 150)">
                <circle r="15" fill="#ffffff" />
              </g>
            </svg>
          </div>

          {/* Hero Copy */}
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
              Your social graph,
              <br />
              <span className="bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                owned by no one.
              </span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 lg:text-base">
              Federated relays, portable identity, and real-time presence — a
              distributed network powered by Neo4j, RustFS, and reactive
              WebSockets that stays up even when individual nodes don't.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <Server className="mb-2 h-5 w-5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">
                  Federated Relays
                </h4>
                <p className="mt-1 text-xs text-slate-400">
                  Multi-region, zero SPOF
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <Zap className="mb-2 h-5 w-5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Real-time Sync</h4>
                <p className="mt-1 text-xs text-slate-400">
                  WebSocket &lt; 50ms
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <ShieldCheck className="mb-2 h-5 w-5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">You Own Data</h4>
                <p className="mt-1 text-xs text-slate-400">S3 / RustFS Blobs</p>
              </div>
            </div>
          </div>

          {/* Bottom Tag */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center">
              <Lock className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
              End-to-end encrypted DMs
            </span>
            <span>•</span>
            <span>Neo4j Cypher Graph Engine</span>
            <span>•</span>
            <span>Web Push VAPID</span>
          </div>
        </div>

        {/* Right Authentication Form Card */}
        <div className="rounded-3xl bg-white p-8 text-slate-800 shadow-2xl shadow-black/40 sm:p-10 lg:col-span-5">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Welcome to Relaymesh
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              One identity across every federated instance.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Tabs (Sign In / Sign Up) */}
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 rounded-lg py-2 text-xs transition-all ${
                !isSignUp
                  ? "bg-white font-bold text-slate-900 shadow-sm"
                  : "font-semibold text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 rounded-lg py-2 text-xs transition-all ${
                isSignUp
                  ? "bg-white font-bold text-slate-900 shadow-sm"
                  : "font-semibold text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                {isSignUp ? "Username" : "Username or Email"}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs text-slate-400">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={isSignUp ? "username" : "username or email"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3.5 pl-8 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@domain.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Short Bio
                </label>
                <input
                  type="text"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell others about you"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              <span>
                {loading
                  ? "Processing..."
                  : isSignUp
                    ? "Get Started"
                    : "Sign In"}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 font-medium text-slate-400">
                  or
                </span>
              </div>
            </div>

            {/* Passkey / Wallet Quick Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Key className="h-3.5 w-3.5 text-indigo-600" />
                <span>Passkey</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Wallet className="h-3.5 w-3.5 text-indigo-600" />
                <span>Wallet</span>
              </button>
            </div>

            <p className="mt-4 text-center text-[10px] text-slate-400">
              By continuing you agree to the Relay Protocol & Distributed Terms.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
