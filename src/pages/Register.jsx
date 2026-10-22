
import { useState } from "react";
import "./style.scss";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const avatars = Array.from(
  { length: 11 },
  (_, index) => `/avatars/avatar${index + 1}.png`
);

const Register = () => {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const form = e.currentTarget;
    const nickName = form.elements.nickname.value.trim();
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(res.user, {
        displayName: nickName,
        photoURL: selectedAvatar,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: nickName,
        email,
        photoURL: selectedAvatar,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});

      // Sign out so the new user can sign in from the login page
      await signOut(auth);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);

      if (error.code === "auth/email-already-in-use") {
        setErr("This email is already registered. Please sign in.");
      } else if (error.code === "auth/weak-password") {
        setErr("Please choose a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setErr("Please enter a valid email address.");
      } else {
        setErr(
          "We couldn't complete your registration. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer registerContainer">
      <div className="formWrapper registerWrapper">
        <div className="registerBrand">
          <span className="registerBrandIcon">F</span>
          <span className="logo">FriendsChat</span>
        </div>

        <div className="registerHeading">
          <h1>Create your account</h1>
          <p>Join FriendsChat and stay connected.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="registerField">
            <label htmlFor="register-nickname">Nickname</label>
            <input
              id="register-nickname"
              type="text"
              name="nickname"
              placeholder="What should we call you?"
              autoComplete="nickname"
              required
            />
          </div>

          <div className="registerField">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="registerField">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="registerAvatarSection">
            <div className="registerAvatarHeading">
              <div>
                <span className="registerAvatarTitle">
                  Profile picture
                </span>
                <span className="registerAvatarSubtitle">
                  Choose an avatar you like
                </span>
              </div>

              <img
                className="registerSelectedAvatar"
                src={selectedAvatar}
                alt="Your selected avatar"
              />
            </div>

            <button
              type="button"
              className="registerAvatarTrigger"
              onClick={() => setShowAvatars((prev) => !prev)}
              aria-expanded={showAvatars}
              aria-controls="register-avatar-options"
            >
              {showAvatars ? "Close avatar choices" : "Choose an avatar"}
              <span>{showAvatars ? "▲" : "▼"}</span>
            </button>

            {showAvatars && (
              <div
                className="registerAvatarGrid"
                id="register-avatar-options"
              >
                {avatars.map((avatar, index) => (
                  <button
                    type="button"
                    key={avatar}
                    className={`registerAvatarOption ${
                      selectedAvatar === avatar ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedAvatar(avatar);
                      setShowAvatars(false);
                    }}
                    aria-label={`Select avatar ${index + 1}`}
                    aria-pressed={selectedAvatar === avatar}
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} />

                    {selectedAvatar === avatar && (
                      <span className="registerAvatarCheck">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {err && (
            <div className="registerError" role="alert">
              {err}
            </div>
          )}

          <button
            className="registerSubmit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="registerLoginLink">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </form>

        <div className="registerFooter">
          Your conversations, all in one place.
        </div>
      </div>
    </div>
  );
};

export default Register;
