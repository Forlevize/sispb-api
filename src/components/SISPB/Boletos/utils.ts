
// Utility functions for Boleto management

// Function to interpret the bank slip reference line
export function interpretarLinhaDigitavel(linha: string) {
  const limpa = linha.replace(/[.\\s]/g, "");

  if (limpa.length !== 47 && limpa.length !== 48) {
    return { erro: "Linha digitável inválida" };
  }

  const vencimentoFator = parseInt(limpa.slice(33, 37), 10);
  const valorCentavos = parseInt(limpa.slice(37), 10);

  const dataBase = new Date(1997, 9, 7); // 07/10/1997
  const dataVencimento = new Date(dataBase.getTime() + vencimentoFator * 24 * 60 * 60 * 1000);

  return {
    vencimento: dataVencimento.toLocaleDateString("pt-BR"),
    valor: (valorCentavos / 100).toFixed(2)
  };
}

// Function to filter boletos based on search term and filters
export function filtrarBoletos(boletos, searchTerm, filtros) {
  return boletos.filter(boleto => {
    // Search filter
    const matchSearch = searchTerm === "" || 
      boleto.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boleto.grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boleto.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boleto.linhaDigitavel.includes(searchTerm);
    
    // Specific filters
    const matchUnidade = filtros.unidade === "" || boleto.unidade === filtros.unidade;
    const matchFornecedor = filtros.fornecedor === "" || boleto.fornecedor === filtros.fornecedor;
    const matchGrupo = filtros.grupo === "" || boleto.grupo === filtros.grupo;
    
    // Date filter
    const dataVencimento = new Date(boleto.dataVencimento);
    const matchDataInicio = filtros.dataInicio === "" || dataVencimento >= new Date(filtros.dataInicio);
    const matchDataFim = filtros.dataFim === "" || dataVencimento <= new Date(filtros.dataFim);
    
    // Status filter
    const matchStatus = filtros.statusPagamento === "todos" || 
      (filtros.statusPagamento === "pagos" && boleto.pago) ||
      (filtros.statusPagamento === "pendentes" && !boleto.pago);
    
    // Value filter
    const matchValorMinimo = filtros.valorMinimo === "" || boleto.valor >= parseFloat(filtros.valorMinimo);
    const matchValorMaximo = filtros.valorMaximo === "" || boleto.valor <= parseFloat(filtros.valorMaximo);
    
    // Reimbursement filter
    const matchReembolso = filtros.reembolso === "todos" || 
      (filtros.reembolso === "sim" && boleto.paraReembolso) ||
      (filtros.reembolso === "nao" && !boleto.paraReembolso);
    
    return matchSearch && matchUnidade && matchFornecedor && matchGrupo && 
           matchDataInicio && matchDataFim && matchStatus && 
           matchValorMinimo && matchValorMaximo && matchReembolso;
  });
}

// Function to calculate the total value of boletos
export function calcularValorTotal(boletos) {
  return boletos.reduce((total, boleto) => total + boleto.valor, 0);
}

// Function to format a WhatsApp message with boleto information
export function formatarMensagemWhatsApp(boleto) {
  return {
    mensagem1: `*Informações do Boleto*
Lançado por: ${boleto.operador || "Não informado"}
Unidade: ${boleto.unidade}
Fornecedor: ${boleto.fornecedor}
Data de Lançamento: ${boleto.dataLancamento ? new Date(boleto.dataLancamento).toLocaleDateString('pt-BR') : "Não informada"}
Data de Vencimento: ${new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}
Valor: R$ ${boleto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Status: ${boleto.pago ? "Pago" : "Pendente"}`,
    mensagem2: `*Linha Digitável do Boleto*
${boleto.linhaDigitavel}`
  };
}
