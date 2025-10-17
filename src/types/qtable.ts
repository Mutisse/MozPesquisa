// Tipos genéricos para QTable
export interface QTableColumn<T = unknown> {
  name: string;
  label: string;
  field: string | ((row: T) => unknown);
  required?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sort?: (a: unknown, b: unknown, rowA: T, rowB: T) => number;
  format?: (val: unknown, row: T) => unknown;
  style?: string | ((row: T) => string);
  classes?: string | ((row: T) => string);
  headerStyle?: string;
  headerClasses?: string;
}

// Tipos específicos para as tabelas do sistema

// Colunas para tabela de usuários (Admin)
export interface SystemUserColumn {
  id: string;
  name: string;
  email: string;
  institution: string;
  type: 'student' | 'participant' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  activity: string;
  financials: string;
  registrationDate: string;
}

// Colunas para tabela de pesquisas (Estudante)
export interface SurveyColumn {
  id: string;
  title: string;
  createdDate: string;
  responses: number;
  target: number;
  reward: number;
  status: 'active' | 'completed' | 'draft';
  googleFormLink?: string;
  targetAudience?: string;
}

// Colunas para tabela de transações (Admin/Participante)
export interface TransactionColumn {
  id: string;
  userName: string;
  type: 'withdrawal' | 'payment';
  method: 'mpesa' | 'card';
  amount: number;
  status: 'processed' | 'approved' | 'pending';
  date: string;
  surveyTitle?: string;
}

// Colunas para tabela de pesquisas disponíveis (Participante)
export interface AvailableSurveyColumn {
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

// Helper types para funções comuns
export type SortFunction<T> = (a: unknown, b: unknown, rowA: T, rowB: T) => number;
export type FormatFunction<T> = (val: unknown, row: T) => unknown;
export type StyleFunction<T> = (row: T) => string;