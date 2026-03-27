import React, { useState } from "react";
import { User, Mail } from "lucide-react";

interface LoginScreenProps {
  onLogin: (name: string, email: string) => void;
  isTransitioning: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isTransitioning }) => {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim(), email.trim());
    }
  };

  // Use the same animation classes as every other screen (the previous
  // fade-exit-active / fade-enter-active classes did not exist in the CSS,
  // meaning the login screen was silently skipping its entrance animation).
  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  return (
    <div className={`glass-container ${transClass}`}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>

        <h1
          className="animate-fade-up delay-200"
          style={{
            textAlign: "center",
            fontSize: "2.4rem",
            marginBottom: "2rem",
            fontWeight: 400,
            opacity: 0
          }}
        >
          Predictable Destiny
        </h1>

        <div
          className="animate-fade-up delay-400"
          style={{ marginBottom: "3rem", textAlign: "center", opacity: 0 }}
        >
          <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem", color: "var(--color-text)" }}>
            Every path is shaped by moments where we had to decide before we were completely ready.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            Over the next few minutes, we will revisit these choices.
          </p>
          <p style={{ fontStyle: "italic", opacity: 0.8 }}>
            The mirror will only reflect what is already there.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up delay-600"
          style={{ width: "100%", maxWidth: "360px", margin: "0 auto", opacity: 0 }}
        >
          <div className="input-group">
            <label htmlFor="login-name" className="sr-only">Your name</label>
            <User className="input-icon" size={20} />
            <input
              id="login-name"
              type="text"
              className="input-field"
              placeholder="Your name"
              aria-label="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* "Email" not "Gmail" — the audience includes Outlook, Yahoo, and
              corporate domain users. Branding this as "Gmail" silently excludes them. */}
          <div className="input-group">
            <label htmlFor="login-email" className="sr-only">Email address (optional)</label>
            <Mail className="input-icon" size={20} />
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="Email (Optional)"
              aria-label="Email address (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{
            fontSize: "0.8rem",
            color: "var(--color-text-light)",
            opacity: 0.7,
            textAlign: "center",
            marginTop: "-0.5rem",
            marginBottom: "1.2rem"
          }}>
            So Cae can follow up with you after the session.
          </div>

          {/* "Begin" is an invitation. "Next" is a form label. */}
          <button type="submit" className="btn-primary" disabled={!name.trim()}>
            Begin
          </button>
        </form>

      </div>

    </div>
  );
};
