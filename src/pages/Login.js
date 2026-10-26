
import React, { useState } from "react";

export default function Login({
  onLogin,
  onError
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedEmail = email.trim();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(cleanedEmail)) {
      const message =
        "Please enter a valid email address.";

      setEmailError(message);
      onError(message);
      return;
    }

    setEmailError("");
    setLoading(true);

    // Demo login.
    
    setTimeout(() => {
      setLoading(false);

      onLogin({
        email: cleanedEmail
      });
    }, 600);
  }

  return (
    <main className="login-layout">
      <section className="login-hero">
        <div className="eyebrow">
          ✦ THE CREATIVE WORKSPACE
        </div>

        <h1>
          Your best shots.
          <br />
          <span>
            Beautifully organized.
          </span>
        </h1>

        <p className="hero-description">
          A focused home for photographers.
          Organize your collections, curate
          your favorite moments, and keep
          your creative workflow moving.
        </p>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1400&q=85"
            alt="Beautiful mountain landscape"
          />

          <div className="hero-image-overlay">
            <small>
              ✦ YOUR CREATIVE SPACE
            </small>

            <strong>
              Every frame has a story.
            </strong>
          </div>
        </div>

        <div className="hero-features">
          <span>
            ✦ Built for photographers
          </span>

          <span>
            ✦ Made for moments
          </span>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-card">
          <div className="eyebrow">
            WELCOME TO PIXELFLOW
          </div>

          <h2>Start creating.</h2>

          <p>
            Enter your email to access
            your photography workspace.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="xxxxxx@example.com"
                autoComplete="email"
                value={email}
                required
                aria-invalid={Boolean(emailError)}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError("");
                }}
              />

              {emailError && (
                <span
                  className="field-error"
                  role="alert"
                >
                  {emailError}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Opening workspace...
                </>
              ) : (
                <>
                  Continue to workspace
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-note">
            Demo access only.
          </div>
        </div>
      </section>
    </main>
  );
}
