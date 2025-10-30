import React, { useState } from 'react';

// CSV data for White Blood Cells and Platelets
const csvData = `BLOOD TYPES,8/28/2023,2/28/2024,8/30/2024,03/11/2025,2/28/2024,38/08/2024,03/11/2025
LEUCOCYTES (X10*9),4.5,5.1,5.7,4.4,13%,12%,-23%
NEUTROPHILS (X10*9),2.89,3.25,3.72,#N/A,12%,14%,#N/A
LYMPHOCYTES (X10*9),0.95,1.13,1.22,#N/A,19%,8%,#N/A
MONOCYTES (X10*9),0.45,0.56,0.5,#N/A,24%,-11%,#N/A
EOSINOPHILS (X10*9),0.21,0.14,0.26,#N/A,-33%,86%,#N/A
BASOPHILS (X10*9),0.02,0.04,0.04,#N/A,100%,0%,#N/A
PLATELETS (X10*9),270,280,305,266,4%,9%,-13%`;

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

interface WhiteBloodCellsLineChartProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

const WhiteBloodCellsLineChart: React.FC<WhiteBloodCellsLineChartProps> = ({ onHover, hoveredCell }) => {
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>(['LEUCOCYTES (X10*9)', 'PLATELETS (X10*9)']);
  
  const data = parseCSVData();
  const biomarkers = ['LEUCOCYTES (X10*9)', 'NEUTROPHILS (X10*9)', 'LYMPHOCYTES (X10*9)', 'MONOCYTES (X10*9)', 'EOSINOPHILS (X10*9)', 'BASOPHILS (X10*9)', 'PLATELETS (X10*9)'];
  
  // Get unique dates and sort them
  const dates = [...new Set(data.map(d => d.date))].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const chartWidth = 1100;
  const chartHeight = 400;
  const margin = { top: 20, right: 280, bottom: 60, left: 80 };
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;
  
  // Separate platelets from other biomarkers for dual axis
  const selectedData = data.filter(d => selectedBiomarkers.includes(d.biomarker));
  const plateletsData = selectedData.filter(d => d.biomarker === 'PLATELETS (X10*9)');
  const otherData = selectedData.filter(d => d.biomarker !== 'PLATELETS (X10*9)');
  
  // Calculate scales for left axis (other biomarkers)
  let leftMaxValue = 0;
  let leftMinValue = 0;
  let leftValueRange = 1;
  
  if (otherData.length > 0) {
    leftMaxValue = Math.max(...otherData.map(d => d.value));
    leftMinValue = Math.min(...otherData.map(d => d.value));
    leftValueRange = leftMaxValue - leftMinValue;
    if (leftValueRange === 0) leftValueRange = 1; // Prevent division by zero
  }
  
  // Calculate scales for right axis (platelets)
  let rightMaxValue = 0;
  let rightMinValue = 0;
  let rightValueRange = 1;
  
  if (plateletsData.length > 0) {
    rightMaxValue = Math.max(...plateletsData.map(d => d.value));
    rightMinValue = Math.min(...plateletsData.map(d => d.value));
    rightValueRange = rightMaxValue - rightMinValue;
    if (rightValueRange === 0) rightValueRange = 1; // Prevent division by zero
  }
  
  const colors = {
    'LEUCOCYTES (X10*9)': '#3b82f6',
    'NEUTROPHILS (X10*9)': '#ef4444',
    'LYMPHOCYTES (X10*9)': '#10b981',
    'MONOCYTES (X10*9)': '#f59e0b',
    'EOSINOPHILS (X10*9)': '#8b5cf6',
    'BASOPHILS (X10*9)': '#ec4899',
    'PLATELETS (X10*9)': '#06b6d4'
  };
  
  // Left axis Y calculation (other biomarkers)
  const getLeftY = (value: number) => {
    if (otherData.length === 0) return margin.top + plotHeight / 2;
    return margin.top + plotHeight - ((value - leftMinValue) / leftValueRange) * plotHeight;
  };
  
  // Right axis Y calculation (platelets)
  const getRightY = (value: number) => {
    if (plateletsData.length === 0) return margin.top + plotHeight / 2;
    return margin.top + plotHeight - ((value - rightMinValue) / rightValueRange) * plotHeight;
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
        {selectedBiomarkers.includes('PLATELETS (X10*9)') && selectedBiomarkers.length > 1 && (
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            marginBottom: '8px',
            fontSize: 'var(--text-xs)',
            color: '#0369a1'
          }}>
            💡 Dual-axis view: Platelets (high values) use the right Y-axis, other biomarkers use the left Y-axis for better visualization.
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {biomarkers.map((biomarker) => (
            <label key={biomarker} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={selectedBiomarkers.includes(biomarker)}
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
                {biomarker.replace(' (X10*9)', '')}
              </span>
            </label>
          ))}
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
          
          {/* Left Y-axis labels (other biomarkers) */}
          {otherData.length > 0 && [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = margin.top + ratio * plotHeight;
            const value = leftMaxValue - ratio * leftValueRange;
            return (
              <text
                key={`left-${ratio}`}
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="var(--color-text-secondary)"
              >
                {value.toFixed(1)}
              </text>
            );
          })}
          
          {/* Right Y-axis labels (platelets) */}
          {plateletsData.length > 0 && [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = margin.top + ratio * plotHeight;
            const value = rightMaxValue - ratio * rightValueRange;
            return (
              <text
                key={`right-${ratio}`}
                x={margin.left + plotWidth + 10}
                y={y + 4}
                textAnchor="start"
                fontSize="12"
                fill="#06b6d4"
                fontWeight="500"
              >
                {Math.round(value)}
              </text>
            );
          })}
          
          {/* Y-axis lines */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={margin.top + plotHeight}
            stroke="var(--color-text-secondary)"
            strokeWidth="1"
          />
          {plateletsData.length > 0 && (
            <line
              x1={margin.left + plotWidth}
              y1={margin.top}
              x2={margin.left + plotWidth}
              y2={margin.top + plotHeight}
              stroke="#06b6d4"
              strokeWidth="2"
            />
          )}
          
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
          
          {/* Lines for other biomarkers (left axis) */}
          {selectedBiomarkers.filter(b => b !== 'PLATELETS (X10*9)').map((biomarker) => {
            const biomarkerData = selectedData
              .filter(d => d.biomarker === biomarker)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            if (biomarkerData.length < 2) return null;
            
            const pathData = biomarkerData.map((point, index) => {
              const dateIndex = dates.indexOf(point.date);
              const x = getX(dateIndex);
              const y = getLeftY(point.value);
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
                  const y = getLeftY(point.value);
                  
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
                      <title>{`${biomarker.replace(' (X10*9)', '')}: ${point.value} on ${formatDate(point.date)}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
          
          {/* Lines for platelets (right axis) */}
          {selectedBiomarkers.includes('PLATELETS (X10*9)') && (() => {
            const biomarkerData = plateletsData
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            if (biomarkerData.length < 2) return null;
            
            const pathData = biomarkerData.map((point, index) => {
              const dateIndex = dates.indexOf(point.date);
              const x = getX(dateIndex);
              const y = getRightY(point.value);
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');
            
            return (
              <g key="platelets">
                {/* Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                />
                
                {/* Points */}
                {biomarkerData.map((point) => {
                  const dateIndex = dates.indexOf(point.date);
                  const x = getX(dateIndex);
                  const y = getRightY(point.value);
                  
                  const getColumnFromDate = (date: string) => {
                    if (date === '2/28/2024') return 'feb';
                    if (date === '8/30/2024') return 'aug';
                    if (date === '03/11/2025') return 'mar';
                    return '';
                  };
                  
                  return (
                    <circle
                      key={`platelets-${point.date}`}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => onHover?.({ biomarker: 'PLATELETS (X10*9)', column: getColumnFromDate(point.date) })}
                      onMouseLeave={() => onHover?.(null)}
                    >
                      <title>{`PLATELETS: ${point.value} on ${formatDate(point.date)}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })()}
          
          {/* Legend */}
          {selectedBiomarkers.map((biomarker, index) => {
            const y = 30 + index * 20;
            const isPlatelets = biomarker === 'PLATELETS (X10*9)';
            return (
              <g key={biomarker}>
                <line
                  x1={chartWidth - margin.right + 90}
                  y1={y}
                  x2={chartWidth - margin.right + 110}
                  y2={y}
                  stroke={colors[biomarker as keyof typeof colors]}
                  strokeWidth={isPlatelets ? "3" : "2"}
                />
                <text
                  x={chartWidth - margin.right + 115}
                  y={y + 4}
                  fontSize="12"
                  fill="var(--color-text-primary)"
                >
                  {biomarker.replace(' (X10*9)', '')}
                  {isPlatelets && (
                    <tspan fill="#06b6d4" fontWeight="500"> (right axis)</tspan>
                  )}
                </text>
              </g>
            );
          })}
          
          {/* Axis labels */}
          {otherData.length > 0 && (
            <text
              x={margin.left - 60}
              y={margin.top + plotHeight / 2}
              textAnchor="middle"
              fontSize="12"
              fill="var(--color-text-secondary)"
              transform={`rotate(-90, ${margin.left - 60}, ${margin.top + plotHeight / 2})`}
            >
              White Blood Cells (×10⁹/L)
            </text>
          )}
          
          {plateletsData.length > 0 && (
            <text
              x={margin.left + plotWidth + 60}
              y={margin.top + plotHeight / 2}
              textAnchor="middle"
              fontSize="12"
              fill="#06b6d4"
              fontWeight="500"
              transform={`rotate(90, ${margin.left + plotWidth + 60}, ${margin.top + plotHeight / 2})`}
            >
              Platelets (×10⁹/L)
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

interface WhiteBloodCellsTableProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

const WhiteBloodCellsTable: React.FC<WhiteBloodCellsTableProps> = ({ onHover, hoveredCell }) => {
  // Filter data for white blood cells and platelets only
  const whiteBloodCellsData = [
    { biomarker: 'LEUCOCYTES (X10*9)', baseline: '4.5', feb2024: '5.1', aug2024: '5.7', mar2025: '4.4', febChange: '13%', augChange: '12%', marChange: '-23%' },
    { biomarker: 'NEUTROPHILS (X10*9)', baseline: '2.89', feb2024: '3.25', aug2024: '3.72', mar2025: '#N/A', febChange: '12%', augChange: '14%', marChange: '#N/A' },
    { biomarker: 'LYMPHOCYTES (X10*9)', baseline: '0.95', feb2024: '1.13', aug2024: '1.22', mar2025: '#N/A', febChange: '19%', augChange: '8%', marChange: '#N/A' },
    { biomarker: 'MONOCYTES (X10*9)', baseline: '0.45', feb2024: '0.56', aug2024: '0.5', mar2025: '#N/A', febChange: '24%', augChange: '-11%', marChange: '#N/A' },
    { biomarker: 'EOSINOPHILS (X10*9)', baseline: '0.21', feb2024: '0.14', aug2024: '0.26', mar2025: '#N/A', febChange: '-33%', augChange: '86%', marChange: '#N/A' },
    { biomarker: 'BASOPHILS (X10*9)', baseline: '0.02', feb2024: '0.04', aug2024: '0.04', mar2025: '#N/A', febChange: '100%', augChange: '0%', marChange: '#N/A' },
    { biomarker: 'PLATELETS (X10*9)', baseline: '270', feb2024: '280', aug2024: '305', mar2025: '266', febChange: '4%', augChange: '9%', marChange: '-13%' }
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
          {whiteBloodCellsData.map((row, index) => (
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
                backgroundColor: 'var(--color-surface)',
                padding: '6px 8px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)'
              }}>
                {row.baseline}
              </td>
              <td style={{ 
                backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'feb' 
                  ? '#fbbf24' : 'var(--color-surface)',
                padding: '6px 8px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)'
              }}>
                {row.feb2024}
              </td>
              <td style={{ 
                backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'aug' 
                  ? '#fbbf24' : 'var(--color-surface)',
                padding: '6px 8px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)'
              }}>
                {row.aug2024}
              </td>
              <td style={{ 
                backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'mar' 
                  ? '#fbbf24' : 'var(--color-surface)',
                padding: '6px 8px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)'
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
                  backgroundColor: getPercentageColor(row.febChange),
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
                  backgroundColor: getPercentageColor(row.augChange),
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
                  backgroundColor: getPercentageColor(row.marChange),
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

export const WhiteBloodCellsPage: React.FC = () => {
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
          White Blood Cells and Platelets
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
            White Blood Cells & Platelets Results
          </h2>
          
          <WhiteBloodCellsTable onHover={setHoveredCell} hoveredCell={hoveredCell} />
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
            <WhiteBloodCellsLineChart onHover={setHoveredCell} hoveredCell={hoveredCell} />
          </div>
        </div>
      </div>
    </div>
  );
};