import React, { useState } from 'react';
import { PercentageBarChart } from './PercentageBarChart';
import { PercentageLineChart } from './PercentageLineChart';

export const ResultsTable: React.FC = () => {
  // Hover state for highlighting
  const [hoveredCell, setHoveredCell] = useState<{
    biomarker: string;
    column: string;
  } | null>(null);

  // Data from CSV file
  const tableData = [
    { biomarker: 'LEUCOCYTES (X10*9)', baseline: '4.5', feb2024: '5.1', aug2024: '5.7', mar2025: '4.4', febChange: '13%', augChange: '12%', marChange: '-23%' },
    { biomarker: 'NEUTROPHILS (X10*9)', baseline: '2.89', feb2024: '3.25', aug2024: '3.72', mar2025: '#N/A', febChange: '12%', augChange: '14%', marChange: '#N/A' },
    { biomarker: 'LYMPHOCYTES (X10*9)', baseline: '0.95', feb2024: '1.13', aug2024: '1.22', mar2025: '#N/A', febChange: '19%', augChange: '8%', marChange: '#N/A' },
    { biomarker: 'MONOCYTES (X10*9)', baseline: '0.45', feb2024: '0.56', aug2024: '0.5', mar2025: '#N/A', febChange: '24%', augChange: '-11%', marChange: '#N/A' },
    { biomarker: 'EOSINOPHILS (X10*9)', baseline: '0.21', feb2024: '0.14', aug2024: '0.26', mar2025: '#N/A', febChange: '-33%', augChange: '86%', marChange: '#N/A' },
    { biomarker: 'BASOPHILS (X10*9)', baseline: '0.02', feb2024: '0.04', aug2024: '0.04', mar2025: '#N/A', febChange: '100%', augChange: '0%', marChange: '#N/A' },
    { biomarker: 'PLATELETS (X10*9)', baseline: '270', feb2024: '280', aug2024: '305', mar2025: '266', febChange: '4%', augChange: '9%', marChange: '-13%' },
    { biomarker: 'RBC (X10*12)', baseline: '4.31', feb2024: '4.04', aug2024: '4.39', mar2025: '4.49', febChange: '-6%', augChange: '9%', marChange: '2%' },
    { biomarker: 'HAEMOGLOBIN (g/dl)', baseline: '12.2', feb2024: '11.6', aug2024: '12.8', mar2025: '13', febChange: '-5%', augChange: '10%', marChange: '2%' },
    { biomarker: 'HAEMATOCRIT (L/L)', baseline: '0.4', feb2024: '0.36', aug2024: '0.41', mar2025: '0.41', febChange: '-10%', augChange: '14%', marChange: '0%' },
    { biomarker: 'MCV (fl)', baseline: '93.3', feb2024: '88.1', aug2024: '92.3', mar2025: '90.6', febChange: '-6%', augChange: '5%', marChange: '-2%' },
    { biomarker: 'MCH (pg)', baseline: '28.3', feb2024: '28.7', aug2024: '29.2', mar2025: '29', febChange: '1%', augChange: '2%', marChange: '-1%' },
    { biomarker: 'MCHC (g/dl)', baseline: '30.3', feb2024: '32.6', aug2024: '31.6', mar2025: '31.9', febChange: '8%', augChange: '-3%', marChange: '1%' },
    { biomarker: 'ALT (U/L)', baseline: '19', feb2024: '17', aug2024: '28', mar2025: '20', febChange: '-11%', augChange: '65%', marChange: '-29%' },
    { biomarker: 'BILIRUBIN TOTAL (UMOL/L)', baseline: '9.9', feb2024: '8.6', aug2024: '6.6', mar2025: '9.5', febChange: '-13%', augChange: '-23%', marChange: '44%' },
    { biomarker: 'ALKALINE PHOSPHATASE( IU/L)', baseline: '85', feb2024: '80', aug2024: '91', mar2025: '70', febChange: '-6%', augChange: '14%', marChange: '-23%' },
    { biomarker: 'GAMMA GT (U/L)', baseline: '46', feb2024: '30', aug2024: '43', mar2025: '32', febChange: '-35%', augChange: '43%', marChange: '-26%' },
    { biomarker: 'TOTAL PROTEINS (G/L)', baseline: '77', feb2024: '75', aug2024: '77', mar2025: '77', febChange: '-3%', augChange: '3%', marChange: '0%' },
    { biomarker: 'ALBUMIN (G/L))', baseline: '46', feb2024: '43', aug2024: '46', mar2025: '47', febChange: '-7%', augChange: '7%', marChange: '2%' },
    { biomarker: 'CHOLESTEROL (TOTAL)mmol/L', baseline: '3.9', feb2024: '3.3', aug2024: '4.6', mar2025: '4.6', febChange: '-15%', augChange: '39%', marChange: '0%' },
    { biomarker: 'TRIGLYCERIDES (mmol / L)', baseline: '1.12', feb2024: '1.11', aug2024: '1.32', mar2025: '1.43', febChange: '-1%', augChange: '19%', marChange: '8%' },
    { biomarker: 'CHOLESTEROL HDL (mmol / L)', baseline: '1.77', feb2024: '1.51', aug2024: '1.86', mar2025: '1.76', febChange: '-15%', augChange: '23%', marChange: '-5%' },
    { biomarker: 'CHOLESTEROL LDL (mmol/L)', baseline: '1.62', feb2024: '1.29', aug2024: '2.14', mar2025: '2.19', febChange: '-20%', augChange: '66%', marChange: '2%' },
    { biomarker: 'non HDL CHOLESTEROL (mmol/L)', baseline: '2.13', feb2024: '1.79', aug2024: '2.74', mar2025: '2.84', febChange: '-16%', augChange: '53%', marChange: '4%' },
    { biomarker: 'UREA (mmol / L)', baseline: '7.1', feb2024: '4.9', aug2024: '4.4', mar2025: '5.2', febChange: '-31%', augChange: '-10%', marChange: '18%' },
    { biomarker: 'CREATININE (umol/L)', baseline: '70', feb2024: '56', aug2024: '65', mar2025: '61', febChange: '-20%', augChange: '16%', marChange: '-6%' },
    { biomarker: 'eGFR (Ml/min/1.73m2', baseline: '77.1', feb2024: '90', aug2024: '83.8', mar2025: '89', febChange: '17%', augChange: '-7%', marChange: '6%' },
    { biomarker: 'SODIUM (MMOL / L)', baseline: '139', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'POTASSIUM (MMOL / L)', baseline: '4.4', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'CHLORIDE (MMOL / L)', baseline: '102', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'CALCIUM (MMOL / L)', baseline: '#N/A', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'PHOSPHOROUS MMOL/L', baseline: '#N/A', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'MAGNESIUM MMOL / L', baseline: '#N/A', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'GLUCOSE MMOL/L', baseline: '#N/A', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'HbA1c', baseline: '42', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'TSH', baseline: '#N/A', feb2024: '0.604', aug2024: '0.36', mar2025: '0.493', febChange: '#N/A', augChange: '-40%', marChange: '37%' },
    { biomarker: 'PSA', baseline: '#N/A', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' }
  ];

  const getPercentageColor = (value: string) => {
    if (value === '#N/A') return 'transparent';
    const numValue = Math.abs(parseFloat(value.replace('%', '')));
    if (numValue > 100) return '#dc2626'; // Red
    if (numValue > 75) return '#7c3aed'; // Purple  
    if (numValue > 25) return '#059669'; // Green
    return '#eab308'; // Yellow
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
        gridTemplateColumns: '2.5fr 0.5fr', 
        gap: '12px',
        height: '100vh',
        width: '100%',
        padding: '12px',
        margin: '0'
      }}>
        
        {/* Left Column - Results Table */}
        <div style={{ 
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: '8px',
          padding: '16px',
          overflow: 'auto'
        }}>
          <h2 style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: '600', 
            color: 'var(--color-text-primary)',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Blood Test Results
          </h2>
          
          <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: 'var(--text-xs)'
            }}>
              <thead>
                <tr>
                  <th style={{ 
                    backgroundColor: '#dcfce7', // Light green
                    padding: '4px',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 'var(--text-xs)',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    zIndex: 20
                  }}>
                    Biomarker
                  </th>
                  <th style={{ 
                    backgroundColor: 'var(--color-surface)',
                    padding: '4px',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 'var(--text-xs)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    8/28/2023
                  </th>
                  <th style={{ 
                    backgroundColor: 'var(--color-surface)',
                    padding: '4px',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 'var(--text-xs)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    2/28/2024
                  </th>
                  <th style={{ 
                    backgroundColor: '#dbeafe', // Light blue
                    padding: '4px',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 'var(--text-xs)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    % Change
                  </th>
                  <th style={{ 
                    backgroundColor: 'var(--color-surface)',
                    padding: '4px',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 'var(--text-xs)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    8/30/2024
                  </th>
                  <th style={{ 
                    backgroundColor: '#dbeafe', // Light blue
                    padding: '4px',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 'var(--text-xs)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    % Change
                  </th>
                  <th style={{ 
                    backgroundColor: 'var(--color-surface)',
                    padding: '4px',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 'var(--text-xs)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    03/11/2025
                  </th>
                  <th style={{ 
                    backgroundColor: '#dbeafe', // Light blue
                    padding: '4px',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 'var(--text-xs)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    % Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td style={{ 
                      backgroundColor: '#dcfce7', // Light green
                      padding: '3px 4px',
                      border: '1px solid var(--color-border)',
                      fontWeight: '500',
                      fontSize: 'var(--text-xs)',
                      position: 'sticky',
                      left: 0,
                      zIndex: 10
                    }}>
                      {row.biomarker}
                    </td>
                    <td style={{ 
                      backgroundColor: row.baseline === '#N/A' ? '#f3f4f6' : 'var(--color-surface)',
                      padding: '3px 4px',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      color: row.baseline === '#N/A' ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
                    }}>
                      {row.baseline}
                    </td>
                    <td style={{ 
                      backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'feb' 
                        ? '#fbbf24' : row.feb2024 === '#N/A' ? '#f3f4f6' : 'var(--color-surface)',
                      padding: '3px 4px',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      color: row.feb2024 === '#N/A' ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
                    }}>
                      {row.feb2024}
                    </td>
                    <td style={{ 
                      backgroundColor: '#dbeafe', // Light blue
                      padding: '3px 4px',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      <span style={{
                        backgroundColor: row.febChange === '#N/A' ? '#6b7280' : getPercentageColor(row.febChange),
                        padding: '2px 6px',
                        borderRadius: '3px',
                        display: 'inline-block',
                        minWidth: '40px'
                      }}>
                        {row.febChange}
                      </span>
                    </td>
                    <td style={{ 
                      backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'aug' 
                        ? '#fbbf24' : row.aug2024 === '#N/A' ? '#f3f4f6' : 'var(--color-surface)',
                      padding: '3px 4px',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      color: row.aug2024 === '#N/A' ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
                    }}>
                      {row.aug2024}
                    </td>
                    <td style={{ 
                      backgroundColor: '#dbeafe', // Light blue
                      padding: '3px 4px',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      <span style={{
                        backgroundColor: row.augChange === '#N/A' ? '#6b7280' : getPercentageColor(row.augChange),
                        padding: '2px 6px',
                        borderRadius: '3px',
                        display: 'inline-block',
                        minWidth: '40px'
                      }}>
                        {row.augChange}
                      </span>
                    </td>
                    <td style={{ 
                      backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'mar' 
                        ? '#fbbf24' : row.mar2025 === '#N/A' ? '#f3f4f6' : 'var(--color-surface)',
                      padding: '3px 4px',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      color: row.mar2025 === '#N/A' ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
                    }}>
                      {row.mar2025}
                    </td>
                    <td style={{ 
                      backgroundColor: '#dbeafe', // Light blue
                      padding: '3px 4px',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      <span style={{
                        backgroundColor: row.marChange === '#N/A' ? '#6b7280' : getPercentageColor(row.marChange),
                        padding: '2px 6px',
                        borderRadius: '3px',
                        display: 'inline-block',
                        minWidth: '40px'
                      }}>
                        {row.marChange}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Charts */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px'
        }}>
          {/* Bar Chart */}
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
                Percentage Change in Blood Results from Previous Measurement
              </h2>
            </div>
            
            <PercentageBarChart 
              onHover={setHoveredCell}
              hoveredCell={hoveredCell}
            />
          </div>

          {/* Line Chart */}
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
            
            <PercentageLineChart 
              onHover={setHoveredCell}
              hoveredCell={hoveredCell}
            />
          </div>
        </div>
      </div>
    </div>
  );
};