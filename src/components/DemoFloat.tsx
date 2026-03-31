import React, { useState } from "react";
import { Dimension, resultInterpretations } from "../data/content";
import { ResultScreen } from "./ResultScreen";

/** Mock answer texts keyed by dimension, used to populate the demo ResultScreen. */
const DEMO_DATA: Record<
  Dimension,
  { q1AnswerText: string; playerCostText: string; q10AnswerText: string; answerCounts: Record<Dimension, number> }
> = {
  A: {
    q1AnswerText: "Run the numbers before I decide",
    playerCostText: "Relationships I moved too fast through",
    q10AnswerText: "moving early was the right call",
    answerCounts: { A: 5, B: 1, C: 1, D: 0 }
  },
  B: {
    q1AnswerText: "Wait until the picture was clearer",
    playerCostText: "Opportunities I waited too long on",
    q10AnswerText: "holding back was still right",
    answerCounts: { A: 1, B: 5, C: 1, D: 0 }
  },
  C: {
    q1AnswerText: "Map every risk before committing",
    playerCostText: "Time spent overanalysing what never launched",
    q10AnswerText: "you wanted to understand the logic",
    answerCounts: { A: 0, B: 1, C: 5, D: 1 }
  },
  D: {
    q1AnswerText: "Keep my options open as long as possible",
    playerCostText: "Projects I never fully committed to",
    q10AnswerText: "the timing was just different",
    answerCounts: { A: 1, B: 0, C: 1, D: 5 }
  }
};

/** Labels shown on the dimension picker chips. */
const DIMENSION_LABELS: Record<Dimension, string> = {
  A: resultInterpretations.A.chip,
  B: resultInterpretations.B.chip,
  C: resultInterpretations.C.chip,
  D: resultInterpretations.D.chip
};

const DIMENSIONS: Dimension[] = ["A", "B", "C", "D"];

/**
 * Floating developer preview button (bottom-right).
 * Opens a full-screen overlay of the ResultScreen for any of the 4 dimensions
 * using representative mock data, without touching game state.
 */
export const DemoFloat: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDimension, setActiveDimension] = useState<Dimension | null>(null);

  /** Opens the demo overlay for the selected dimension. */
  function openDemo(dimension: Dimension): void {
    setActiveDimension(dimension);
    setMenuOpen(false);
  }

  /** Closes the overlay and returns to normal game view. */
  function closeDemo(): void {
    setActiveDimension(null);
  }

  /** Cycles to the next dimension while the overlay is open. */
  function cycleNext(): void {
    if (activeDimension === null) return;
    const idx = DIMENSIONS.indexOf(activeDimension);
    setActiveDimension(DIMENSIONS[(idx + 1) % DIMENSIONS.length]);
  }

  return (
    <>
      {/* Overlay — position:absolute inside #root so it respects the app's
          max-width and does not break at non-100% device zoom. */}
      {activeDimension !== null && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            minHeight: "100%",
            zIndex: 9999,
            background: "#fcfbf9",
            overflowY: "auto"
          }}
        >
          {/* Sticky top bar */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1rem",
              background: "rgba(252,251,249,0.95)",
              backdropFilter: "blur(8px)",
              borderBottom: "1px solid rgba(0,0,0,0.06)"
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.35)"
              }}
            >
              Preview: {DIMENSION_LABELS[activeDimension]}
            </span>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={cycleNext}
                aria-label="Preview next dimension"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  padding: "0.35rem 0.75rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                  cursor: "pointer",
                  color: "var(--color-text)"
                }}
              >
                Next →
              </button>
              <button
                onClick={closeDemo}
                aria-label="Close demo preview"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  padding: "0.35rem 0.75rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                  cursor: "pointer",
                  color: "var(--color-text)"
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          <ResultScreen
            name="Alex"
            finalDimension={activeDimension}
            isTied={false}
            tiedDimensions={[]}
            answerCounts={DEMO_DATA[activeDimension].answerCounts}
            q10AnswerText={DEMO_DATA[activeDimension].q10AnswerText}
            q1AnswerText={DEMO_DATA[activeDimension].q1AnswerText}
            isTransitioning={false}
            onBack={closeDemo}
            playerCostText={DEMO_DATA[activeDimension].playerCostText}
          />
        </div>
      )}

      {/* Floating trigger button — fixed so it's always visible regardless of scroll */}
      <div
        style={{
          position: "fixed",
          bottom: "1.25rem",
          right: "1.25rem",
          zIndex: menuOpen ? 9998 : 8000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.5rem"
        }}
      >
        {/* Dimension picker — shown when menu is open */}
        {menuOpen && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              alignItems: "flex-end"
            }}
          >
            {DIMENSIONS.map((dim) => (
              <button
                key={dim}
                onClick={() => openDemo(dim)}
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  padding: "0.4rem 0.9rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "white",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  color: "var(--color-text)",
                  whiteSpace: "nowrap"
                }}
              >
                {DIMENSION_LABELS[dim]}
              </button>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Open result screen preview"
          style={{
            width: "2.8rem",
            height: "2.8rem",
            borderRadius: "50%",
            border: "none",
            background: "var(--color-text)",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease"
          }}
        >
          {menuOpen ? "✕" : "👁"}
        </button>
      </div>
    </>
  );
};
