import React, { useEffect, useState } from "react";

interface BreatheScreenProps {
  onProceed: () => void;
  isTransitioning: boolean;
}

/**
 * BreatheScreen inserts a short, player-controlled pause between Surprise and Stage III.
 * The button is intentionally delayed to create breathing room before escalation.
 */
export const BreatheScreen: React.FC<BreatheScreenProps> = ({
  onProceed,
  isTransitioning
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      // Brief pause so the text lands before the button appears.
      // Kept short (2s) because the Surprise Screen already held the player for 4s.
      const timer = setTimeout(() => setShowButton(true), 2000);
      return () => clearTimeout(timer);
    }
    setShowButton(false);
    return undefined;
  }, [isTransitioning]);

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  return (
    <div
      className={`glass-container ${transClass}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      <p
        className="animate-fade-up delay-400"
        style={{
          fontSize: "1.8rem",
          fontWeight: 400,
          color: "var(--color-text)",
          textAlign: "center"
        }}
      >
        Take a breath.
      </p>

      {showButton && (
        <div className="animate-fade-up" style={{ marginTop: "2.5rem", width: "100%", maxWidth: "360px" }}>
          <button className="btn-primary" onClick={onProceed}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};
