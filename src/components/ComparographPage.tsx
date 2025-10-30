import React, { useState } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';

interface ComparographPageProps {
  onNavigate?: (page: string) => void;
}

interface DataPoint {
  date: string;
  value: number;
  percentageChange?: number;
}

interface BiomarkerData {
  [key: string]: DataPoint[];
}

export const ComparographPage: React.FC<ComparographPageProps> = ({ onNavigate }) => {
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>(['RBC', 'HAEMOGLOBIN']);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('last4');
  const [comparisonType, setComparisonType] = useState<'percentage' | 'absolute'>('percentage');

  // Biomarker data from CSV
  const biomarkerData: BiomarkerData = {
    'RBC': [
      { date: '8/28/2023', value: 4.31 },
      { date: '2/28/2024', value: 4.04, percentageChange: -6 },
      { date: '8/30/2024', value: 4.39, percentageChange: 9 },
      { date: '03/11/2025', value: 4.49, percentageChange: 2 }
    ],
    'HAEMOGLOBIN': [
      { date: '8/28/2023', value: 12.2 },
      { date: '2/28/2024', value: 11.6, percentageChange: -5 },
      { date: '8/30/2024', value: 12.8, percentageChange: 10 },
      { date: '03/11/2025', value: 13, percentageChange: 2 }
    ],
    'LEUCOCYTES': [
      { date: '8/28/2023', value: 4.5 },
      { date: '2/28/2024', value: 5.1, percentageChange: 13 },
      { date: '8/30/2024', value: 5.7, percentageChange: 12 },
      { date: '03/11/2025', value: 4.4, percentageChange: -23 }
    ],
    'PLATELETS': [
      { date: '8/28/2023', value: 270 },
      { date: '2/28/2024', value: 280, percentageChange: 4 },
      { date: '8/30/2024', value: 305, percentageChange: 9 },
      { date: '03/11/2025', value: 266, percentageChange: -13 }
    ],
    'ALT': [
      { date: '8/28/2023', value: 19 },
      { date: '2/28/2024', value: 17, percentageChange: -11 },
      { date: '8/30/2024', value: 28, percentageChange: 65 },
      { date: '03/11/2025', value: 20, percentageChange: -29 }
    ],
    'BILIRUBIN': [
      { date: '8/28/2023', value: 9.9 },
      { date: '2/28/2024', value: 8.6, percentageChange: -13 },
      { date: '8/30/2024', value: 6.6, percentageChange: -23 },
      { date: '03/11/2025', value: 9.5, percentageChange: 44 }
    ],
    'CHOLESTEROL': [
      { date: '8/28/2023', value: 3.9 },
      { date: '2/28/2024', value: 3.3, percentageChange: -15 },
      { date: '8/30/2024', value: 4.6, percentageChange: 39 },
      { date: '03/11/2025', value: 4.6, percentageChange: 0 }
    ],
    'TRIGLYCERIDES': [
      { date: '8/28/2023', value: 1.12 },
      { date: '2/28/2024', value: 1.11, percentageChange: -1 },
      { date: '8/30/2024', value: 1.32, percentageChange: 19 },
      { date: '03/11/2025', value: 1.43, percentageChange: 8 }
    ],
    'UREA': [
      { date: '8/28/2023', value: 7.1 },
      { date: '2/28/2024', value: 4.9, percentageChange: -31 },
      { date: '8/30/2024', value: 4.4, percentageChange: -10 },
      { date: '03/11/2025', value: 5.2, percentageChange: 18 }
    ],
    'CREATININE': [
      { date: '8/28/2023', value: 70 },
      { date: '2/28/2024', value: 56, percentageChange: -20 },
      { date: '8/30/2024', value: 65, percentageChange: 16 },
      { date: '03/11/2025', value: 61, percentageChange: -6 }
    ],
    'TSH': [
      { date: '2/28/2024', value: 0.604 },
      { date: '8/30/2024', value: 0.36, percentageChange: -40 },
      { date: '03/11/2025', value: 0.493, percentageChange: 37 }
    ]
  };

  // Available biomarkers for comparison
  const availableBiomarkers = [
    { id: 'RBC', name: 'Red Blood Cells', category: 'Blood Cells', unit: '(X10*12)' },
    { id: 'HAEMOGLOBIN', name: 'Haemoglobin', category: 'Blood Cells', unit: '(g/dl)' },
    { id: 'LEUCOCYTES', name: 'White Blood Cells', category: 'Blood Cells', unit: '(X10*9)' },
    { id: 'PLATELETS', name: 'Platelets', category: 'Blood Cells', unit: '(X10*9)' },
    { id: 'ALT', name: 'ALT', category: 'Liver Function', unit: '(U/L)' },
    { id: 'BILIRUBIN', name: 'Bilirubin', category: 'Liver Function', unit: '(UMOL/L)' },
    { id: 'CHOLESTEROL', name: 'Total Cholesterol', category: 'Lipids', unit: '(mmol/L)' },
    { id: 'TRIGLYCERIDES', name: 'Triglycerides', category: 'Lipids', unit: '(mmol/L)' },
    { id: 'UREA', name: 'Urea', category: 'Kidney Function', unit: '(mmol/L)' },
    { id: 'CREATININE', name: 'Creatinine', category: 'Kidney Function', unit: '(umol/L)' },
    { id: 'TSH', name: 'TSH', category: 'Hormones', unit: '' }
  ];

  const timeframeOptions = [
    { id: 'last2', label: 'Last 2 Measurements' },
    { id: 'last3', label: 'Last 3 Measurements' },
    { id: 'last4', label: 'Last 4 Measurements' }
  ];

  const biomarkerCategories = [...new Set(availableBiomarkers.map(b => b.category))];

  const toggleBiomarker = (biomarkerId: string) => {
    setSelectedBiomarkers(prev => 
      prev.includes(biomarkerId) 
        ? prev.filter(id => id !== biomarkerId)
        : [...prev, biomarkerId]
    );
  };

  // Filter data based on timeframe
  const getFilteredData = () => {
    const filteredData: BiomarkerData = {};
    
    Object.keys(biomarkerData).forEach(biomarker => {
      switch (selectedTimeframe) {
        case 'last2':
          filteredData[biomarker] = biomarkerData[biomarker].slice(-2);
          break;
        case 'last3':
          filteredData[biomarker] = biomarkerData[biomarker].slice(-3);
          break;
        case 'last4':
          filteredData[biomarker] = biomarkerData[biomarker].slice(-4);
          break;
        default:
          filteredData[biomarker] = biomarkerData[biomarker];
      }
    });
    
    return filteredData;
  };

  // Chart component
  const ComparisonChart: React.FC = () => {
    const filteredData = getFilteredData();
    const chartData = selectedBiomarkers.map(biomarker => ({
      biomarker,
      data: filteredData[biomarker] || [],
      color: getMarkerColor(biomarker)
    })).filter(item => item.data.length > 0);

    if (chartData.length === 0) return null;

    // Get all unique dates for X-axis
    const allDates = [...new Set(
      chartData.flatMap(item => item.data.map(point => point.date))
    )].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const chartWidth = 900;
    const chartHeight = 400;
    const margin = { top: 20, right: 200, bottom: 80, left: 80 };
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = chartHeight - margin.top - margin.bottom;

    // Calculate scales
    const getYValue = (point: DataPoint) => 
      comparisonType === 'percentage' ? (point.percentageChange || 0) : point.value;

    const allValues = chartData.flatMap(item => 
      item.data.map(point => getYValue(point))
    );

    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const valueRange = maxValue - minValue || 1;

    const getX = (dateIndex: number) => {
      return margin.left + (dateIndex / Math.max(allDates.length - 1, 1)) * plotWidth;
    };

    const getY = (value: number) => {
      return margin.top + plotHeight - ((value - minValue) / valueRange) * plotHeight;
    };

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
      <div style={{ 
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '20px',
        width: '100%',
        overflow: 'auto'
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
                opacity={0.5}
              />
            );
          })}

          {/* Y-axis */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={margin.top + plotHeight}
            stroke="var(--color-text-secondary)"
            strokeWidth="2"
          />

          {/* X-axis */}
          <line
            x1={margin.left}
            y1={margin.top + plotHeight}
            x2={margin.left + plotWidth}
            y2={margin.top + plotHeight}
            stroke="var(--color-text-secondary)"
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
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
                {comparisonType === 'percentage' ? `${value.toFixed(0)}%` : value.toFixed(1)}
              </text>
            );
          })}

          {/* X-axis labels */}
          {allDates.map((date, index) => {
            const x = getX(index);
            return (
              <text
                key={date}
                x={x}
                y={chartHeight - margin.bottom + 20}
                textAnchor="middle"
                fontSize="12"
                fill="var(--color-text-secondary)"
                transform={`rotate(-45, ${x}, ${chartHeight - margin.bottom + 20})`}
              >
                {formatDate(date)}
              </text>
            );
          })}

          {/* Data lines and points */}
          {chartData.map((item, itemIndex) => {
            const pathData = item.data.map((point, pointIndex) => {
              const dateIndex = allDates.indexOf(point.date);
              const x = getX(dateIndex);
              const y = getY(getYValue(point));
              return `${pointIndex === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');

            return (
              <g key={item.biomarker}>
                {/* Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="3"
                  opacity={0.8}
                />

                {/* Points */}
                {item.data.map((point) => {
                  const dateIndex = allDates.indexOf(point.date);
                  const x = getX(dateIndex);
                  const y = getY(getYValue(point));

                  return (
                    <circle
                      key={`${item.biomarker}-${point.date}`}
                      cx={x}
                      cy={y}
                      r="5"
                      fill={item.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                    >
                      <title>
                        {`${item.biomarker}: ${comparisonType === 'percentage' ? (point.percentageChange || 0) + '%' : point.value} on ${formatDate(point.date)}`}
                      </title>
                    </circle>
                  );
                })}
              </g>
            );
          })}

          {/* Legend */}
          {chartData.map((item, index) => {
            const y = 30 + index * 25;
            const biomarkerInfo = availableBiomarkers.find(b => b.id === item.biomarker);
            return (
              <g key={item.biomarker}>
                <line
                  x1={chartWidth - margin.right + 20}
                  y1={y}
                  x2={chartWidth - margin.right + 40}
                  y2={y}
                  stroke={item.color}
                  strokeWidth="3"
                />
                <text
                  x={chartWidth - margin.right + 45}
                  y={y + 4}
                  fontSize="12"
                  fill="var(--color-text-primary)"
                >
                  {biomarkerInfo?.name} {biomarkerInfo?.unit}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={margin.left - 50}
            y={margin.top + plotHeight / 2}
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="var(--color-text-secondary)"
            transform={`rotate(-90, ${margin.left - 50}, ${margin.top + plotHeight / 2})`}
          >
            {comparisonType === 'percentage' ? 'Percentage Change (%)' : 'Biomarker Values'}
          </text>

          <text
            x={margin.left + plotWidth / 2}
            y={chartHeight - 10}
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="var(--color-text-secondary)"
          >
            Test Dates
          </text>
        </svg>
      </div>
    );
  };

  // Helper function for biomarker colors
  const getMarkerColor = (biomarker: string): string => {
    const colors = {
      'RBC': '#ef4444',
      'HAEMOGLOBIN': '#3b82f6',
      'LEUCOCYTES': '#10b981',
      'PLATELETS': '#f59e0b',
      'ALT': '#8b5cf6',
      'BILIRUBIN': '#ec4899',
      'CHOLESTEROL': '#06b6d4',
      'TRIGLYCERIDES': '#84cc16',
      'UREA': '#f97316',
      'CREATININE': '#6366f1',
      'TSH': '#14b8a6'
    };
    return colors[biomarker as keyof typeof colors] || '#6b7280';
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
      {/* Header */}
      <div style={{ 
        backgroundColor: 'var(--color-surface)', 
        padding: '20px 32px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={() => onNavigate?.('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: '6px',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-100)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-50)';
          }}
        >
          <ArrowLeft size={16} />
          Back to Overview
        </button>
        
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: '700', 
            color: 'var(--color-text-primary)',
            marginBottom: '8px',
            margin: 0
          }}>
            Comparograph
          </h1>
          <div style={{ 
            height: '4px', 
            width: '60px', 
            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            borderRadius: '2px',
            marginTop: '8px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr', 
        gap: '16px',
        height: 'calc(100vh - 120px)',
        width: '100%',
        padding: '16px'
      }}>
        
        {/* Left Sidebar - Controls */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          
          {/* Comparison Type */}
          <div style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <BarChart3 size={16} />
              Comparison Type
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)'
              }}>
                <input
                  type="radio"
                  checked={comparisonType === 'percentage'}
                  onChange={() => setComparisonType('percentage')}
                />
                Percentage Change
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)'
              }}>
                <input
                  type="radio"
                  checked={comparisonType === 'absolute'}
                  onChange={() => setComparisonType('absolute')}
                />
                Absolute Values
              </label>
            </div>
          </div>

          {/* Timeframe Selection */}
          <div style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calendar size={16} />
              Timeframe
            </h3>
            
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-sm)'
              }}
            >
              {timeframeOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Biomarker Selection */}
          <div style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '16px',
            flex: 1,
            overflow: 'auto'
          }}>
            <h3 style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Filter size={16} />
              Select Biomarkers
            </h3>
            
            {biomarkerCategories.map(category => (
              <div key={category} style={{ marginBottom: '16px' }}>
                <h4 style={{ 
                  fontSize: 'var(--text-xs)', 
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {category}
                </h4>
                
                {availableBiomarkers
                  .filter(biomarker => biomarker.category === category)
                  .map(biomarker => (
                    <label key={biomarker.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: 'var(--text-xs)',
                      marginBottom: '6px',
                      padding: '4px',
                      borderRadius: '4px',
                      backgroundColor: selectedBiomarkers.includes(biomarker.id) 
                        ? 'var(--color-primary-50)' 
                        : 'transparent'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedBiomarkers.includes(biomarker.id)}
                        onChange={() => toggleBiomarker(biomarker.id)}
                      />
                      <span style={{ flex: 1 }}>
                        {biomarker.name} <span style={{ color: 'var(--color-text-tertiary)' }}>{biomarker.unit}</span>
                      </span>
                    </label>
                  ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Content Area - Comparison Chart */}
        <div style={{ 
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {selectedBiomarkers.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <TrendingUp size={64} style={{ color: 'var(--color-text-tertiary)', marginBottom: '16px' }} />
              <h3 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: '8px'
              }}>
                Select Biomarkers to Compare
              </h3>
              <p style={{ 
                fontSize: 'var(--text-base)', 
                color: 'var(--color-text-secondary)',
                maxWidth: '400px'
              }}>
                Choose one or more biomarkers from the sidebar to generate a comprehensive comparison chart showing trends and relationships across your test results.
              </p>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%' }}>
              {/* Chart Header */}
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h2 style={{ 
                  fontSize: 'var(--text-xl)', 
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px'
                }}>
                  {comparisonType === 'percentage' ? 'Percentage Change' : 'Absolute Values'} Comparison
                </h2>
                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--color-text-secondary)'
                }}>
                  Comparing {selectedBiomarkers.length} biomarker{selectedBiomarkers.length > 1 ? 's' : ''} • {timeframeOptions.find(t => t.id === selectedTimeframe)?.label}
                </p>
              </div>

              {/* Interactive Comparison Chart */}
              <div style={{ 
                width: '100%',
                height: 'calc(100% - 80px)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto'
              }}>
                <ComparisonChart />
                
                {/* Chart Summary */}
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-primary-50)',
                  border: '1px solid var(--color-primary-200)',
                  borderRadius: '6px',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center'
                }}>
                  <strong>Selected:</strong> {selectedBiomarkers.join(', ')} • 
                  <strong> View:</strong> {comparisonType === 'percentage' ? 'Percentage Change' : 'Absolute Values'} • 
                  <strong> Timeframe:</strong> {timeframeOptions.find(t => t.id === selectedTimeframe)?.label}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};