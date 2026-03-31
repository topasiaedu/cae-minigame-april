import React, { useEffect, useMemo, useState } from "react";
import {
  Dimension,
  questions,
  reflectionBalancedLines,
  reflectionFriction,
  reflectionObservations,
  stageIBehaviorText,
  q4DescriptionText
} from "../data/content";
import { ChevronLeft } from "lucide-react";

interface ReflectionScreenProps {
  triggerBlock: number;
  dominantDimension: Dimension;
  dominantCount: number;
  onProceed: () => void;
  isTransitioning: boolean;
  onBack: () => void;
  stageAnswers: Dimension[];
  name: string;
  allAnswers: Dimension[];
  /** Dominant dimension from Stage I (Q1-Q3). Used for contradiction detection in block 2. */
  stageIDominant: Dimension;
  /** The player's Q5 cost text. Shown in block 2 reflection. Empty string if not yet answered. */
  playerCostText: string;
}

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({
  triggerBlock,
  dominantDimension,
  dominantCount,
  onProceed,
  isTransitioning,
  onBack,
  stageAnswers,
  stageIDominant,
  playerCostText
}) => {
  const questionOffset = triggerBlock === 1 ? 0 : 3;
  const watermarkNumeral = triggerBlock === 1 ? "I" : "II";
  const ctaText = triggerBlock === 1 ? "Continue" : "Keep going";

  const stageAnswerTexts = useMemo(
    () =>
      stageAnswers.map((dimension, answerIndex) => {
        const question = questions[questionOffset + answerIndex];
        if (question === undefined) return "";
        const option = question.options.find((item) => item.id === dimension);
        return option === undefined ? "" : option.text;
      }),
    [questionOffset, stageAnswers]
  );

  const hasContradiction = useMemo((): boolean => {
    if (triggerBlock !== 2) return false;
    const q4Answer = stageAnswers[0];
    if (q4Answer === undefined) return false;
    return stageIDominant !== q4Answer;
  }, [triggerBlock, stageAnswers, stageIDominant]);

  const observationText = useMemo((): string => {
    if (triggerBlock === 1) {
      if (dominantCount === 3) return reflectionObservations.stage1[dominantDimension];
      if (dominantCount === 2) return reflectionBalancedLines.stage1Moderate;
      return reflectionBalancedLines.stage1;
    }
    if (hasContradiction) {
      const q4Answer = stageAnswers[0];
      if (q4Answer !== undefined) {
        return `In the first story, you ${stageIBehaviorText[stageIDominant]} every time. But looking back, you said ${q4DescriptionText[q4Answer]}.`;
      }
    }
    if (dominantCount === 3) return reflectionObservations.stage2[dominantDimension];
    if (dominantCount === 2) return reflectionBalancedLines.stage2Moderate;
    return reflectionBalancedLines.stage2;
  }, [dominantCount, dominantDimension, triggerBlock, hasContradiction, stageAnswers, stageIDominant]);

  const frictionText = useMemo((): string => {
    if (triggerBlock === 1) {
      return dominantCount >= 2 ? reflectionFriction.stage1Clear : reflectionFriction.stage1Balanced;
    }
    return dominantCount >= 2 ? reflectionFriction.stage2Clear : reflectionFriction.stage2Balanced;
  }, [dominantCount, triggerBlock]);

  const [showButton, setShowButton] = useState(false);
  const [showFriction, setShowFriction] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      const frictionTimer = setTimeout(() => setShowFriction(true), 2000);
      const buttonTimer = setTimeout(() => setShowButton(true), 4000);
      return () => {
        clearTimeout(frictionTimer);
        clearTimeout(buttonTimer);
      };
    }
    setShowButton(false);
    setShowFriction(false);
    return undefined;
  }, [isTransitioning, triggerBlock]);

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  return (
    <div
      className={`glass-container ${transClass}`}
        style={{ position: "relative", overflow: "hidden" }}
    >
      <div className="roman-watermark">{watermarkNumeral}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2rem",
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

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
          position: "relative",
          zIndex: 2
        }}
      >
        {/* Single card: all connected content — player's choices + observation + cost */}
        <div className="phase3-card animate-fade-up delay-200">
          <p className="phase3-overline">What you chose</p>

          {stageAnswerTexts.map((text, answerIndex) => {
            if (text.trim().length === 0) return null;
            return (
              <React.Fragment key={answerIndex}>
                {answerIndex > 0 && <div className="phase3-divider" />}
                <p style={{ fontSize: "0.97rem", fontStyle: "italic", lineHeight: 1.7, color: "var(--color-text)" }}>
                  &ldquo;{text}&rdquo;
                </p>
              </React.Fragment>
            );
          })}

          <div className="phase3-divider" />

          <p style={{ fontSize: "1.05rem", fontWeight: 500, lineHeight: 1.75, color: "var(--color-text)" }}>
            {observationText}
          </p>

          {triggerBlock === 2 && playerCostText.trim().length > 0 && (
            <>
              <div className="phase3-divider" />
              <p className="phase3-overline">You said this costs you</p>
              <p style={{ fontSize: "0.97rem", fontStyle: "italic", lineHeight: 1.7, color: "var(--color-text)" }}>
                &ldquo;{playerCostText}&rdquo;
              </p>
            </>
          )}
        </div>

        {/* Friction line — bare floating text, no card border; it's a late reveal, not a new section */}
        <p
          style={{
            fontSize: "1.02rem",
            fontWeight: 500,
            fontStyle: "italic",
            lineHeight: 1.7,
            color: "var(--color-text-light)",
            textAlign: "center",
            padding: "0 0.5rem",
            opacity: showFriction ? 1 : 0,
            transition: "opacity 0.6s ease"
          }}
        >
          {frictionText}
        </p>

        {/* CTA — always in DOM, invisible until timer fires, never pushes layout */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "1rem",
            width: "100%",
            maxWidth: "360px",
            alignSelf: "center",
            opacity: showButton ? 1 : 0,
            pointerEvents: showButton ? "auto" : "none",
            transition: "opacity 0.5s ease"
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
