
// Interfaces for the Faltas (Stock Shortage) system

export interface Produto {
  id: number;
  nome: string;
  codigoBarras: string;
  grupo?: string; // Added group property
  dataCadastro: string;
}

export enum StatusFalta {
  EM_ABERTO = "Em Aberto",
  SOLICITADO = "Solicitado",
  EM_COTACAO = "Em Cotação",
  PEDIDO_REALIZADO = "Pedido Realizado",
  RECEBIDO = "Recebido"
}

export interface Falta {
  id: number;
  produtoId: number;
  produtoNome: string;
  codigoBarras: string;
  quantidadeSolicitada: number;
  quantidadeDisponivel: number;
  operador: string;
  unidade: string;
  dataLancamento: string;
  status: StatusFalta;
}

export interface FiltroFaltas {
  dataInicio: string;
  dataFim: string;
  produto: string;
  unidade: string;
  status: string;
}

export interface FormDataProduto {
  nome: string;
  codigoBarras: string;
  grupo?: string; // Added group property
}

export interface FormDataFalta {
  codigoBarras: string;
  produtoNome: string;
  quantidadeSolicitada: number;
  quantidadeDisponivel: number;
  unidade: string; // Added unit field
}

export interface GrupoProduto {
  id: number;
  nome: string;
  descricao?: string;
  dataCadastro: string;
}

export interface FormDataGrupo {
  nome: string;
  descricao?: string;
}

export interface Unidade {
  id: number;
  nome: string;
  endereco?: string;
  cidade?: string;
  ativo: boolean;
}
