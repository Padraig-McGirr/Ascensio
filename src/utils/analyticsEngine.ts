import { 
  linearRegression, 
  // linearRegressionLine, 
  sampleCorrelation, 
  standardDeviation,
  mean,
  median,
  quantile
} from 'simple-statistics';
import { differenceInDays, parseISO } from 'date-fns';
import type { LongitudinalDataPoint, BloodBiomarker } from '../types/bloodTest';

export class BloodTestAnalyticsEngine {
  
  /**
   * Calculate trend analysis for a biomarker over time
   */
  static calculateTrend(dataPoints: LongitudinalDataPoint[]) {
    if (dataPoints.length < 2) {
      return {
        trend: 'stable' as const,
        slope: 0,
        correlation: 0,
        riskLevel: 'low' as const
      };
    }

    // Sort by date
    const sortedData = dataPoints.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Convert dates to numeric values (days since first measurement)
    const baseDate = parseISO(sortedData[0].date);
    const coordinates: [number, number][] = sortedData.map(point => [
      differenceInDays(parseISO(point.date), baseDate),
      point.value
    ]);

    // Calculate linear regression
    const regression = linearRegression(coordinates);
    
    // Calculate correlation coefficient
    const xValues = coordinates.map(coord => coord[0]);
    const yValues = coordinates.map(coord => coord[1]);
    const correlation = sampleCorrelation(xValues, yValues);

    // Determine trend direction
    let trend: 'improving' | 'worsening' | 'stable' | 'fluctuating';
    const slope = regression.m;
    
    if (Math.abs(slope) < 0.1) {
      trend = 'stable';
    } else if (Math.abs(correlation) < 0.3) {
      trend = 'fluctuating';
    } else {
      // This would need biomarker-specific logic (e.g., lower cholesterol = improving)
      trend = slope > 0 ? 'worsening' : 'improving';
    }

    // Risk assessment based on recent values and trend
    const recentValues = sortedData.slice(-3);
    const criticalCount = recentValues.filter(p => p.status === 'critical').length;
    const highCount = recentValues.filter(p => p.status === 'high').length;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (criticalCount > 0) riskLevel = 'critical';
    else if (highCount >= 2) riskLevel = 'high';
    else if (trend === 'worsening' && highCount > 0) riskLevel = 'medium';
    else riskLevel = 'low';

    return {
      trend,
      slope,
      correlation,
      riskLevel
    };
  }

  /**
   * Generate statistical summary for biomarker values
   */
  static generateStatisticalSummary(values: number[]) {
    if (values.length === 0) return null;

    return {
      mean: mean(values),
      median: median(values),
      standardDeviation: standardDeviation(values),
      quartiles: {
        q1: quantile(values, 0.25),
        q3: quantile(values, 0.75)
      },
      range: {
        min: Math.min(...values),
        max: Math.max(...values)
      },
      count: values.length
    };
  }

  /**
   * Detect anomalies in biomarker values using statistical methods
   */
  static detectAnomalies(dataPoints: LongitudinalDataPoint[], threshold: number = 2) {
    if (dataPoints.length < 3) return [];

    const values = dataPoints.map(p => p.value);
    const meanValue = mean(values);
    const stdDev = standardDeviation(values);

    return dataPoints.filter(point => {
      const zScore = Math.abs((point.value - meanValue) / stdDev);
      return zScore > threshold;
    });
  }

  /**
   * Calculate biomarker correlation matrix
   */
  static calculateBiomarkerCorrelations(
    biomarkerData: Record<string, LongitudinalDataPoint[]>
  ) {
    const biomarkerNames = Object.keys(biomarkerData);
    const correlationMatrix: Record<string, Record<string, number>> = {};

    biomarkerNames.forEach(biomarker1 => {
      correlationMatrix[biomarker1] = {};
      
      biomarkerNames.forEach(biomarker2 => {
        if (biomarker1 === biomarker2) {
          correlationMatrix[biomarker1][biomarker2] = 1;
          return;
        }

        // Find common dates
        const data1 = biomarkerData[biomarker1];
        const data2 = biomarkerData[biomarker2];
        
        const commonDates = data1
          .filter(d1 => data2.some(d2 => d2.date === d1.date))
          .map(d => d.date);

        if (commonDates.length < 3) {
          correlationMatrix[biomarker1][biomarker2] = 0;
          return;
        }

        const values1 = commonDates.map(date => 
          data1.find(d => d.date === date)!.value
        );
        const values2 = commonDates.map(date => 
          data2.find(d => d.date === date)!.value
        );

        try {
          correlationMatrix[biomarker1][biomarker2] = sampleCorrelation(values1, values2);
        } catch {
          correlationMatrix[biomarker1][biomarker2] = 0;
        }
      });
    });

    return correlationMatrix;
  }

  /**
   * Generate clinical insights based on biomarker patterns
   */
  static generateClinicalInsights(
    biomarkers: BloodBiomarker[],
    historicalData?: Record<string, LongitudinalDataPoint[]>
  ) {
    const insights: Array<{
      type: 'warning' | 'info' | 'critical' | 'positive';
      message: string;
      biomarkers: string[];
      severity: number; // 1-10
    }> = [];

    // Check for critical values
    const criticalBiomarkers = biomarkers.filter(b => b.status === 'critical');
    if (criticalBiomarkers.length > 0) {
      insights.push({
        type: 'critical',
        message: `Critical values detected requiring immediate attention`,
        biomarkers: criticalBiomarkers.map(b => b.name),
        severity: 10
      });
    }

    // Check for diabetes risk pattern
    const glucose = biomarkers.find(b => b.name.toLowerCase().includes('glucose'));
    const hba1c = biomarkers.find(b => b.name.toLowerCase().includes('hba1c'));
    
    if (glucose && hba1c && glucose.status === 'high' && hba1c.status === 'high') {
      insights.push({
        type: 'warning',
        message: 'Elevated glucose and HbA1c suggest diabetes monitoring needed',
        biomarkers: ['glucose', 'hba1c'],
        severity: 8
      });
    }

    // Check for cardiovascular risk
    const cholesterol = biomarkers.find(b => b.name.toLowerCase().includes('cholesterol'));
    const triglycerides = biomarkers.find(b => b.name.toLowerCase().includes('triglycerides'));
    
    if (cholesterol && triglycerides && 
        cholesterol.status === 'high' && triglycerides.status === 'high') {
      insights.push({
        type: 'warning',
        message: 'Lipid profile indicates cardiovascular risk assessment needed',
        biomarkers: ['cholesterol', 'triglycerides'],
        severity: 7
      });
    }

    // Add trend-based insights if historical data available
    if (historicalData) {
      Object.entries(historicalData).forEach(([biomarkerName, data]) => {
        const trend = this.calculateTrend(data);
        if (trend.riskLevel === 'high' || trend.riskLevel === 'critical') {
          insights.push({
            type: trend.riskLevel === 'critical' ? 'critical' : 'warning',
            message: `${biomarkerName} shows ${trend.trend} trend with ${trend.riskLevel} risk`,
            biomarkers: [biomarkerName],
            severity: trend.riskLevel === 'critical' ? 9 : 6
          });
        }
      });
    }

    return insights.sort((a, b) => b.severity - a.severity);
  }

  /**
   * Calculate drug effectiveness score based on biomarker changes
   */
  static calculateDrugEffectiveness(
    targetBiomarkers: string[],
    pretreatmentData: Record<string, LongitudinalDataPoint[]>,
    posttreatmentData: Record<string, LongitudinalDataPoint[]>
  ) {
    let totalImprovement = 0;
    let biomarkersEvaluated = 0;

    targetBiomarkers.forEach(biomarker => {
      const preData = pretreatmentData[biomarker];
      const postData = posttreatmentData[biomarker];

      if (!preData || !postData || preData.length === 0 || postData.length === 0) {
        return;
      }

      const preAverage = mean(preData.map(d => d.value));
      const postAverage = mean(postData.map(d => d.value));
      
      // Calculate percentage change (biomarker-specific logic needed)
      const percentChange = ((postAverage - preAverage) / preAverage) * 100;
      
      // For most biomarkers, lower is better (cholesterol, glucose, etc.)
      // This would need biomarker-specific improvement calculations
      const improvement = -percentChange; // Simplified assumption
      
      totalImprovement += Math.max(-50, Math.min(50, improvement)); // Cap at ±50%
      biomarkersEvaluated++;
    });

    if (biomarkersEvaluated === 0) return 0;

    // Convert to 0-100 scale
    const averageImprovement = totalImprovement / biomarkersEvaluated;
    return Math.max(0, Math.min(100, 50 + averageImprovement));
  }
}