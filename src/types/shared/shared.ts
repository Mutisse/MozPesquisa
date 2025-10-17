// Tipos compartilhados entre todos os stores
export interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'participant' | 'admin';
  institution?: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'suspended';
}

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

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'withdrawal' | 'payment';
  method: 'mpesa' | 'card';
  amount: number;
  status: 'processed' | 'approved' | 'pending';
  date: string;
  surveyId?: string;
  surveyTitle?: string;
}

export interface ParticipantStats {
  userId: string;
  currentBalance: number;
  totalEarned: number;
  ranking: number;
  completedSurveys: number;
}
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

  // Propriedades do criador
  creatorId: string; // ADICIONADO
  creatorName?: string; // ADICIONADO
  creatorInstitution?: string;
  category?: string;
}

export interface ParticipantStats {
  userId: string;
  userName?: string; // ADICIONADO
  currentBalance: number;
  totalEarned: number;
  ranking: number;
  completedSurveys: number;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string; // JÁ EXISTE
  type: 'withdrawal' | 'payment';
  method: 'mpesa' | 'card';
  amount: number;
  status: 'processed' | 'approved' | 'pending';
  date: string;
  surveyId?: string;
  surveyTitle?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'participant' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  registrationDate: string;

  // Propriedades específicas do estudante
  university?: string;
  course?: string;

  // Propriedades específicas do participante
  age?: number;
  province?: string;
  mpesaNumber?: string;

  // Propriedades comuns
  institution?: string;
  activity?: string;
  financials?: string;
}
