import React, { useState, useEffect } from 'react';
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
  const [selected, setSelected] = useState<Dimension | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  const stage = questionIndex < 5 ? 1 : questionIndex < 10 ? 2 : 3;
  const stageLabel = stage === 1 ? 'STAGE I · THE UNKNOWN' : stage === 2 ? 'STAGE II · THE AFTERMATH' : 'STAGE III · THE MIRROR';
  const transClass = isTransitioning ? 'screen-exit' : 'screen-enter';
  const letters = ['A', 'B', 'C', 'D'];

  const handleSelect = (dim: Dimension) => {
    if (selected || isTransitioning) return;
    setSelected(dim);
    setTimeout(() => onAnswer(dim), 850);
  };

  return (
    <div className={`glass-container ${transClass}`} style={{ background: STAGE_OVERLAYS[stage] }}>

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
          height: '100%',
          width: `${progressPercent}%`,
          background: 'linear-gradient(90deg, var(--color-gold-light), var(--color-gold-dark))',
          transition: 'width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }} />
      </div>

      {/* Question text */}
      <div className="animate-fade-up delay-200" style={{ textAlign: 'center', marginBottom: '2rem', padding: '0 0.25rem' }}>
        <p style={{ fontSize: '1.35rem', fontWeight: 500, lineHeight: 1.6, color: 'var(--color-text)' }}>
          {question.setup}{' '}
          <span style={{ fontWeight: 400 }}>{question.context}</span>
        </p>
      </div>

      {/* Options — simple list, tap to auto-advance */}
      <div className="animate-fade-up delay-400" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }}>
        {question.options.map((opt, idx) => {
          const isChosen = selected === opt.id;
          const isFaded = selected !== null && !isChosen;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={!!selected}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1.1rem 1rem',
                minHeight: '120px',
                borderRadius: '16px',
                border: isChosen ? '2px solid var(--color-gold-dark)' : '1.5px solid rgba(255,255,255,0.65)',
                background: isChosen
                  ? 'linear-gradient(135deg, rgba(251,229,184,0.95), rgba(243,206,133,0.9))'
                  : 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: selected ? 'default' : 'pointer',
                fontFamily: 'var(--font-main)',
                textAlign: 'left',
                opacity: isFaded ? 0.3 : 1,
                transform: isChosen ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isChosen ? '0 10px 28px rgba(200,150,80,0.25)' : '0 2px 10px rgba(0,0,0,0.04)',
                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '28px', height: '28px', flexShrink: 0, borderRadius: '50%',
                background: isChosen ? 'var(--color-gold-dark)' : 'rgba(0,0,0,0.05)',
                color: isChosen ? '#fff' : 'var(--color-text-light)',
                fontWeight: 700, fontSize: '0.82rem',
                transition: 'all 0.4s ease'
              }}>
                {letters[idx]}
              </span>
              <span style={{ fontSize: '0.95rem', lineHeight: 1.45, color: 'var(--color-text)', fontWeight: isChosen ? 500 : 400 }}>
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ paddingBottom: '1.5rem' }} />
    </div>
  );
};
