import React, { useState, useEffect, useMemo } from "react";
import { Dimension, Question, Option } from "../data/content";
import { ChevronLeft } from "lucide-react";

interface QuestionScreenProps {
  question: Question;
  /** Pre-resolved setup text — handles branching questions transparently */
  resolvedSetup: string;
  questionIndex: number;
  totalQuestions: number;
  progressPercent: number;
  onAnswer: (dimension: Dimension) => void;
  isTransitioning: boolean;
  onBack: () => void;
  /** Full answers array — used by Stage III (Q7–Q9) to echo the corresponding Stage I choice */
  answers: Dimension[];
}

/** Stage background tints — more assertive from Stage I → III to give a
 *  felt sense of escalation. Stage III should feel noticeably heavier. */
const STAGE_OVERLAYS: Record<number, string> = {
  1: "rgba(243, 206, 133, 0.06)",
  2: "rgba(210, 160, 80,  0.10)",
  3: "rgba(160, 90,  50,  0.16)"   // significantly more assertive than before
};

/** Brief behavioral echo shown during the 850ms selection window.
 *  One-to-three words that name what the player just did — not a judgment. */
const DIMENSION_ECHOES: Record<Dimension, string> = {
  A: "Moving first.",
  B: "Watching first.",
  C: "Measuring first.",
  D: "Keeping exits open."
};

type EchoContent =
  | { type: "simple"; text: string }
  | { type: "comparison"; primary: string; secondary: string };

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  resolvedSetup,
  questionIndex,
  totalQuestions,
  progressPercent,
  onAnswer,
  isTransitioning,
  onBack,
  answers
}) => {
  const [selected, setSelected] = useState<Dimension | null>(null);

  // Reset selection state whenever a new question loads
  useEffect(() => {
    setSelected(null);
  }, [question.options]);

  /**
   * Shuffle the display order of options on each new question.
   *
   * WHY: The original design always placed A (act) in position 1, B (wait) in
   * position 2, etc. A player who answers 3 questions will decode the system and
   * can game the result. Shuffling the visible positions makes the experience
   * feel like genuine self-reflection rather than a pattern-recognition game.
   *
   * The dimension ID (A/B/C/D) is preserved in opt.id — scoring is unaffected.
   * Each new question.id triggers a fresh random shuffle.
   */
  const shuffledOptions = useMemo((): Option[] => {
    const arr = [...question.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }, [question.options]);

  // Stage I: indices 0–2, Stage II: indices 3–5, Stage III: indices 6–9
  const stage = questionIndex < 3 ? 1 : questionIndex < 6 ? 2 : 3;
  const stageLabel =
    stage === 1 ? "STAGE I · THE UNKNOWN" :
    stage === 2 ? "STAGE II · THE AFTERMATH" :
                  "STAGE III · THE MIRROR";

  // Stage III fade-in is deliberately slower to signal a heavier register
  const questionFadeDelay = stage === 3 ? "delay-400" : "delay-200";
  const optionFadeDelay   = stage === 3 ? "delay-800" : "delay-400";

  // Stage III (>= 6) appears without entry animation — the sudden absence of
  // ceremony signals weight. Stage I and II keep the normal screen-enter fade.
  const transClass = isTransitioning
    ? "screen-exit"
    : (questionIndex >= 6 ? "" : "screen-enter");

  const handleSelect = (dim: Dimension): void => {
    if (selected !== null || isTransitioning) return;
    setSelected(dim);
    // Haptic pulse on Stage III selections. This physical cue marks the shift
    // into the heavier mirror stage without changing visual structure.
    if (questionIndex >= 6 && typeof navigator.vibrate === "function") {
      navigator.vibrate(30);
    }
    // Stage III (>= 6) lingers longer before advancing — gives the echo time to land
    const advanceDelay = questionIndex >= 6 ? 1600 : 850;
    setTimeout(() => onAnswer(dim), advanceDelay);
  };

  /**
   * Echo text logic:
   * - Stage III Q7–Q9 (indices 6–8): compare the current selection against the
   *   player's corresponding Stage I answer. "Still here." means the same pattern.
   *   "Something has shifted." means the player's self-reported behaviour in Stage III
   *   differs from what they chose in Stage I — a moment of awareness.
   * - Q10 (index 9) and Stage I & II: show the plain behavioural echo.
   */
  const echoContent = useMemo((): EchoContent | null => {
    if (selected === null) return null;
    // Cost question — show acknowledgment instead of dimension echo
    if (question.isCostQuestion === true) {
      return { type: "simple", text: "You named it." };
    }
    // Echo comparison: only for Stage III questions Q7–Q9 (indices 6–8)
    const isEchoComparison = questionIndex >= 6 && questionIndex <= 8;
    if (isEchoComparison) {
      const stageOneIndex  = questionIndex - 6;
      const stageOneAnswer = answers[stageOneIndex];
      if (stageOneAnswer !== undefined) {
        return stageOneAnswer === selected
          ? { type: "comparison", primary: "Still here.", secondary: "You chose the same pattern three questions ago." }
          : { type: "comparison", primary: "Something has shifted.", secondary: "You answered differently this time." };
      }
    }
    return { type: "simple", text: DIMENSION_ECHOES[selected] };
  }, [selected, questionIndex, answers]);

  /**
   * Q7 (questionIndex 6) gets an extra layer of darkness on entry.
   * This is purely cosmetic — it signals the stage shift at the exact
   * moment the player crosses into Stage III for the first time.
   */
  const containerBackground =
    questionIndex === 6
      ? "rgba(100, 50, 20, 0.18)"
      : STAGE_OVERLAYS[stage];

  return (
    <div
      className={`glass-container ${transClass}`}
      style={{ background: containerBackground }}
    >

      {/* ── Top bar: back button + stage label + question counter ── */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
        <button
          className="back-btn"
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

        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: "1rem", letterSpacing: "2px", opacity: 0.9, fontWeight: 600, color: "var(--color-text)" }}>
            {stageLabel}
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 500, marginTop: "0.1rem" }}>
            {String(questionIndex + 1).padStart(2, "0")}
            <span style={{ opacity: 0.55 }}> / {totalQuestions}</span>
          </div>
        </div>

        {/* Spacer to keep the counter visually centred */}
        <div style={{ width: "32px" }} />
      </div>

      {/* ── Progress bar ── */}
      <div style={{
        width: "100%",
        height: "3px",
        background: "rgba(0,0,0,0.05)",
        borderRadius: "2px",
        marginBottom: "2rem",
        overflow: "hidden"
      }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(progressPercent, 8)}%`,
            ...(questionIndex < 6 && {
              background: "linear-gradient(90deg, var(--color-gold-light), var(--color-gold-dark))"
            }),
            transition: "width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)"
          }}
          className={questionIndex >= 6 ? "stage3-progress-bar" : undefined}
        />
      </div>

      {/* ── Question text ── */}
      <div
        className={`animate-fade-up ${questionFadeDelay}`}
        style={{ textAlign: "center", marginBottom: "2rem", padding: "0 0.25rem" }}
      >
        <p style={{
          fontSize: questionIndex === 9 ? "1.6rem" : "1.35rem",
          fontWeight: 500,
          lineHeight: 1.6,
          color: "var(--color-text)"
        }}>
          {resolvedSetup}{" "}
          <span style={{ fontWeight: 400 }}>{question.context}</span>
        </p>
      </div>

      {question.isReversal === true && (
        <p
          className="animate-fade-up delay-400"
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "var(--color-text)",
            textAlign: "center",
            marginBottom: "0.75rem",
            borderBottom: "2px solid var(--color-gold-mid)",
            display: "inline-block",
            alignSelf: "center",
            paddingBottom: "2px"
          }}
        >
          Choose the one least like you
        </p>
      )}

      {/* ── Option cards ── */}
      {/* Q10 (index 9): single-column, each card fades in individually with staggered delays.
          All other questions: 2×2 grid with a single shared fade-up wrapper. */}
      {questionIndex === 9 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "0.75rem",
            flex: 1
          }}
        >
          {shuffledOptions.map((opt, idx) => {
            const isChosen = selected === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={selected !== null}
                className="animate-fade-up"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  padding: "1.1rem 1rem",
                  minHeight: "auto",
                  borderRadius: "16px",
                  border: isChosen
                    ? "2px solid var(--color-gold-dark)"
                    : "1.5px solid rgba(255,255,255,0.65)",
                  background: isChosen
                    ? "linear-gradient(135deg, rgba(251,229,184,0.95), rgba(243,206,133,0.9))"
                    : "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  cursor: selected !== null ? "default" : "pointer",
                  fontFamily: "var(--font-main)",
                  textAlign: "left",
                  opacity: 0,
                  transform: isChosen ? "scale(1)" : "scale(1)",
                  boxShadow: isChosen
                    ? "0 10px 28px rgba(200,150,80,0.25)"
                    : "0 2px 10px rgba(0,0,0,0.04)",
                  transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                  animationDelay: `${0.6 + idx * 0.8}s`
                }}
              >
                {/* No position badge for Q10 — the question feels more like a contemplation */}
                <span style={{
                  fontSize: "1rem",
                  lineHeight: 1.45,
                  color: "var(--color-text)",
                  fontWeight: isChosen ? 500 : 400
                }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div
          className={`animate-fade-up ${optionFadeDelay}`}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            flex: 1
          }}
        >
          {shuffledOptions.map((opt, idx) => {
            const isChosen = selected === opt.id;
            const isFaded  = selected !== null && !isChosen;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={selected !== null}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  padding: "1.1rem 1rem",
                  minHeight: "120px",
                  borderRadius: "16px",
                  border: isChosen
                    ? "2px solid var(--color-gold-dark)"
                    : "1.5px solid rgba(255,255,255,0.65)",
                  background: isChosen
                    ? "linear-gradient(135deg, rgba(251,229,184,0.95), rgba(243,206,133,0.9))"
                    : "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  cursor: selected !== null ? "default" : "pointer",
                  fontFamily: "var(--font-main)",
                  textAlign: "left",
                  opacity: isFaded ? 0.3 : 1,
                  transform: isChosen ? (questionIndex >= 6 ? "scale(1)" : "scale(1.02)") : "scale(1)",
                  boxShadow: isChosen
                    ? "0 10px 28px rgba(200,150,80,0.25)"
                    : "0 2px 10px rgba(0,0,0,0.04)",
                  transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
                }}
              >
                {/* Position number badge (1–4 based on shuffled display order).
                    Using position numbers instead of A/B/C/D prevents the player
                    from decoding that "A = always act fast" by reading the labels. */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: isChosen ? "var(--color-gold-dark)" : "rgba(0,0,0,0.05)",
                  color: isChosen ? "#fff" : "var(--color-text-light)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  transition: "all 0.4s ease"
                }}>
                  {(idx + 1).toString()}
                </span>

                <span style={{
                  fontSize: "1rem",
                  lineHeight: 1.45,
                  color: "var(--color-text)",
                  fontWeight: isChosen ? 500 : 400
                }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Behavioral echo — appears during the selection window ── */}
      {echoContent !== null && (
        echoContent.type === "simple" ? (
          <div
            className="animate-fade-up"
            style={{
              textAlign: "center",
              fontSize: "1.1rem",
              color: "var(--color-text-light)",
              paddingTop: "1.5rem",
              paddingBottom: "0.5rem",
              letterSpacing: "0.3px",
              opacity: 0
            }}
          >
            {echoContent.text}
          </div>
        ) : (
          <div
            className="animate-fade-up"
            style={{
              textAlign: "center",
              paddingTop: "2rem",
              paddingBottom: "1rem",
              opacity: 0
            }}
          >
            <div style={{ fontSize: "1.4rem", color: "var(--color-text)", fontWeight: 600 }}>
              {echoContent.primary}
            </div>
            <div style={{ fontSize: "1.05rem", color: "var(--color-text-light)", fontStyle: "italic", marginTop: "0.6rem" }}>
              {echoContent.secondary}
            </div>
            {echoContent.primary === "Still here." && <div className="echo-line-expand" />}
          </div>
        )
      )}

      <div style={{ paddingBottom: "1rem" }} />
    </div>
  );
};
