import React from 'react';
import { PercentageBarChart } from './PercentageBarChart';
import { PercentageLineChart } from './PercentageLineChart';

interface OverviewPageProps {
  onNavigate?: (page: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  // Biomarker data for color coding
  const biomarkerData = {
    whiteBloodCells: {
      biomarkers: ['LEUCOCYTES', 'NEUTROPHILS', 'LYMPHOCYTES', 'MONOCYTES', 'EOSINOPHILS', 'BASOPHILS', 'PLATELETS'],
      changes: { 'LEUCOCYTES': 23, 'NEUTROPHILS': 14, 'LYMPHOCYTES': 8, 'MONOCYTES': 11, 'EOSINOPHILS': 86, 'BASOPHILS': 100, 'PLATELETS': 13 },
      gridColumns: 'repeat(4, 1fr)'
    },
    redBloodCells: {
      biomarkers: ['RBC', 'HAEMOGLOBIN', 'HAEMATOCRIT', 'MCV', 'MCH', 'MCHC'],
      changes: { 'RBC': 2, 'HAEMOGLOBIN': 2, 'HAEMATOCRIT': 0, 'MCV': 2, 'MCH': 1, 'MCHC': 1 },
      gridColumns: 'repeat(3, 1fr)'
    },
    liverFunction: {
      biomarkers: ['ALT', 'BILIRUBIN', 'ALKALINE PHOSPHATE', 'GAMMA GT', 'TOTAL PROTEINS', 'ALBUMIN'],
      changes: { 'ALT': 29, 'BILIRUBIN': 44, 'ALKALINE PHOSPHATE': 23, 'GAMMA GT': 26, 'TOTAL PROTEINS': 0, 'ALBUMIN': 2 },
      gridColumns: 'repeat(3, 1fr)'
    },
    lipidProfile: {
      biomarkers: ['CHOLESTEROL (TOTAL)', 'TRIGLYCERIDES', 'CHOLESTEROL HDL', 'CHOLESTEROL LDL', 'Non HDL CHOLESTEROL'],
      changes: { 'CHOLESTEROL (TOTAL)': 0, 'TRIGLYCERIDES': 8, 'CHOLESTEROL HDL': 5, 'CHOLESTEROL LDL': 2, 'Non HDL CHOLESTEROL': 4 },
      gridColumns: 'repeat(2, 1fr)'
    },
    kidneyFunction: {
      biomarkers: ['UREA', 'CREATININE', 'Egfr', 'SODIUM', 'POTASSIUM', 'CHLORIDE', 'CALCIUM', 'PHOSPHOROUS', 'MAGNESIUM'],
      changes: { 'UREA': 18, 'CREATININE': 6, 'Egfr': 6, 'SODIUM': 0, 'POTASSIUM': 0, 'CHLORIDE': 0, 'CALCIUM': 0, 'PHOSPHOROUS': 0, 'MAGNESIUM': 0 },
      gridColumns: 'repeat(3, 1fr)'
    },
    bloodSugarTshPsa: {
      biomarkers: ['GLUCOSE', 'HBA1C', 'TSH', 'PSA'],
      changes: { 'GLUCOSE': 0, 'HBA1C': 0, 'TSH': 37, 'PSA': 0 },
      gridColumns: 'repeat(2, 1fr)'
    }
  };

  // Function to determine background color based on percentage change
  const getBiomarkerColor = (changeValue: number): string => {
    if (changeValue > 100) {
      return '#dc2626'; // Red solid
    } else if (changeValue > 75) {
      return '#7c3aed'; // Purple solid
    } else if (changeValue > 25) {
      return '#059669'; // Green solid
    } else {
      return '#fbbf24'; // Yellow solid
    }
  };

  // Component for rendering biomarker grid
  const BiomarkerGrid: React.FC<{
    biomarkers: string[];
    changes: Record<string, number>;
    gridColumns: string;
  }> = ({ biomarkers, changes, gridColumns }) => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: gridColumns, 
      gap: '4px'
    }}>
      {biomarkers.map((label, index) => {
        const changeValue = changes[label] || 0;
        const backgroundColor = getBiomarkerColor(changeValue);
        
        return (
          <div 
            key={index} 
            style={{ 
              height: '24px',
              backgroundColor: backgroundColor,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: '700',
              color: 'white',
              padding: '2px',
              position: 'relative',
              zIndex: 10,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );

  // Component for KPI button
  const KPIButton: React.FC<{
    title: string;
    navigationKey: string;
    biomarkerData: {
      biomarkers: string[];
      changes: Record<string, number>;
      gridColumns: string;
    };
  }> = ({ title, navigationKey, biomarkerData }) => (
    <button 
      onClick={() => onNavigate?.(navigationKey)}
      style={{ 
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px',
        margin: '0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <h4 style={{ 
        fontSize: 'var(--text-sm)', 
        fontWeight: '600',
        margin: '0 0 12px 0',
        textAlign: 'center'
      }}>
        {title}
      </h4>
      <BiomarkerGrid 
        biomarkers={biomarkerData.biomarkers}
        changes={biomarkerData.changes}
        gridColumns={biomarkerData.gridColumns}
      />
    </button>
  );

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
      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '1px',
        height: 'calc(100vh - 50px)',
        width: '100%',
        padding: '0 8px 0 0',
        margin: '0'
      }}>
        
        {/* Left Column - Charts */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1px'
        }}>
          
          {/* Top Chart - Percentage Change Bar Graph */}
          <div style={{ 
            flex: '0 0 45%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '8px',
            margin: '0'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                Percentage Change in Blood Results from Previous Measurement
              </h2>
            </div>
            <PercentageBarChart />
          </div>

          {/* Bottom Chart - Percentage Change Line Graph */}
          <div style={{ 
            flex: '1',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '8px',
            margin: '0'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                Percentage Change in Blood Results over last 3 Measurements
              </h2>
            </div>
            <PercentageLineChart />
          </div>
        </div>

        {/* Right Column - KPI Indicators Panel */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1px'
        }}>
          
          {/* KPI Panel Header */}
          <div style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '8px',
            margin: '0'
          }}>
            <h3 style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: '600', 
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
              textAlign: 'center'
            }}>
              Key Performance Indicators - Biomarker Status
            </h3>
          </div>

          {/* KPI Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            
            {/* White Blood Cells and Platelets */}
            <KPIButton 
              title="WHITE BLOOD CELLS AND PLATELETS"
              navigationKey="white-blood-cells"
              biomarkerData={biomarkerData.whiteBloodCells}
            />

            {/* Red Blood Cells */}
            <KPIButton 
              title="RED BLOOD CELLS"
              navigationKey="red-blood-cells"
              biomarkerData={biomarkerData.redBloodCells}
            />

            {/* Liver Function */}
            <KPIButton 
              title="LIVER FUNCTION"
              navigationKey="liver-function"
              biomarkerData={biomarkerData.liverFunction}
            />

            {/* Lipid Profile */}
            <KPIButton 
              title="LIPID PROFILE"
              navigationKey="lipid-profile"
              biomarkerData={biomarkerData.lipidProfile}
            />

            {/* Kidney Function */}
            <KPIButton 
              title="KIDNEY FUNCTION"
              navigationKey="kidney-function"
              biomarkerData={biomarkerData.kidneyFunction}
            />

            {/* Blood Sugar + TSH + PSA */}
            <KPIButton 
              title="BLOOD SUGAR + TSH + PSA"
              navigationKey="blood-sugar-tsh-psa"
              biomarkerData={biomarkerData.bloodSugarTshPsa}
            />

            {/* Bottom spacer for additional KPIs */}
            <div style={{ 
              height: '60px',
              backgroundColor: 'var(--color-background)',
              border: '2px dashed var(--color-border)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-text-tertiary)'
              }}>
                Additional KPI space
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};