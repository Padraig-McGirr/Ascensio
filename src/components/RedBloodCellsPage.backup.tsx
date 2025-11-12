// @ts-nocheck
import React, { useState } from 'react';

// CSV data for Red Blood Cells
const csvData = `BLOOD TYPES,8/28/2023,2/28/2024,8/30/2024,03/11/2025,2/28/2024,38/08/2024,03/11/2025
RBC (X10*12),4.31,4.04,4.39,4.49,-6%,9%,2%
HAEMOGLOBIN (g/dl),12.2,11.6,12.8,13,-5%,10%,2%
HAEMATOCRIT (L/L),0.4,0.36,0.41,0.41,-10%,14%,0%
MCV (fl),93.3,88.1,92.3,90.6,-6%,5%,-2%
MCH (pg),28.3,28.7,29.2,29,1%,2%,-1%
MCHC (g/dl),30.3,32.6,31.6,31.9,8%,-3%,1%`;

// Red blood cells ranges data
const bloodRangesData = {
  'RBC (X10*12)': { min: 3.8, max: 4.8 },
  'HAEMOGLOBIN (g/dl)': { min: 12.0, max: 15.0 },
  'HAEMATOCRIT (L/L)': { min: 0.36, max: 0.46 },
  'MCV (fl)': { min: 83, max: 101 },
  'MCH (pg)': { min: 27, max: 32 },
  'MCHC (g/dl)': { min: 31.5, max: 36 }
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

const CircularGauge: React.FC<CircularGaugeProps> = ({ biomarker, value, ranges, selectedDate, onHover: _onHover }) => {
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
        fontSize: '10px', 
        fontWeight: '600', 
        margin: '0 0 8px 0',
        textAlign: 'center',
        color: '#475569'
      }}>
        {biomarker.split(' (')[0]}
      </h4>
      
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-135deg)' }}>
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
            fontWeight: '700',
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

  const biomarkers = ['RBC (X10*12)', 'HAEMOGLOBIN (g/dl)', 'HAEMATOCRIT (L/L)', 'MCV (fl)', 'MCH (pg)', 'MCHC (g/dl)'];

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

      {/* Gauges Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginTop: '-20px'
      }}>
        {biomarkers.map((biomarker) => {
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

interface RedBloodCellsLineChartProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

const RedBloodCellsLineChart: React.FC<RedBloodCellsLineChartProps> = ({ onHover, hoveredCell: _hoveredCell }) => {
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>(['RBC (X10*12)', 'HAEMOGLOBIN (g/dl)']);
  
  const data = parseCSVData();
  const biomarkers = ['RBC (X10*12)', 'HAEMOGLOBIN (g/dl)', 'HAEMATOCRIT (L/L)', 'MCV (fl)', 'MCH (pg)', 'MCHC (g/dl)'];
  
  // Get unique dates and sort them
  const dates = [...new Set(data.map(d => d.date))].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const chartWidth = 1100;
  const chartHeight = 400;
  const margin = { top: 20, right: 250, bottom: 60, left: 80 };
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;
  
  // Separate high-value biomarkers from others for dual axis
  const selectedData = data.filter(d => selectedBiomarkers.includes(d.biomarker));
  const highValueData = selectedData.filter(d => d.biomarker === 'MCV (fl)'); // MCV has highest values (~88-93)
  const otherData = selectedData.filter(d => d.biomarker !== 'MCV (fl)');
  
  // Calculate scales for left axis (other biomarkers)
  let leftMaxValue = 0;
  let leftMinValue = 0;
  let leftValueRange = 1;
  
  if (otherData.length > 0) {
    leftMaxValue = Math.max(...otherData.map(d => d.value));
    leftMinValue = Math.min(...otherData.map(d => d.value));
    leftValueRange = leftMaxValue - leftMinValue;
    if (leftValueRange === 0) leftValueRange = 1;
  }
  
  // Calculate scales for right axis (high values)
  let rightMaxValue = 0;
  let rightMinValue = 0;
  let rightValueRange = 1;
  
  if (highValueData.length > 0) {
    rightMaxValue = Math.max(...highValueData.map(d => d.value));
    rightMinValue = Math.min(...highValueData.map(d => d.value));
    rightValueRange = rightMaxValue - rightMinValue;
    if (rightValueRange === 0) rightValueRange = 1;
  }
  
  const colors = {
    'RBC (X10*12)': '#ef4444',
    'HAEMOGLOBIN (g/dl)': '#3b82f6',
    'HAEMATOCRIT (L/L)': '#10b981',
    'MCV (fl)': '#f59e0b',
    'MCH (pg)': '#8b5cf6',
    'MCHC (g/dl)': '#ec4899'
  };
  
  // Left axis Y calculation (other biomarkers)
  const getLeftY = (value: number) => {
    if (otherData.length === 0) return margin.top + plotHeight / 2;
    return margin.top + plotHeight - ((value - leftMinValue) / leftValueRange) * plotHeight;
  };
  
  // Right axis Y calculation (high values)
  const getRightY = (value: number) => {
    if (highValueData.length === 0) return margin.top + plotHeight / 2;
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
        {selectedBiomarkers.includes('MCV (fl)') && selectedBiomarkers.length > 1 && (
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            marginBottom: '8px',
            fontSize: 'var(--text-xs)',
            color: '#0369a1'
          }}>
            💡 Dual-axis view: MCV (high values) uses the right Y-axis, other biomarkers use the left Y-axis for better visualization.
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
                {biomarker.split(' (')[0]}
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
          
          {/* Right Y-axis labels (high values) */}
          {highValueData.length > 0 && [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = margin.top + ratio * plotHeight;
            const value = rightMaxValue - ratio * rightValueRange;
            return (
              <text
                key={`right-${ratio}`}
                x={margin.left + plotWidth + 10}
                y={y + 4}
                textAnchor="start"
                fontSize="12"
                fill="#f59e0b"
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
          {highValueData.length > 0 && (
            <line
              x1={margin.left + plotWidth}
              y1={margin.top}
              x2={margin.left + plotWidth}
              y2={margin.top + plotHeight}
              stroke="#f59e0b"
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
          {selectedBiomarkers.filter(b => b !== 'MCV (fl)').map((biomarker) => {
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
                      <title>{`${biomarker.split(' (')[0]}: ${point.value} on ${formatDate(point.date)}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
          
          {/* Lines for high values (right axis) */}
          {selectedBiomarkers.includes('MCV (fl)') && (() => {
            const biomarkerData = highValueData
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            if (biomarkerData.length < 2) return null;
            
            const pathData = biomarkerData.map((point, index) => {
              const dateIndex = dates.indexOf(point.date);
              const x = getX(dateIndex);
              const y = getRightY(point.value);
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');
            
            return (
              <g key="mcv">
                {/* Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#f59e0b"
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
                      key={`mcv-${point.date}`}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => onHover?.({ biomarker: 'MCV (fl)', column: getColumnFromDate(point.date) })}
                      onMouseLeave={() => onHover?.(null)}
                    >
                      <title>{`MCV: ${point.value} on ${formatDate(point.date)}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })()}
          
          {/* Legend */}
          {selectedBiomarkers.map((biomarker, index) => {
            const y = 30 + index * 20;
            const isHighValue = biomarker === 'MCV (fl)';
            return (
              <g key={biomarker}>
                <line
                  x1={chartWidth - margin.right + 90}
                  y1={y}
                  x2={chartWidth - margin.right + 110}
                  y2={y}
                  stroke={colors[biomarker as keyof typeof colors]}
                  strokeWidth={isHighValue ? "3" : "2"}
                />
                <text
                  x={chartWidth - margin.right + 115}
                  y={y + 4}
                  fontSize="12"
                  fill="var(--color-text-primary)"
                >
                  {biomarker.split(' (')[0]}
                  {isHighValue && (
                    <tspan fill="#f59e0b" fontWeight="500"> (right axis)</tspan>
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
              Red Blood Cell Markers
            </text>
          )}
          
          {highValueData.length > 0 && (
            <text
              x={margin.left + plotWidth + 60}
              y={margin.top + plotHeight / 2}
              textAnchor="middle"
              fontSize="12"
              fill="#f59e0b"
              fontWeight="500"
              transform={`rotate(90, ${margin.left + plotWidth + 60}, ${margin.top + plotHeight / 2})`}
            >
              MCV (fl)
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

interface RedBloodCellsTableProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

const RedBloodCellsTable: React.FC<RedBloodCellsTableProps> = ({ onHover: _onHover, hoveredCell: _hoveredCell }) => {
  // Filter data for red blood cells only
  const redBloodCellsData = [
    { biomarker: 'RBC (X10*12)', baseline: '4.31', feb2024: '4.04', aug2024: '4.39', mar2025: '4.49', febChange: '-6%', augChange: '9%', marChange: '2%' },
    { biomarker: 'HAEMOGLOBIN (g/dl)', baseline: '12.2', feb2024: '11.6', aug2024: '12.8', mar2025: '13', febChange: '-5%', augChange: '10%', marChange: '2%' },
    { biomarker: 'HAEMATOCRIT (L/L)', baseline: '0.4', feb2024: '0.36', aug2024: '0.41', mar2025: '0.41', febChange: '-10%', augChange: '14%', marChange: '0%' },
    { biomarker: 'MCV (fl)', baseline: '93.3', feb2024: '88.1', aug2024: '92.3', mar2025: '90.6', febChange: '-6%', augChange: '5%', marChange: '-2%' },
    { biomarker: 'MCH (pg)', baseline: '28.3', feb2024: '28.7', aug2024: '29.2', mar2025: '29', febChange: '1%', augChange: '2%', marChange: '-1%' },
    { biomarker: 'MCHC (g/dl)', baseline: '30.3', feb2024: '32.6', aug2024: '31.6', mar2025: '31.9', febChange: '8%', augChange: '-3%', marChange: '1%' }
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
          {redBloodCellsData.map((row, index) => (
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
                backgroundColor: 'var(--color-surface)',
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)'
              }}>
                {row.baseline}
              </td>
              <td style={{ 
                backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'feb' 
                  ? '#fbbf24' : 'var(--color-surface)',
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)'
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
                backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'aug' 
                  ? '#fbbf24' : 'var(--color-surface)',
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)'
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
                backgroundColor: hoveredCell?.biomarker && row.biomarker.includes(hoveredCell.biomarker) && hoveredCell?.column === 'mar' 
                  ? '#fbbf24' : 'var(--color-surface)',
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)'
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

export const RedBloodCellsPage: React.FC = () => {
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
          Red Blood Cells
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
              Red Blood Cells Results
            </h2>
            
            <RedBloodCellsTable onHover={setHoveredCell} hoveredCell={hoveredCell} />
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
            <RedBloodCellsLineChart onHover={setHoveredCell} hoveredCell={hoveredCell} />
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