
// General types used across SISPB components

// Document Types
export type DocumentType = {
  id: number;
  titulo: string;
  tipo: string;
  data: string;
  departamento: string;
  assunto: string;
  status: string;
  conteudo: string;
  urgencia: 'alta' | 'média' | 'baixa';
};

export type CienciaStatus = 'pendente' | 'assinado';

// BidItem Types
export type BidItem = {
  id: number;
  productName: string;
  batch: string;
  unit: string;
  status: 'won' | 'lost';
  victoryDate: string;
  unitPrice?: number;
  quantity?: number;
  totalValue?: number;
};

// OngoingQuotation Types
export type OngoingQuotation = {
  id: number;
  title: string;
  unit: string;
  dueDate: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    unit: string;
  }[];
  status: 'open' | 'sent' | 'closed';
};

// Dashboard stats
export type RepresentanteStats = {
  totalQuotations: number;
  wonQuotations: number;
  pendingQuotations: number;
  participationRate: number;
  recentResults: {
    won: number;
    lost: number;
    pending: number;
  };
};

// Log Types
export type LogEntry = {
  id: number;
  usuario: string;
  usuarioId: number;
  acao: string;
  descricao: string;
  ip: string;
  data: string;
  modulo: string;
};

// User Monitoring Types
export type UserActivity = {
  usuarioId: number;
  nome: string;
  email: string;
  ultimoAcesso: string;
  totalAcoes: number;
  nivelAcesso: string;
  ultimaAcao: string;
  status: 'online' | 'offline' | 'inativo';
};

export type UserFilter = {
  nivelAcesso?: string;
  status?: 'online' | 'offline' | 'inativo';
  periodo?: 'hoje' | 'semana' | 'mes' | 'personalizado';
  dataInicio?: string;
  dataFim?: string;
};

export type LogFilter = {
  usuario?: string;
  acao?: string;
  modulo?: string;
  periodo?: 'hoje' | 'semana' | 'mes' | 'personalizado';
  dataInicio?: string;
  dataFim?: string;
};
