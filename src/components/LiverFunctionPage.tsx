import React, { useState } from 'react';
import { getBloodRangeColor } from '../utils/bloodRangeColors';

// CSV data for Liver Function
const csvData = `BLOOD TYPES,8/28/2023,2/28/2024,8/30/2024,03/11/2025,2/28/2024,38/08/2024,03/11/2025
ALT (U/L),19,17,28,20,-11%,65%,-29%
BILIRUBIN TOTAL (UMOL/L),9.9,8.6,6.6,9.5,-13%,-23%,44%
ALKALINE PHOSPHATASE( IU/L),85,80,91,70,-6%,14%,-23%
GAMMA GT (U/L),46,30,43,32,-35%,43%,-26%
TOTAL PROTEINS (G/L),77,75,77,77,-3%,3%,0%
ALBUMIN (G/L)),46,43,46,47,-7%,7%,2%`;

// Liver function ranges data
const bloodRangesData = {
  'ALT (U/L)': { min: 5.0, max: 33.0 },
  'BILIRUBIN TOTAL (UMOL/L)': { min: 2.0, max: 21.0 },
  'ALKALINE PHOSPHATASE( IU/L)': { min: 30.0, max: 130.0 },
  'GAMMA GT (U/L)': { min: 6.0, max: 42.0 },
  'TOTAL PROTEINS (G/L)': { min: 60.0, max: 80.0 },
  'ALBUMIN (G/L))': { min: 35.0, max: 50.0 }
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
        {biomarker.split(' (')[0]}
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

  const biomarkers = ['ALT (U/L)', 'BILIRUBIN TOTAL (UMOL/L)', 'ALKALINE PHOSPHATASE( IU/L)', 'GAMMA GT (U/L)', 'TOTAL PROTEINS (G/L)', 'ALBUMIN (G/L))'];

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

interface LiverFunctionLineChartProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

const LiverFunctionLineChart: React.FC<LiverFunctionLineChartProps> = ({ onHover, hoveredCell: _hoveredCell }) => {
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>(['ALT (U/L)', 'BILIRUBIN TOTAL (UMOL/L)']);
  
  const data = parseCSVData();
  const biomarkers = ['ALT (U/L)', 'BILIRUBIN TOTAL (UMOL/L)', 'ALKALINE PHOSPHATASE( IU/L)', 'GAMMA GT (U/L)', 'TOTAL PROTEINS (G/L)', 'ALBUMIN (G/L))'];
  
  // Get unique dates and sort them
  const dates = [...new Set(data.map(d => d.date))].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const chartWidth = 1100;
  const chartHeight = 400;
  const margin = { top: 20, right: 250, bottom: 60, left: 80 };
  const plotWidth = chartWidth - margin.left - margin.right;
  const plotHeight = chartHeight - margin.top - margin.bottom;

  // Separate high-value biomarkers from others for dual axis
  const selectedData = data.filter(d => selectedBiomarkers.includes(d.biomarker));
  const highValueData = selectedData.filter(d => ['ALKALINE PHOSPHATASE( IU/L)', 'TOTAL PROTEINS (G/L)', 'ALBUMIN (G/L))'].includes(d.biomarker)); // Higher values (~70-91)
  const otherData = selectedData.filter(d => !['ALKALINE PHOSPHATASE( IU/L)', 'TOTAL PROTEINS (G/L)', 'ALBUMIN (G/L))'].includes(d.biomarker));
  
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
    'ALT (U/L)': '#ef4444',
    'BILIRUBIN TOTAL (UMOL/L)': '#3b82f6',
    'ALKALINE PHOSPHATASE( IU/L)': '#10b981',
    'GAMMA GT (U/L)': '#f59e0b',
    'TOTAL PROTEINS (G/L)': '#8b5cf6',
    'ALBUMIN (G/L))': '#ec4899'
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
        {selectedBiomarkers.some(b => ['ALKALINE PHOSPHATASE( IU/L)', 'TOTAL PROTEINS (G/L)', 'ALBUMIN (G/L))'].includes(b)) && selectedBiomarkers.length > 1 && (
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            marginBottom: '8px',
            fontSize: 'var(--text-xs)',
            color: '#0369a1'
          }}>
            💡 Dual-axis view: High-value biomarkers (Alkaline Phosphatase, Total Proteins, Albumin) use the right Y-axis, other biomarkers use the left Y-axis for better visualization.
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
                fill="#10b981"
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
              stroke="#10b981"
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
          {selectedBiomarkers.filter(b => !['ALKALINE PHOSPHATASE( IU/L)', 'TOTAL PROTEINS (G/L)', 'ALBUMIN (G/L))'].includes(b)).map((biomarker) => {
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
          {selectedBiomarkers.filter(b => ['ALKALINE PHOSPHATASE( IU/L)', 'TOTAL PROTEINS (G/L)', 'ALBUMIN (G/L))'].includes(b)).map((biomarker) => {
            const biomarkerData = selectedData
              .filter(d => d.biomarker === biomarker)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            if (biomarkerData.length < 2) return null;
            
            const pathData = biomarkerData.map((point, index) => {
              const dateIndex = dates.indexOf(point.date);
              const x = getX(dateIndex);
              const y = getRightY(point.value);
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');
            
            return (
              <g key={biomarker}>
                {/* Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={colors[biomarker as keyof typeof colors]}
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
                      key={`${biomarker}-${point.date}`}
                      cx={x}
                      cy={y}
                      r="5"
                      fill={colors[biomarker as keyof typeof colors]}
                      stroke="#ffffff"
                      strokeWidth="2"
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
          
          {/* Legend */}
          {selectedBiomarkers.map((biomarker, index) => {
            const y = 30 + index * 25;
            const isHighValue = ['ALKALINE PHOSPHATASE( IU/L)', 'TOTAL PROTEINS (G/L)', 'ALBUMIN (G/L))'].includes(biomarker);
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
                  fontSize="11"
                  fill="var(--color-text-primary)"
                >
                  {biomarker.split(' (')[0]}
                  {isHighValue && (
                    <tspan fill="#10b981" fontWeight="500"> (right axis)</tspan>
                  )}
                </text>
              </g>
            );
          })}
          
          {/* Axis labels */}
          {otherData.length > 0 && (
            <text
              x={margin.left - 40}
              y={margin.top + plotHeight / 2}
              textAnchor="middle"
              fontSize="12"
              fill="var(--color-text-secondary)"
              transform={`rotate(-90, ${margin.left - 40}, ${margin.top + plotHeight / 2})`}
            >
              Liver Function Markers
            </text>
          )}
          
          {highValueData.length > 0 && (
            <text
              x={margin.left + plotWidth + 40}
              y={margin.top + plotHeight / 2}
              textAnchor="middle"
              fontSize="12"
              fill="#10b981"
              fontWeight="500"
              transform={`rotate(90, ${margin.left + plotWidth + 40}, ${margin.top + plotHeight / 2})`}
            >
              High-Value Markers
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

interface LiverFunctionTableProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

const LiverFunctionTable: React.FC<LiverFunctionTableProps> = ({ onHover: _onHover, hoveredCell: _hoveredCell }) => {
  // Helper function to extract biomarker name for color matching
  const getBiomarkerKey = (fullName: string): string => {
    // Extract key parts of biomarker name for matching with blood ranges
    const upperName = fullName.toUpperCase();
    if (upperName.includes('ALT')) return 'ALT';
    if (upperName.includes('BILIRUBIN TOTAL')) return 'BILIRUBIN';
    if (upperName.includes('ALKALINE PHOSPHATASE')) return 'ALP';
    if (upperName.includes('GAMMA GT')) return 'GAMMA GT';
    if (upperName.includes('TOTAL PROTEINS')) return 'PROTEINS';
    if (upperName.includes('ALBUMIN')) return 'ALBUMIN';
    return fullName;
  };
  // Filter data for liver function only
  const liverFunctionData = [
    { biomarker: 'ALT (U/L)', baseline: '19', feb2024: '17', aug2024: '28', mar2025: '20', febChange: '-11%', augChange: '65%', marChange: '-29%' },
    { biomarker: 'BILIRUBIN TOTAL (UMOL/L)', baseline: '9.9', feb2024: '8.6', aug2024: '6.6', mar2025: '9.5', febChange: '-13%', augChange: '-23%', marChange: '44%' },
    { biomarker: 'ALKALINE PHOSPHATASE( IU/L)', baseline: '85', feb2024: '80', aug2024: '91', mar2025: '70', febChange: '-6%', augChange: '14%', marChange: '-23%' },
    { biomarker: 'GAMMA GT (U/L)', baseline: '46', feb2024: '30', aug2024: '43', mar2025: '32', febChange: '-35%', augChange: '43%', marChange: '-26%' },
    { biomarker: 'TOTAL PROTEINS (G/L)', baseline: '77', feb2024: '75', aug2024: '77', mar2025: '77', febChange: '-3%', augChange: '3%', marChange: '0%' },
    { biomarker: 'ALBUMIN (G/L))', baseline: '46', feb2024: '43', aug2024: '46', mar2025: '47', febChange: '-7%', augChange: '7%', marChange: '2%' }
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
          {liverFunctionData.map((row, index) => (
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
                backgroundColor: getBloodRangeColor(getBiomarkerKey(row.biomarker), row.baseline),
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.baseline === '#N/A' ? 'var(--color-text-tertiary)' : 'white',
                fontWeight: '600'
              }}>
                {row.baseline}
              </td>
              <td style={{ 
                backgroundColor: _hoveredCell?.biomarker && row.biomarker.includes(_hoveredCell.biomarker) && _hoveredCell?.column === 'feb' 
                  ? '#3b82f6' : getBloodRangeColor(getBiomarkerKey(row.biomarker), row.feb2024),
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.feb2024 === '#N/A' ? 'var(--color-text-tertiary)' : 'white',
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
                  ? '#3b82f6' : getBloodRangeColor(getBiomarkerKey(row.biomarker), row.aug2024),
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.aug2024 === '#N/A' ? 'var(--color-text-tertiary)' : 'white',
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
                  ? '#3b82f6' : getBloodRangeColor(getBiomarkerKey(row.biomarker), row.mar2025),
                padding: '3px 4px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: 'var(--text-xs)',
                color: row.mar2025 === '#N/A' ? 'var(--color-text-tertiary)' : 'white',
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

export const LiverFunctionPage: React.FC = () => {
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
          Liver Function
        </h1>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          borderRadius: '2px',
          marginTop: '8px'
        }}></div>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 440px',
        gap: '16px',
        padding: '12px',
        margin: '0'
      }}>
        
        {/* Left Column - Table and Chart */}
        <div>
          {/* Results Table */}
          <div style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            overflow: 'auto'
          }}>
            <h2 style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: '600', 
              color: 'var(--color-text-primary)',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Liver Function Results
            </h2>
            
            <LiverFunctionTable onHover={setHoveredCell} hoveredCell={hoveredCell} />
          </div>
          
          {/* Chart */}
          <div style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px',
            padding: '8px',
            overflow: 'auto'
          }}>
            <LiverFunctionLineChart onHover={setHoveredCell} hoveredCell={hoveredCell} />
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