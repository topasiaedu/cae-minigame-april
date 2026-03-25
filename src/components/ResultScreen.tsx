import React, { useEffect, useState } from "react";
import { Dimension, resultInterpretations } from "../data/content";
import { ChevronLeft } from "lucide-react";

interface ResultScreenProps {
  name: string;
  finalDimension: Dimension;
  isTransitioning: boolean;
  onBack: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  name,
  finalDimension,
  isTransitioning,
  onBack
}) => {
  const resultData = resultInterpretations[finalDimension];

  // Controls slider animation and word-by-word quote reveal.
  // Starts false, becomes true 400ms after mount so animations fire after the
  // screen-enter fade completes.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setMounted(true), 400);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isTransitioning]);

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  /**
   * Editorial section divider — the "─────── 01 LABEL ───────" pattern.
   * Gives the result page the feel of a magazine spread rather than a quiz output.
   */
  const SectionDivider = ({ number, label }: { number: string; label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
      <div style={{
        flex: 1,
        height: "1px",
        background: "linear-gradient(to right, var(--color-gold-mid), transparent)"
      }} />
      <span style={{
        fontSize: "0.8rem",
        letterSpacing: "3px",
        color: "var(--color-gold-dark)",
        fontWeight: 600,
        whiteSpace: "nowrap"
      }}>
        {number} &nbsp; {label.toUpperCase()}
      </span>
      <div style={{
        flex: 1,
        height: "1px",
        background: "linear-gradient(to left, var(--color-gold-mid), transparent)"
      }} />
    </div>
  );

  /**
   * Word-by-word reveal for the final punchline sentence.
   * Each word fades in and rises 6px, staggered at 70ms intervals.
   * This slows the reading pace so the sentence lands with weight —
   * a player who skims will still be forced to read it word by word.
   */
  const RevealWords = ({ text, startDelay = 0 }: { text: string; startDelay?: number }) => {
    const words = text.split(" ");
    return (
      <>
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(6px)",
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

  return (
    <div className={`glass-container ${transClass}`} style={{ paddingBottom: "6rem" }}>

      {/* Back button */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
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

      {/* ── Section 0: Identity header ── */}
      <header
        className="animate-fade-up delay-200"
        style={{ marginBottom: "4rem", textAlign: "center" }}
      >
        <h1 style={{ fontSize: "2.8rem", marginBottom: "0.8rem", fontWeight: 400 }}>
          {name || "Friend"}
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--color-text-light)", lineHeight: 1.6 }}>
          A familiar way you tend to respond<br />
          when things are still unfolding
        </p>
      </header>

      {/* ── Section 01: A closer look (Chips — 2-col gold grid) ── */}
      <section className="animate-fade-up delay-400" style={{ marginBottom: "4rem" }}>
        <SectionDivider number="01" label="A closer look" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
          {[resultData.chip, ...resultData.secondaryChips].map((chip, idx) => (
            <div
              key={idx}
              style={{
                padding: "0.8rem 1rem",
                background: "linear-gradient(135deg, var(--color-gold-light), var(--color-gold-mid))",
                borderRadius: "14px",
                fontWeight: idx === 0 ? 600 : 500,
                fontSize: "1rem",
                textAlign: "center",
                color: "var(--color-text)",
                boxShadow: "0 4px 12px rgba(220, 180, 110, 0.2)"
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 02: Behavioural sliders ── */}
      <section className="animate-fade-up delay-600" style={{ marginBottom: "4rem" }}>
        <SectionDivider number="02" label="How you tend to respond" />
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {resultData.sliders.map((slider, idx) => (
            <div key={idx}>
              {/* Context label above the slider track */}
              <div style={{
                fontSize: "0.85rem",
                letterSpacing: "1.5px",
                color: "var(--color-text-light)",
                textTransform: "uppercase",
                marginBottom: "1rem",
                textAlign: "center"
              }}>
                {slider.title}
              </div>

              <div style={{ position: "relative", paddingBottom: "1.5rem" }}>
                {/* Track */}
                <div style={{
                  width: "100%",
                  height: "2px",
                  background: "rgba(0,0,0,0.08)",
                  borderRadius: "1px",
                  position: "relative"
                }}>
                  {/* Centre reference tick */}
                  <div style={{
                    position: "absolute",
                    left: "50%",
                    top: "-4px",
                    width: "1px",
                    height: "10px",
                    background: "rgba(0,0,0,0.15)",
                    transform: "translateX(-50%)"
                  }} />

                  {/* Value dot — starts at centre (50%), animates to actual value on mount */}
                  <div style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    background: "#fff",
                    border: "2.5px solid var(--color-gold-dark)",
                    borderRadius: "50%",
                    top: "-9px",
                    left: mounted ? `${slider.value}%` : "50%",
                    transform: "translateX(-50%)",
                    transition: `left 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${0.3 + idx * 0.2}s`,
                    boxShadow: "0 2px 10px rgba(200, 150, 80, 0.35)",
                    zIndex: 2
                  }} />
                </div>

                {/* Labels below the track */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.8rem" }}>
                  <span style={{ fontSize: "0.95rem", color: "var(--color-text)", fontWeight: 500 }}>
                    {slider.label1}
                  </span>
                  <span style={{ fontSize: "0.95rem", color: "var(--color-text)", fontWeight: 500 }}>
                    {slider.label2}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 03: What this pattern may mean ── */}
      <section
        className="animate-fade-up delay-800"
        style={{ marginBottom: "5rem", textAlign: "center" }}
      >
        <SectionDivider number="03" label="What this pattern may mean" />

        {/* Line 1: calm observation */}
        <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "var(--color-text-light)", marginBottom: "1.2rem" }}>
          {resultData.reflectionLines[0]}
        </p>

        {/* Line 2: the benefit */}
        <p style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "var(--color-text-light)", marginBottom: "3rem" }}>
          {resultData.reflectionLines[1]}
        </p>

        {/* Line 3: the hidden cost — set apart in a gold-tinted box */}
        <div style={{
          padding: "1.8rem 1.5rem",
          background: "linear-gradient(135deg, rgba(251,229,184,0.25), rgba(243,206,133,0.1))",
          borderRadius: "16px",
          border: "1px solid rgba(243,206,133,0.3)"
        }}>
          <p style={{
            fontSize: "1.25rem",
            lineHeight: 1.8,
            color: "var(--color-text)",
            fontStyle: "italic",
            margin: 0
          }}>
            {resultData.reflectionLines[2]}
          </p>
        </div>
      </section>

      {/* ── Section 04: The bigger picture ── */}
      <section
        className="animate-fade-up delay-1000"
        style={{ textAlign: "center", marginBottom: "5rem" }}
      >
        <SectionDivider number="04" label="The bigger picture" />

        {/* Quiet opener — static, deliberately understated */}
        <p style={{
          fontSize: "1.25rem",
          lineHeight: 1.9,
          marginBottom: "2rem",
          color: "var(--color-text-light)",
          fontStyle: "italic"
        }}>
          "What determines your path is rarely a single, brilliant choice."
        </p>

        {/* Punchline — word-by-word reveal so the player cannot skim it.
            Start delay of 0.8s gives the italic opener time to register first. */}
        <p style={{ fontSize: "1.35rem", lineHeight: 1.9, color: "var(--color-text)", fontWeight: 500 }}>
          <RevealWords
            text="It is the quiet, automatic habit you fall back on every time you simply don't know what to do."
            startDelay={0.8}
          />
        </p>
      </section>

      {/* ── Closing message — replaces the Share/Save buttons ──────────────────
          The Share and Save CTAs were removed because they close the psychological
          open loop prematurely. A player who shares or saves their result has
          packaged and filed the experience. The game's design intent is to leave
          them sitting with an unanswered question until the speaker returns.
          ───────────────────────────────────────────────────────────────────── */}
      <section className="animate-fade-up delay-1200" style={{ textAlign: "center" }}>
        <div style={{
          padding: "1.5rem",
          borderTop: "1px solid rgba(243,206,133,0.35)"
        }}>
          <p style={{
            fontSize: "1.05rem",
            color: "var(--color-text-light)",
            lineHeight: 1.7,
            fontStyle: "italic",
            margin: 0
          }}>
            The speaker will return shortly.
          </p>
          <p style={{
            fontSize: "1.1rem",
            color: "var(--color-text)",
            fontWeight: 500,
            marginTop: "0.6rem",
            letterSpacing: "0.5px"
          }}>
            Sit with this.
          </p>
        </div>
      </section>

      <div
        className="animate-fade-up delay-1200"
        style={{
          textAlign: "center",
          marginTop: "3rem",
          opacity: 0.3,
          fontSize: "0.85rem",
          letterSpacing: "4px"
        }}
      >
        CAE GOH
      </div>
    </div>
  );
};
