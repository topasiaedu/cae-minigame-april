import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Dimension } from "../data/content";

interface ConfrontationScreenProps {
  onProceed: () => void;
  isTransitioning: boolean;
  onBack: () => void;
  /** Dominant dimension from Stage I */
  stageIDominant: Dimension;
  /** Whether Stage I dominant differs from Q4 answer */
  hasContradiction: boolean;
  /** Human-readable Stage I behavior, e.g. "moved first" */
  stageIBehaviorText: string;
  /** Human-readable Q4 description, e.g. "you should have moved sooner" */
  q4DescriptionText: string;
  /** Player's Q5 cost answer text */
  playerCostText: string;
}

export const ConfrontationScreen: React.FC<ConfrontationScreenProps> = ({
  onProceed,
  isTransitioning,
  onBack,
  hasContradiction,
  stageIBehaviorText,
  q4DescriptionText,
  playerCostText
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setShowButton(true), 4000);
      return () => clearTimeout(timer);
    }
    setShowButton(false);
    return undefined;
  }, [isTransitioning]);

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  return (
    <div className={`glass-container ${transClass}`} style={{ position: "relative", overflow: "hidden" }}>
      <div className="roman-watermark">III</div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", position: "relative", zIndex: 2 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", marginLeft: "-0.5rem" }}
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
          zIndex: 2
        }}
      >
        <p className="animate-fade-up delay-200" style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "1.5rem" }}>
          You have been making the same call.
        </p>
        <p className="animate-fade-up delay-400" style={{ fontSize: "1.1rem", color: "var(--color-text)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          {hasContradiction && q4DescriptionText.length > 0
            ? `In the first story, you ${stageIBehaviorText}. But looking back at a real moment, you said ${q4DescriptionText}.`
            : "In the first story and in hindsight, the same instinct."}
        </p>
        {playerCostText.trim().length > 0 && (
          <p className="animate-fade-up delay-600" style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--color-text)", marginBottom: "1.5rem" }}>
            And you already named what it costs you.
          </p>
        )}
        <p className="animate-fade-up delay-800" style={{ fontSize: "1rem", color: "var(--color-text-light)", fontStyle: "italic", maxWidth: "320px", lineHeight: 1.7 }}>
          The next questions are not about what might happen. They are about what is already running.
        </p>

        {/* Always in DOM — opacity controls visibility so layout never shifts */}
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            maxWidth: "360px",
            paddingTop: "3rem",
            opacity: showButton ? 1 : 0,
            pointerEvents: showButton ? "auto" : "none",
            transition: "opacity 0.5s ease"
          }}
        >
          <button className="btn-primary" onClick={onProceed}>
            I&apos;m ready
          </button>
        </div>
      </div>
    </div>
  );
};
