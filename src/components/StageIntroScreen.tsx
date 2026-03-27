import React from "react";
import { ChevronLeft } from "lucide-react";

/**
 * StageIntroScreen — shown once, between Reflection 2 and Q11.
 *
 * Purpose: give the player a felt sense that Stage III is different
 * before it begins. The questions stop asking "what would you do?"
 * and start asking "what do you already know about yourself?"
 *
 * The Roman numeral III watermark (via .roman-watermark CSS class) gives
 * visual depth without explaining anything.
 */

interface StageIntroScreenProps {
  onProceed: () => void;
  isTransitioning: boolean;
  onBack: () => void;
}

export const StageIntroScreen: React.FC<StageIntroScreenProps> = ({
  onProceed,
  isTransitioning,
  onBack
}) => {
  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  return (
    <div
      className={`glass-container ${transClass}`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Near-invisible Roman numeral III — visual depth, not decoration */}
      <div className="roman-watermark">III</div>

      {/* Back button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "4rem",
          position: "relative",
          zIndex: 2
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            marginLeft: "-0.5rem"
          }}
          aria-label="Go back"
        >
          <ChevronLeft size={24} color="var(--color-text)" />
        </button>
      </div>

      {/* Main content — centred, staggered reveal */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          paddingBottom: "2rem"
        }}
      >
        {/* Stage label */}
        <div
          className="animate-fade-up delay-200"
          style={{
            fontSize: "0.72rem",
            letterSpacing: "4px",
            fontWeight: 600,
            color: "var(--color-gold-dark)",
            opacity: 0,
            marginBottom: "2rem",
            textTransform: "uppercase"
          }}
        >
          Stage III · The Mirror
        </div>

        {/* Header */}
        <h2
          className="animate-fade-up delay-400"
          style={{
            fontSize: "2rem",
            marginBottom: "2.5rem",
            fontWeight: 400,
            opacity: 0
          }}
        >
          This section is different.
        </h2>

        {/* First body line */}
        <p
          className="animate-fade-up delay-600"
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.9,
            maxWidth: "300px",
            margin: "0 auto 1.2rem",
            color: "var(--color-text)",
            opacity: 0
          }}
        >
          The next questions are not about what might happen.
        </p>

        {/* Second body line — italic, softer — the emotional punchline */}
        <p
          className="animate-fade-up delay-800"
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.9,
            maxWidth: "300px",
            margin: "0 auto",
            color: "var(--color-text-light)",
            fontStyle: "italic",
            opacity: 0
          }}
        >
          They are about what has already been happening — for a long time.
        </p>

        {/* CTA — appears last, after the copy has landed */}
        <div
          className="animate-fade-up delay-1000"
          style={{
            marginTop: "auto",
            paddingTop: "4rem",
            width: "100%",
            maxWidth: "360px",
            opacity: 0
          }}
        >
          <button className="btn-primary" onClick={onProceed}>
            I'm ready
          </button>
        </div>
      </div>
    </div>
  );
};
