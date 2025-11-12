import React, { useState } from 'react';

interface LineChartData {
  biomarker: string;
  changes: { [date: string]: number | null };
}

interface ResultsTableLineChartProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
  chartHover?: {
    x: number;
    biomarkerIndex: number;
    visible: boolean;
  };
  onChartHover?: (hover: {
    x: number;
    biomarkerIndex: number;
    visible: boolean;
  }) => void;
  timeframe?: string;
  selectedBiomarkerGroups?: Set<string>;
  selectedTimeRange?: string;
}

export const ResultsTableLineChart: React.FC<ResultsTableLineChartProps> = ({ 
  onHover, 
  hoveredCell: _hoveredCell, 
  chartHover, 
  onChartHover, 
  timeframe = 'last2', 
  selectedBiomarkerGroups,
  selectedTimeRange: _selectedTimeRange 
}) => {
  const [selectedLines, setSelectedLines] = useState<string[]>(['Feb to Aug 2024', 'Aug 2024 to Mar 2025']);
  
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    biomarker: string;
    value: number;
    period: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    biomarker: '',
    value: 0,
    period: ''
  });

  // All available dates - 4 measurement periods (baseline + 3 follow-ups)
  // const allDates = ['8/28/2023', '2/28/2024', '8/30/2024', '03/11/2025'];
  const dateColors = ['#8b5cf6', '#2563eb', '#059669', '#dc2626']; // Purple, Blue, Green, Red
  
  // Get comparison periods based on timeframe
  const getComparisonPeriods = () => {
    switch (timeframe) {
      case 'last2':
        return [
          { 
            name: 'Aug 2024 to Mar 2025', 
            fromDate: '8/30/2024', 
            toDate: '03/11/2025',
            color: dateColors[2] // Green
          }
        ];
      case 'last3':
        return [
          { 
            name: 'Feb to Aug 2024', 
            fromDate: '2/28/2024', 
            toDate: '8/30/2024',
            color: dateColors[1] // Blue
          },
          { 
            name: 'Aug 2024 to Mar 2025', 
            fromDate: '8/30/2024', 
            toDate: '03/11/2025',
            color: dateColors[2] // Green
          }
        ];
      case 'last4':
        return [
          { 
            name: 'Baseline to Feb 2024', 
            fromDate: '8/28/2023', 
            toDate: '2/28/2024',
            color: dateColors[0] // Purple
          },
          { 
            name: 'Feb to Aug 2024', 
            fromDate: '2/28/2024', 
            toDate: '8/30/2024',
            color: dateColors[1] // Blue
          },
          { 
            name: 'Aug 2024 to Mar 2025', 
            fromDate: '8/30/2024', 
            toDate: '03/11/2025',
            color: dateColors[2] // Green
          }
        ];
      default:
        return [
          { 
            name: 'Feb to Aug 2024', 
            fromDate: '2/28/2024', 
            toDate: '8/30/2024',
            color: dateColors[1] // Blue
          },
          { 
            name: 'Aug 2024 to Mar 2025', 
            fromDate: '8/30/2024', 
            toDate: '03/11/2025',
            color: dateColors[2] // Green
          }
        ];
    }
  };
  
  const comparisonPeriods = getComparisonPeriods();
  
  // Update selected lines when timeframe changes
  React.useEffect(() => {
    setSelectedLines(comparisonPeriods.map(period => period.name));
  }, [timeframe]);
  
  // const toggleLine = (periodName: string) => {
  //   setSelectedLines(prev => 
  //     prev.includes(periodName) 
  //       ? prev.filter(d => d !== periodName)
  //       : [...prev, periodName]
  //   );
  // };
  
  const data: LineChartData[] = [
    { biomarker: 'LEUCOCYTES', changes: { '2/28/2024': 13, '8/30/2024': 12, '03/11/2025': -23 } },
    { biomarker: 'NEUTROPHILS', changes: { '2/28/2024': 12, '8/30/2024': 14, '03/11/2025': null } },
    { biomarker: 'LYMPHOCYTES', changes: { '2/28/2024': 19, '8/30/2024': 8, '03/11/2025': null } },
    { biomarker: 'MONOCYTES', changes: { '2/28/2024': 24, '8/30/2024': -11, '03/11/2025': null } },
    { biomarker: 'EOSINOPHILS', changes: { '2/28/2024': -33, '8/30/2024': 86, '03/11/2025': null } },
    { biomarker: 'BASOPHILS', changes: { '2/28/2024': 100, '8/30/2024': 0, '03/11/2025': null } },
    { biomarker: 'PLATELETS', changes: { '2/28/2024': 4, '8/30/2024': 9, '03/11/2025': -13 } },
    { biomarker: 'RBC', changes: { '2/28/2024': -6, '8/30/2024': 9, '03/11/2025': 2 } },
    { biomarker: 'HAEMOGLOBIN', changes: { '2/28/2024': -5, '8/30/2024': 10, '03/11/2025': 2 } },
    { biomarker: 'HAEMATOCRIT', changes: { '2/28/2024': -10, '8/30/2024': 14, '03/11/2025': 0 } },
    { biomarker: 'MCV', changes: { '2/28/2024': -6, '8/30/2024': 5, '03/11/2025': -2 } },
    { biomarker: 'MCH', changes: { '2/28/2024': 1, '8/30/2024': 2, '03/11/2025': -1 } },
    { biomarker: 'MCHC', changes: { '2/28/2024': 8, '8/30/2024': -3, '03/11/2025': 1 } },
    { biomarker: 'ALT', changes: { '2/28/2024': -11, '8/30/2024': 65, '03/11/2025': -29 } },
    { biomarker: 'BILIRUBIN', changes: { '2/28/2024': -13, '8/30/2024': -23, '03/11/2025': 44 } },
    { biomarker: 'ALP', changes: { '2/28/2024': -6, '8/30/2024': 14, '03/11/2025': -23 } },
    { biomarker: 'GAMMA GT', changes: { '2/28/2024': -35, '8/30/2024': 43, '03/11/2025': -26 } },
    { biomarker: 'PROTEINS', changes: { '2/28/2024': -3, '8/30/2024': 3, '03/11/2025': 0 } },
    { biomarker: 'ALBUMIN', changes: { '2/28/2024': -7, '8/30/2024': 7, '03/11/2025': 2 } },
    { biomarker: 'CHOLESTEROL', changes: { '2/28/2024': -15, '8/30/2024': 39, '03/11/2025': 0 } },
    { biomarker: 'TRIGLYCERIDES', changes: { '2/28/2024': -1, '8/30/2024': 19, '03/11/2025': 8 } },
    { biomarker: 'HDL', changes: { '2/28/2024': -15, '8/30/2024': 23, '03/11/2025': -5 } },
    { biomarker: 'LDL', changes: { '2/28/2024': -20, '8/30/2024': 66, '03/11/2025': 2 } },
    { biomarker: 'NON-HDL', changes: { '2/28/2024': -16, '8/30/2024': 53, '03/11/2025': 4 } },
    { biomarker: 'UREA', changes: { '2/28/2024': -31, '8/30/2024': -10, '03/11/2025': 18 } },
    { biomarker: 'CREATININE', changes: { '2/28/2024': -20, '8/30/2024': 16, '03/11/2025': -6 } },
    { biomarker: 'eGFR', changes: { '2/28/2024': 17, '8/30/2024': -7, '03/11/2025': 6 } },
    { biomarker: 'TSH', changes: { '2/28/2024': null, '8/30/2024': -40, '03/11/2025': 37 } }
  ];

  // Define biomarker groups mapping
  const biomarkerGroupMapping: Record<string, string[]> = {
    'whiteBloodCells': ['LEUCOCYTES', 'NEUTROPHILS', 'LYMPHOCYTES', 'MONOCYTES', 'EOSINOPHILS', 'BASOPHILS', 'PLATELETS'],
    'redBloodCells': ['RBC', 'HAEMOGLOBIN', 'HAEMATOCRIT', 'MCV', 'MCH', 'MCHC'],
    'liverFunction': ['ALT', 'BILIRUBIN', 'ALP', 'GAMMA GT', 'PROTEINS', 'ALBUMIN'],
    'lipidProfile': ['CHOLESTEROL', 'TRIGLYCERIDES', 'HDL', 'LDL', 'NON-HDL'],
    'kidneyFunction': ['UREA', 'CREATININE', 'eGFR'],
    'bloodSugarTshPsa': ['TSH']
  };

  // Filter biomarkers based on selected groups
  const getFilteredBiomarkers = () => {
    if (!selectedBiomarkerGroups || selectedBiomarkerGroups.size === 0) {
      return data; // Show all if none selected
    }

    const allowedBiomarkers = new Set<string>();
    selectedBiomarkerGroups.forEach(groupId => {
      const biomarkers = biomarkerGroupMapping[groupId] || [];
      biomarkers.forEach(biomarker => allowedBiomarkers.add(biomarker));
    });

    return data.filter(item => allowedBiomarkers.has(item.biomarker));
  };

  // Use filtered biomarkers
  const filteredData = getFilteredBiomarkers();

  const chartHeight = 250; // Reduced chart height for Results Table
  const chartWidth = 800; // Extended chart width for Results Table
  const leftMargin = 80; // Increased left margin for Results Table
  const bottomMargin = 100;
  const pointSpacing = filteredData.length > 1 ? (chartWidth - 200) / (filteredData.length - 1) : 100; // Simple spacing calculation
  
  // Calculate Y-axis range
  const allValues = data.flatMap(item => 
    Object.values(item.changes).filter(val => val !== null) as number[]
  );
  const maxValue = Math.max(...allValues.map(Math.abs));
  const yRange = [-maxValue, maxValue];

  const getYPosition = (value: number) => {
    return chartHeight - ((value - yRange[0]) / (yRange[1] - yRange[0])) * chartHeight;
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '420px', 
      position: 'relative',
      backgroundColor: 'var(--color-background)',
      border: '1px solid var(--color-border-light)',
      borderRadius: '8px',
      padding: '16px',
      overflow: 'visible'
    }}>
      
      
      {/* Y-axis Label */}
      <div style={{
        position: 'absolute',
        left: '-55px',
        top: '35%',
        transform: 'rotate(-90deg)',
        transformOrigin: 'center',
        fontSize: 'var(--text-xs)',
        fontWeight: '600',
        color: 'var(--color-text-secondary)',
        whiteSpace: 'nowrap'
      }}>
        Percentage Change (%)
      </div>
      
      {/* Chart Container */}
      <div 
        style={{ 
          position: 'relative', 
          width: chartWidth + 'px', 
          height: chartHeight + 'px',
          margin: `0px auto ${bottomMargin}px ${leftMargin}px`,
          overflow: 'visible'
        }}
        onMouseMove={(e) => {
          if (onChartHover) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const biomarkerIndex = Math.round(x / pointSpacing);
            
            // Ensure biomarkerIndex is within bounds
            if (biomarkerIndex >= 0 && biomarkerIndex < filteredData.length) {
              onChartHover({
                x: biomarkerIndex * pointSpacing,
                biomarkerIndex,
                visible: true
              });
            }
          }
        }}
        onMouseLeave={() => {
          if (onChartHover) {
            onChartHover({
              x: 0,
              biomarkerIndex: -1,
              visible: false
            });
          }
        }}
      >
        {/* Y-axis */}
        <div style={{
          position: 'absolute',
          left: '-2px',
          top: '0',
          width: '2px',
          height: '100%',
          backgroundColor: 'var(--color-border-medium)'
        }} />
        
        {/* Zero line */}
        <div style={{
          position: 'absolute',
          top: getYPosition(0) + 'px',
          left: '0',
          width: `${(filteredData.length - 1) * pointSpacing + 20}px`,
          height: '1px',
          backgroundColor: 'var(--color-border-medium)',
          zIndex: 1
        }} />
        
        {/* Y-axis labels */}
        <div style={{
          position: 'absolute',
          left: '-35px',
          top: '0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-tertiary)'
        }}>
          <span>{maxValue}%</span>
          <span>0%</span>
          <span>-{maxValue}%</span>
        </div>
        
        {/* Hover line */}
        {chartHover?.visible && (
          <div
            style={{
              position: 'absolute',
              left: chartHover.x + 'px',
              top: '0',
              width: '2px',
              height: '100%',
              backgroundColor: 'var(--color-primary)',
              borderLeft: '2px dashed var(--color-primary)',
              opacity: 0.7,
              pointerEvents: 'none',
              zIndex: 100
            }}
          />
        )}
        
        {/* X-axis labels */}
        {filteredData.map((item, index) => (
          <div key={index} style={{
            position: 'absolute',
            left: (10 + index * pointSpacing - 35) + 'px',
            top: chartHeight + 8 + 'px',
            width: '60px',
            textAlign: 'center',
            fontSize: '9px',
            fontWeight: '600',
            color: 'var(--color-text-secondary)',
            transform: 'rotate(-45deg)',
            transformOrigin: 'center top',
            whiteSpace: 'nowrap'
          }}>
            {item.biomarker}
          </div>
        ))}
        
        {/* Lines for each comparison period */}
        {comparisonPeriods.map((period) => {
          // Only render if this line is selected (all lines are selected by default)
          if (!selectedLines.includes(period.name)) return null;

          const points = filteredData.map((item, index) => {
            const value = item.changes[period.toDate];
            if (value === null) return null;
            return {
              x: 10 + (index * pointSpacing), // Close to x-axis start for Results Table
              y: getYPosition(value),
              value,
              biomarker: item.biomarker
            };
          }).filter(Boolean);

          if (points.length < 2) return null;

          // Create SVG path
          const pathData = points.map((point, i) => 
            `${i === 0 ? 'M' : 'L'} ${point!.x} ${point!.y}`
          ).join(' ');

          return (
            <div key={period.name}>
              {/* Line */}
              <svg style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}>
                <path
                  d={pathData}
                  stroke={period.color}
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              
              {/* Points */}
              {points.map((point, i) => {
                return (
                  <div 
                    key={i} 
                    style={{
                      position: 'absolute',
                      left: (point!.x - 4) + 'px',
                      top: (point!.y - 4) + 'px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: period.color,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: '1px solid white',
                      transition: 'all 0.2s ease'
                    }} 
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        visible: true,
                        x: rect.left + 4,
                        y: rect.top - 10,
                        biomarker: point!.biomarker,
                        value: point!.value,
                        period: period.name
                      });
                      // Trigger table highlighting based on period
                      let column = '';
                      if (period.toDate === '2/28/2024') column = 'feb';
                      else if (period.toDate === '8/30/2024') column = 'aug';
                      else if (period.toDate === '03/11/2025') column = 'mar';
                      
                      if (column) {
                        onHover?.({ biomarker: point!.biomarker, column });
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltip(prev => ({ ...prev, visible: false }));
                      onHover?.(null);
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      
      {/* Custom Tooltip */}
      {tooltip.visible && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 'px',
          top: tooltip.y + 'px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: 'var(--color-text-primary)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 1000,
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '2px' }}>
            {tooltip.biomarker}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
            {tooltip.value > 0 ? '+' : ''}{tooltip.value}% change
          </div>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
            {tooltip.period}
          </div>
        </div>
      )}
      
      {/* Legend - Show comparison periods */}
      <div style={{
        position: 'absolute',
        right: '20px',
        top: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: 'var(--text-xs)'
      }}>
        {comparisonPeriods.map((period) => (
          <div key={period.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: period.color,
              borderRadius: '2px'
            }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>
              {period.fromDate} to {period.toDate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};