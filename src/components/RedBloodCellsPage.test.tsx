import React from 'react';

export const RedBloodCellsPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '32px', 
      backgroundColor: 'var(--color-background)',
      minHeight: '100vh'
    }}>
      <div style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderRadius: '12px', 
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }}>
        <h1 style={{ 
          fontSize: 'var(--text-3xl)', 
          fontWeight: '700', 
          color: 'var(--color-text-primary)',
          marginBottom: '16px'
        }}>
          🔴 Red Blood Cells Page - TEST
        </h1>
        <p style={{ 
          fontSize: 'var(--text-lg)', 
          color: 'var(--color-text-secondary)' 
        }}>
          ✅ Navigation is working! This is a test component to verify the routing works correctly.
        </p>
        <p style={{ 
          fontSize: 'var(--text-base)', 
          color: 'var(--color-text-secondary)',
          marginTop: '16px'
        }}>
          If you can see this message, it means:
        </p>
        <ul style={{ 
          fontSize: 'var(--text-base)', 
          color: 'var(--color-text-secondary)',
          marginTop: '8px',
          marginLeft: '20px'
        }}>
          <li>✅ The onClick handler in OverviewPage is working</li>
          <li>✅ The routing in App.tsx is working</li>
          <li>✅ The component is rendering successfully</li>
        </ul>
      </div>
    </div>
  );
};