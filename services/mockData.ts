import { User, UserRole, Subject, VideoLesson, QAThread, SchoolClass, LessonFlag } from '../types';

export const MOCK_SCHOOL_ID = 'school_123';

export const SUPER_ADMIN_USER: User = {
  id: 'u_superadmin',
  name: 'Platform Owner',
  role: UserRole.SUPER_ADMIN,
  avatarUrl: 'https://ui-avatars.com/api/?name=SA&background=A855F7&color=fff'
};

export const CLASSROOM_TEACHER_USER: User = {
  id: 'u1',
  name: 'Jason Ranti',
  schoolId: MOCK_SCHOOL_ID,
  role: UserRole.CLASSROOM_TEACHER,
  avatarUrl: 'https://image.pollinations.ai/prompt/portrait%20of%20a%20friendly%20male%20teacher%20in%20classroom?width=100&height=100&nologo=true',
  assignments: [{ classId: 'c1' }]
};

export const SUBJECT_TEACHER_USER: User = {
  id: 'u2',
  name: 'Dr. Sarah Connor',
  schoolId: MOCK_SCHOOL_ID,
  role: UserRole.SUBJECT_TEACHER,
  specialty: 'Mathematics & Physics',
  avatarUrl: 'https://image.pollinations.ai/prompt/professional%20female%20professor%20portrait?width=100&height=100&nologo=true',
  assignments: [{ classId: 'c1', subjectId: 's4' }, { classId: 'c2', subjectId: 's1' }]
};

export const SCHOOL_ADMIN_USER: User = {
  id: 'u_admin',
  name: 'School Administrator',
  schoolId: MOCK_SCHOOL_ID,
  role: UserRole.SCHOOL_ADMIN,
  avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
};

const HISTORY_TEACHER: User = {
    id: 'u4',
    name: 'Prof. Indiana Jones',
    schoolId: MOCK_SCHOOL_ID,
    role: UserRole.SUBJECT_TEACHER,
    specialty: 'World History',
    avatarUrl: 'https://image.pollinations.ai/prompt/male%20archaeology%20professor%20portrait?width=100&height=100&nologo=true',
    assignments: [{ classId: 'c3', subjectId: 's3' }]
};

export const MOCK_USERS: User[] = [CLASSROOM_TEACHER_USER, SUBJECT_TEACHER_USER, SCHOOL_ADMIN_USER, HISTORY_TEACHER, SUPER_ADMIN_USER];


export const SUBJECTS: Subject[] = [
  { id: 's1', title: 'Algebra I', icon: 'Calculator', color: 'bg-blue-100 text-blue-600', teacherId: 'u2' },
  { id: 's2', title: 'Biology', icon: 'Dna', color: 'bg-green-100 text-green-600', teacherId: 'u3' },
  { id: 's3', title: 'World History', icon: 'Globe', color: 'bg-orange-100 text-orange-600', teacherId: 'u4' },
  { id: 's4', title: 'Physics', icon: 'Atom', color: 'bg-indigo-100 text-indigo-600', teacherId: 'u2' },
];

export const MOCK_CLASSES: SchoolClass[] = [
    { id: 'c1', name: 'SS 2', category: 'SENIOR_SECONDARY', status: 'ACTIVE', subjects: ['s2', 's4'] },
    { id: 'c2', name: 'JSS 3', category: 'JUNIOR_SECONDARY', status: 'ACTIVE', subjects: ['s1'] },
    { id: 'c3', name: 'SS 1', category: 'SENIOR_SECONDARY', status: 'ARCHIVED', subjects: ['s3'] }
];

// Using a standard open source video for demo (Big Buck Bunny Trailer)
const DEMO_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const INITIAL_LESSONS: VideoLesson[] = [
  {
    id: 'l1', subjectId: 's1', classId: 'c2', topic: 'Variables', week: 1, period: 1, teacherId: 'u2',
    title: 'Introduction to Linear Equations',
    description: 'Understanding variables and basic linear structures. In this lesson we explore the fundamental theorem.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/mathematics%20linear%20equations%20blackboard?width=800&height=450&nologo=true',
    duration: '15:30', views: 120, uploadedAt: '2023-10-24', videoUrl: DEMO_VIDEO_URL,
    status: 'APPROVED'
  },
  {
    id: 'l2', subjectId: 's1', classId: 'c2', topic: 'Graphing', week: 1, period: 2, teacherId: 'u2',
    title: 'Slope-Intercept Form',
    description: 'Mastering y = mx + b with real world examples regarding architecture and bridge building.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/architectural%20bridge%20blueprints%20math?width=800&height=450&nologo=true',
    duration: '22:15', views: 85, uploadedAt: '2023-10-26', videoUrl: DEMO_VIDEO_URL,
    status: 'APPROVED'
  },
  {
    id: 'l3', subjectId: 's2', classId: 'c1', topic: 'Cell Biology', week: 1, period: 1, teacherId: 'u2',
    title: 'Cellular Respiration',
    description: 'How cells generate energy from glucose. A deep dive into the mitochondria.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/biology%20mitochondria%20cell%20structure%203d?width=800&height=450&nologo=true',
    duration: '18:45', views: 200, uploadedAt: '2023-10-20', videoUrl: DEMO_VIDEO_URL,
    status: 'APPROVED'
  },
  {
    id: 'l4', subjectId: 's4', classId: 'c1', topic: 'Kinematics', week: 2, period: 1, teacherId: 'u2',
    title: 'Intro to Newtonian Physics',
    description: 'The process by which green plants and some other organisms use sunlight to synthesize foods.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/newtonian%20physics%20apple%20gravity?width=800&height=450&nologo=true',
    duration: '20:10', views: 150, uploadedAt: '2023-10-21', videoUrl: DEMO_VIDEO_URL,
    status: 'APPROVED'
  },
  {
    id: 'l6', subjectId: 's3', classId: 'c3', topic: 'Roman Republic', week: 4, period: 1, teacherId: 'u4',
    title: 'The Roman Empire - Rise and Fall',
    description: 'A comprehensive overview of the Roman Empire, from its origins to its eventual collapse.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/roman%20empire%20colosseum%20history?width=800&height=450&nologo=true',
    duration: '35:10', views: 0, uploadedAt: '1 day ago', videoUrl: DEMO_VIDEO_URL,
    status: 'PENDING'
  },
  {
    id: 'l7', subjectId: 's1', classId: 'c2', topic: 'Inequalities', week: 2, period: 1, teacherId: 'u2',
    title: 'Solving for X with Inequalities',
    description: 'This lesson covers the basics of inequalities.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/math%20inequalities%20symbols%20on%20a%20chalkboard?width=800&height=450&nologo=true',
    duration: '00:00', views: 0, uploadedAt: '2 days ago',
    status: 'DRAFT'
  },
  {
    id: 'l8', subjectId: 's4', classId: 'c1', topic: 'Kinematics', week: 3, period: 2, teacherId: 'u2',
    title: 'Understanding Velocity',
    description: 'An introduction to velocity and speed.',
    thumbnailUrl: 'https://image.pollinations.ai/prompt/physics%20velocity%20vector%20diagram?width=800&height=450&nologo=true',
    duration: '18:10', views: 5, uploadedAt: '3 days ago', videoUrl: DEMO_VIDEO_URL,
    status: 'REJECTED',
    rejectionReason: 'The audio quality is poor between 02:30 and 05:00. Please re-record this section.'
  }
];

export const MOCK_QA_THREADS: QAThread[] = [
  {
    id: 'qa1', lessonId: 'l1', instructorId: 'u1',
    questionText: 'The students are confused about why "b" represents the y-intercept. Can you explain the etymology or a quick memory trick?',
    timestamp: '2 hours ago', status: 'ANSWERED',
    answerText: 'Great question! Think of "b" as the "beginning" value when x is 0. I will upload a short explaining this shortly.',
    answeredAt: '1 hour ago'
  },
  {
    id: 'qa2', lessonId: 'l2', instructorId: 'u1',
    questionText: 'Is there a specific graph paper scale we should use for the exercises at minute 14?',
    timestamp: '10 mins ago', status: 'PENDING'
  }
];

export const MOCK_LESSON_FLAGS: LessonFlag[] = [
    { id: 'f1', lessonId: 'l1', instructorId: 'u1', timestamp: 165, comment: 'Students were confused about the term "coefficient".', status: 'PENDING' },
    { id: 'f2', lessonId: 'l2', instructorId: 'u1', timestamp: 450, comment: 'Is there a simpler real-world example for negative slope?', status: 'PENDING' },
    { id: 'f3', lessonId: 'l1', instructorId: 'u1', timestamp: 60, comment: 'The whiteboard was out of focus here.', status: 'RESOLVED' }
];