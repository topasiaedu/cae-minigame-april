import React, { useEffect } from "react";

/**
 * Props for the SurpriseScreen component
 */
interface SurpriseScreenProps {
  onProceed: () => void;
  isTransitioning: boolean;
}

/**
 * SurpriseScreen triggers between Reflection 2 and Stage III Intro.
 * It auto-advances after 4000ms and has no player-interactive elements.
 * A single low ambient tone plays on mount to give the moment physical weight.
 */
export const SurpriseScreen: React.FC<SurpriseScreenProps> = ({
  onProceed,
  isTransitioning
}) => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isTransitioning) {
      timer = setTimeout(() => {
        onProceed();
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTransitioning, onProceed]);

  /**
   * Single ambient tone — plays only on this screen.
   * The entire game is silent; the sound makes this moment physically significant.
   * Fade in 0 → 0.3 over 2s, fade out on unmount. Autoplay should be permitted
   * since the player has been tapping buttons throughout the game. If blocked,
   * the game works without sound — error is silently swallowed.
   */
  useEffect(() => {
    if (isTransitioning) return;

    const audio = new Audio("/sounds/ambient-tone.mp3");
    audio.volume = 0;
    audio.loop = true;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — silent fallback. The game works without sound.
      });
    }

    // Fade in: 0 → 0.3 over 2 seconds
    let currentVolume = 0;
    const fadeIn = setInterval(() => {
      currentVolume = Math.min(currentVolume + 0.015, 0.3);
      audio.volume = currentVolume;
      if (currentVolume >= 0.3) clearInterval(fadeIn);
    }, 100);

    // Cleanup: fade out and stop
    return () => {
      clearInterval(fadeIn);
      let fadeOutVolume = audio.volume;
      const fadeOut = setInterval(() => {
        fadeOutVolume = Math.max(fadeOutVolume - 0.03, 0);
        audio.volume = fadeOutVolume;
        if (fadeOutVolume <= 0) {
          clearInterval(fadeOut);
          audio.pause();
          audio.src = "";
        }
      }, 100);
    };
  }, [isTransitioning]);

  const transClass = isTransitioning ? "screen-exit" : "screen-enter";

  return (
    <div
      className={`glass-container ${transClass}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}
    >
      <div style={{ padding: "0 1.5rem" }}>
        <p
          className="animate-fade-up delay-400 animate-breathe"
          style={{
            fontSize: "1.8rem",
            fontWeight: 400,
            color: "var(--color-text)",
            textAlign: "center",
            lineHeight: 1.5
          }}
        >
          You've been making the same choice.
        </p>
        <p
          className="animate-fade-up delay-800"
          style={{
            fontSize: "1.3rem",
            fontStyle: "italic",
            color: "var(--color-text-light)",
            textAlign: "center",
            marginTop: "1.2rem"
          }}
        >
          Have you noticed?
        </p>
      </div>
      {/**
       * A thin gold line that crawls left-to-right across the bottom of the
       * screen over exactly 4 seconds — matching the auto-advance timer.
       * This communicates "something is happening" without labelling it a loader.
       */}
      <div className="surprise-progress" />
    </div>
  );
};
