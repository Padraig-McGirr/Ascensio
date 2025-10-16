import React, { useState } from 'react';

interface BarChartData {
  biomarker: string;
  mostRecent: number; // 03/11/2025 data
  previous: number | null; // 8/30/2024 data
  earliest: number | null; // 2/28/2024 data
}

interface PercentageBarChartProps {
  onHover?: (cell: { biomarker: string; column: string } | null) => void;
  hoveredCell?: { biomarker: string; column: string } | null;
}

export const PercentageBarChart: React.FC<PercentageBarChartProps> = ({ onHover, hoveredCell }) => {
  const [showMostRecent, setShowMostRecent] = useState(true);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showEarliest, setShowEarliest] = useState(false);
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
    { biomarker: 'LEUCOCYTES', mostRecent: -23, previous: 12, earliest: 13 },
    { biomarker: 'NEUTROPHILS', mostRecent: null, previous: 14, earliest: 12 },
    { biomarker: 'LYMPHOCYTES', mostRecent: null, previous: 8, earliest: 19 },
    { biomarker: 'MONOCYTES', mostRecent: null, previous: -11, earliest: 24 },
    { biomarker: 'EOSINOPHILS', mostRecent: null, previous: 86, earliest: -33 },
    { biomarker: 'BASOPHILS', mostRecent: null, previous: 0, earliest: 100 },
    { biomarker: 'PLATELETS', mostRecent: -13, previous: 9, earliest: 4 },
    { biomarker: 'RBC', mostRecent: 2, previous: 9, earliest: -6 },
    { biomarker: 'HAEMOGLOBIN', mostRecent: 2, previous: 10, earliest: -5 },
    { biomarker: 'HAEMATOCRIT', mostRecent: 0, previous: 14, earliest: -10 },
    { biomarker: 'MCV', mostRecent: -2, previous: 5, earliest: -6 },
    { biomarker: 'MCH', mostRecent: -1, previous: 2, earliest: 1 },
    { biomarker: 'MCHC', mostRecent: 1, previous: -3, earliest: 8 },
    { biomarker: 'ALT', mostRecent: -29, previous: 65, earliest: -11 },
    { biomarker: 'BILIRUBIN', mostRecent: 44, previous: -23, earliest: -13 },
    { biomarker: 'ALP', mostRecent: -23, previous: 14, earliest: -6 },
    { biomarker: 'GAMMA GT', mostRecent: -26, previous: 43, earliest: -35 },
    { biomarker: 'PROTEINS', mostRecent: 0, previous: 3, earliest: -3 },
    { biomarker: 'ALBUMIN', mostRecent: 2, previous: 7, earliest: -7 },
    { biomarker: 'CHOLESTEROL', mostRecent: 0, previous: 39, earliest: -15 },
    { biomarker: 'TRIGLYCERIDES', mostRecent: 8, previous: 19, earliest: -1 },
    { biomarker: 'HDL', mostRecent: -5, previous: 23, earliest: -15 },
    { biomarker: 'LDL', mostRecent: 2, previous: 66, earliest: -20 },
    { biomarker: 'NON-HDL', mostRecent: 4, previous: 53, earliest: -16 },
    { biomarker: 'UREA', mostRecent: 18, previous: -10, earliest: -31 },
    { biomarker: 'CREATININE', mostRecent: -6, previous: 16, earliest: -20 },
    { biomarker: 'eGFR', mostRecent: 6, previous: -7, earliest: 17 },
    { biomarker: 'TSH', mostRecent: 37, previous: -40, earliest: null }
  ];

  // Use all biomarkers - same as line chart below
  const baseData = data;

  // Calculate max value from all data points that might be displayed
  const allValues = data.flatMap(d => {
    const values = [];
    if (d.mostRecent !== null) values.push(Math.abs(d.mostRecent));
    if (d.previous !== null) values.push(Math.abs(d.previous));
    if (d.earliest !== null) values.push(Math.abs(d.earliest));
    return values;
  });
  const maxValue = Math.max(...allValues);
  
  const chartHeight = 250;
  const chartWidth = 750; // Chart area width
  const barsPerDataset = (showMostRecent ? 1 : 0) + (showPrevious ? 1 : 0) + (showEarliest ? 1 : 0);
  const totalBarsNeeded = baseData.length * barsPerDataset;
  const barWidth = Math.max(8, (chartWidth - 80) / (totalBarsNeeded + baseData.length * 0.3) - 1);
  const leftMargin = 60;

  const getBarColor = (value: number) => {
    const absChange = Math.abs(value);
    if (absChange > 100) {
      return '#dc2626'; // Red
    } else if (absChange > 75) {
      return '#7c3aed'; // Purple
    } else if (absChange > 25) {
      return '#059669'; // Green
    } else {
      return '#fbbf24'; // Yellow
    }
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
      
      {/* Toggle Buttons */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '16px',
        zIndex: 20,
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => setShowMostRecent(!showMostRecent)}
          style={{
            backgroundColor: showMostRecent ? 'var(--color-primary)' : 'var(--color-surface)',
            color: showMostRecent ? 'white' : 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: 'var(--text-xs)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Last 2 tests
        </button>
        <button
          onClick={() => setShowPrevious(!showPrevious)}
          style={{
            backgroundColor: showPrevious ? 'var(--color-primary)' : 'var(--color-surface)',
            color: showPrevious ? 'white' : 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: 'var(--text-xs)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Last 3 tests
        </button>
        <button
          onClick={() => setShowEarliest(!showEarliest)}
          style={{
            backgroundColor: showEarliest ? 'var(--color-primary)' : 'var(--color-surface)',
            color: showEarliest ? 'white' : 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: 'var(--text-xs)',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Last 4 tests
        </button>
      </div>

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
      <div style={{ 
        position: 'relative', 
        width: chartWidth + 'px', 
        height: chartHeight + 'px',
        margin: `20px auto 60px ${leftMargin}px`,
        overflow: 'visible'
      }}>
        {/* Zero line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
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
          let barIndex = 0;
          const baseX = index * (barWidth * barsPerDataset + barWidth * 0.2 + 2);
          
          return (
            <div key={index}>
              {/* Most Recent Bar */}
              {showMostRecent && item.mostRecent !== null && (
                <>
                  {(() => {
                    const currentX = baseX + (barIndex * (barWidth + 2));
                    const barHeight = Math.abs(item.mostRecent) / maxValue * (chartHeight / 2);
                    const isPositive = item.mostRecent >= 0;
                    const barTop = isPositive ? (chartHeight / 2) - barHeight : chartHeight / 2;
                    const barColor = getBarColor(item.mostRecent);
                    barIndex++;
                    
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
                              value: item.mostRecent,
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
                  })()}
                </>
              )}
              
              {/* Previous Bar */}
              {showPrevious && item.previous !== null && (
                <>
                  {(() => {
                    const currentX = baseX + (barIndex * (barWidth + 2));
                    const barHeight = Math.abs(item.previous) / maxValue * (chartHeight / 2);
                    const isPositive = item.previous >= 0;
                    const barTop = isPositive ? (chartHeight / 2) - barHeight : chartHeight / 2;
                    const barColor = getBarColor(item.previous);
                    barIndex++;
                    
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
                              value: item.previous,
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
                  })()}
                </>
              )}
              
              {/* Earliest Bar */}
              {showEarliest && item.earliest !== null && (
                <>
                  {(() => {
                    const currentX = baseX + (barIndex * (barWidth + 2));
                    const barHeight = Math.abs(item.earliest) / maxValue * (chartHeight / 2);
                    const isPositive = item.earliest >= 0;
                    const barTop = isPositive ? (chartHeight / 2) - barHeight : chartHeight / 2;
                    const barColor = getBarColor(item.earliest);
                    
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
                              value: item.earliest,
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
                  })()}
                </>
              )}
              
              {/* X-axis label */}
              <div
                style={{
                  position: 'absolute',
                  left: (baseX + (barsPerDataset * barWidth) / 2 - barWidth / 2 - 15) + 'px',
                  top: chartHeight + 8 + 'px',
                  width: barWidth + 'px',
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
        right: '16px',
        top: '110px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: 'var(--text-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: '#fbbf24',
            borderRadius: '2px'
          }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>0-25%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: '#059669',
            borderRadius: '2px'
          }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>25-75%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: '#7c3aed',
            borderRadius: '2px'
          }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>75-100%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: '#dc2626',
            borderRadius: '2px'
          }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>&gt;100%</span>
        </div>
      </div>
    </div>
  );
};