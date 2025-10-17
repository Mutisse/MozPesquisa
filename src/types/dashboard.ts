export interface Survey {
  id: string;
  title: string;
  description?: string;
  createdDate: string;
  responses: number;
  target: number;
  reward: number;
  status: 'active' | 'completed' | 'draft';
  googleFormLink?: string;
  targetAudience?: string;
  duration?: string;
  requirements?: string;
  creator?: string;
  creatorInstitution?: string;
}

export interface AvailableSurvey {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorInstitution: string;
  reward: number;
  duration: string;
  requirements: string;
  payment: number;
}

export interface ParticipantStats {
  currentBalance: number;
  totalEarned: number;
  ranking: number;
  availableSurveys: number;
}

export interface Ranking {
  name: string;
  earnings: number;
  position: number;
}

export interface TransactionHistory {
  id: string;
  surveyTitle: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
}

export interface DashboardStats {
  completionRate: number;
  averageTime: string;
  satisfaction: number;
}

export interface NewSurveyData {
  title: string;
  googleFormLink: string;
  targetResponses: number;
  reward: number;
  targetAudience: string;
}

export interface AdminStats {
  totalUsers: number;
  activeSurveys: number;
  transactionVolume: number;
  monthlyGrowth: number;
  pendingApprovals: number;
  systemHealth: number;
}

export interface Transaction {
  id: string;
  userName: string;
  type: 'withdrawal' | 'payment';
  method: 'mpesa' | 'card';
  amount: number;
  status: 'processed' | 'approved' | 'pending';
  date: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  institution: string;
  type: 'student' | 'participant' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  registrationDate: string;
  activity: string;
  financials: string;
}

// CORREÇÃO: Remover duplicações e manter apenas UMA definição
export interface MonthlyStat {
  month: string;
  surveys: number;
  revenue: number;
}

export interface SystemReport {
  monthlyStats: MonthlyStat[];
  completionRate: number;
  averageSatisfaction: number;
  totalRevenue: number;
}