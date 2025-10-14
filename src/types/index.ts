export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  address: string;
  lastVisit: string;
  avatar?: string;
  bloodworkHistory: BloodworkData[];
}

export interface BloodworkData {
  id: string;
  patientId: string;
  testDate: string;
  hemoglobin: number; // g/dL (normal: 12.0-15.5 for women, 13.5-17.5 for men)
  whiteBloodCells: number; // K/uL (normal: 4.5-11.0)
  platelets: number; // K/uL (normal: 150-450)
  glucose: number; // mg/dL (normal: 70-100 fasting)
  cholesterol: {
    total: number; // mg/dL (normal: <200)
    hdl: number; // mg/dL (normal: >40 for men, >50 for women)
    ldl: number; // mg/dL (normal: <100)
    triglycerides: number; // mg/dL (normal: <150)
  };
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'doctor' | 'nurse' | 'admin';
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface BloodworkTrend {
  date: string;
  value: number;
  metric: string;
}

export interface DashboardStats {
  totalPatients: number;
  recentVisits: number;
  abnormalResults: number;
  pendingReports: number;
}

export interface TodayAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  time: string;
  type: 'Clinic Consulting' | 'Video Consulting' | 'Follow-up' | 'New Patient';
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  duration: string;
}

export interface WeeklyAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'Clinic Consulting' | 'Video Consulting' | 'Follow-up' | 'New Patient';
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  notes?: string;
}