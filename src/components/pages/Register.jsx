import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  // AuthContext theke loginWithGoogle o nilam
  const { register: signup, loginWithGoogle } = useAuth();
  const [f, setF] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: "success" | "error", message: string }
  const nav = useNavigate();

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
    setAlert(null);

    if (!f.email || !f.password) {
      setAlert({
        type: "error",
        message: "Email and password are required",
      });
      return;
    }

    const pwdError = validatePassword(f.password);
    if (pwdError) {
      setAlert({
        type: "error",
        message: pwdError,
      });
      return;
    }

    try {
      setLoading(true);
      await signup(f.email, f.password);

      setAlert({
        type: "success",
        message: "Account created successfully!",
      });

      nav("/");
    } catch (e2) {
      console.error(e2);
      let message = e2.message || "Register failed";

      if (e2.code === "auth/email-already-in-use") {
        message = "This email already has an account. Please login instead.";
      }

      setAlert({
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google diye register/login
  const handleGoogleRegister = async () => {
    setAlert(null);
    try {
      setLoading(true);
      await loginWithGoogle(); // AuthContext er function

      setAlert({
        type: "success",
        message: "Signed up / logged in with Google!",
      });

      nav("/");
    } catch (e2) {
      console.error(e2);
      setAlert({
        type: "error",
        message: e2.message || "Google sign up failed",
      });
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
              <span> Register </span>
              <i className="fa-solid fa-heart"></i>
            </h2>

            {/* ALERT */}
            {alert && (
              <div
                role="alert"
                className={`alert mb-3 ${
                  alert.type === "success" ? "alert-success" : "alert-error"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{alert.message}</span>
              </div>
            )}

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
                value={loading ? "Creating..." : "Create Account"}
                disabled={loading}
                className={loading ? "btn-disabled" : ""}
              />

              {/* Google Register Button */}
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleRegister}
                disabled={loading}
              >
                <span className="google-icon">G</span>
                <span>
                  {loading ? "Please wait..." : "Sign up with Google"}
                </span>
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="group">
                <span className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="link">
                    Login
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
