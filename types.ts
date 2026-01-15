
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  SUBJECT_TEACHER = 'SUBJECT_TEACHER', // Remote Expert
  CLASSROOM_TEACHER = 'CLASSROOM_TEACHER',   // Local Facilitator
}

export interface UserAssignment {
    classId: string;
    subjectId?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  schoolId?: string; // Optional for Super Admin
  avatarUrl: string;
  specialty?: string; // For teachers
  assignments?: UserAssignment[]; // For teacher assignments
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  color: string;
  teacherId: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  category: 'JUNIOR_SECONDARY' | 'SENIOR_SECONDARY' | 'PRIMARY';
  status: 'ACTIVE' | 'ARCHIVED';
  subjects: string[]; // array of subject IDs
}

export interface VideoLesson {
  id: string;
  subjectId: string;
  classId: string;
  topic: string;
  week: number;
  period: number;
  teacherId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string; // e.g., "14:20"
  views: number;
  uploadedAt: string;
  videoUrl?: string; // Mock url
  videoFile?: File; // For drafts
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
  rejectionReason?: string;
}

export interface QAThread {
  id: string;
  lessonId: string;
  instructorId: string;
  questionText: string;
  timestamp: string;
  status: 'PENDING' | 'ANSWERED';
  answerText?: string;
  answerVideoUrl?: string;
  answeredAt?: string;
}

export interface LessonFlag {
  id: string;
  lessonId: string;
  instructorId: string;
  timestamp: number; // in seconds
  comment: string;
  status: 'PENDING' | 'RESOLVED';
}


export interface DashboardStats {
  totalLessons: number;
  activeStudents: number;
  pendingQuestions: number;
  hoursWatched: number;
}
