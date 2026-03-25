import React, { useState, useEffect, useRef } from 'react';
import { Dimension, Question } from '../data/content';
import { ChevronLeft } from 'lucide-react';

interface QuestionScreenProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  progressPercent: number;
  onAnswer: (dimension: Dimension) => void;
  isTransitioning: boolean;
  onBack: () => void;
}

const STAGE_OVERLAYS: Record<number, string> = {
  1: 'rgba(243, 206, 133, 0.06)',
  2: 'rgba(210, 160, 80,  0.09)',
  3: 'rgba(160, 90,  50,  0.08)',
};

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  questionIndex,
  totalQuestions,
  progressPercent,
  onAnswer,
  isTransitioning,
  onBack
}) => {
  const [activeCard, setActiveCard] = useState(0);    // which option is in focus (0-3)
  const [selected, setSelected] = useState<Dimension | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);  // live drag offset in px
  const [isAnimating, setIsAnimating] = useState(false);

  const dragStart = useRef<number | null>(null);
  const cardWidth = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset whenever we move to a new question
  useEffect(() => {
    setActiveCard(0);
    setSelected(null);
    setSwipeOffset(0);
    setIsAnimating(false);
  }, [question.id]);

  // Measure card width
  useEffect(() => {
    if (containerRef.current) {
      cardWidth.current = containerRef.current.offsetWidth;
    }
  }, []);

  const stage = questionIndex < 5 ? 1 : questionIndex < 10 ? 2 : 3;
  const stageLabel = stage === 1 ? 'STAGE I · THE UNKNOWN' : stage === 2 ? 'STAGE II · THE AFTERMATH' : 'STAGE III · THE MIRROR';
  const transClass = isTransitioning ? 'screen-exit' : 'screen-enter';
  const options = question.options;


  // Swipe gesture: pointer events work on both touch and mouse
  const onPointerDown = (e: React.PointerEvent) => {
    if (selected || isAnimating) return;
    dragStart.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current === null || selected || isAnimating) return;
    const delta = e.clientX - dragStart.current;
    setSwipeOffset(delta);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    const threshold = cardWidth.current * 0.28; // 28% of card width

    dragStart.current = null;
    setIsAnimating(true);
    setSwipeOffset(0);

    if (Math.abs(delta) < 8) {
      // Pure tap — select this card
      handleSelect(options[activeCard].id);
    } else if (delta < -threshold && activeCard < 3) {
      // Swipe left → next option
      setActiveCard(prev => prev + 1);
    } else if (delta > threshold && activeCard > 0) {
      // Swipe right → previous option
      setActiveCard(prev => prev - 1);
    }
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleSelect = (dim: Dimension) => {
    if (selected || isTransitioning) return;
    setSelected(dim);
    setTimeout(() => onAnswer(dim), 900);
  };

  return (
    <div
      className={`glass-container ${transClass}`}
      style={{ background: STAGE_OVERLAYS[stage], overflow: 'hidden' }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', marginLeft: '-0.5rem' }}>
          <ChevronLeft size={24} color="var(--color-text)" />
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '2px', opacity: 0.45, fontWeight: 600 }}>{stageLabel}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '0.1rem' }}>
            {String(questionIndex + 1).padStart(2, '0')}
            <span style={{ opacity: 0.35 }}> / {totalQuestions}</span>
          </div>
        </div>
        <div style={{ width: '32px' }} />
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', height: '3px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${progressPercent}%`,
          background: 'linear-gradient(90deg, var(--color-gold-light), var(--color-gold-dark))',
          transition: 'width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }} />
      </div>

      {/* Question text */}
      <div className="animate-fade-up delay-200" style={{ textAlign: 'center', marginBottom: '2rem', padding: '0 0.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 500, lineHeight: 1.5, marginBottom: '0.7rem', color: 'var(--color-text)' }}>
          {question.setup}
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--color-text-light)' }}>
          {question.context}
        </p>
      </div>

      {/* Card stack viewport */}
      <div
        ref={containerRef}
        className="animate-fade-up delay-400"
        style={{ position: 'relative', flex: 1, overflow: 'hidden', touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {options.map((opt, idx) => {
          const offset = (idx - activeCard) * 100; // percentage of card width
          const liveShift = idx === activeCard ? swipeOffset : 0;
          const isActive = idx === activeCard;
          const isChosen = selected === opt.id;
          const isDimmed = selected !== null && !isChosen;

          return (
            <div
              key={opt.id}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.8rem 1.5rem',
                borderRadius: '22px',
                border: isChosen
                  ? '2px solid var(--color-gold-dark)'
                  : '1.5px solid rgba(255,255,255,0.65)',
                background: isChosen
                  ? 'linear-gradient(135deg, rgba(251,229,184,0.95), rgba(243,206,133,0.9))'
                  : isActive
                    ? 'rgba(255,255,255,0.65)'
                    : 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: isChosen
                  ? '0 16px 40px rgba(200,150,80,0.3)'
                  : isActive
                    ? '0 8px 30px rgba(0,0,0,0.08)'
                    : '0 4px 16px rgba(0,0,0,0.04)',
                opacity: isDimmed ? 0 : isActive ? 1 : 0,
                transform: `translateX(calc(${offset * 100}% + ${liveShift}px)) scale(${isActive ? 1 : 0.94})`,
                transition: dragStart.current !== null
                  ? 'opacity 0.3s ease, box-shadow 0.3s ease'
                  : 'all 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
                userSelect: 'none',
                willChange: 'transform',
              }}
            >
              {/* Letter badge 
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '34px', height: '34px', borderRadius: '50%',
                background: isChosen ? 'var(--color-gold-dark)' : 'rgba(0,0,0,0.06)',
                color: isChosen ? '#fff' : 'var(--color-text-light)',
                fontWeight: 700, fontSize: '0.9rem',
                transition: 'all 0.4s ease'
              }}>
                {letters[idx]}
              </span>
              */}

              {/* Option text */}
              <p style={{
                fontSize: '1.15rem',
                lineHeight: 1.55,
                fontWeight: isChosen ? 500 : 400,
                color: 'var(--color-text)',
                margin: 0
              }}>
                {opt.text}
              </p>

              {/* Tap hint at bottom */}
              {!selected && isActive && (
                <span style={{ fontSize: '0.78rem', letterSpacing: '1.5px', opacity: 0.3, color: 'var(--color-text)' }}>
                  TAP TO CHOOSE
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Dot navigation & swipe hint */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1.5rem', paddingBottom: '1rem', gap: '0.8rem' }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {options.map((_, idx) => (
            <button
              key={idx}
              onClick={() => !selected && !isAnimating && setActiveCard(idx)}
              style={{
                width: activeCard === idx ? '20px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: activeCard === idx ? 'var(--color-gold-dark)' : 'rgba(0,0,0,0.12)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
          ))}
        </div>
        {/* Swipe hint */}
        {!selected && (
          <span style={{ fontSize: '0.78rem', letterSpacing: '1.5px', opacity: 0.25 }}>
            SWIPE TO EXPLORE · TAP TO CHOOSE
          </span>
        )}
      </div>
    </div>
  );
};
