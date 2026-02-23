import React from 'react';
import { PercentageBarChart } from './PercentageBarChart';
import { PercentageLineChart } from './PercentageLineChart';
import { getBloodRangeColor } from '../utils/bloodRangeColors';

interface OverviewPageProps {
  onNavigate?: (page: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(['whiteBloodCells', 'redBloodCells', 'liverFunction', 'lipidProfile', 'kidneyFunction', 'bloodSugarTshPsa']));
  
  // Shared hover state for both charts
  const [chartHover, setChartHover] = React.useState<{
    x: number;
    biomarkerIndex: number;
    visible: boolean;
  }>({
    x: 0,
    biomarkerIndex: -1,
    visible: false
  });

  // State for tracking which biomarker should be highlighted in the table
  const [highlightedBiomarker, setHighlightedBiomarker] = React.useState<string | null>(null);

  // Chart filter state
  const [selectedTimeRange] = React.useState<string>('last2'); // For top chart
  const [bottomChartTimeRange, setBottomChartTimeRange] = React.useState<string>('last2'); // For bottom chart only
  const [selectedBiomarkerGroups] = React.useState<Set<string>>(new Set(['whiteBloodCells', 'redBloodCells', 'liverFunction', 'lipidProfile', 'kidneyFunction', 'bloodSugarTshPsa']));

  // Biomarker data with actual values and changes
  const biomarkerGroups = [
    {
      id: 'whiteBloodCells',
      title: 'WHITE BLOOD CELLS AND PLATELETS',
      navigationKey: 'white-blood-cells',
biomarkers: [
        // Using most recent test values and "Last 2 tests" percentage changes
        { name: 'BASOPHILS (X10*9)', result: '0.04', change: 0 }, // aug2024 value, aug->mar change
        { name: 'EOSINOPHILS (X10*9)', result: '0.26', change: null }, // aug2024 value, aug->mar change is null (mar2025 = #N/A)
        { name: 'LEUCOCYTES (X10*9)', result: '4.4', change: -23 }, // mar2025 value, aug->mar change
        { name: 'LYMPHOCYTES (X10*9)', result: '1.22', change: null }, // aug2024 value, aug->mar change is null
        { name: 'MONOCYTES (X10*9)', result: '0.5', change: null }, // aug2024 value, aug->mar change is null
        { name: 'NEUTROPHILS (X10*9)', result: '3.72', change: null }, // aug2024 value, aug->mar change is null
        { name: 'PLATELETS (X10*9)', result: '266', change: -13 } // mar2025 value, aug->mar change
      ]
    },
    {
      id: 'redBloodCells',
      title: 'RED BLOOD CELLS',
      navigationKey: 'red-blood-cells',
      biomarkers: [
        { name: 'RBC (X10*12)', result: '4.49', change: 2 }, // mar2025 value, aug->mar change
        { name: 'HAEMOGLOBIN (g/dl)', result: '13', change: 2 }, // mar2025 value, aug->mar change
        { name: 'HAEMATOCRIT (L/L)', result: '0.41', change: 0 }, // mar2025 value, aug->mar change
        { name: 'MCV (fl)', result: '90.6', change: -2 }, // mar2025 value, aug->mar change
        { name: 'MCH (pg)', result: '29', change: -1 }, // mar2025 value, aug->mar change
        { name: 'MCHC (g/dl)', result: '31.9', change: 1 } // mar2025 value, aug->mar change
      ]
    },
    {
      id: 'liverFunction',
      title: 'LIVER FUNCTION',
      navigationKey: 'liver-function',
      biomarkers: [
        { name: 'ALT (U/L)', result: '20', change: -29 }, // mar2025 value, aug->mar change
        { name: 'BILIRUBIN TOTAL (UMOL/L)', result: '9.5', change: 44 }, // mar2025 value, aug->mar change  
        { name: 'ALKALINE PHOSPHATASE( IU/L)', result: '70', change: -23 }, // mar2025 value, aug->mar change
        { name: 'GAMMA GT (U/L)', result: '32', change: -26 }, // mar2025 value, aug->mar change
        { name: 'TOTAL PROTEINS (G/L)', result: '77', change: 0 }, // mar2025 value, aug->mar change
        { name: 'ALBUMIN (G/L))', result: '47', change: 2 } // mar2025 value, aug->mar change
      ]
    },
    {
      id: 'lipidProfile',
      title: 'LIPID PROFILE',
      navigationKey: 'lipid-profile',
      biomarkers: [
        { name: 'CHOLESTEROL (TOTAL)mmol/L', result: '4.6', change: 0 }, // mar2025 value, aug->mar change
        { name: 'TRIGLYCERIDES (mmol / L)', result: '1.43', change: 8 }, // mar2025 value, aug->mar change
        { name: 'CHOLESTEROL HDL (mmol / L)', result: '1.76', change: -5 }, // mar2025 value, aug->mar change
        { name: 'CHOLESTEROL LDL (mmol/L)', result: '2.19', change: 2 }, // mar2025 value, aug->mar change
        { name: 'non HDL CHOLESTEROL (mmol/L)', result: '2.84', change: 4 } // mar2025 value, aug->mar change
      ]
    },
    {
      id: 'kidneyFunction',
      title: 'KIDNEY FUNCTION',
      navigationKey: 'kidney-function',
      biomarkers: [
        { name: 'UREA (mmol / L)', result: '5.2', change: 18 }, // mar2025 value, aug->mar change
        { name: 'CREATININE (umol/L)', result: '61', change: -6 }, // mar2025 value, aug->mar change
        { name: 'eGFR (Ml/min/1.73m2', result: '89', change: 6 } // mar2025 value, aug->mar change
      ]
    },
    {
      id: 'bloodSugarTshPsa',
      title: 'BLOOD SUGAR + TSH + PSA',
      navigationKey: 'blood-sugar-tsh-psa',
      biomarkers: [
        { name: 'GLUCOSE MMOL/L', result: '#N/A', change: null }, // mar2025 value, aug->mar change
        { name: 'HbA1c', result: '#N/A', change: null }, // mar2025 value, aug->mar change  
        { name: 'TSH', result: '0.493', change: 37 }, // mar2025 value, aug->mar change
        { name: 'PSA', result: '#N/A', change: null } // mar2025 value, aug->mar change
      ]
    }
  ];

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };


  // Function to determine background color based on percentage change
  // const getPercentageChangeColor = (changeValue: number | null): string => {
  //   if (changeValue === null) return '#6b7280'; // Gray for null values
  //   const absValue = Math.abs(changeValue);
  //   if (absValue > 100) {
  //     return '#dc2626'; // Red solid
  //   } else if (absValue > 75) {
  //     return '#7c3aed'; // Purple solid
  //   } else if (absValue > 25) {
  //     return '#059669'; // Green solid
  //   } else {
  //     return '#fbbf24'; // Yellow solid
  //   }
  // };

  // Helper function to map chart biomarker names to table biomarker names
  const mapChartNameToTableName = (chartName: string): string => {
    const chartToTableMapping: Record<string, string> = {
      // Direct matches (charts use these exact names)
      'LEUCOCYTES': 'LEUCOCYTES',
      'NEUTROPHILS': 'NEUTROPHILS', 
      'LYMPHOCYTES': 'LYMPHOCYTES',
      'MONOCYTES': 'MONOCYTES',
      'EOSINOPHILS': 'EOSINOPHILS',
      'BASOPHILS': 'BASOPHILS',
      'PLATELETS': 'PLATELETS',
      'RBC': 'RBC',
      'HAEMOGLOBIN': 'HAEMOGLOBIN',
      'HAEMATOCRIT': 'HAEMATOCRIT',
      'MCV': 'MCV',
      'MCH': 'MCH',
      'MCHC': 'MCHC',
      'ALT': 'ALT',
      'UREA': 'UREA',
      'CREATININE': 'CREATININE',
      'eGFR': 'eGFR',
      'TSH': 'TSH',
      'TRIGLYCERIDES': 'TRIGLYCERIDES',
      'ALBUMIN': 'ALBUMIN',
      
      // Mismatched names (charts → table normalized versions)
      'BILIRUBIN': 'BILIRUBIN TOTAL',
      'ALP': 'ALKALINE PHOSPHATASE',
      'GAMMA GT': 'GAMMA GT',
      'PROTEINS': 'TOTAL PROTEINS', 
      'CHOLESTEROL': 'CHOLESTEROL TOTAL', // Notice: removed parentheses as they get normalized away
      'HDL': 'CHOLESTEROL HDL',
      'LDL': 'CHOLESTEROL LDL',
      'NON-HDL': 'NON HDL CHOLESTEROL'
    };
    
    return chartToTableMapping[chartName.toUpperCase()] || chartName.toUpperCase();
  };

  // Helper function to normalize table biomarker name for comparison
  const normalizeTableBiomarkerName = (name: string): string => {
    // Remove units and extra formatting from table names
    return name.toUpperCase()
      .replace(/\)\)+/g, ')') // Fix double closing parentheses (like ALBUMIN (G/L)))  
      .replace(/\([^)]*\)?[^)]*/g, '') // Remove parentheses and all content inside/after, handle missing closing paren
      .replace(/\s*[a-zA-Z]+\/[a-zA-Z0-9.]+\s*$/g, '') // Remove trailing units like "mmol/L", "Ml/min/1.73m2"  
      .replace(/[a-zA-Z]+\/[a-zA-Z0-9.]+$/g, '') // Remove units without spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  // Helper function to extract biomarker key for color matching
  const getBiomarkerKey = (fullName: string): string => {
    const upperName = fullName.toUpperCase();
    if (upperName.includes('LEUCOCYTES')) return 'LEUCOCYTES';
    if (upperName.includes('NEUTROPHILS')) return 'NEUTROPHILS';
    if (upperName.includes('LYMPHOCYTES')) return 'LYMPHOCYTES';
    if (upperName.includes('MONOCYTES')) return 'MONOCYTES';
    if (upperName.includes('EOSINOPHILS')) return 'EOSINOPHILS';
    if (upperName.includes('BASOPHILS')) return 'BASOPHILS';
    if (upperName.includes('PLATELETS')) return 'PLATELETS';
    if (upperName.includes('RBC')) return 'RBC';
    if (upperName.includes('HAEMOGLOBIN')) return 'HAEMOGLOBIN';
    if (upperName.includes('HAEMATOCRIT')) return 'HAEMATOCRIT';
    if (upperName.includes('MCV')) return 'MCV';
    if (upperName.includes('MCH')) return 'MCH';
    if (upperName.includes('MCHC')) return 'MCHC';
    if (upperName.includes('ALT')) return 'ALT';
    if (upperName.includes('BILIRUBIN')) return 'BILIRUBIN';
    if (upperName.includes('ALKALINE')) return 'ALP';
    if (upperName.includes('GAMMA')) return 'GAMMA GT';
    if (upperName.includes('PROTEINS')) return 'PROTEINS';
    if (upperName.includes('ALBUMIN')) return 'ALBUMIN';
    if (upperName.includes('CHOLESTEROL (TOTAL)')) return 'CHOLESTEROL';
    if (upperName.includes('TRIGLYCERIDES')) return 'TRIGLYCERIDES';
    // Explicit check for NON HDL CHOLESTEROL
    if (upperName.includes('NON HDL CHOLESTEROL')) return 'NON-HDL';
    if (upperName.includes('HDL')) return 'HDL';
    if (upperName.includes('LDL')) return 'LDL';
    if (upperName.includes('UREA')) return 'UREA';
    if (upperName.includes('CREATININE')) return 'CREATININE';
    if (upperName.includes('eGFR')) return 'eGFR';
    if (upperName.includes('GLUCOSE')) return 'GLUCOSE';
    if (upperName.includes('HbA1c')) return 'HbA1c';
    if (upperName.includes('TSH')) return 'TSH';
    if (upperName.includes('PSA')) return 'PSA';
    return fullName;
  };

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
            flex: '0 0 26%', // 5% reduction to give bottom graph more space
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '8px',
            margin: '0'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <h2 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)',
                marginBottom: '4px',
                textAlign: 'center'
              }}>
                Percentage Change in Blood Results from Previous Measurement
              </h2>
            </div>
            <PercentageBarChart 
              chartHover={chartHover}
              onChartHover={setChartHover}
              timeframe={selectedTimeRange}
              selectedBiomarkerGroups={selectedBiomarkerGroups}
              onBiomarkerHover={setHighlightedBiomarker}
            />
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
            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)',
                marginBottom: '4px',
                flex: '1',
                textAlign: 'center'
              }}>
                Percentage Change in Blood Results
              </h2>
              
              {/* Time Range Filters for Bottom Chart Only */}
              <div style={{
                display: 'flex',
                gap: '6px',
                alignItems: 'center'
              }}>
                {['last2', 'last3', 'last4'].map((range) => (
                    <button 
                      key={range}
                      onClick={() => setBottomChartTimeRange(range)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: bottomChartTimeRange === range ? 'var(--color-primary)' : 'transparent',
                        color: bottomChartTimeRange === range ? 'white' : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (bottomChartTimeRange !== range) {
                          e.currentTarget.style.backgroundColor = 'var(--color-primary-50)';
                          e.currentTarget.style.color = 'var(--color-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (bottomChartTimeRange !== range) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }
                      }}
                    >
                      Last {range.slice(-1)} tests
                    </button>
                ))}
              </div>
            </div>
            <PercentageLineChart 
              chartHover={chartHover}
              onChartHover={setChartHover}
              timeframe={bottomChartTimeRange}
              selectedBiomarkerGroups={selectedBiomarkerGroups}
              onBiomarkerHover={setHighlightedBiomarker}
            />
          </div>
        </div>

        {/* Right Column - KPI Table */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          overflow: 'visible'
        }}>
          

          {/* Table Body */}
          <div style={{ 
            flex: 'none',
            overflow: 'visible' // Remove scroll restrictions to show all content
          }}>
            {biomarkerGroups.map((group) => (
              <div key={group.id}>
                {/* Group Header Row */}
                <div 
                  onClick={() => onNavigate?.(group.navigationKey)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  }}
                >
                  <div style={{ 
                    padding: '6px 14px', 
                    borderRight: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroup(group.id);
                      }}
                      style={{ cursor: 'pointer', fontSize: '11px' }}
                    >
                      {expandedGroups.has(group.id) ? '▼' : '▶'}
                    </span>
                    {group.title}
                  </div>
                  <div style={{ 
                    padding: '6px 14px', 
                    borderRight: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {group.id === 'whiteBloodCells' ? 'Result' : ''}
                  </div>
                  <div style={{ 
                    padding: '6px 14px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {group.id === 'whiteBloodCells' ? 'Δ PY %' : ''}
                  </div>
                </div>

                {/* Biomarker Rows */}
                {expandedGroups.has(group.id) && group.biomarkers.map((biomarker, index) => {
                  const normalizedTableName = normalizeTableBiomarkerName(biomarker.name);
                  const expectedTableName = mapChartNameToTableName(highlightedBiomarker || '');
                  const isHighlighted = highlightedBiomarker && normalizedTableName === expectedTableName;
                  
                  return (
                  <div 
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr',
                      borderBottom: index < group.biomarkers.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                      fontSize: 'var(--text-xs)',
                      transition: 'all 0.2s ease',
                      border: isHighlighted ? '2px solid black' : 'none',
                      marginBottom: isHighlighted ? '2px' : '0px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary-25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ 
                      padding: '4px 14px 4px 28px', 
                      borderRight: '1px solid var(--color-border-light)',
                      color: 'var(--color-text-secondary)',
                      fontSize: '10px'
                    }}>
                      {biomarker.name}
                    </div>
                    <div style={{ 
                      padding: '4px 10px', 
                      borderRight: '1px solid var(--color-border-light)',
                      textAlign: 'center',
                      fontWeight: '600',
                      backgroundColor: biomarker.name.includes('eGFR') ? '#6b7280' : (biomarker.name.includes('non HDL') ? '#059669' : getBloodRangeColor(getBiomarkerKey(biomarker.name), biomarker.result)),
                      color: 'white',
                      fontSize: '10px'
                    }}>
                      {biomarker.result}
                    </div>
                    <div style={{ 
                      padding: '4px 10px',
                      textAlign: 'center',
                      fontWeight: '600',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      fontSize: '10px'
                    }}>
                      {biomarker.change === null ? 'N/A' : `${biomarker.change > 0 ? '+' : ''}${biomarker.change.toFixed(1)}%`}
                    </div>
                  </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Compare Results Button */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)'
          }}>
            <button 
              onClick={() => onNavigate?.('comparograph')}
              style={{ 
                width: '100%',
                padding: '8px 16px',
                backgroundColor: 'var(--color-secondary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-sm)',
                fontWeight: '600',
                boxShadow: 'var(--shadow-md)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-secondary-dark)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              📊 Compare Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};