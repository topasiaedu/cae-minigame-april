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
  q8AnswerText: string;
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
  q8AnswerText,
  isTransitioning,
  onBack,
  playerCostText
}) => {
  const resultData = resultInterpretations[finalDimension];
  const [phase, setPhase] = useState(1);
  const [showContinue, setShowContinue] = useState(false);
  const [slidersVisible, setSlidersVisible] = useState(false);

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

  useEffect(() => {
    if (phase === 3) {
      const timer = setTimeout(() => setSlidersVisible(true), 300);
      return () => clearTimeout(timer);
    }
    setSlidersVisible(false);
    return undefined;
  }, [phase]);

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

          <div
            className="hidden-cost-pulse"
            style={{
              padding: "1.4rem 1.2rem",
              background: "linear-gradient(135deg, rgba(251,229,184,0.25), rgba(243,206,133,0.1))",
              borderRadius: "16px",
              border: "1px solid rgba(243,206,133,0.3)",
              marginBottom: "2rem"
            }}
          >
            <p
              style={{
                fontSize: "1.15rem",
                lineHeight: 1.7,
                color: "var(--color-text)",
                margin: 0
              }}
            >
              {resultData.reflectionLines[2]}
            </p>
          </div>

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

          {/* Primary dominant-pattern chip(s) */}
          <div
            className="animate-fade-up delay-400"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}
          >
            {(isTied
              ? tieDimensionData
              : [{ dimension: finalDimension, chip: resultData.chip }]
            ).map((item) => (
              <span
                key={item.dimension}
                style={{
                  fontSize: "0.95rem",
                  border: "1px solid rgba(204,153,56,0.6)",
                  borderRadius: "100px",
                  padding: "0.28rem 0.85rem",
                  color: "var(--color-text)",
                  background: "rgba(251,229,184,0.15)"
                }}
              >
                {item.chip}
              </span>
            ))}
          </div>

          {/* Secondary trait chips — smaller, lighter */}
          <div
            className="animate-fade-up delay-400"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.4rem" }}
          >
            {resultData.secondaryChips.map((chip) => (
              <span
                key={chip}
                style={{
                  fontSize: "0.82rem",
                  color: "var(--color-text-light)",
                  border: "1px solid rgba(204,153,56,0.25)",
                  borderRadius: "100px",
                  padding: "0.18rem 0.6rem"
                }}
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Sliders — smaller labels to reduce visual noise */}
          <div className="animate-fade-up delay-600" style={{ marginBottom: "0.5rem" }}>
            {resultData.sliders.map((slider) => (
              <div key={slider.title} style={{ marginBottom: "0.9rem" }}>
                <p
                  style={{
                    fontSize: "0.84rem",
                    color: "var(--color-text-light)",
                    marginBottom: "0.3rem"
                  }}
                >
                  {slider.title}
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text)",
                      flexShrink: 0
                    }}
                  >
                    {slider.label1}
                  </span>
                  <div className="slider-track">
                    <div
                      style={{
                        height: "100%",
                        width: slidersVisible ? `${slider.value}%` : "0%",
                        background: "var(--color-gold-mid)",
                        borderRadius: "2px",
                        transition: "width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)"
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text)",
                      flexShrink: 0
                    }}
                  >
                    {slider.label2}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ─ Zone B: The Closing — emotional peak, lots of breathing room ─ */}
          <div
            className="animate-fade-up delay-800"
            style={{
              borderTop: "1px solid rgba(204,153,56,0.35)",
              marginTop: "1.4rem",
              paddingTop: "2.4rem",
              textAlign: "center"
            }}
          >
            <p
              style={{
                fontSize: "1.3rem",
                lineHeight: 1.85,
                color: "var(--color-text)",
                maxWidth: "300px",
                margin: "0 auto 2rem"
              }}
            >
              The months ahead will amplify whatever direction you are already in.
              <br />
              <em>Is this the pattern you want running it?</em>
            </p>

            <div
              className="animate-breathe-delayed"
              style={{ fontSize: "2.2rem", color: "var(--color-text)" }}
            >
              {name.trim() || "Friend"}
            </div>
          </div>

          {/* ─ Zone C: Sign-off — quiet, minimal ─ */}
          <div
            className="animate-fade-up delay-1000"
            style={{
              borderTop: "1px solid rgba(204,153,56,0.15)",
              marginTop: "2rem",
              paddingTop: "1.4rem",
              textAlign: "center"
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-light)",
                marginBottom: "0.3rem"
              }}
            >
              Now you have seen it.
            </p>
            <p
              style={{
                fontSize: "0.88rem",
                letterSpacing: "4px",
                color: "var(--color-text-light)"
              }}
            >
              CAE GOH
            </p>
          </div>

          <p
            className="animate-fade-up delay-1200"
            style={{
              fontSize: "0.8rem",
              color: "var(--color-text-light)",
              textAlign: "center",
              marginTop: "1.2rem",
              lineHeight: 1.7,
              maxWidth: "270px",
              alignSelf: "center"
            }}
          >
            This game shows you the pattern. It cannot show you why it runs, or how the months ahead will change it.
          </p>

          {/* Ending signal — no inline opacity; animation handles the reveal */}
          <p
            className="animate-fade-up delay-1800"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "1.5px",
              textAlign: "center",
              color: "var(--color-text-light)",
              marginTop: "0.8rem",
              alignSelf: "center"
            }}
          >
            The speaker will continue from here.
          </p>
        </div>
      )}
    </div>
  );
};
