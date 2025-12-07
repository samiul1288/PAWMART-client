import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";



export default function Login() {
  // dhore nilam useAuth e googleLogin ache
  const { login, loginWithGoogle } = useAuth();
  const [f, setF] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/";

  // === Password Validation ===
  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least 1 uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least 1 lowercase letter";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!f.email) {
      toast.error("Email is required");
      return;
    }
    const pwdError = validatePassword(f.password);
    if (pwdError) {
      toast.error(pwdError);
      return;
    }

    try {
      setLoading(true);
      await login(f.email, f.password);
      toast.success("Logged in successfully");
      nav(from, { replace: true });
    } catch (e2) {
      toast.error(e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Logged in with Google");
      nav(from, { replace: true });
    } catch (e2) {
      toast.error(e2.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="box">
        <div className="login">
          <div className="loginbx">
            <h2>
              <i className="fa-solid fa-right-to-bracket"></i>
              <span> Login </span>
              <i className="fa-solid fa-heart"></i>
            </h2>

            <form onSubmit={submit} className="login-form">
              <input
                type="email"
                placeholder="Email"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
                required
                disabled={loading}
              />

              <input
                type="password"
                placeholder="Password"
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
                required
                disabled={loading}
              />

              <input
                type="submit"
                value={loading ? "Logging in..." : "Sign in"}
                disabled={loading}
                className={loading ? "btn-disabled" : ""}
              />

              {/* Google Sign In */}
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <span className="google-icon">G</span>
                <span>
                  {loading ? "Please wait..." : "Sign in with Google"}
                </span>
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="group">
                <Link to="/forgot-password">forget password</Link>
                <Link to="/register">sign up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
