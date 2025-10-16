import React from 'react';

export const BloodSugarTshPsaPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '32px',
      backgroundColor: 'var(--color-background)',
      minHeight: '100vh'
    }}>
      <div className="medical-card" style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderRadius: '12px', 
        padding: '40px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '8px'
          }}>
            Blood Sugar + TSH + PSA
          </h1>
          <div style={{ 
            height: '4px', 
            width: '60px', 
            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            borderRadius: '2px',
            marginBottom: '16px'
          }}></div>
        </div>
        
        <div style={{ 
          backgroundColor: 'var(--color-primary-50)', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid var(--color-primary-100)',
          marginBottom: '32px'
        }}>
          <p style={{ 
            fontSize: 'var(--text-base)', 
            color: 'var(--color-text-primary)', 
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Specialized markers for diabetes, thyroid function, and prostate health
          </p>
        </div>
        
        <div>
          <h3 style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            marginBottom: '12px'
          }}>
            Biomarkers Included
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {['GLUCOSE', 'HBA1C', 'TSH', 'PSA'].map((biomarker) => (
              <div key={biomarker} style={{
                padding: '12px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: 'var(--color-text-primary)'
              }}>
                {biomarker}
              </div>
            ))}
          </div>
          
          <p style={{ 
            fontSize: 'var(--text-base)', 
            color: 'var(--color-text-secondary)', 
            lineHeight: '1.6',
            marginBottom: '0'
          }}>
            This section covers important specialized tests including blood glucose control, 
            thyroid stimulating hormone levels, and prostate-specific antigen screening.
          </p>
        </div>
      </div>
    </div>
  );
};