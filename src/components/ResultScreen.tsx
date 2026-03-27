import React, { useEffect, useState } from "react";
import { Dimension, resultInterpretations } from "../data/content";
import { ChevronLeft } from "lucide-react";

interface ResultScreenProps {
  name: string;
  finalDimension: Dimension;
  isTied: boolean;
  /** The verbatim text of the player's Q10 answer — quoted back in Phase 2 */
  q10AnswerText: string;
  /** The verbatim text of the player's Q1 answer — the "At the start" comparison anchor */
  q1AnswerText: string;
  /** The verbatim text of the player's Q7 answer — the "Just now" mirror comparison */
  q7AnswerText: string;
  isTransitioning: boolean;
  onBack: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  name,
  finalDimension,
  isTied,
  q10AnswerText,
  q1AnswerText,
  q7AnswerText,
  isTransitioning,
  onBack
}) => {
  const resultData = resultInterpretations[finalDimension];

  // Phase 1–4 staged reveal — each phase focuses attention on one set of content
  const [phase, setPhase] = useState(1);
  // Controls the continue button — appears 3 seconds after each phase loads
  const [showContinue, setShowContinue] = useState(false);

  /**
   * Show the continue button after a phase-appropriate delay.
   * Phase 1 (name only): 2s — minimal content, just a moment of address.
   * Phase 2 (mirror + quotes): 2.5s — more to read, slightly longer.
   * Phase 3 (benefit + hidden cost): 2s — the pulse animation draws attention.
   * Phase 4 has no continue button — it is the final resting state.
   */
  useEffect(() => {
    if (phase < 4 && !isTransitioning) {
      setShowContinue(false);
      const delayByPhase: Record<number, number> = { 1: 2000, 2: 2500, 3: 2000 };
      const delay = delayByPhase[phase] ?? 2000;
      const timer = setTimeout(() => setShowContinue(true), delay);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase, isTransitioning]);

  /** Advance to the next result phase */
  const advancePhase = (): void => {
    setPhase(prev => Math.min(prev + 1, 4));
  };

  /** Go back one phase, or exit result if on phase 1 */
  const handleBack = (): void => {
    if (phase > 1) {
      setPhase(prev => prev - 1);
    } else {
      onBack();
    }
  };

  /**
   * Word-by-word reveal for the final punchline sentence.
   * Each word fades in and rises 6px, staggered at 70ms intervals.
   * This slows the reading pace so the sentence lands with weight —
   * a player who skims will still be forced to read it word by word.
   */
  const RevealWords = ({ text, startDelay = 0 }: { text: string; startDelay?: number }) => {
    const words = text.split(" ");
    // showDetail is used here as the "mounted" trigger — sliders only animate when revealed
    return (
      <>
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: phase === 4 ? 1 : 0,
              transform: phase === 4 ? "translateY(0)" : "translateY(6px)",
              transition: [
                `opacity 0.55s ease ${startDelay + i * 0.07}s`,
                `transform 0.55s ease ${startDelay + i * 0.07}s`
              ].join(", "),
              marginRight: "0.3em"
            }}
          >
            {word}
          </span>
        ))}
      </>
    );
  };

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  return (
    <div className={`glass-container ${transClass}`} style={{ paddingBottom: "4rem" }}>

      {/**
       * Entry curtain — a semi-dark overlay that briefly covers the screen
       * before fading away over 1.8s. Gives the result reveal a theatrical
       * weight. pointer-events: none ensures it never blocks interaction.
       */}
      <div className="result-curtain" />

      {/* Back button — always visible */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
        <button
          onClick={handleBack}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", marginLeft: "-0.5rem" }}
          aria-label="Go back"
        >
          <ChevronLeft size={24} color="var(--color-text)" />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          PHASE 1 — Player's name, alone.
          A quiet moment of address before any interpretation begins.
          ═══════════════════════════════════════════════════════════════════ */}
      {phase === 1 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <h1
            className="animate-fade-up delay-200"
            style={{ fontSize: "3.2rem", fontWeight: 400, marginBottom: "1rem" }}
          >
            {name || "Friend"}
          </h1>
          <p
            className="animate-fade-up delay-400"
            style={{ fontSize: "1.1rem", color: "var(--color-text-light)", lineHeight: 1.6 }}
          >
            A familiar way you tend to respond<br />when things are still unfolding
          </p>
          {isTied && (
            <p
              className="animate-fade-up delay-600"
              style={{ fontSize: "0.95rem", color: "var(--color-text-light)", fontStyle: "italic", marginTop: "0.5rem" }}
            >
              Your pattern was closely divided between two tendencies.
            </p>
          )}

          {showContinue && (
            <div className="animate-fade-up" style={{ marginTop: "auto", paddingTop: "3rem", width: "100%", maxWidth: "360px" }}>
              <button className="btn-primary" onClick={advancePhase}>Continue</button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PHASE 2 — Mirror sentence + Q1 vs Q7 comparison + Q10 quote-back.
          The player's own words become the mirror — no interpretation needed.
          ═══════════════════════════════════════════════════════════════════ */}
      {phase === 2 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Mirror sentence — the first reflectionLine, NOT the dimension name */}
          <p
            className="animate-fade-up delay-200"
            style={{ fontSize: "1.35rem", lineHeight: 1.8, color: "var(--color-text)", textAlign: "center", marginBottom: "3rem" }}
          >
            {resultData.reflectionLines[0]}
          </p>

          {/* Q1 vs Q7 comparison — the player's own words as a mirror */}
          {q1AnswerText.trim().length > 0 && q7AnswerText.trim().length > 0 && (
            <div className="animate-fade-up delay-400" style={{ marginBottom: "3rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", fontStyle: "italic", marginBottom: "0.5rem" }}>
                  At the start, you said:
                </p>
                <div style={{ borderLeft: "3px solid var(--color-gold-mid)", paddingLeft: "1.2rem" }}>
                  <p style={{ fontSize: "1.05rem", color: "var(--color-text)", fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
                    {q1AnswerText}
                  </p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", fontStyle: "italic", marginBottom: "0.5rem" }}>
                  Just now, you said:
                </p>
                <div style={{ borderLeft: "3px solid var(--color-gold-dark)", paddingLeft: "1.2rem" }}>
                  <p style={{ fontSize: "1.05rem", color: "var(--color-text)", fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
                    {q7AnswerText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Q10 quote-back — the question the player chose for themselves */}
          {q10AnswerText.trim().length > 0 && (
            <div className="animate-fade-up delay-600" style={{ marginBottom: "2rem" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", fontStyle: "italic", lineHeight: 1.7, marginBottom: "1rem", textAlign: "center" }}>
                When asked what question you most needed to ask yourself — you chose:
              </p>
              <div style={{ borderLeft: "3px solid var(--color-gold-dark)", paddingLeft: "1.2rem" }}>
                <p style={{ fontSize: "1.1rem", color: "var(--color-text)", fontWeight: 500, lineHeight: 1.65, fontStyle: "normal", margin: 0 }}>
                  {q10AnswerText}
                </p>
              </div>
            </div>
          )}

          {showContinue && (
            <div className="animate-fade-up" style={{ marginTop: "auto", paddingTop: "2rem", width: "100%", maxWidth: "360px", margin: "0 auto" }}>
              <button className="btn-primary" onClick={advancePhase}>Continue</button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PHASE 3 — Benefit + Hidden Cost.
          What this pattern gives you — and what it silently takes away.
          ═══════════════════════════════════════════════════════════════════ */}
      {phase === 3 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", textAlign: "center" }}>
          {/* Benefit line */}
          <p
            className="animate-fade-up delay-200"
            style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "var(--color-text-light)", marginBottom: "3rem" }}
          >
            {resultData.reflectionLines[1]}
          </p>

          {/* Hidden cost box — uses hidden-cost-pulse which chains fadeUp + gentlePulse
              in a single animation declaration to avoid CSS override conflicts */}
          <div
            className="hidden-cost-pulse"
            style={{
              padding: "1.8rem 1.5rem",
              background: "linear-gradient(135deg, rgba(251,229,184,0.25), rgba(243,206,133,0.1))",
              borderRadius: "16px",
              border: "1px solid rgba(243,206,133,0.3)",
              marginBottom: "2rem"
            }}
          >
            <p style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "var(--color-text)", fontStyle: "italic", margin: 0 }}>
              {resultData.reflectionLines[2]}
            </p>
          </div>

          {showContinue && (
            <div className="animate-fade-up" style={{ marginTop: "auto", paddingTop: "2rem", width: "100%", maxWidth: "360px", margin: "0 auto" }}>
              <button className="btn-primary" onClick={advancePhase}>Continue</button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PHASE 4 — Bigger Picture + Closing.
          The final resting state. No continue button.
          Final resting state with the closing question and breathing name.
          ═══════════════════════════════════════════════════════════════════ */}
      {phase === 4 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Quiet opener */}
          <p
            className="animate-fade-up delay-200"
            style={{ fontSize: "1.25rem", lineHeight: 1.9, marginBottom: "2rem", color: "var(--color-text-light)", fontStyle: "italic", textAlign: "center" }}
          >
            "What determines your path is rarely a single, brilliant choice."
          </p>

          {/* Punchline — word-by-word reveal */}
          <p
            className="animate-fade-up delay-400"
            style={{ fontSize: "1.35rem", lineHeight: 1.9, color: "var(--color-text)", fontWeight: 500, textAlign: "center", marginBottom: "3rem" }}
          >
            <RevealWords
              text="It is the quiet, automatic habit you fall back on every time you simply don't know what to do."
              startDelay={0.8}
            />
          </p>

          {/* Closing question */}
          <div className="animate-fade-up delay-800" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "1.6rem", fontWeight: 500, color: "var(--color-text)", lineHeight: 1.6 }}>
              What has it cost you?
            </p>
            {name.trim() && (
              <div
                className="animate-breathe-delayed"
                style={{ fontSize: "2.4rem", fontWeight: 400, color: "var(--color-text)", marginTop: "2rem" }}
              >
                {name.trim().split(" ")[0]}
              </div>
            )}
          </div>

          {/* CAE GOH watermark */}
          <div style={{ textAlign: "center", marginTop: "3rem", opacity: 0.3, fontSize: "0.85rem", letterSpacing: "4px" }}>
            CAE GOH
          </div>
        </div>
      )}
    </div>
  );
};
