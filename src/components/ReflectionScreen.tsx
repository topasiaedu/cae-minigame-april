import React, { useState, useEffect } from "react";
import { dynamicTriggers, Dimension } from "../data/content";
import { ChevronLeft } from "lucide-react";

interface ReflectionScreenProps {
  triggerBlock: number;
  dominantDimension: Dimension;
  /** How many of the last 3 answers matched the dominant dimension (1-3) */
  dominantCount: number;
  onProceed: () => void;
  isTransitioning: boolean;
  onBack: () => void;
  /** Player's first name — used in Reflection 1 to make the first mirror moment personal */
  name: string;
}

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({
  triggerBlock,
  dominantDimension,
  dominantCount,
  onProceed,
  isTransitioning,
  onBack,
  name
}) => {
  /**
   * Header and CTA copy deliberately vary across the two trigger blocks:
   *
   * Reflection 1 — uses the player's name. The game knows you at this point.
   *                CTA: "I see it." (acknowledges the mirror, not a dismissal)
   * Reflection 2 — more impersonal, more clinical. The pattern is named as a habit.
   *                CTA: "Keep going." (implies there's still more to discover)
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
    // Safety fallback — triggerBlock 3 no longer fires in the normal game flow.
    // Defaults to stage2 content to avoid an empty screen if state ever goes out of sync.
    reflectionText  = dynamicTriggers["stage2"][dominantDimension];
    headerText      = "A silent repetition.";
    ctaText         = "Keep going.";
    watermarkNumeral = "II";
  }

  /**
   * Gate the continue button behind a 3.5-second delay.
   * Long enough to force reading the reflection text. Short enough
   * that fast readers don't think the screen is broken.
   * The reflection-timer-line CSS animation duration must match this value.
   */
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setShowButton(true), 3500);
      return () => clearTimeout(timer);
    }
    setShowButton(false);
    return undefined;
  }, [isTransitioning, triggerBlock]);

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  /**
   * Renders a string as individual character spans, each animated in
   * with a staggered delay. Space characters use .char-span-space for
   * correct width without invisible animated elements.
   *
   * @param text - The string to render character by character.
   * @param baseDelay - The delay (in seconds) before the first character appears.
   * @returns An array of span elements.
   */
  const renderCharByChar = (text: string, baseDelay: number): React.ReactElement[] => {
    return text.split("").map((char, idx): React.ReactElement => {
      if (char === " ") {
        return <span key={idx} className="char-span-space" />;
      }
      return (
        <span
          key={idx}
          className="char-span"
          style={{ animationDelay: `${baseDelay + idx * 0.04}s` }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div
      className={`glass-container ${transClass}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...(triggerBlock === 3 && {
          background: "rgba(100, 50, 15, 0.1)",
          animationDuration: triggerBlock === 3 && !isTransitioning ? "1.1s" : undefined
        })
      }}
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
          className={triggerBlock === 2 ? "char-reveal-container delay-200" : "animate-fade-up delay-200"}
          style={{ fontSize: "2rem", marginBottom: "2.5rem", fontWeight: 400 }}
        >
          {triggerBlock === 2
            ? renderCharByChar(headerText, 0.2)
            : headerText
          }
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

        {dominantCount >= 2 && (
          <p
            className="animate-fade-up delay-600"
            style={{
              fontSize: "1rem",
              color: "var(--color-text-light)",
              fontStyle: "italic",
              marginTop: "1.5rem",
              textAlign: "center",
              opacity: 0
            }}
          >
            {dominantCount === 3
              ? "Each of your last three answers pointed in the same direction."
              : "Two of your last three answers leaned the same way."}
          </p>
        )}

        <div className="reflection-timer-line" />

        {/* Continue button — only shown after 5 seconds to encourage reading */}
        {showButton && (
          <div
            className="animate-fade-up"
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
        )}
      </div>
    </div>
  );
};
