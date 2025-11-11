// Blood range color utility based on BLOOD RANGES AND LIMITERS.csv
export interface BloodRange {
  biomarker: string;
  normalRange: [number, number];
  lowThreshold: number;
  highThreshold: number;
}

// Biomarker ranges from the CSV file
export const bloodRanges: Record<string, BloodRange> = {
  'PLATELETS': {
    biomarker: 'PLATELETS',
    normalRange: [150, 450],
    lowThreshold: 226, // Bottom of normal range (26%-74%)
    highThreshold: 374 // Top of normal range (26%-74%)
  },
  'NEUTROPHILS': {
    biomarker: 'NEUTROPHILS',
    normalRange: [2.0, 7.0],
    lowThreshold: 3.26, // Bottom of normal range (26%-74%)
    highThreshold: 5.74 // Top of normal range (26%-74%)
  },
  'LYMPHOCYTES': {
    biomarker: 'LYMPHOCYTES', 
    normalRange: [1.0, 3.0],
    lowThreshold: 1.6, // Bottom of normal range (26%-74%)
    highThreshold: 2.4 // Top of normal range (26%-74%)
  },
  'MONOCYTES': {
    biomarker: 'MONOCYTES',
    normalRange: [0.2, 1.0],
    lowThreshold: 0.5, // Bottom of normal range (26%-74%)
    highThreshold: 0.7 // Top of normal range (26%-74%)
  },
  'EOSINOPHILS': {
    biomarker: 'EOSINOPHILS',
    normalRange: [0.02, 0.5],
    lowThreshold: 0.15, // Bottom of normal range (26%-74%)
    highThreshold: 0.37 // Top of normal range (26%-74%)
  },
  'BASOPHILS': {
    biomarker: 'BASOPHILS',
    normalRange: [0.02, 0.1],
    lowThreshold: 0.05, // Bottom of normal range (26%-74%)
    highThreshold: 0.07 // Top of normal range (26%-74%)
  },
  'LEUCOCYTES': {
    biomarker: 'LEUCOCYTES',
    normalRange: [4.0, 10.0],
    lowThreshold: 5.6, // Bottom of normal range (26%-74%)
    highThreshold: 8.4 // Top of normal range (26%-74%)
  },
  'RBC': {
    biomarker: 'RBC',
    normalRange: [3.8, 4.8],
    lowThreshold: 4.2, // Bottom of normal range (26%-74%)
    highThreshold: 4.5 // Top of normal range (26%-74%)
  },
  'HAEMOGLOBIN': {
    biomarker: 'HAEMOGLOBIN',
    normalRange: [12.0, 15.0],
    lowThreshold: 12.7, // Bottom of normal range (26%-74%)
    highThreshold: 14.2 // Top of normal range (26%-74%)
  },
  'HAEMATOCRIT': {
    biomarker: 'HAEMATOCRIT',
    normalRange: [0.36, 0.46],
    lowThreshold: 0.40, // Bottom of normal range (26%-74%)
    highThreshold: 0.43 // Top of normal range (26%-74%)
  },
  'MCV': {
    biomarker: 'MCV',
    normalRange: [83, 101],
    lowThreshold: 89, // Bottom of normal range (26%-74%)
    highThreshold: 96 // Top of normal range (26%-74%)
  },
  'MCH': {
    biomarker: 'MCH',
    normalRange: [27, 32],
    lowThreshold: 29, // Bottom of normal range (26%-74%)
    highThreshold: 30 // Top of normal range (26%-74%)
  },
  'MCHC': {
    biomarker: 'MCHC',
    normalRange: [31.5, 36],
    lowThreshold: 32.7, // Bottom of normal range (26%-74%)
    highThreshold: 34.8 // Top of normal range (26%-74%)
  },
  'ALT': {
    biomarker: 'ALT',
    normalRange: [5.0, 33.0],
    lowThreshold: 13, // Bottom of normal range (26%-74%)
    highThreshold: 25 // Top of normal range (26%-74%)
  },
  'BILIRUBIN': {
    biomarker: 'BILIRUBIN',
    normalRange: [2.0, 21.0],
    lowThreshold: 6.9, // Bottom of normal range (26%-74%)
    highThreshold: 16.2 // Top of normal range (26%-74%)
  },
  'ALP': {
    biomarker: 'ALP',
    normalRange: [30.0, 130.0],
    lowThreshold: 56, // Bottom of normal range (26%-74%)
    highThreshold: 104 // Top of normal range (26%-74%)
  },
  'GAMMA GT': {
    biomarker: 'GAMMA GT',
    normalRange: [6.0, 42.0],
    lowThreshold: 16, // Bottom of normal range (26%-74%)
    highThreshold: 32 // Top of normal range (26%-74%)
  },
  'PROTEINS': {
    biomarker: 'PROTEINS',
    normalRange: [60.0, 80.0],
    lowThreshold: 66, // Bottom of normal range (26%-74%)
    highThreshold: 74 // Top of normal range (26%-74%)
  },
  'ALBUMIN': {
    biomarker: 'ALBUMIN',
    normalRange: [35.0, 50.0],
    lowThreshold: 38.9, // Bottom of normal range (26%-74%)
    highThreshold: 46.2 // Top of normal range (26%-74%)
  },
  'CHOLESTEROL': {
    biomarker: 'CHOLESTEROL',
    normalRange: [2.0, 5.0],
    lowThreshold: 2.9, // Bottom of normal range (26%-74%)
    highThreshold: 4.2 // Top of normal range (26%-74%)
  },
  'TRIGLYCERIDES': {
    biomarker: 'TRIGLYCERIDES',
    normalRange: [0.5, 2.0],
    lowThreshold: 1.0, // Bottom of normal range (26%-74%)
    highThreshold: 1.5 // Top of normal range (26%-74%)
  },
  'HDL': {
    biomarker: 'HDL',
    normalRange: [1.2, 2.0],
    lowThreshold: 1.6, // Bottom of normal range (26%-74%)
    highThreshold: 1.7 // Top of normal range (26%-74%)
  },
  'LDL': {
    biomarker: 'LDL',
    normalRange: [0.31, 3.0],
    lowThreshold: 1.1, // Bottom of normal range (26%-74%)
    highThreshold: 2.2 // Top of normal range (26%-74%)
  },
  'NON-HDL': {
    biomarker: 'NON-HDL',
    normalRange: [0, 3.8],
    lowThreshold: 0.9, // Low threshold (≤25%)
    highThreshold: 2.9 // Start of high range (≥75%)
  },
  'UREA': {
    biomarker: 'UREA',
    normalRange: [2.5, 7.8],
    lowThreshold: 3.9, // Bottom of normal range (26%-74%)
    highThreshold: 6.4 // Top of normal range (26%-74%)
  },
  'CREATININE': {
    biomarker: 'CREATININE',
    normalRange: [45, 84],
    lowThreshold: 56, // Bottom of normal range (26%-74%)
    highThreshold: 73 // Top of normal range (26%-74%)
  },
  // eGFR removed - no ranges provided in CSV
  'SODIUM': {
    biomarker: 'SODIUM',
    normalRange: [135, 145],
    lowThreshold: 139, // Bottom of normal range (26%-74%)
    highThreshold: 142 // Top of normal range (26%-74%)
  },
  'CHLORIDE': {
    biomarker: 'CHLORIDE',
    normalRange: [95, 108],
    lowThreshold: 99, // Bottom of normal range (26%-74%)
    highThreshold: 104 // Top of normal range (26%-74%)
  },
  'POTASSIUM': {
    biomarker: 'POTASSIUM',
    normalRange: [3.5, 5.3],
    lowThreshold: 4.1, // Bottom of normal range (26%-74%)
    highThreshold: 4.8 // Top of normal range (26%-74%)
  },
  'CALCIUM': {
    biomarker: 'CALCIUM',
    normalRange: [2.2, 2.6],
    lowThreshold: 2.4, // From normal range (26%-74%)
    highThreshold: 2.4 // Single value in CSV
  },
  'PHOSPHOROUS': {
    biomarker: 'PHOSPHOROUS',
    normalRange: [0.8, 1.5],
    lowThreshold: 1.1, // Bottom of normal range (26%-74%)
    highThreshold: 1.2 // Top of normal range (26%-74%)
  },
  'MAGNESIUM': {
    biomarker: 'MAGNESIUM',
    normalRange: [0.7, 1.0],
    lowThreshold: 0.85, // Single value in CSV
    highThreshold: 0.85 // Single value in CSV
  },
  'GLUCOSE': {
    biomarker: 'GLUCOSE',
    normalRange: [3.0, 6.0],
    lowThreshold: 3.9, // Bottom of normal range (26%-74%)
    highThreshold: 5.2 // Top of normal range (26%-74%)
  },
  'HbA1c': {
    biomarker: 'HbA1c',
    normalRange: [20, 42],
    lowThreshold: 27, // Bottom of normal range (26%-74%)
    highThreshold: 36 // Top of normal range (26%-74%)
  },
  'TSH': {
    biomarker: 'TSH',
    normalRange: [0.27, 4.2],
    lowThreshold: 1.27, // Bottom of normal range (26%-74%)
    highThreshold: 3.21 // Top of normal range (26%-74%)
  },
  'PSA': {
    biomarker: 'PSA',
    normalRange: [0, 4.99],
    lowThreshold: 1.26, // Bottom of normal range (26%-74%)
    highThreshold: 3.74 // Top of normal range (26%-74%)
  }
};

// Color constants
export const BLOOD_RANGE_COLORS = {
  LOW: '#eab308',      // Yellow - Low
  NORMAL: '#059669',   // Green - In Range  
  HIGH: '#7c3aed',     // Purple - High
  OUT_OF_RANGE: '#dc2626' // Red - Out of Range
} as const;

/**
 * Get the color for a biomarker value based on blood range data
 */
export function getBloodRangeColor(biomarker: string, value: string | number): string {
  
  // Handle N/A values
  if (value === '#N/A' || value === 'N/A' || value === null || value === undefined) {
    return '#6b7280'; // Dark gray for N/A values
  }

  let numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Skip if we can't parse the value
  if (isNaN(numValue)) {
    return '#f3f4f6';
  }

  // Check if this is a biomarker we should not color (no ranges in CSV)
  const upperBiomarker = biomarker.toUpperCase();
  if (upperBiomarker.includes('eGFR')) {
    return '#6b7280'; // Dark grey for eGFR - no ranges in CSV (same as N/A cells)
  }

  // Find the biomarker in our ranges (try exact match first, then partial match)
  const biomarkerKey = Object.keys(bloodRanges).find(key => {
    const upperKey = key.toUpperCase();
    return upperBiomarker.includes(upperKey) || upperKey.includes(upperBiomarker);
  });

  if (!biomarkerKey) {
    // If no range found, return neutral color
    return '#f3f4f6';
  }

  const range = bloodRanges[biomarkerKey];
  
  // Check if value is out of normal range entirely
  if (numValue < range.normalRange[0] || numValue > range.normalRange[1]) {
    return BLOOD_RANGE_COLORS.OUT_OF_RANGE; // Red - Out of Range
  }
  
  
  // Check if value is in low range (below or equal to low threshold)
  if (numValue <= range.lowThreshold) {
    return BLOOD_RANGE_COLORS.LOW; // Yellow - Low
  }
  
  // Check if value is in high range (at or above high threshold)  
  if (numValue >= range.highThreshold) {
    return BLOOD_RANGE_COLORS.HIGH; // Purple - High
  }
  
  // Value is in normal range (between low threshold and high threshold)
  return BLOOD_RANGE_COLORS.NORMAL; // Green - In Range
}

/**
 * Get the legend text for a color
 */
export function getColorLegendText(color: string): string {
  switch (color) {
    case BLOOD_RANGE_COLORS.LOW:
      return 'Low';
    case BLOOD_RANGE_COLORS.NORMAL:
      return 'In Range';
    case BLOOD_RANGE_COLORS.HIGH:
      return 'High';
    case BLOOD_RANGE_COLORS.OUT_OF_RANGE:
      return 'Out of Range';
    default:
      return 'N/A';
  }
}