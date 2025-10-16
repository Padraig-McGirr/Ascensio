import { z } from 'zod';

// Blood test biomarker schema with medical validation
export const BloodBiomarkerSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  referenceRange: z.object({
    min: z.number(),
    max: z.number(),
    unit: z.string()
  }),
  status: z.enum(['normal', 'low', 'high', 'critical']),
  category: z.enum(['hematology', 'chemistry', 'lipids', 'thyroid', 'liver', 'kidney', 'diabetes'])
});

// Complete blood test result schema
export const BloodTestResultSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  testDate: z.string(), // ISO date string
  laboratoryId: z.string(),
  biomarkers: z.array(BloodBiomarkerSchema),
  clinicalNotes: z.string().optional(),
  status: z.enum(['pending', 'completed', 'reviewed', 'flagged']),
  orderedBy: z.string(), // GP/clinician ID
  reviewedBy: z.string().optional()
});

// Longitudinal analysis data point
export const LongitudinalDataPointSchema = z.object({
  date: z.string(),
  value: z.number(),
  status: z.enum(['normal', 'low', 'high', 'critical']),
  testId: z.string()
});

// Patient analytics profile
export const PatientAnalyticsSchema = z.object({
  patientId: z.string(),
  biomarkerHistory: z.record(z.array(LongitudinalDataPointSchema)),
  trendAnalysis: z.record(z.object({
    trend: z.enum(['improving', 'worsening', 'stable', 'fluctuating']),
    slope: z.number(),
    correlation: z.number(),
    riskLevel: z.enum(['low', 'medium', 'high', 'critical'])
  })),
  lastUpdated: z.string()
});

// Drug effectiveness tracking
export const DrugEffectivenessSchema = z.object({
  drugName: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  targetBiomarkers: z.array(z.string()),
  effectiveness: z.object({
    overallScore: z.number(), // 0-100
    targetReached: z.boolean(),
    sideEffectMarkers: z.array(z.string()),
    improvementRate: z.number()
  })
});

// TypeScript types derived from schemas
export type BloodBiomarker = z.infer<typeof BloodBiomarkerSchema>;
export type BloodTestResult = z.infer<typeof BloodTestResultSchema>;
export type LongitudinalDataPoint = z.infer<typeof LongitudinalDataPointSchema>;
export type PatientAnalytics = z.infer<typeof PatientAnalyticsSchema>;
export type DrugEffectiveness = z.infer<typeof DrugEffectivenessSchema>;

// Common biomarker reference ranges
export const BIOMARKER_REFERENCES = {
  glucose: { min: 70, max: 100, unit: 'mg/dL' },
  cholesterolTotal: { min: 0, max: 200, unit: 'mg/dL' },
  cholesterolLDL: { min: 0, max: 100, unit: 'mg/dL' },
  cholesterolHDL: { min: 40, max: 999, unit: 'mg/dL' }, // No upper limit
  triglycerides: { min: 0, max: 150, unit: 'mg/dL' },
  hemoglobin: { min: 12.0, max: 16.0, unit: 'g/dL' },
  hematocrit: { min: 36.0, max: 48.0, unit: '%' },
  whiteBloodCells: { min: 4.5, max: 11.0, unit: '10³/μL' },
  platelets: { min: 150, max: 450, unit: '10³/μL' },
  creatinine: { min: 0.6, max: 1.2, unit: 'mg/dL' },
  bun: { min: 7, max: 20, unit: 'mg/dL' },
  alt: { min: 7, max: 56, unit: 'U/L' },
  ast: { min: 10, max: 40, unit: 'U/L' },
  tsh: { min: 0.4, max: 4.0, unit: 'mIU/L' },
  hba1c: { min: 0, max: 5.7, unit: '%' }
} as const;