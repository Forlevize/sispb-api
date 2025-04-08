
// Interfaces for the Boleto system

export interface Boleto {
  id: number;
  unidade: string;
  fornecedor: string;
  tipoFornecedor: string;
  grupo: string;
  linhaDigitavel: string;
  referencia: string;
  dataVencimento: string;
  valor: number;
  notaFiscal?: string;
  pago: boolean;
  dataPagamento?: string;
  valorPago?: number;
  paraReembolso: boolean;
  dataLancamento?: string;
  operador?: string;
  anexoImagem?: string;
}

export interface Unidade {
  id: number;
  nome: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
}

export interface GrupoPagamento {
  id: number;
  nome: string;
}

export interface FormDataBoleto {
  unidade: string;
  fornecedor: string;
  tipoFornecedor: string;
  grupo: string;
  linhaDigitavel: string;
  referencia: string;
  dataVencimento: string;
  valor: string;
  notaFiscal: string;
  pago: boolean;
  dataPagamento: string;
  valorPago: string;
  paraReembolso: boolean;
  anexoImagem: string;
}

export interface FiltrosBoleto {
  unidade: string;
  fornecedor: string;
  grupo: string;
  dataInicio: string;
  dataFim: string;
  statusPagamento: string;
  valorMinimo: string;
  valorMaximo: string;
  reembolso: string;
}
