import React, { useState } from 'react';

// CSV data for Blood Sugar + TSH + PSA
const csvData = `BLOOD TYPES,8/28/2023,2/28/2024,8/30/2024,03/11/2025,2/28/2024,38/08/2024,03/11/2025
GLUCOSE MMOL/L,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A
HbA1c,42,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A
TSH,#N/A,0.604,0.36,0.493,#N/A,-40%,37%
PSA,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A`;

interface DataPoint {
  date: string;
  value: number;
  biomarker: string;
}

const parseCSVData = (): DataPoint[] => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const dataPoints: DataPoint[] = [];
  
  // Extract actual date columns (columns 1-4)
  const dates = headers.slice(1, 5);
  
  // Parse each biomarker row
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    const biomarker = row[0];
    
    // Extract values for each date
    for (let j = 1; j <= 4; j++) {
      const value = row[j];
      if (value && value !== '#N/A' && !value.includes('%')) {
        dataPoints.push({
          date: dates[j - 1],
          value: parseFloat(value),
          biomarker: biomarker
        });
      }
    }
  }
  
  return dataPoints;
};

interface BloodSugarTshPsaLineChartProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

const BloodSugarTshPsaLineChart: React.FC<BloodSugarTshPsaLineChartProps> = ({ onHover, hoveredCell }) => {
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>(['TSH']);
  
  const data = parseCSVData();
  const biomarkers = ['GLUCOSE MMOL/L', 'HbA1c', 'TSH', 'PSA'];
  
  // Get unique dates and sort them
  const dates = [...new Set(data.map(d => d.date))].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const chartWidth = 1100;
  const chartHeight = 400;
  const margin = { top: 20, right: 280, bottom: 60, left: 80 };
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;
  
  // All biomarkers on single axis since we have limited data
  const selectedData = data.filter(d => selectedBiomarkers.includes(d.biomarker));
  
  // Calculate scales
  let maxValue = 0;
  let minValue = 0;
  let valueRange = 1;
  
  if (selectedData.length > 0) {
    maxValue = Math.max(...selectedData.map(d => d.value));
    minValue = Math.min(...selectedData.map(d => d.value));
    valueRange = maxValue - minValue;
    if (valueRange === 0) valueRange = 1;
  }
  
  const colors = {
    'GLUCOSE MMOL/L': '#ef4444',
    'HbA1c': '#3b82f6',
    'TSH': '#10b981',
    'PSA': '#f59e0b'
  };
  
  const getY = (value: number) => {
    if (selectedData.length === 0) return margin.top + plotHeight / 2;
    return margin.top + plotHeight - ((value - minValue) / valueRange) * plotHeight;
  };
  
  const getX = (dateIndex: number) => {
    return margin.left + (dateIndex / (dates.length - 1)) * plotWidth;
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Biomarker Selection */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          backgroundColor: '#fef3c7', 
          padding: '8px 12px', 
          borderRadius: '4px', 
          marginBottom: '8px',
          fontSize: 'var(--text-xs)',
          color: '#92400e'
        }}>
          💡 Limited data available: Only TSH has multiple data points. Other biomarkers have insufficient data for trending.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {biomarkers.map((biomarker) => {
            const hasData = data.some(d => d.biomarker === biomarker);
            return (
              <label key={biomarker} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: 'var(--text-sm)',
                color: hasData ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                cursor: hasData ? 'pointer' : 'not-allowed',
                opacity: hasData ? 1 : 0.5
              }}>
                <input
                  type="checkbox"
                  checked={selectedBiomarkers.includes(biomarker)}
                  disabled={!hasData}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBiomarkers([...selectedBiomarkers, biomarker]);
                    } else {
                      setSelectedBiomarkers(selectedBiomarkers.filter(b => b !== biomarker));
                    }
                  }}
                  style={{ marginRight: '6px' }}
                />
                <span style={{ color: colors[biomarker as keyof typeof colors] }}>
                  {biomarker.split(' ')[0]} {!hasData && '(No data)'}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      
      {/* Chart */}
      <div style={{ 
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <svg width={chartWidth} height={chartHeight}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = margin.top + ratio * plotHeight;
            return (
              <line
                key={ratio}
                x1={margin.left}
                y1={y}
                x2={margin.left + plotWidth}
                y2={y}
                stroke="var(--color-border)"
                strokeDasharray="2,2"
              />
            );
          })}
          
          {/* Y-axis labels */}
          {selectedData.length > 0 && [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = margin.top + ratio * plotHeight;
            const value = maxValue - ratio * valueRange;
            return (
              <text
                key={`y-${ratio}`}
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="var(--color-text-secondary)"
              >
                {value.toFixed(2)}
              </text>
            );
          })}
          
          {/* Y-axis line */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={margin.top + plotHeight}
            stroke="var(--color-text-secondary)"
            strokeWidth="1"
          />
          
          {/* X-axis labels */}
          {dates.map((date, index) => {
            const x = getX(index);
            return (
              <text
                key={date}
                x={x}
                y={chartHeight - margin.bottom + 20}
                textAnchor="middle"
                fontSize="12"
                fill="var(--color-text-secondary)"
              >
                {formatDate(date)}
              </text>
            );
          })}
          
          {/* Data lines and points */}
          {selectedBiomarkers.map((biomarker) => {
            const biomarkerData = selectedData
              .filter(d => d.biomarker === biomarker)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            if (biomarkerData.length === 0) return null;
            
            // For single points, just show the point
            if (biomarkerData.length === 1) {
              const point = biomarkerData[0];
              const dateIndex = dates.indexOf(point.date);
              const x = getX(dateIndex);
              const y = getY(point.value);
              
              return (
                <circle
                  key={`${biomarker}-single`}
                  cx={x}
                  cy={y}
                  r="6"
                  fill={colors[biomarker as keyof typeof colors]}
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                >
                  <title>{`${biomarker}: ${point.value} on ${formatDate(point.date)}`}</title>
                </circle>
              );
            }
            
            // For multiple points, draw lines
            const pathData = biomarkerData.map((point, index) => {
              const dateIndex = dates.indexOf(point.date);
              const x = getX(dateIndex);
              const y = getY(point.value);
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');
            
            return (
              <g key={biomarker}>
                {/* Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={colors[biomarker as keyof typeof colors]}
                  strokeWidth="2"
                />
                
                {/* Points */}
                {biomarkerData.map((point) => {
                  const dateIndex = dates.indexOf(point.date);
                  const x = getX(dateIndex);
                  const y = getY(point.value);
                  
                  const getColumnFromDate = (date: string) => {
                    if (date === '2/28/2024') return 'feb';
                    if (date === '8/30/2024') return 'aug';
                    if (date === '03/11/2025') return 'mar';
                    return '';
                  };
                  
                  return (
                    <circle
                      key={`${biomarker}-${point.date}`}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={colors[biomarker as keyof typeof colors]}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => onHover?.({ biomarker, column: getColumnFromDate(point.date) })}
                      onMouseLeave={() => onHover?.(null)}
                    >
                      <title>{`${biomarker}: ${point.value} on ${formatDate(point.date)}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
          
          {/* Legend */}
          {selectedBiomarkers.map((biomarker, index) => {
            const y = 30 + index * 20;
            return (
              <g key={biomarker}>
                <line
                  x1={chartWidth - margin.right + 90}
                  y1={y}
                  x2={chartWidth - margin.right + 110}
                  y2={y}
                  stroke={colors[biomarker as keyof typeof colors]}
                  strokeWidth="2"
                />
                <text
                  x={chartWidth - margin.right + 115}
                  y={y + 4}
                  fontSize="12"
                  fill="var(--color-text-primary)"
                >
                  {biomarker}
                </text>
              </g>
            );
          })}
          
          {/* Axis label */}
          <text
            x={margin.left - 60}
            y={margin.top + plotHeight / 2}
            textAnchor="middle"
            fontSize="12"
            fill="var(--color-text-secondary)"
            transform={`rotate(-90, ${margin.left - 60}, ${margin.top + plotHeight / 2})`}
          >
            Biomarker Values
          </text>
        </svg>
      </div>
    </div>
  );
};

interface BloodSugarTshPsaTableProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

const BloodSugarTshPsaTable: React.FC<BloodSugarTshPsaTableProps> = ({ onHover, hoveredCell }) => {
  // Data for Blood Sugar + TSH + PSA
  const bloodSugarTshPsaData = [
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
              padding: '8px',
              border: '1px solid var(--color-border)',
              textAlign: 'left',
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
              padding: '8px',
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
              padding: '8px',
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
              backgroundColor: 'var(--color-surface)',
              padding: '8px',
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
              backgroundColor: 'var(--color-surface)',
              padding: '8px',
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
              padding: '8px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 'var(--text-xs)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              2/28/2024 Change
            </th>
            <th style={{ 
              backgroundColor: '#dbeafe', // Light blue
              padding: '8px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 'var(--text-xs)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              8/30/2024 Change
            </th>
            <th style={{ 
              backgroundColor: '#dbeafe', // Light blue
              padding: '8px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 'var(--text-xs)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              03/11/2025 Change
            </th>
          </tr>
        </thead>
        <tbody>
          {bloodSugarTshPsaData.map((row, index) => (
            <tr key={index}>
              <td style={{ 
                backgroundColor: '#dcfce7', // Light green
                padding: '6px 8px',
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
                padding: '6px 8px',
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
                padding: '6px 8px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.feb2024 === '#N/A' ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
              }}>
                {row.feb2024}
              </td>
              <td style={{ 
                backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'aug' 
                  ? '#fbbf24' : row.aug2024 === '#N/A' ? '#f3f4f6' : 'var(--color-surface)',
                padding: '6px 8px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.aug2024 === '#N/A' ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
              }}>
                {row.aug2024}
              </td>
              <td style={{ 
                backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'mar' 
                  ? '#fbbf24' : row.mar2025 === '#N/A' ? '#f3f4f6' : 'var(--color-surface)',
                padding: '6px 8px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.mar2025 === '#N/A' ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
              }}>
                {row.mar2025}
              </td>
              <td style={{ 
                backgroundColor: '#dbeafe', // Light blue
                padding: '6px 8px',
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
                backgroundColor: '#dbeafe', // Light blue
                padding: '6px 8px',
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
                backgroundColor: '#dbeafe', // Light blue
                padding: '6px 8px',
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
  );
};

export const BloodSugarTshPsaPage: React.FC = () => {
  // Hover state for highlighting
  const [hoveredCell, setHoveredCell] = useState<{
    biomarker: string;
    column: string;
  } | null>(null);

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
          Blood Sugar + TSH + PSA
        </h1>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          borderRadius: '2px',
          marginTop: '8px'
        }}></div>
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2.5fr 0.5fr', 
        gap: '12px',
        height: 'calc(100vh - 120px)',
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
            Blood Sugar + TSH + PSA Results
          </h2>
          
          <BloodSugarTshPsaTable onHover={setHoveredCell} hoveredCell={hoveredCell} />
        </div>
        
        {/* Right Column - Charts */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px'
        }}>
          {/* Chart */}
          <div style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px',
            padding: '16px',
            flex: 1,
            overflow: 'auto'
          }}>
            <BloodSugarTshPsaLineChart onHover={setHoveredCell} hoveredCell={hoveredCell} />
          </div>
        </div>
      </div>
    </div>
  );
};