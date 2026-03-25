import React from 'react';
import { dynamicTriggers, Dimension } from '../data/content';
import { ChevronLeft } from 'lucide-react';

interface ReflectionScreenProps {
  triggerBlock: number;
  dominantDimension: Dimension;
  onProceed: () => void;
  isTransitioning: boolean;
  onBack: () => void;
}

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({ 
  triggerBlock, 
  dominantDimension, 
  onProceed,
  isTransitioning,
  onBack
}) => {
  let reflectionText = "";
  let headerText = "Have you noticed something?";

  if (triggerBlock === 1) {
    reflectionText = dynamicTriggers.stage1[dominantDimension];
  } else if (triggerBlock === 2) {
    reflectionText = dynamicTriggers.stage2[dominantDimension];
    headerText = "A silent repetition.";
  } else {
    reflectionText = dynamicTriggers.stage3[dominantDimension];
    headerText = "Looking at the map.";
  }

  const transClass = isTransitioning ? 'screen-exit' : 'screen-enter';

  return (
    <div className={`glass-container ${transClass}`} style={{ position: 'relative', overflow: 'hidden' }}>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5rem', position: 'relative', zIndex: 2 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', marginLeft: '-0.5rem' }}>
          <ChevronLeft size={24} color="var(--color-text)" />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <h2 className="animate-fade-up delay-200" style={{ fontSize: '2rem', marginBottom: '2.5rem', fontWeight: 400 }}>
          {headerText}
        </h2>
        
        <p className="animate-fade-up delay-400" style={{ fontSize: '1.25rem', lineHeight: '1.8', maxWidth: '320px', margin: '0 auto', color: 'var(--color-text)' }}>
          {reflectionText}
        </p>

        <div className="animate-fade-up delay-800" style={{ marginTop: 'auto', width: '100%', maxWidth: '360px', paddingBottom: '2rem' }}>
           <button className="btn-primary" onClick={onProceed}>
             Continue
           </button>
        </div>
      </div>
    </div>
  );
};
