
import { useState } from "react";
import "./style.scss";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const email = e.currentTarget.elements.email.value.trim();
    const password = e.currentTarget.elements.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setErr("Incorrect email or password.");
      } else if (error.code === "auth/invalid-email") {
        setErr("Please enter a valid email address.");
      } else {
        setErr("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer loginContainer">
      <div className="formWrapper loginWrapper">
        <div className="loginBrand">
          <span className="loginBrandIcon">F</span>
          <span className="logo">FriendsChat</span>
        </div>

        <div className="loginHeading">
          <h1>Welcome back!</h1>
          <p>Sign in to continue chatting with your friends.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="loginField">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="loginField">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {err && (
            <div className="loginError" role="alert">
              {err}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="loginRegisterLink">
            Don't have an account?
            <Link to="/register">Create an account</Link>
          </p>
        </form>

        <div className="loginFooter">
          Your conversations, all in one place.
        </div>
      </div>
    </div>
  );
};

export default Login;
