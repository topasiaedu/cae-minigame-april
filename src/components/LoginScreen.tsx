import React, { useState } from "react";
import { User } from "lucide-react";

interface LoginScreenProps {
  onLogin: (name: string) => void;
  isTransitioning: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isTransitioning }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
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
            fontSize: "2.2rem",
            marginBottom: "2rem",
            fontWeight: 600,
            opacity: 0
          }}
        >
          Predictable Destiny
        </h1>

        <div
          className="animate-fade-up delay-400"
          style={{ marginBottom: "3rem", textAlign: "center", opacity: 0 }}
        >
          <p style={{ marginBottom: "0.9rem", fontSize: "1.15rem", fontWeight: 500, color: "var(--color-text)" }}>
            The first three months are done.
          </p>
          <p style={{ marginBottom: "0.9rem", fontSize: "1.05rem", color: "var(--color-text)" }}>
            Before April begins, this will show you how you have been deciding.
          </p>
          <p style={{ marginBottom: "0.9rem", fontSize: "0.95rem", color: "var(--color-text-light)" }}>
            It takes about 8 minutes. There are no right answers.
          </p>
          <p style={{ fontStyle: "italic", fontSize: "0.95rem", color: "var(--color-text-light)" }}>
            As you answer, let your first three months come to mind.
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

          <button type="submit" className="btn-primary" disabled={!name.trim()}>
            Begin
          </button>
        </form>

      </div>

    </div>
  );
};
