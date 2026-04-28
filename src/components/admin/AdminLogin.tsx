import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-spot-dark px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo className="text-4xl mb-2" />
          <p className="text-spot-muted text-sm font-body">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 font-body">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 font-body mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-spot-card border border-spot-border rounded-lg px-4 py-2.5 text-white font-body focus:outline-none focus:border-spot-green/50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 font-body mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-spot-card border border-spot-border rounded-lg px-4 py-2.5 text-white font-body focus:outline-none focus:border-spot-green/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-spot-green text-spot-dark font-heading font-bold text-lg py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
