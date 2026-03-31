import React, { useEffect, useState } from "react";
import { Dimension, resultInterpretations } from "../data/content";
import { ChevronLeft } from "lucide-react";

/**
 * Replaces {TOKEN} placeholders in a template string with provided values.
 * Used to inject player-specific data into narrative copy stored in content.ts.
 */
function interpolate(template: string, tokens: Record<string, string>): string {
  return Object.entries(tokens).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, "g"), value),
    template
  );
}

interface ResultScreenProps {
  name: string;
  finalDimension: Dimension;
  isTied: boolean;
  tiedDimensions: Dimension[];
  answerCounts: Record<Dimension, number>;
  q10AnswerText: string;
  q1AnswerText: string;
  q8AnswerText: string;
  /** Player's Q9 answer text — "Which cost do you notice least in yourself?" */
  q9AnswerText: string;
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
  q9AnswerText,
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

  /** The minimum answer count across all dimensions, used to find blind spots. */
  const minCount = Math.min(
    answerCounts.A,
    answerCounts.B,
    answerCounts.C,
    answerCounts.D
  );

  /**
   * All dimensions that share the lowest answer count.
   * There may be more than one if the player's answers are evenly spread.
   */
  const weakestDimensions: Dimension[] = (["A", "B", "C", "D"] as Dimension[]).filter(
    (dimension) => answerCounts[dimension] === minCount
  );

  /**
   * Token map for pathWalked — only COUNT is interpolated; player's own words
   * are rendered as styled pull-quotes in the JSX, not embedded in prose.
   */
  const pathWalkedTokens: Record<string, string> = {
    COUNT: String(answerCounts[finalDimension])
  };

  /**
   * Builds the token map for a given dimension's weaknessNarrative.
   * Only COUNT is interpolated; Q9 is rendered as a pull-quote in the JSX.
   */
  const weaknessTokens = (dimension: Dimension): Record<string, string> => ({
    COUNT: String(answerCounts[dimension])
  });

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
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}
        >
          <h1
            className="animate-fade-up delay-200"
            style={{ fontSize: "3.2rem", fontWeight: 400, marginBottom: "1rem" }}
          >
            {name || "Friend"}
          </h1>

          <p
            className="animate-fade-up delay-400"
            style={{
              fontSize: "0.78rem",
              letterSpacing: "2.5px",
              color: "var(--color-text-light)",
              textTransform: "uppercase",
              marginBottom: "0.75rem"
            }}
          >
            YOUR PATTERN
          </p>

          <div
            className="animate-fade-up delay-600"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1.4rem"
            }}
          >
            {(isTied
              ? tieDimensionData
              : [{ dimension: finalDimension, chip: resultData.chip }]
            ).map((item) => (
              <span
                key={item.dimension}
                style={{
                  fontSize: "1rem",
                  padding: "0.3rem 0.9rem",
                  borderRadius: "100px",
                  border: "1px solid rgba(204,153,56,0.6)",
                  color: "var(--color-text)",
                  background: "rgba(251,229,184,0.1)"
                }}
              >
                {item.chip}
              </span>
            ))}
          </div>

          {/* Core recognition sentence */}
          <p
            className="animate-fade-up delay-800"
            style={{
              fontSize: "1.15rem",
              color: "var(--color-text)",
              lineHeight: 1.7,
              maxWidth: "300px",
              marginBottom: isTied ? "0.6rem" : "1.8rem"
            }}
          >
            {resultData.reflectionLines[0]}
          </p>

          {isTied && (
            <p
              className="animate-fade-up delay-800"
              style={{
                fontSize: "0.95rem",
                color: "var(--color-text-light)",
                marginBottom: "1.8rem"
              }}
            >
              Your decisions pulled in two directions.
            </p>
          )}

          {/* Q10 — the question the player gave themselves. One personal touch. */}
          {hasQ10 && (
            <div
              className="animate-fade-up delay-1000"
              style={{
                width: "100%",
                maxWidth: "320px",
                textAlign: "left",
                borderLeft: "2px solid rgba(204,153,56,0.45)",
                paddingLeft: "1rem"
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "var(--color-text-light)",
                  marginBottom: "0.5rem"
                }}
              >
                The question you chose for yourself
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--color-text)",
                  lineHeight: 1.6,
                  fontStyle: "italic"
                }}
              >
                &ldquo;{q10AnswerText}&rdquo;
              </p>
            </div>
          )}

          {showContinue && (
            <div
              className="animate-fade-up"
              style={{ marginTop: "2rem", width: "100%", maxWidth: "360px" }}
            >
              <button className="btn-primary" onClick={advancePhase}>Continue</button>
            </div>
          )}
        </div>
      )}

      {/* ── Phase 2: Cost ─────────────────────────────────────────────────── */}
      {phase === 2 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", textAlign: "center" }}>
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              color: "var(--color-text)",
              marginBottom: "2rem"
            }}
          >
            {resultData.reflectionLines[1]}
          </p>

          <p
            className="animate-fade-up delay-600"
            style={{ fontSize: "1.1rem", color: "var(--color-text)", lineHeight: 1.7 }}
          >
            {resultData.q1CostLine}
          </p>

          {/* Player's own named cost — echoed back as confirmation of the pattern */}
          {hasCost && (
            <div
              className="animate-fade-up delay-800"
              style={{
                marginTop: "1.6rem",
                width: "100%",
                maxWidth: "320px",
                alignSelf: "center",
                textAlign: "center",
                padding: "1rem 1.2rem",
                background: "rgba(251,229,184,0.07)",
                borderRadius: "12px",
                border: "1px solid rgba(204,153,56,0.3)"
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "var(--color-text-light)",
                  marginBottom: "0.6rem"
                }}
              >
                You already named it
              </p>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--color-text)",
                  lineHeight: 1.6,
                  fontStyle: "italic"
                }}
              >
                &ldquo;{playerCostText}&rdquo;
              </p>
            </div>
          )}

          {showContinue && (
            <div
              className="animate-fade-up"
              style={{ marginTop: "2rem", width: "100%", maxWidth: "360px", alignSelf: "center" }}
            >
              <button className="btn-primary" onClick={advancePhase}>Continue</button>
            </div>
          )}
        </div>
      )}

      {/* ── Phase 3: Portrait + Urgency ───────────────────────────────────── */}
      {phase === 3 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* ─ Zone A: Decision Portrait (data, screenshot-worthy) ─ */}
          <p
            className="animate-fade-up"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--color-text-light)",
              marginBottom: "1rem"
            }}
          >
            Your Decision Portrait
          </p>

          {/* Behaviour distribution bars */}
          <div
            className="animate-fade-up delay-200"
            style={{ marginBottom: "1.2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}
          >
            {distributionOrder.map((dimension) => {
              const widthPercent = Math.round(
                (answerCounts[dimension] / maxDistributionCount) * 100
              );
              return (
                <div key={dimension} className="distribution-row">
                  <span className="distribution-label">
                    {resultInterpretations[dimension].chip}
                  </span>
                  <div className="distribution-track">
                    <div className="distribution-fill" style={{ width: `${widthPercent}%` }} />
                  </div>
                  <span className="distribution-count">({answerCounts[dimension]})</span>
                </div>
              );
            })}
          </div>

          {/* ─ Section 1: The Path You Walked ─ */}
          <div
            className="animate-fade-up delay-400"
            style={{
              borderTop: "1px solid rgba(204,153,56,0.2)",
              marginTop: "1.2rem",
              paddingTop: "1.6rem"
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "var(--color-text-light)",
                marginBottom: "1.2rem"
              }}
            >
              The Path You Walked
            </p>

            {/* Player's first move — echoed as a pull-quote before the analysis */}
            {q1AnswerText.trim().length > 0 && (
              <div className="narrative-quote" style={{ marginBottom: "1.1rem" }}>
                <p className="narrative-quote__label">Your first move</p>
                <p className="narrative-quote__text">&ldquo;{q1AnswerText}&rdquo;</p>
              </div>
            )}

            {/* pathWalked[0] and [1] — pattern setup and consistency observation */}
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--color-text)", marginBottom: "1rem" }}>
              {interpolate(resultData.pathWalked[0], pathWalkedTokens)}
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--color-text)", marginBottom: "1.1rem" }}>
              {interpolate(resultData.pathWalked[1], pathWalkedTokens)}
            </p>

            {/* Player's named cost — echoed as a pull-quote before the shadow paragraph */}
            {playerCostText.trim().length > 0 && (
              <div className="narrative-quote" style={{ marginBottom: "1.1rem" }}>
                <p className="narrative-quote__label">What it cost you</p>
                <p className="narrative-quote__text">&ldquo;{playerCostText}&rdquo;</p>
              </div>
            )}

            {/* pathWalked[2] — the shadow observation */}
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--color-text)" }}>
              {interpolate(resultData.pathWalked[2], pathWalkedTokens)}
            </p>
          </div>

          {/* ─ Section 2: The Pattern You Rarely Used ─ */}
          <div
            className="animate-fade-up delay-600"
            style={{
              marginTop: "1.6rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}
          >
            {weakestDimensions.map((weakDimension) => {
              const weakData = resultInterpretations[weakDimension];
              return (
                <div key={weakDimension} className="warning-box">
                  <p className="warning-label">⚠ Blind Spot</p>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                      color: "var(--color-text-light)",
                      marginBottom: "1.2rem"
                    }}
                  >
                    The Pattern You Rarely Used
                  </p>

                  {/* weaknessNarrative[0] + [1] — count statement and short observation */}
                  <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--color-text)", marginBottom: "0.9rem" }}>
                    {interpolate(weakData.weaknessNarrative[0], weaknessTokens(weakDimension))}
                  </p>
                  <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--color-text)", marginBottom: "1.1rem" }}>
                    {interpolate(weakData.weaknessNarrative[1], weaknessTokens(weakDimension))}
                  </p>

                  {/* Q9 — the cost they admit they cannot see — pulled out as a quote */}
                  {q9AnswerText.trim().length > 0 && (
                    <div className="narrative-quote narrative-quote--warning" style={{ marginBottom: "1.1rem" }}>
                      <p className="narrative-quote__label narrative-quote__label--warning">
                        The cost you notice least
                      </p>
                      <p className="narrative-quote__text">&ldquo;{q9AnswerText}&rdquo;</p>
                    </div>
                  )}

                  {/* weaknessNarrative[2] — the closing question */}
                  <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: 1.8,
                      color: "var(--color-text)",
                      fontStyle: "italic"
                    }}
                  >
                    {interpolate(weakData.weaknessNarrative[2], weaknessTokens(weakDimension))}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
