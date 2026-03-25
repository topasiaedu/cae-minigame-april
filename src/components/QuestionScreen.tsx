import React, { useState, useEffect, useMemo } from "react";
import { Dimension, Question, Option } from "../data/content";
import { ChevronLeft } from "lucide-react";

interface QuestionScreenProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  progressPercent: number;
  onAnswer: (dimension: Dimension) => void;
  isTransitioning: boolean;
  onBack: () => void;
  /** Full answers array — used by Stage III to echo the corresponding Stage I choice */
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

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
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
  }, [question.id]);

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
  }, [question.id]);

  const stage = questionIndex < 5 ? 1 : questionIndex < 10 ? 2 : 3;
  const stageLabel =
    stage === 1 ? "STAGE I · THE UNKNOWN" :
    stage === 2 ? "STAGE II · THE AFTERMATH" :
                  "STAGE III · THE MIRROR";

  // Stage III fade-in is deliberately slower to signal a heavier register
  const questionFadeDelay = stage === 3 ? "delay-400" : "delay-200";
  const optionFadeDelay   = stage === 3 ? "delay-800" : "delay-400";

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  const handleSelect = (dim: Dimension): void => {
    if (selected !== null || isTransitioning) return;
    setSelected(dim);
    setTimeout(() => onAnswer(dim), 850);
  };

  /**
   * Echo text logic:
   * - Stage III (Q11–Q15): compare the current selection against the player's
   *   corresponding Stage I answer. "Still here." means the same pattern.
   *   "Something has shifted." means the player's self-reported behaviour in
   *   Stage III differs from what they chose in Stage I — a moment of awareness.
   * - Stage I & II: show the plain behavioural echo (one-line dimension label).
   */
  const echoText = useMemo((): string => {
    if (selected === null) return "";
    const isStageThree = questionIndex >= 10;
    if (isStageThree) {
      const stageOneIndex  = questionIndex - 10;
      const stageOneAnswer = answers[stageOneIndex];
      if (stageOneAnswer !== undefined) {
        return stageOneAnswer === selected ? "Still here." : "Something has shifted.";
      }
    }
    return DIMENSION_ECHOES[selected];
  }, [selected, questionIndex, answers]);

  return (
    <div
      className={`glass-container ${transClass}`}
      style={{ background: STAGE_OVERLAYS[stage] }}
    >

      {/* ── Top bar: back button + stage label + question counter ── */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
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

        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: "0.72rem", letterSpacing: "2px", opacity: 0.45, fontWeight: 600 }}>
            {stageLabel}
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 500, marginTop: "0.1rem" }}>
            {String(questionIndex + 1).padStart(2, "0")}
            <span style={{ opacity: 0.35 }}> / {totalQuestions}</span>
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
        <div style={{
          height: "100%",
          width: `${progressPercent}%`,
          background: "linear-gradient(90deg, var(--color-gold-light), var(--color-gold-dark))",
          transition: "width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)"
        }} />
      </div>

      {/* ── Question text ── */}
      <div
        className={`animate-fade-up ${questionFadeDelay}`}
        style={{ textAlign: "center", marginBottom: "2rem", padding: "0 0.25rem" }}
      >
        <p style={{ fontSize: "1.35rem", fontWeight: 500, lineHeight: 1.6, color: "var(--color-text)" }}>
          {question.setup}{" "}
          <span style={{ fontWeight: 400 }}>{question.context}</span>
        </p>
      </div>

      {/* ── Option cards — 2×2 grid ── */}
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
                transform: isChosen ? "scale(1.02)" : "scale(1)",
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
                fontSize: "0.82rem",
                transition: "all 0.4s ease"
              }}>
                {(idx + 1).toString()}
              </span>

              <span style={{
                fontSize: "0.95rem",
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

      {/* ── Behavioral echo — appears during the 850ms selection window ── */}
      {selected !== null && (
        <div
          className="animate-fade-up"
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            fontStyle: "italic",
            color: "var(--color-text-light)",
            paddingTop: "1.5rem",
            paddingBottom: "0.5rem",
            letterSpacing: "0.3px",
            opacity: 0
          }}
        >
          {echoText}
        </div>
      )}

      <div style={{ paddingBottom: "1rem" }} />
    </div>
  );
};
