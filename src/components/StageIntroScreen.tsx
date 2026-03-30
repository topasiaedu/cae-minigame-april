import React from "react";
import { ChevronLeft } from "lucide-react";

/**
 * StageIntroScreen — shown before Stage I, Stage II, and Stage III.
 *
 * Parameterised via `stageNumber` so a single component serves all three
 * intro moments. The visual structure (watermark, staggered reveal, CTA)
 * is identical across stages — only the copy differs.
 */

interface StageIntroScreenProps {
  stageNumber: 1 | 2;
  onProceed: () => void;
  isTransitioning: boolean;
  onBack: () => void;
}

interface StageCopy {
  label: string;
  watermark: string;
  line1: string;
  line2: string;
  cta: string;
}

const STAGE_COPY: Record<1 | 2, StageCopy> = {
  1: {
    label: "STAGE I · THE UNKNOWN",
    watermark: "I",
    line1: "These situations involve uncertainty.",
    line2: "Think of your first three months as you answer.",
    cta: "Begin"
  },
  2: {
    label: "STAGE II · THE AFTERMATH",
    watermark: "II",
    line1: "Now we look back.",
    line2: "Not to judge your first three months — to see them clearly.",
    cta: "Continue"
  }
};

export const StageIntroScreen: React.FC<StageIntroScreenProps> = ({
  stageNumber,
  onProceed,
  isTransitioning,
  onBack
}) => {
  const copy = STAGE_COPY[stageNumber];
  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  return (
    <div
      className={`glass-container ${transClass}`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Near-invisible Roman numeral — visual depth, not decoration */}
      <div className="roman-watermark">{copy.watermark}</div>

      {/* Back button */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "2rem", position: "relative", zIndex: 2 }}
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
          paddingBottom: "2rem",
          maxWidth: "360px",
          margin: "0 auto"
        }}
      >
        <div
          className="animate-fade-up delay-200"
          style={{
            fontSize: "1rem",
            letterSpacing: "2px",
            fontWeight: 600,
            color: "var(--color-gold-dark)",
            opacity: 0,
            marginBottom: "2.5rem",
            textTransform: "uppercase"
          }}
        >
          {copy.label}
        </div>

        <p
          className="animate-fade-up delay-400"
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.7,
            maxWidth: "300px",
            margin: "0 auto 1.2rem",
            color: "var(--color-text)",
            opacity: 0
          }}
        >
          {copy.line1}
        </p>

        <p
          className="animate-fade-up delay-600"
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.7,
            maxWidth: "300px",
            margin: "0 auto",
            color: "var(--color-text)",
            fontStyle: "italic",
            opacity: 0
          }}
        >
          {copy.line2}
        </p>

        <div
          className="animate-fade-up delay-800"
          style={{
            marginTop: "auto",
            paddingTop: "4rem",
            width: "100%",
            maxWidth: "360px",
            opacity: 0
          }}
        >
          <button className="btn-primary" onClick={onProceed}>
            {copy.cta}
          </button>
        </div>
      </div>
    </div>
  );
};
