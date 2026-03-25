import React from "react";
import { dynamicTriggers, Dimension } from "../data/content";
import { ChevronLeft } from "lucide-react";

interface ReflectionScreenProps {
  triggerBlock: number;
  dominantDimension: Dimension;
  onProceed: () => void;
  isTransitioning: boolean;
  onBack: () => void;
  /** Player's first name — used in Reflection 1 to make the first mirror moment personal */
  name: string;
}

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({
  triggerBlock,
  dominantDimension,
  onProceed,
  isTransitioning,
  onBack,
  name
}) => {
  /**
   * Header and CTA copy deliberately vary across the three trigger blocks:
   *
   * Reflection 1 — uses the player's name. The game knows you at this point.
   *                CTA: "I see it." (acknowledges the mirror, not a dismissal)
   * Reflection 2 — more impersonal, more clinical. The pattern is named as a habit.
   *                CTA: "Keep going." (implies there's still more to discover)
   * Reflection 3 — the most confrontational. The map is drawn.
   *                CTA: "Show me." (hunger to see the result)
   */
  let reflectionText = "";
  let headerText     = "";
  let ctaText        = "";
  let watermarkNumeral = "I";

  if (triggerBlock === 1) {
    reflectionText  = dynamicTriggers["stage1"][dominantDimension];
    // Use first name only. If name is empty for any reason, fall back to neutral header.
    headerText      = name.trim() ? `Have you noticed, ${name.trim().split(" ")[0]}?` : "Have you noticed something?";
    ctaText         = "I see it.";
    watermarkNumeral = "I";
  } else if (triggerBlock === 2) {
    reflectionText  = dynamicTriggers["stage2"][dominantDimension];
    headerText      = "A silent repetition.";
    ctaText         = "Keep going.";
    watermarkNumeral = "II";
  } else {
    reflectionText  = dynamicTriggers["stage3"][dominantDimension];
    headerText      = "You've been here before.";
    ctaText         = "Show me.";
    watermarkNumeral = "III";
  }

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  return (
    <div
      className={`glass-container ${transClass}`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Near-invisible Roman numeral watermark — provides depth and stage context
          without explaining anything. The opacity is set in index.css (.roman-watermark). */}
      <div className="roman-watermark">{watermarkNumeral}</div>

      {/* Back button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "5rem",
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

      {/* Main content */}
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
        <h2
          className="animate-fade-up delay-200"
          style={{ fontSize: "2rem", marginBottom: "2.5rem", fontWeight: 400 }}
        >
          {headerText}
        </h2>

        <p
          className="animate-fade-up delay-400"
          style={{
            fontSize: "1.25rem",
            lineHeight: 1.8,
            maxWidth: "320px",
            margin: "0 auto",
            color: "var(--color-text)"
          }}
        >
          {reflectionText}
        </p>

        {/* Thin gold divider — gives the reflection space to breathe */}
        <div
          className="animate-fade-up delay-600"
          style={{
            width: "40px",
            height: "1px",
            background: "var(--color-gold-mid)",
            margin: "2.5rem auto 0"
          }}
        />

        <div
          className="animate-fade-up delay-800"
          style={{
            marginTop: "auto",
            paddingTop: "3rem",
            width: "100%",
            maxWidth: "360px",
            paddingBottom: "2rem"
          }}
        >
          <button className="btn-primary" onClick={onProceed}>
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};
