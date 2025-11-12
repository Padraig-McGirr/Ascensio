import React from 'react';

export const RedBloodCellsPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '0',
      margin: '0',
      backgroundColor: 'var(--color-background)',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'var(--color-surface)', 
        padding: '20px 32px',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <h1 style={{ 
          fontSize: 'var(--text-3xl)', 
          fontWeight: '700', 
          color: 'var(--color-text-primary)',
          marginBottom: '8px',
          margin: 0
        }}>
          🔴 RED BLOOD CELLS
        </h1>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          borderRadius: '2px',
          marginTop: '8px'
        }}></div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '32px',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Left Column - Charts and Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Chart Placeholder */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: '600', 
              color: 'var(--color-text-primary)',
              marginBottom: '16px'
            }}>
              Red Blood Cell Trends
            </h2>
            <div style={{
              height: '300px',
              backgroundColor: 'var(--color-background)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-lg)'
            }}>
              📊 Chart Component Loading...
            </div>
          </div>

          {/* Data Table Placeholder */}
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: '600', 
              color: 'var(--color-text-primary)',
              marginBottom: '16px'
            }}>
              Red Blood Cell Data
            </h2>
            
            {/* Sample Data */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'RBC (X10*12)', value: '4.49', status: 'normal' },
                { name: 'HAEMOGLOBIN (g/dl)', value: '13.0', status: 'normal' },
                { name: 'HAEMATOCRIT (L/L)', value: '0.41', status: 'normal' },
                { name: 'MCV (fl)', value: '90.6', status: 'normal' },
                { name: 'MCH (pg)', value: '29.0', status: 'normal' },
                { name: 'MCHC (g/dl)', value: '31.9', status: 'normal' }
              ].map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-background)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)'
                }}>
                  <span style={{ 
                    fontWeight: '500', 
                    color: 'var(--color-text-primary)' 
                  }}>
                    {item.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: 'var(--color-text-primary)' 
                    }}>
                      {item.value}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: item.status === 'normal' ? '#10b981' : '#ef4444',
                      color: 'white'
                    }}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Range Visualization Placeholder */}
        <div>
          <div style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            height: 'fit-content'
          }}>
            <h2 style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: '600', 
              color: 'var(--color-text-primary)',
              marginBottom: '16px'
            }}>
              Reference Ranges
            </h2>
            <div style={{
              height: '400px',
              backgroundColor: 'var(--color-background)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-lg)'
            }}>
              🎯 Range Visualization Loading...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};