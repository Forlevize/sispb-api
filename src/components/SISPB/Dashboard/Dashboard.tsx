
import { ReactNode } from "react";
import Header from "./Header";
import InfoCards from "./InfoCards";
import MenuGrid from "./MenuGrid";
import AnaliseGrafico from "./AnaliseGrafico";
import RankingFornecedores from "./RankingFornecedores";

interface DadosBoleto {
  mes: string;
  pendentes: number;
  pagos: number;
}

interface DadosFornecedor {
  fornecedor: string;
  valor: number;
}

interface MenuItem {
  nome: string;
  icone: ReactNode;
  acao: () => void;
  descricao?: string;
}

interface DashboardProps {
  boletosHoje: number;
  valorHoje: number;
  boletosAtraso: number;
  dadosBoletos: DadosBoleto[];
  dadosFornecedores: DadosFornecedor[];
  botoesMenu: MenuItem[];
  onLogout: () => void;
  userName?: string;
  lastAccess?: string;
}

export default function Dashboard({ 
  boletosHoje, 
  valorHoje, 
  boletosAtraso,
  dadosBoletos,
  dadosFornecedores,
  botoesMenu,
  onLogout,
  userName,
  lastAccess
}: DashboardProps) {
  return (
    <div 
      className="min-h-screen bg-[#00c6a7] bg-cover bg-center p-4 md:p-6" 
      style={{ backgroundImage: "url('/farmacia-fundo.png')" }}
    >
      <Header onLogout={onLogout} userName={userName} lastAccess={lastAccess} />
      
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md bg-blue-500/20 px-3 py-2 rounded-md">Resumo Financeiro</h2>
        <InfoCards 
          boletosHoje={boletosHoje} 
          valorHoje={valorHoje} 
          boletosAtraso={boletosAtraso} 
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 drop-shadow-md bg-blue-500/20 px-3 py-2 rounded-md">Módulos do Sistema</h2>
        <MenuGrid items={botoesMenu} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AnaliseGrafico dados={dadosBoletos} />
        <RankingFornecedores dados={dadosFornecedores} />
      </div>
    </div>
  );
}
