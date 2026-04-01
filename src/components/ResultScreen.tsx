import React, { useEffect, useState } from "react";
import { Dimension, resultInterpretations } from "../data/content";
import { ChevronLeft } from "lucide-react";

interface ResultScreenProps {
  name: string;
  finalDimension: Dimension;
  isTied: boolean;
  tiedDimensions: Dimension[];
  answerCounts: Record<Dimension, number>;
  q10AnswerText: string;
  q1AnswerText: string;
  isTransitioning: boolean;
  onBack: () => void;
  /** Player's Q5 cost answer text */
  playerCostText: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  name,
  finalDimension,
  isTied,
  tiedDimensions,
  answerCounts,
  q10AnswerText,
  q1AnswerText,
  isTransitioning,
  onBack,
  playerCostText
}) => {
  const resultData = resultInterpretations[finalDimension];
  const [phase, setPhase] = useState(1);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (phase < 3 && !isTransitioning) {
      setShowContinue(false);
      const delayByPhase: Record<number, number> = { 1: 2200, 2: 1800 };
      const delay = delayByPhase[phase] ?? 2000;
      const timer = setTimeout(() => setShowContinue(true), delay);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase, isTransitioning]);

  const advancePhase = (): void => {
    setPhase((previous) => Math.min(previous + 1, 3));
  };

  const handleBack = (): void => {
    if (phase > 1) {
      setPhase((previous) => previous - 1);
    } else {
      onBack();
    }
  };

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";
  const tieDimensionData = tiedDimensions.map((dimension) => ({
    dimension,
    chip: resultInterpretations[dimension].chip
  }));
  const distributionOrder: Dimension[] = ["A", "B", "C", "D"];
  const maxDistributionCount = Math.max(
    1,
    answerCounts.A,
    answerCounts.B,
    answerCounts.C,
    answerCounts.D
  );

  const hasQ10 = q10AnswerText.trim().length > 0;
  const hasCost = playerCostText.trim().length > 0;

  return (
    <div className={`glass-container ${transClass}`} style={{ paddingBottom: "4rem" }}>
      <div className="result-curtain" />

      {/* Back button */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
        <button
          onClick={handleBack}
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

      {/* ── Phase 1: Recognition — "Here is who you are" ────────────────── */}
      {phase === 1 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.2rem" }}>

          {/* Name heading — above the card, not inside it */}
          <div className="animate-fade-up delay-200" style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "2.6rem", fontWeight: 600, marginBottom: "0.4rem" }}>
              {name || "Friend"}
            </h1>
            <p style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "3px", color: "var(--color-text-light)", textTransform: "uppercase" }}>
              Your Pattern
            </p>
          </div>

          {/* Single card: chip → recognition → optional Q10 */}
          <div className="phase3-card animate-fade-up delay-400">
            {/* Pattern chip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              {(isTied
                ? tieDimensionData
                : [{ dimension: finalDimension, chip: resultData.chip }]
              ).map((item) => (
                <span
                  key={item.dimension}
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    padding: "0.25rem 0.8rem",
                    borderRadius: "100px",
                    border: "1px solid rgba(204,153,56,0.55)",
                    color: "var(--color-text)",
                    background: "rgba(251,229,184,0.18)"
                  }}
                >
                  {item.chip}
                </span>
              ))}
            </div>

            {/* Recognition line */}
            <p style={{ fontSize: "1.08rem", fontWeight: 500, lineHeight: 1.75, color: "var(--color-text)" }}>
              {resultData.reflectionLines[0]}
            </p>

            {isTied && (
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", marginTop: "0.4rem" }}>
                Your decisions pulled in two directions.
              </p>
            )}

            {/* Q10 — the player's chosen question, revealed within the same card */}
            {hasQ10 && (
              <>
                <div className="phase3-divider" />
                <p className="phase3-overline">The question you chose for yourself</p>
                <p style={{ fontSize: "1rem", fontStyle: "italic", lineHeight: 1.7, color: "var(--color-text)" }}>
                  &ldquo;{q10AnswerText}&rdquo;
                </p>
              </>
            )}
          </div>

          {/* CTA — always in DOM, invisible until timer fires */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "1rem",
              width: "100%",
              maxWidth: "360px",
              alignSelf: "center",
              opacity: showContinue ? 1 : 0,
              pointerEvents: showContinue ? "auto" : "none",
              transition: "opacity 0.5s ease"
            }}
          >
            <button className="btn-primary" onClick={advancePhase}>Continue</button>
          </div>
        </div>
      )}

      {/* ── Phase 2: Cost ─────────────────────────────────────────────────── */}
      {phase === 2 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.2rem" }}>

          {/* Single card: strength → reflective question → cost echo — one continuous thought */}
          <div className="phase3-card animate-fade-up delay-200">
            <p style={{ fontSize: "1.08rem", fontWeight: 500, lineHeight: 1.75, color: "var(--color-text)" }}>
              {resultData.reflectionLines[1]}
            </p>

            <div className="phase3-divider" />

            <p style={{ fontSize: "0.97rem", fontStyle: "italic", lineHeight: 1.75, color: "var(--color-text-light)" }}>
              {resultData.q1CostLine}
            </p>

            {hasCost && (
              <>
                <div className="phase3-divider" />
                <p className="phase3-overline">You already named it</p>
                <p style={{ fontSize: "1rem", fontStyle: "italic", lineHeight: 1.7, color: "var(--color-text)" }}>
                  &ldquo;{playerCostText}&rdquo;
                </p>
              </>
            )}
          </div>

          {/* CTA — always in DOM, invisible until timer fires */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "1rem",
              width: "100%",
              maxWidth: "360px",
              alignSelf: "center",
              opacity: showContinue ? 1 : 0,
              pointerEvents: showContinue ? "auto" : "none",
              transition: "opacity 0.5s ease"
            }}
          >
            <button className="btn-primary" onClick={advancePhase}>Continue</button>
          </div>
        </div>
      )}

      {/* ── Phase 3: Portrait + Urgency ───────────────────────────────────── */}
      {phase === 3 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.2rem" }}>

          {/* ─ Card 1: Decision Portrait ─ */}
          <div className="phase3-card animate-fade-up">
            <p className="phase3-overline">Your Decision Portrait</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
              {distributionOrder.map((dimension) => {
                const widthPercent = Math.round(
                  (answerCounts[dimension] / maxDistributionCount) * 100
                );
                const isDominant = dimension === finalDimension;
                return (
                  <div key={dimension}>
                    {/* Label row: name left, count right */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
                      <span style={{
                        fontSize: isDominant ? "0.93rem" : "0.85rem",
                        fontWeight: isDominant ? 600 : 400,
                        color: isDominant ? "var(--color-text)" : "var(--color-text-light)"
                      }}>
                        {resultInterpretations[dimension].chip}
                      </span>
                      <span style={{
                        fontSize: isDominant ? "0.9rem" : "0.8rem",
                        fontWeight: isDominant ? 600 : 400,
                        color: isDominant ? "var(--color-text)" : "var(--color-text-light)"
                      }}>
                        {answerCounts[dimension]}
                      </span>
                    </div>
                    {/* Bar */}
                    <div className="distribution-track">
                      <div
                        className={isDominant ? "distribution-fill distribution-fill--dominant" : "distribution-fill"}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─ Card 2: The Path You Walked (full narrative arc) ─ */}
          <div className="phase3-card animate-fade-up delay-200">
            <p className="phase3-overline">The Path You Walked</p>

            {q1AnswerText.trim().length > 0 && (
              <p className="phase3-echo" style={{ marginBottom: "0.75rem" }}>&ldquo;{q1AnswerText}&rdquo;</p>
            )}

            <p className="phase3-body">
              {resultData.pathWalked[0]}
            </p>

            <div className="phase3-divider" />

            {playerCostText.trim().length > 0 && (
              <p className="phase3-echo" style={{ marginBottom: "0.75rem" }}>&ldquo;{playerCostText}&rdquo;</p>
            )}

            <p className="phase3-body">
              {resultData.pathWalked[1]}
            </p>

            <div className="phase3-divider" />

            <p className="phase3-takeaway">
              {resultData.pathWalked[2]}
            </p>
          </div>

          {/* ─ Card 5: Blind Spot ─ */}
          <div className="phase3-card animate-fade-up delay-600">
            <p className="phase3-warning-title">
              A blind spot you might have missed.
            </p>

            <p className="phase3-body">
              {resultData.blindSpot[0]}
            </p>

            <div className="phase3-divider" />

            <p className="phase3-body">
              {resultData.blindSpot[1]}
            </p>

            <p className="phase3-closer">
              {resultData.blindSpot[2]}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
