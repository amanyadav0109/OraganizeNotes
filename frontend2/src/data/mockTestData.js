import {
  GraduationCap,
  BookOpen,
  Brain,
  Code2,
  Trophy,
  Target,
  BriefcaseBusiness,
  Atom,
  Stethoscope,
  School,
} from "lucide-react";

export const categories = [
  {
    id: "class-8",
    name: "Class 8",
    description: "Practice school subjects",
    icon: School,
    color: "blue",
  },
  {
    id: "class-9",
    name: "Class 9",
    description: "Build strong fundamentals",
    icon: BookOpen,
    color: "purple",
  },
  {
    id: "class-10",
    name: "Class 10",
    description: "Board exam preparation",
    icon: GraduationCap,
    color: "indigo",
  },
  {
    id: "class-11",
    name: "Class 11",
    description: "Choose your stream and subjects",
    icon: Atom,
    color: "cyan",
  },
  {
    id: "class-12",
    name: "Class 12",
    description: "Prepare for board examinations",
    icon: GraduationCap,
    color: "emerald",
  },
  {
    id: "jee",
    name: "JEE",
    description: "JEE Main and Advanced preparation",
    icon: Brain,
    color: "orange",
  },
  {
    id: "neet",
    name: "NEET",
    description: "Medical entrance preparation",
    icon: Stethoscope,
    color: "rose",
  },
  {
    id: "gate",
    name: "GATE",
    description: "Graduate Aptitude Test preparation",
    icon: Target,
    color: "violet",
  },
  {
    id: "competitive",
    name: "Competitive Exams",
    description: "Prepare for various competitive exams",
    icon: Trophy,
    color: "amber",
  },
  {
    id: "placement",
    name: "Placement Preparation",
    description: "Get ready for technical interviews",
    icon: Code2,
    color: "teal",
  },
];

// Demo subjects
export const subjects = {
  "class-8": [
    { id: "maths", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "english", name: "English" },
    { id: "social-science", name: "Social Science" },
  ],

  "class-9": [
    { id: "maths", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "english", name: "English" },
    { id: "social-science", name: "Social Science" },
  ],

  "class-10": [
    { id: "maths", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "english", name: "English" },
    { id: "social-science", name: "Social Science" },
  ],

  "class-11": [
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "maths", name: "Mathematics" },
    { id: "biology", name: "Biology" },
    { id: "accountancy", name: "Accountancy" },
    { id: "economics", name: "Economics" },
    { id: "business-studies", name: "Business Studies" },
    { id: "history", name: "History" },
    { id: "political-science", name: "Political Science" },
  ],

  "class-12": [
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "maths", name: "Mathematics" },
    { id: "biology", name: "Biology" },
    { id: "accountancy", name: "Accountancy" },
    { id: "economics", name: "Economics" },
    { id: "business-studies", name: "Business Studies" },
    { id: "history", name: "History" },
    { id: "political-science", name: "Political Science" },
  ],

  jee: [
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "maths", name: "Mathematics" },
  ],

  neet: [
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "botany", name: "Botany" },
    { id: "zoology", name: "Zoology" },
  ],

  gate: [
    { id: "engineering-maths", name: "Engineering Mathematics" },
    { id: "dsa", name: "Data Structures & Algorithms" },
    { id: "dbms", name: "DBMS" },
    { id: "os", name: "Operating Systems" },
    { id: "cn", name: "Computer Networks" },
  ],

  competitive: [
    { id: "aptitude", name: "Quantitative Aptitude" },
    { id: "reasoning", name: "Logical Reasoning" },
    { id: "english", name: "English" },
    { id: "general-knowledge", name: "General Knowledge" },
  ],

  placement: [
    { id: "aptitude", name: "Aptitude" },
    { id: "dsa", name: "Data Structures & Algorithms" },
    { id: "java", name: "Java Programming" },
    { id: "sql", name: "SQL" },
    { id: "dbms", name: "DBMS" },
    { id: "os", name: "Operating Systems" },
    { id: "cn", name: "Computer Networks" },
    { id: "interview", name: "Interview Preparation" },
  ],
};

// Temporary test sets. Admin will manage these later.
export const testSets = {
  maths: [
    {
      id: "maths-set-1",
      title: "Mathematics - Set 1",
      description: "Test your basic mathematics knowledge.",
      questions: 20,
      duration: 30,
      difficulty: "Easy",
    },
    {
      id: "maths-set-2",
      title: "Mathematics - Set 2",
      description: "Practice intermediate mathematics.",
      questions: 30,
      duration: 45,
      difficulty: "Medium",
    },
  ],

  physics: [
    {
      id: "physics-set-1",
      title: "Physics - Set 1",
      description: "Test your physics fundamentals.",
      questions: 20,
      duration: 30,
      difficulty: "Easy",
    },
  ],

  chemistry: [
    {
      id: "chemistry-set-1",
      title: "Chemistry - Set 1",
      description: "Practice chemistry questions.",
      questions: 20,
      duration: 30,
      difficulty: "Medium",
    },
  ],

  science: [
    {
      id: "science-set-1",
      title: "Science - Set 1",
      description: "Test your science knowledge.",
      questions: 20,
      duration: 30,
      difficulty: "Easy",
    },
  ],

  english: [
    {
      id: "english-set-1",
      title: "English - Set 1",
      description: "Practice English questions.",
      questions: 20,
      duration: 30,
      difficulty: "Easy",
    },
  ],

  aptitude: [
    {
      id: "aptitude-set-1",
      title: "Aptitude - Set 1",
      description: "Practice quantitative aptitude.",
      questions: 20,
      duration: 30,
      difficulty: "Medium",
    },
  ],

  dsa: [
    {
      id: "dsa-set-1",
      title: "DSA - Set 1",
      description: "Test your data structures knowledge.",
      questions: 20,
      duration: 30,
      difficulty: "Medium",
    },
  ],

  dbms: [
    {
      id: "dbms-set-1",
      title: "DBMS - Set 1",
      description: "Practice database concepts.",
      questions: 20,
      duration: 30,
      difficulty: "Easy",
    },
  ],

  java: [
    {
      id: "java-set-1",
      title: "Java - Set 1",
      description: "Test your Java programming knowledge.",
      questions: 20,
      duration: 30,
      difficulty: "Medium",
    },
  ],

  sql: [
    {
      id: "sql-set-1",
      title: "SQL - Set 1",
      description: "Practice SQL queries and concepts.",
      questions: 20,
      duration: 30,
      difficulty: "Easy",
    },
  ],
};