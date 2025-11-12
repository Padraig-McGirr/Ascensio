import React, { useState } from 'react';
import { BLOOD_RANGE_COLORS, getBloodRangeColor } from '../utils/bloodRangeColors';

interface BarChartData {
  biomarker: string;
  mostRecent: number | null; // 03/11/2025 percentage change
  previous: number | null; // 8/30/2024 percentage change
  earliest: number | null; // 2/28/2024 percentage change
  // Actual biomarker values for color coding
  actualValues: {
    baseline: string;
    feb2024: string;
    aug2024: string;
    mar2025: string;
  };
}

interface ResultsTableBarChartProps {
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

export const ResultsTableBarChart: React.FC<ResultsTableBarChartProps> = ({ 
  onHover, 
  hoveredCell: _hoveredCell, 
  chartHover, 
  onChartHover, 
  timeframe = 'last2', 
  selectedBiomarkerGroups,
  selectedTimeRange: _selectedTimeRange 
}) => {
  // Determine which bars to show based on timeframe
  const showMostRecent = timeframe === 'last2' || timeframe === 'last3' || timeframe === 'last4';
  const showPrevious = timeframe === 'last3' || timeframe === 'last4';
  const showEarliest = timeframe === 'last4';
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    biomarker: string;
    value: number;
    date: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    biomarker: '',
    value: 0,
    date: ''
  });
  
  const data: BarChartData[] = [
    { biomarker: 'LEUCOCYTES', mostRecent: -23, previous: 12, earliest: 13, actualValues: { baseline: '4.5', feb2024: '5.1', aug2024: '5.7', mar2025: '4.4' } },
    { biomarker: 'NEUTROPHILS', mostRecent: null, previous: 14, earliest: 12, actualValues: { baseline: '2.89', feb2024: '3.25', aug2024: '3.72', mar2025: '#N/A' } },
    { biomarker: 'LYMPHOCYTES', mostRecent: null, previous: 8, earliest: 19, actualValues: { baseline: '0.95', feb2024: '1.13', aug2024: '1.22', mar2025: '#N/A' } },
    { biomarker: 'MONOCYTES', mostRecent: null, previous: -11, earliest: 24, actualValues: { baseline: '0.45', feb2024: '0.56', aug2024: '0.5', mar2025: '#N/A' } },
    { biomarker: 'EOSINOPHILS', mostRecent: null, previous: 86, earliest: -33, actualValues: { baseline: '0.21', feb2024: '0.14', aug2024: '0.26', mar2025: '#N/A' } },
    { biomarker: 'BASOPHILS', mostRecent: null, previous: 0, earliest: 100, actualValues: { baseline: '0.02', feb2024: '0.04', aug2024: '0.04', mar2025: '#N/A' } },
    { biomarker: 'PLATELETS', mostRecent: -13, previous: 9, earliest: 4, actualValues: { baseline: '270', feb2024: '280', aug2024: '305', mar2025: '266' } },
    { biomarker: 'RBC', mostRecent: 2, previous: 9, earliest: -6, actualValues: { baseline: '4.31', feb2024: '4.04', aug2024: '4.39', mar2025: '4.49' } },
    { biomarker: 'HAEMOGLOBIN', mostRecent: 2, previous: 10, earliest: -5, actualValues: { baseline: '12.2', feb2024: '11.6', aug2024: '12.8', mar2025: '13' } },
    { biomarker: 'HAEMATOCRIT', mostRecent: 0, previous: 14, earliest: -10, actualValues: { baseline: '0.4', feb2024: '0.36', aug2024: '0.41', mar2025: '0.41' } },
    { biomarker: 'MCV', mostRecent: -2, previous: 5, earliest: -6, actualValues: { baseline: '93.3', feb2024: '88.1', aug2024: '92.3', mar2025: '90.6' } },
    { biomarker: 'MCH', mostRecent: -1, previous: 2, earliest: 1, actualValues: { baseline: '28.3', feb2024: '28.7', aug2024: '29.2', mar2025: '29' } },
    { biomarker: 'MCHC', mostRecent: 1, previous: -3, earliest: 8, actualValues: { baseline: '30.3', feb2024: '32.6', aug2024: '31.6', mar2025: '31.9' } },
    { biomarker: 'ALT', mostRecent: -29, previous: 65, earliest: -11, actualValues: { baseline: '19', feb2024: '17', aug2024: '28', mar2025: '20' } },
    { biomarker: 'BILIRUBIN', mostRecent: 44, previous: -23, earliest: -13, actualValues: { baseline: '9.9', feb2024: '8.6', aug2024: '6.6', mar2025: '9.5' } },
    { biomarker: 'ALP', mostRecent: -23, previous: 14, earliest: -6, actualValues: { baseline: '85', feb2024: '80', aug2024: '91', mar2025: '70' } },
    { biomarker: 'GAMMA GT', mostRecent: -26, previous: 43, earliest: -35, actualValues: { baseline: '46', feb2024: '30', aug2024: '43', mar2025: '32' } },
    { biomarker: 'PROTEINS', mostRecent: 0, previous: 3, earliest: -3, actualValues: { baseline: '77', feb2024: '75', aug2024: '77', mar2025: '77' } },
    { biomarker: 'ALBUMIN', mostRecent: 2, previous: 7, earliest: -7, actualValues: { baseline: '46', feb2024: '43', aug2024: '46', mar2025: '47' } },
    { biomarker: 'CHOLESTEROL', mostRecent: 0, previous: 39, earliest: -15, actualValues: { baseline: '3.9', feb2024: '3.3', aug2024: '4.6', mar2025: '4.6' } },
    { biomarker: 'TRIGLYCERIDES', mostRecent: 8, previous: 19, earliest: -1, actualValues: { baseline: '1.12', feb2024: '1.11', aug2024: '1.32', mar2025: '1.43' } },
    { biomarker: 'HDL', mostRecent: -5, previous: 23, earliest: -15, actualValues: { baseline: '1.77', feb2024: '1.51', aug2024: '1.86', mar2025: '1.76' } },
    { biomarker: 'LDL', mostRecent: 2, previous: 66, earliest: -20, actualValues: { baseline: '1.62', feb2024: '1.29', aug2024: '2.14', mar2025: '2.19' } },
    { biomarker: 'NON-HDL', mostRecent: 4, previous: 53, earliest: -16, actualValues: { baseline: '2.13', feb2024: '1.79', aug2024: '2.74', mar2025: '2.84' } },
    { biomarker: 'UREA', mostRecent: 18, previous: -10, earliest: -31, actualValues: { baseline: '7.1', feb2024: '4.9', aug2024: '4.4', mar2025: '5.2' } },
    { biomarker: 'CREATININE', mostRecent: -6, previous: 16, earliest: -20, actualValues: { baseline: '70', feb2024: '56', aug2024: '65', mar2025: '61' } },
    { biomarker: 'eGFR', mostRecent: 6, previous: -7, earliest: 17, actualValues: { baseline: '77.1', feb2024: '90', aug2024: '83.8', mar2025: '89' } },
    { biomarker: 'TSH', mostRecent: 37, previous: -40, earliest: null, actualValues: { baseline: '#N/A', feb2024: '0.604', aug2024: '0.36', mar2025: '0.493' } }
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
  const baseData = getFilteredBiomarkers();

  // Calculate max value from all data points that might be displayed
  const allValues = data.flatMap(d => {
    const values = [];
    if (d.mostRecent !== null) values.push(Math.abs(d.mostRecent));
    if (d.previous !== null) values.push(Math.abs(d.previous));
    if (d.earliest !== null) values.push(Math.abs(d.earliest));
    return values;
  });
  const maxValue = Math.max(...allValues);
  
  const chartHeight = 250; // Reduced chart height for Results Table
  const chartWidth = 800; // Extended chart width for Results Table
  const leftMargin = 80; // Increased left margin for Results Table
  // const barsPerDataset = 3; // Always allocate space for 3 bars (all datasets) regardless of selection
  const pointSpacing = baseData.length > 1 ? (chartWidth - 200) / (baseData.length - 1) : 100; // Simple spacing calculation
  const barWidth = Math.max(6, pointSpacing / 8); // Reduced bar width for Results Table

  // Get bar color based on actual biomarker value, not percentage change
  const getBarColor = (biomarker: string, date: string, item: BarChartData) => {
    let actualValue: string;
    switch(date) {
      case '03/11/2025': 
        actualValue = item.actualValues.mar2025;
        break;
      case '8/30/2024': 
        actualValue = item.actualValues.aug2024;
        break;
      case '2/28/2024': 
        actualValue = item.actualValues.feb2024;
        break;
      default: 
        actualValue = item.actualValues.baseline;
    }
    
    return getBloodRangeColor(biomarker, actualValue);
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
        top: '40%',
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
          margin: `20px auto 30px ${leftMargin}px`,
          overflow: 'visible'
        }}
        onMouseMove={(e) => {
          if (onChartHover) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const biomarkerIndex = Math.round(x / pointSpacing);
            
            // Ensure biomarkerIndex is within bounds
            if (biomarkerIndex >= 0 && biomarkerIndex < baseData.length) {
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
        {/* Zero line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          width: `${(baseData.length - 1) * pointSpacing + 20}px`,
          height: '1px',
          backgroundColor: 'var(--color-border-medium)',
          zIndex: 1
        }} />
        
        {/* Y-axis */}
        <div style={{
          position: 'absolute',
          left: '-2px',
          top: '0',
          width: '2px',
          height: '100%',
          backgroundColor: 'var(--color-border-medium)'
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
        
        {/* Bars */}
        {baseData.map((item, index) => {
          const baseX = 10 + (index * pointSpacing); // Close to x-axis start for Results Table
          
          return (
            <div key={index}>
              {/* Earliest Bar - Always position 0 */}
              {showEarliest && (
                <>
                  {(() => {
                    const currentX = baseX - barWidth - 2; // Earliest bar: left offset
                    
                    // Only render bar if data exists
                    if (item.earliest !== null) {
                      const barHeight = Math.abs(item.earliest) / maxValue * (chartHeight / 2);
                      const isPositive = item.earliest >= 0;
                      const barTop = isPositive ? (chartHeight / 2) - barHeight : chartHeight / 2;
                      const barColor = getBarColor(item.biomarker, '2/28/2024', item);
                      
                      return (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              left: currentX + 'px',
                              top: barTop + 'px',
                              width: barWidth + 'px',
                              height: barHeight + 'px',
                              backgroundColor: barColor,
                              borderRadius: '2px 2px 0 0',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                              opacity: 0.8
                            }}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTooltip({
                                visible: true,
                                x: rect.left + rect.width / 2,
                                y: rect.top - 10,
                                biomarker: item.biomarker,
                                value: item.earliest ?? 0,
                                date: '2/28/2024'
                              });
                              // Trigger table highlighting
                              onHover?.({ biomarker: item.biomarker, column: 'feb' });
                            }}
                            onMouseLeave={() => {
                              setTooltip(prev => ({ ...prev, visible: false }));
                              onHover?.(null);
                            }}
                          />
                        </>
                      );
                    }
                    return null; // No bar, but space is reserved
                  })()}
                </>
              )}
              
              {/* Previous Bar - Always position 1 */}
              {showPrevious && (
                <>
                  {(() => {
                    const currentX = baseX; // Previous bar: center position
                    
                    // Only render bar if data exists
                    if (item.previous !== null) {
                      const barHeight = Math.abs(item.previous) / maxValue * (chartHeight / 2);
                      const isPositive = item.previous >= 0;
                      const barTop = isPositive ? (chartHeight / 2) - barHeight : chartHeight / 2;
                      const barColor = getBarColor(item.biomarker, '8/30/2024', item);
                      
                      return (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              left: currentX + 'px',
                              top: barTop + 'px',
                              width: barWidth + 'px',
                              height: barHeight + 'px',
                              backgroundColor: barColor,
                              borderRadius: '2px 2px 0 0',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                              opacity: 0.9
                            }}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTooltip({
                                visible: true,
                                x: rect.left + rect.width / 2,
                                y: rect.top - 10,
                                biomarker: item.biomarker,
                                value: item.previous ?? 0,
                                date: '8/30/2024'
                              });
                              // Trigger table highlighting
                              onHover?.({ biomarker: item.biomarker, column: 'aug' });
                            }}
                            onMouseLeave={() => {
                              setTooltip(prev => ({ ...prev, visible: false }));
                              onHover?.(null);
                            }}
                          />
                        </>
                      );
                    }
                    return null; // No bar, but space is reserved
                  })()}
                </>
              )}
              
              {/* Most Recent Bar - Always position 2 */}
              {showMostRecent && (
                <>
                  {(() => {
                    const currentX = baseX + barWidth + 2; // Most recent bar: right offset
                    
                    // Only render bar if data exists
                    if (item.mostRecent !== null) {
                      const barHeight = Math.abs(item.mostRecent) / maxValue * (chartHeight / 2);
                      const isPositive = item.mostRecent >= 0;
                      const barTop = isPositive ? (chartHeight / 2) - barHeight : chartHeight / 2;
                      const barColor = getBarColor(item.biomarker, '03/11/2025', item);
                      
                      return (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              left: currentX + 'px',
                              top: barTop + 'px',
                              width: barWidth + 'px',
                              height: barHeight + 'px',
                              backgroundColor: barColor,
                              borderRadius: '2px 2px 0 0',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTooltip({
                                visible: true,
                                x: rect.left + rect.width / 2,
                                y: rect.top - 10,
                                biomarker: item.biomarker,
                                value: item.mostRecent ?? 0,
                                date: '03/11/2025'
                              });
                              // Trigger table highlighting
                              onHover?.({ biomarker: item.biomarker, column: 'mar' });
                            }}
                            onMouseLeave={() => {
                              setTooltip(prev => ({ ...prev, visible: false }));
                              onHover?.(null);
                            }}
                          />
                        </>
                      );
                    }
                    return null; // No bar, but space is reserved
                  })()}
                </>
              )}
              
            </div>
          );
        })}
        
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
        
        {/* X-axis labels - always show all biomarkers */}
        {baseData.map((item, index) => {
          return (
            <div
              key={`label-${index}`}
              style={{
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
                whiteSpace: 'nowrap',
                overflow: 'visible'
              }}
            >
              {item.biomarker}
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
          whiteSpace: 'nowrap',
          transform: 'translateX(-50%)'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '2px' }}>
            {tooltip.biomarker}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
            {tooltip.value > 0 ? '+' : ''}{tooltip.value}% change
          </div>
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
            {tooltip.date}
          </div>
        </div>
      )}
      
      {/* Legend - Right Side */}
      <div style={{
        position: 'absolute',
        right: '60px',
        top: '120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: 'var(--text-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: BLOOD_RANGE_COLORS.LOW,
            borderRadius: '2px'
          }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>Low</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: BLOOD_RANGE_COLORS.NORMAL,
            borderRadius: '2px'
          }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>In Range</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: BLOOD_RANGE_COLORS.HIGH,
            borderRadius: '2px'
          }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>High</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: BLOOD_RANGE_COLORS.OUT_OF_RANGE,
            borderRadius: '2px'
          }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>Out of Range</span>
        </div>
      </div>
    </div>
  );
};