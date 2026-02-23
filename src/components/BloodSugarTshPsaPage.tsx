import React, { useState } from 'react';
import { getBloodRangeColor } from '../utils/bloodRangeColors';

// CSV data for Blood Sugar + TSH + PSA
const csvData = `BLOOD TYPES,8/28/2023,2/28/2024,8/30/2024,03/11/2025,2/28/2024,38/08/2024,03/11/2025
GLUCOSE MMOL/L,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A
HbA1c,42,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A
TSH,#N/A,0.604,0.36,0.493,#N/A,-40%,37%
PSA,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A,#N/A`;

// Blood sugar, TSH, PSA ranges data
const bloodRangesData = {
  'GLUCOSE MMOL/L': { min: 3.0, max: 6.0 },
  'HbA1c': { min: 20, max: 42 },
  'TSH': { min: 0.27, max: 4.2 },
  'PSA': { min: 0, max: 4.99 }
};

interface DataPoint {
  date: string;
  value: number;
  biomarker: string;
}

interface CircularGaugeProps {
  biomarker: string;
  value: number;
  ranges: {
    min: number;
    max: number;
  };
  selectedDate: string;
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({ biomarker, value, ranges, selectedDate, onHover }) => {
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate percentage within the range
  const percentage = ((value - ranges.min) / (ranges.max - ranges.min)) * 100;
  
  // Calculate position on the 3/4 circle (270 degrees)
  // Clamp the position between 0.02 (very small arc) and 0.75 (full range)
  const valuePosition = Math.max(0.02, Math.min((percentage / 100) * 0.75, 0.75));
  
  // Determine color based on percentage
  let valueColor = '#fbbf24'; // yellow (0-25%)
  if (percentage > 75) {
    valueColor = '#a855f7'; // light purple (75%+)
  } else if (percentage >= 26) {
    valueColor = '#10b981'; // green (26-74%)
  }
  
  // Function to get column identifier from date
  const getColumnFromDate = (date: string) => {
    if (date === '2/28/2024') return 'feb';
    if (date === '8/30/2024') return 'aug';
    if (date === '03/11/2025') return 'mar';
    return '';
  };
  
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '180px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={() => onHover?.({ biomarker, column: getColumnFromDate(selectedDate) })}
      onMouseLeave={() => onHover?.(null)}
    >
      <h4 style={{ 
        fontSize: '12px', 
        fontWeight: '800', 
        margin: '0 0 8px 0',
        textAlign: 'center',
        color: '#475569'
      }}>
        {biomarker === 'GLUCOSE MMOL/L' ? 'GLUCOSE' : biomarker}
      </h4>
      
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
          {/* Background track (full range) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeLinecap="round"
          />
          
          {/* Value indicator - colored arc up to the value */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={valueColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${valuePosition * circumference} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Value display */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '800',
            color: '#1e293b',
            lineHeight: '1'
          }}>
            {value}
          </div>
        </div>
      </div>
      
      {/* Range labels */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginTop: '8px',
        fontSize: '8px',
        color: '#64748b'
      }}>
        <span>{ranges.min}</span>
        <span>{ranges.max}</span>
      </div>
    </div>
  );
};

interface RangeVisualizationProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

const RangeVisualization: React.FC<RangeVisualizationProps> = ({ onHover, hoveredCell: _hoveredCell }) => {
  const [selectedDate, setSelectedDate] = useState<string>('03/11/2025');
  
  const availableDates = ['8/28/2023', '2/28/2024', '8/30/2024', '03/11/2025'];
  
  // Parse the CSV data to get values for the selected date
  const getValueForDate = (biomarker: string, date: string): number | null => {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const dateIndex = headers.indexOf(date);
    
    if (dateIndex === -1) return null;
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row[0] === biomarker) {
        const value = row[dateIndex];
        if (value && value !== '#N/A' && !value.includes('%')) {
          return parseFloat(value);
        }
      }
    }
    return null;
  };

  const biomarkers = ['GLUCOSE MMOL/L', 'HbA1c', 'TSH', 'PSA'];
  
  // Filter biomarkers that have data for the selected date
  const biomarkersWithData = biomarkers.filter(biomarker => {
    const value = getValueForDate(biomarker, selectedDate);
    return value !== null;
  });

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border-light)',
      borderRadius: '8px',
      height: 'fit-content',
      width: '440px'
    }}>
      {/* Header with date filter */}
      <div style={{ marginBottom: '44px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <h3 style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: '600', 
            color: 'var(--color-text-primary)',
            margin: '0'
          }}>
            Range Analysis
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: '500', 
              color: 'var(--color-text-secondary)'
            }}>
              Date:
            </label>
            <select 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--text-sm)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                minWidth: '140px'
              }}
            >
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* No data message or Gauges Grid */}
      {biomarkersWithData.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-sm)'
        }}>
          No data available for the selected date.
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: biomarkersWithData.length === 1 ? '1fr' : 'repeat(2, 1fr)',
          gap: '12px',
          marginTop: '-20px'
        }}>
          {biomarkersWithData.map((biomarker) => {
            const value = getValueForDate(biomarker, selectedDate);
            const ranges = bloodRangesData[biomarker as keyof typeof bloodRangesData];
            
            if (!value || !ranges) return null;
            
            return (
              <CircularGauge
                key={`${biomarker}-${selectedDate}`}
                biomarker={biomarker}
                value={value}
                ranges={ranges}
                selectedDate={selectedDate}
                onHover={onHover}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

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

const BloodSugarTshPsaLineChart: React.FC<BloodSugarTshPsaLineChartProps> = ({ onHover, hoveredCell: _hoveredCell }) => {
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>(['TSH']);
  
  const data = parseCSVData();
  const biomarkers = ['GLUCOSE MMOL/L', 'HbA1c', 'TSH', 'PSA'];
  
  // Get unique dates and sort them
  const dates = [...new Set(data.map(d => d.date))].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const chartWidth = 1100;
  const chartHeight = 400;
  const margin = { top: 20, right: 250, bottom: 60, left: 80 };
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
        padding: '8px'
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

const BloodSugarTshPsaTable: React.FC<BloodSugarTshPsaTableProps> = ({ onHover: _onHover, hoveredCell: _hoveredCell }) => {
  // Helper function to extract biomarker name for color matching
  const getBiomarkerKey = (fullName: string): string => {
    // Extract key parts of biomarker name for matching with blood ranges
    const upperName = fullName.toUpperCase();
    if (upperName.includes('GLUCOSE')) return 'GLUCOSE';
    if (upperName.includes('HbA1c')) return 'HbA1c';
    if (upperName.includes('TSH')) return 'TSH';
    if (upperName.includes('PSA')) return 'PSA';
    return fullName;
  };
  // Data for Blood Sugar + TSH + PSA
  const bloodSugarTshPsaData = [
    { biomarker: 'GLUCOSE MMOL/L', baseline: '#N/A', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'HbA1c', baseline: '42', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' },
    { biomarker: 'TSH', baseline: '#N/A', feb2024: '0.604', aug2024: '0.36', mar2025: '0.493', febChange: '#N/A', augChange: '-40%', marChange: '37%' },
    { biomarker: 'PSA', baseline: '#N/A', feb2024: '#N/A', aug2024: '#N/A', mar2025: '#N/A', febChange: '#N/A', augChange: '#N/A', marChange: '#N/A' }
  ];


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
          {bloodSugarTshPsaData.map((row, index) => (
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
                backgroundColor: row.baseline === '#N/A' ? '#6b7280' : getBloodRangeColor(getBiomarkerKey(row.biomarker), row.baseline),
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.baseline === '#N/A' ? 'white' : 'white',
                fontWeight: '600'
              }}>
                {row.baseline}
              </td>
              <td style={{ 
                backgroundColor: _hoveredCell?.biomarker && row.biomarker.includes(_hoveredCell.biomarker) && _hoveredCell?.column === 'feb' 
                  ? '#3b82f6' : row.feb2024 === '#N/A' ? '#6b7280' : getBloodRangeColor(getBiomarkerKey(row.biomarker), row.feb2024),
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.feb2024 === '#N/A' ? 'white' : 'white',
                fontWeight: '600'
              }}>
                {row.feb2024}
              </td>
              <td style={{ 
                backgroundColor: '#dbeafe', // Light blue
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-primary)',
                fontWeight: '600'
              }}>
                {row.febChange}
              </td>
              <td style={{ 
                backgroundColor: _hoveredCell?.biomarker && row.biomarker.includes(_hoveredCell.biomarker) && _hoveredCell?.column === 'aug' 
                  ? '#3b82f6' : row.aug2024 === '#N/A' ? '#6b7280' : getBloodRangeColor(getBiomarkerKey(row.biomarker), row.aug2024),
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.aug2024 === '#N/A' ? 'white' : 'white',
                fontWeight: '600'
              }}>
                {row.aug2024}
              </td>
              <td style={{ 
                backgroundColor: '#dbeafe', // Light blue
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-primary)',
                fontWeight: '600'
              }}>
                {row.augChange}
              </td>
              <td style={{ 
                backgroundColor: _hoveredCell?.biomarker && row.biomarker.includes(_hoveredCell.biomarker) && _hoveredCell?.column === 'mar' 
                  ? '#3b82f6' : row.mar2025 === '#N/A' ? '#6b7280' : getBloodRangeColor(getBiomarkerKey(row.biomarker), row.mar2025),
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.mar2025 === '#N/A' ? 'white' : 'white',
                fontWeight: '600'
              }}>
                {row.mar2025}
              </td>
              <td style={{ 
                backgroundColor: '#dbeafe', // Light blue
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-primary)',
                fontWeight: '600'
              }}>
                {row.marChange}
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
        gridTemplateColumns: '1fr 440px', 
        gap: '12px',
        height: 'calc(100vh - 120px)',
        width: '100%',
        padding: '12px',
        margin: '0'
      }}>
        
        {/* Left Column - Results Table and Chart */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px'
        }}>
          {/* Results Table */}
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
          
          {/* Chart */}
          <div style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px',
            padding: '8px',
            flex: 1,
            overflow: 'auto'
          }}>
            <BloodSugarTshPsaLineChart onHover={setHoveredCell} hoveredCell={hoveredCell} />
          </div>
        </div>
        
        {/* Right Column - Range Visualization */}
        <div>
          <RangeVisualization onHover={setHoveredCell} hoveredCell={hoveredCell} />
        </div>
      </div>
    </div>
  );
};