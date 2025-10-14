import type { Patient, BloodworkData, User, TodayAppointment, WeeklyAppointment } from '../types';
import { subMonths, format, startOfWeek, addDays, addHours, setHours, setMinutes } from 'date-fns';

// Mock bloodwork data generator
const generateBloodworkData = (patientId: string, gender: 'Male' | 'Female' | 'Other', months: number = 6): BloodworkData[] => {
  const bloodwork: BloodworkData[] = [];
  
  for (let i = 0; i < months; i++) {
    const testDate = subMonths(new Date(), i);
    
    // Generate realistic values with some variation
    const hemoglobin = gender === 'Male' 
      ? 13.5 + Math.random() * 4 + (Math.random() - 0.5) * 2
      : 12.0 + Math.random() * 3.5 + (Math.random() - 0.5) * 2;
    
    const whiteBloodCells = 4.5 + Math.random() * 6.5 + (Math.random() - 0.5) * 1.5;
    const platelets = 150 + Math.random() * 300 + (Math.random() - 0.5) * 50;
    const glucose = 70 + Math.random() * 60 + (Math.random() - 0.5) * 20;
    
    const totalCholesterol = 150 + Math.random() * 100 + (Math.random() - 0.5) * 30;
    const hdl = gender === 'Male' ? 40 + Math.random() * 30 : 50 + Math.random() * 30;
    const triglycerides = 50 + Math.random() * 200;
    const ldl = totalCholesterol - hdl - (triglycerides / 5);

    bloodwork.push({
      id: `bw-${patientId}-${i}`,
      patientId,
      testDate: format(testDate, 'yyyy-MM-dd'),
      hemoglobin: Math.round(hemoglobin * 10) / 10,
      whiteBloodCells: Math.round(whiteBloodCells * 10) / 10,
      platelets: Math.round(platelets),
      glucose: Math.round(glucose),
      cholesterol: {
        total: Math.round(totalCholesterol),
        hdl: Math.round(hdl),
        ldl: Math.round(Math.max(ldl, 50)),
        triglycerides: Math.round(triglycerides)
      },
      notes: i === 0 ? 'Most recent lab results' : undefined
    });
  }
  
  return bloodwork.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
};

export const mockPatients: Patient[] = [
  {
    id: 'p001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-15',
    age: 39,
    gender: 'Female',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Boston, MA 02101',
    lastVisit: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    bloodworkHistory: generateBloodworkData('p001', 'Female', 6)
  },
  {
    id: 'p002',
    firstName: 'Michael',
    lastName: 'Chen',
    dateOfBirth: '1978-07-22',
    age: 46,
    gender: 'Male',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, Cambridge, MA 02139',
    lastVisit: '2024-01-12',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    bloodworkHistory: generateBloodworkData('p002', 'Male', 6)
  },
  {
    id: 'p003',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    dateOfBirth: '1992-11-08',
    age: 32,
    gender: 'Female',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 345-6789',
    address: '789 Pine St, Somerville, MA 02143',
    lastVisit: '2024-01-10',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    bloodworkHistory: generateBloodworkData('p003', 'Female', 6)
  },
  {
    id: 'p004',
    firstName: 'David',
    lastName: 'Thompson',
    dateOfBirth: '1965-05-30',
    age: 59,
    gender: 'Male',
    email: 'david.thompson@email.com',
    phone: '(555) 456-7890',
    address: '321 Elm St, Newton, MA 02458',
    lastVisit: '2024-01-08',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    bloodworkHistory: generateBloodworkData('p004', 'Male', 6)
  },
  {
    id: 'p005',
    firstName: 'Lisa',
    lastName: 'Anderson',
    dateOfBirth: '1988-09-12',
    age: 36,
    gender: 'Female',
    email: 'lisa.anderson@email.com',
    phone: '(555) 567-8901',
    address: '654 Maple Ave, Brookline, MA 02446',
    lastVisit: '2024-01-05',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    bloodworkHistory: generateBloodworkData('p005', 'Female', 6)
  },
  {
    id: 'p006',
    firstName: 'James',
    lastName: 'Wilson',
    dateOfBirth: '1975-12-03',
    age: 49,
    gender: 'Male',
    email: 'james.wilson@email.com',
    phone: '(555) 678-9012',
    address: '987 Cedar St, Waltham, MA 02451',
    lastVisit: '2024-01-03',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    bloodworkHistory: generateBloodworkData('p006', 'Male', 6)
  },
  {
    id: 'p007',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: '1990-04-18',
    age: 34,
    gender: 'Female',
    email: 'maria.garcia@email.com',
    phone: '(555) 789-0123',
    address: '246 Birch Ln, Medford, MA 02155',
    lastVisit: '2024-01-01',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    bloodworkHistory: generateBloodworkData('p007', 'Female', 6)
  },
  {
    id: 'p008',
    firstName: 'Robert',
    lastName: 'Brown',
    dateOfBirth: '1982-08-25',
    age: 42,
    gender: 'Male',
    email: 'robert.brown@email.com',
    phone: '(555) 890-1234',
    address: '135 Spruce St, Arlington, MA 02474',
    lastVisit: '2023-12-28',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
    bloodworkHistory: generateBloodworkData('p008', 'Male', 6)
  }
];

export const mockUsers: User[] = [
  {
    id: 'u001',
    username: 'doctor',
    role: 'doctor',
    firstName: 'Dr. Jane',
    lastName: 'Smith'
  },
  {
    id: 'u002',
    username: 'nurse',
    role: 'nurse',
    firstName: 'Nancy',
    lastName: 'Williams'
  },
  {
    id: 'u003',
    username: 'admin',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  }
];

// Helper function to get patient by ID
export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

// Mock Today's Appointments
export const mockTodayAppointments: TodayAppointment[] = [
  {
    id: 'apt001',
    patientId: 'p001',
    patientName: 'Sarah Johnson',
    time: '09:30',
    type: 'Clinic Consulting',
    status: 'Confirmed',
    duration: '30 min'
  },
  {
    id: 'apt002',
    patientId: 'p003',
    patientName: 'Emily Rodriguez',
    time: '10:00',
    type: 'Video Consulting',
    status: 'Pending',
    duration: '45 min'
  },
  {
    id: 'apt003',
    patientId: 'p002',
    patientName: 'Michael Chen',
    time: '10:45',
    type: 'Follow-up',
    status: 'Confirmed',
    duration: '15 min'
  },
  {
    id: 'apt004',
    patientId: 'p005',
    patientName: 'Lisa Anderson',
    time: '11:30',
    type: 'Clinic Consulting',
    status: 'Confirmed',
    duration: '30 min'
  },
  {
    id: 'apt005',
    patientId: 'p007',
    patientName: 'Maria Garcia',
    time: '14:00',
    type: 'New Patient',
    status: 'Pending',
    duration: '60 min'
  },
  {
    id: 'apt006',
    patientId: 'p004',
    patientName: 'David Thompson',
    time: '15:30',
    type: 'Video Consulting',
    status: 'Confirmed',
    duration: '30 min'
  }
];

// Mock Appointment Requests
export const mockAppointmentRequests = [
  {
    id: 'req001',
    patientName: 'Jennifer Williams',
    patientPhone: '(555) 123-9876',
    patientEmail: 'j.williams@email.com',
    requestedDate: '2024-01-25',
    requestedTime: '09:00 AM',
    appointmentType: 'New Patient' as const,
    priority: 'High' as const,
    status: 'Pending' as const,
    notes: 'First time patient, experiencing chest pain for 3 days',
    requestedAt: '2024-01-18T10:30:00Z'
  },
  {
    id: 'req002',
    patientName: 'Mark Thompson',
    patientPhone: '(555) 987-6543',
    patientEmail: 'mark.thompson@email.com',
    requestedDate: '2024-01-24',
    requestedTime: '02:30 PM',
    appointmentType: 'Video Consulting' as const,
    priority: 'Medium' as const,
    status: 'Pending' as const,
    notes: 'Follow-up on blood pressure medication adjustment',
    requestedAt: '2024-01-17T14:15:00Z'
  },
  {
    id: 'req003',
    patientName: 'Rachel Green',
    patientPhone: '(555) 456-7890',
    patientEmail: 'rachel.green@email.com',
    requestedDate: '2024-01-26',
    requestedTime: '11:15 AM',
    appointmentType: 'Clinic Consulting' as const,
    priority: 'Low' as const,
    status: 'Approved' as const,
    notes: 'Annual physical examination',
    requestedAt: '2024-01-16T09:45:00Z'
  },
  {
    id: 'req004',
    patientName: 'Brian Davis',
    patientPhone: '(555) 321-0987',
    patientEmail: 'brian.davis@email.com',
    requestedDate: '2024-01-23',
    requestedTime: '04:00 PM',
    appointmentType: 'Follow-up' as const,
    priority: 'Medium' as const,
    status: 'Pending' as const,
    notes: 'Review recent lab results and discuss treatment plan',
    requestedAt: '2024-01-17T16:20:00Z'
  },
  {
    id: 'req005',
    patientName: 'Amanda Johnson',
    patientPhone: '(555) 654-3210',
    patientEmail: 'amanda.johnson@email.com',
    requestedDate: '2024-01-27',
    requestedTime: '08:30 AM',
    appointmentType: 'Video Consulting' as const,
    priority: 'Low' as const,
    status: 'Declined' as const,
    notes: 'Routine check-up, no urgent concerns',
    requestedAt: '2024-01-15T11:10:00Z'
  }
];

// Generate weekly appointments
const generateWeeklyAppointments = (): WeeklyAppointment[] => {
  const appointments: WeeklyAppointment[] = [];
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  
  const appointmentTypes: Array<'Clinic Consulting' | 'Video Consulting' | 'Follow-up' | 'New Patient'> = [
    'Clinic Consulting', 'Video Consulting', 'Follow-up', 'New Patient'
  ];
  
  // Fixed time slots to avoid overlaps
  const availableTimeSlots = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // 8 AM to 6 PM

  // Generate appointments for each day of the week (Monday to Sunday)
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const currentDay = addDays(weekStart, dayIndex);
    const dayDateString = format(currentDay, 'yyyy-MM-dd');
    
    // Track used time slots for this day to prevent overlaps
    const usedTimeSlots = new Set<number>();
    
    // Fewer appointments on weekends
    const isWeekend = dayIndex === 5 || dayIndex === 6; // Saturday or Sunday
    const maxAppointments = isWeekend ? 2 : 4; // Max 2 on weekends, 4 on weekdays
    const dayAppointments = Math.floor(Math.random() * maxAppointments) + 1;
    
    for (let i = 0; i < dayAppointments; i++) {
      // Find available time slot
      const availableSlots = availableTimeSlots.filter(slot => !usedTimeSlots.has(slot));
      if (availableSlots.length === 0) break; // No more available slots
      
      const selectedHour = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      usedTimeSlots.add(selectedHour);
      
      const patient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
      const appointmentType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
      
      // Set appointment duration based on type
      const duration = appointmentType === 'New Patient' ? 60 : 
                      appointmentType === 'Follow-up' ? 30 : 45;
      
      const startTime = setMinutes(setHours(currentDay, selectedHour), 0);
      const endTime = addHours(startTime, duration / 60);
      
      appointments.push({
        id: `wk-apt-${dayIndex}-${i}`,
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        patientAvatar: patient.avatar,
        date: dayDateString,
        startTime: format(startTime, 'HH:mm'),
        endTime: format(endTime, 'HH:mm'),
        type: appointmentType,
        status: Math.random() > 0.8 ? 'Pending' : 'Confirmed',
        notes: appointmentType === 'New Patient' ? 'Initial consultation' : 
               appointmentType === 'Follow-up' ? 'Follow-up visit' : undefined
      });
    }
  }
  
  return appointments.sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
};

export const mockWeeklyAppointments: WeeklyAppointment[] = generateWeeklyAppointments();

// Helper function to get recent bloodwork for all patients
export const getRecentBloodwork = (): BloodworkData[] => {
  return mockPatients.flatMap(patient => 
    patient.bloodworkHistory.slice(0, 1)
  );
};