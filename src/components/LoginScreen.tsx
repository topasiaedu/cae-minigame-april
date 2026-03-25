import React, { useState } from 'react';
import { User, Mail } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string, email: string) => void;
  isTransitioning: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isTransitioning }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name, email);
    }
  };

  return (
    <div className={`glass-container ${isTransitioning ? 'fade-exit-active' : 'fade-enter-active'}`}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
          Predictable Destiny
        </h1>
        
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Every path is shaped by moments where we had to decide before we were completely ready.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            Over the next few minutes, we will revisit these choices.
          </p>
          <p style={{ fontStyle: 'italic', opacity: 0.8 }}>
            There are no right answers—only your natural habits. Let's look in the mirror.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '360px', margin: '0 auto' }}>
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Username" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              className="input-field" 
              placeholder="Gmail (Optional)" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={!name.trim()}>
            Next
          </button>
        </form>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '2rem', opacity: 0.4, fontSize: '0.8rem', letterSpacing: '2px' }}>
        CAE GOH
      </div>
    </div>
  );
};
