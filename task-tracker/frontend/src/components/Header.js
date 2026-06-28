import React from 'react';
import { FiZap } from 'react-icons/fi';

export default function Header() {
  return (
    <header style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      position: 'sticky', top: 0, zIndex: 100,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiZap size={17} color="white" fill="white" />
          </div>
          <span style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700, fontSize: 20,
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            TaskFlow
          </span>
        </div>

        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          MERN Task Tracker
        </span>
      </div>
    </header>
  );
}
