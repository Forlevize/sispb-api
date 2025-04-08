
// Define a interface para boletos
export interface Boleto {
  fornecedor: string;
  vencimento: string;
  valor: number;
  status: string;
}

export const getMockBoletos = (): Boleto[] => {
  const hoje = new Date();
  
  const boletosMock: Boleto[] = [
    { fornecedor: "Laboratório A", vencimento: hoje.toISOString().split("T")[0], valor: 250.50, status: "Pendente" },
    { fornecedor: "Laboratório A", vencimento: hoje.toISOString().split("T")[0], valor: 300.00, status: "Pendente" },
    { fornecedor: "Fornecedor B", vencimento: "2025-04-06", valor: 120.00, status: "Pendente" },
    { fornecedor: "Fornecedor C", vencimento: "2025-04-01", valor: 100.00, status: "Pago" },
    { fornecedor: "Fornecedor D", vencimento: "2025-03-28", valor: 200.00, status: "Pendente" },
    { fornecedor: "Fornecedor C", vencimento: "2025-05-05", valor: 400.00, status: "Pendente" },
    { fornecedor: "Laboratório A", vencimento: "2025-06-01", valor: 150.00, status: "Pendente" },
    { fornecedor: "Fornecedor B", vencimento: "2025-02-15", valor: 300.00, status: "Pago" },
    { fornecedor: "Fornecedor C", vencimento: "2025-03-10", valor: 100.00, status: "Pago" },
    { fornecedor: "Fornecedor D", vencimento: "2025-05-20", valor: 500.00, status: "Pendente" },
  ];
  
  return boletosMock;
};

export const formatDateForComparison = (dateString: string) => {
  // Format to YYYY-MM-DD for comparison
  return dateString.split('T')[0];
};

export const calculaDadosDashboard = (boletos: Boleto[]) => {
  const hoje = new Date();
  const formattedHoje = hoje.toISOString().split('T')[0];
  
  // Filter boletos for today
  const boletosHoje = boletos.filter(b => formatDateForComparison(b.vencimento) === formattedHoje).length;
  
  // Calculate total value of boletos due today
  const valorHoje = boletos
    .filter(b => formatDateForComparison(b.vencimento) === formattedHoje)
    .reduce((acc, b) => acc + b.valor, 0);
  
  // Count overdue boletos (vencimento < today && not paid)
  const boletosAtraso = boletos
    .filter(b => {
      const boletoDate = new Date(b.vencimento);
      return boletoDate < hoje && b.status !== "Pago";
    })
    .length;

  return {
    boletosHoje,
    valorHoje,
    boletosAtraso
  };
};

export const calculaGraficoBoletos = (boletos: Boleto[]) => {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth();
  const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const intervalo = [-2, -1, 0, 1, 2];
  
  const dadosBoletos = intervalo.map(offset => {
    const dataRef = new Date(anoAtual, mesAtual + offset, 1);
    const mes = nomesMeses[dataRef.getMonth()];
    
    const pendentes = boletos
      .filter(b => {
        const dataBoleto = new Date(b.vencimento);
        return dataBoleto.getMonth() === dataRef.getMonth() && 
               dataBoleto.getFullYear() === dataRef.getFullYear() && 
               b.status === "Pendente";
      })
      .reduce((total, b) => total + b.valor, 0);
      
    const pagos = boletos
      .filter(b => {
        const dataBoleto = new Date(b.vencimento);
        return dataBoleto.getMonth() === dataRef.getMonth() && 
               dataBoleto.getFullYear() === dataRef.getFullYear() && 
               b.status === "Pago";
      })
      .reduce((total, b) => total + b.valor, 0);
      
    return { mes, pendentes, pagos };
  });

  return dadosBoletos;
};

export const calculaRankingFornecedores = (boletos: Boleto[]) => {
  const fornecedoresTotais = boletos.reduce((acc, boleto) => {
    acc[boleto.fornecedor] = (acc[boleto.fornecedor] || 0) + boleto.valor;
    return acc;
  }, {} as Record<string, number>);
  
  const dadosFornecedores = Object.entries(fornecedoresTotais).map(([fornecedor, valor]) => ({ 
    fornecedor, 
    valor 
  }));

  return dadosFornecedores;
};
