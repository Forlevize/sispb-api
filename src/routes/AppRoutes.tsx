
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { mainMenuItems, senhaMenuItems } from "../data/menuItems";
import { getMockBoletos, calculaDadosDashboard, calculaGraficoBoletos, calculaRankingFornecedores } from "../utils/dashboardUtils";

// Components
import Login from "@/components/SISPB/Login";
import CadastroOperador from "@/components/SISPB/CadastroOperador";
import CadastroCargos from "@/components/SISPB/CadastroCargos";
import Dashboard from "@/components/SISPB/Dashboard/Dashboard";
import CadastroFornecedor from "@/components/SISPB/CadastroFornecedor";
import CadastroUnidade from "@/components/SISPB/CadastroUnidade";
import CadastroGrupoPagamento from "@/components/SISPB/CadastroGrupoPagamento";
import RegistroLogs from "@/components/SISPB/RegistroLogs";
import Analises from "@/components/SISPB/Analises";
import CadastroBoleto from "@/components/SISPB/CadastroBoleto";
import AlteracaoSenha from "@/components/SISPB/AlteracaoSenha";
import ReseteSenha from "@/components/SISPB/ReseteSenha";
import Faltas from "@/components/SISPB/Faltas/Faltas";
import CotacaoCompras from "@/components/SISPB/Cotacao/CotacaoCompras";
import SalaRepresentantes from "@/components/SISPB/SalaRepresentantes/SalaRepresentantes";
import LogsSystem from "@/components/SISPB/Logs/LogsSystem";
import { toast } from "sonner";

const AppRoutes: React.FC = () => {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [tela, setTela] = useState("menu");
  
  // Get boletos data and calculate dashboard metrics
  const boletos = getMockBoletos();
  const { boletosHoje, valorHoje, boletosAtraso } = calculaDadosDashboard(boletos);
  const dadosBoletos = calculaGraficoBoletos(boletos);
  const dadosFornecedores = calculaRankingFornecedores(boletos);

  const handleCadastrarOperador = () => {
    toast.success("Operador cadastrado com sucesso!", {
      description: "Os dados foram salvos no sistema."
    });
    setTela("menu");
  };

  // Convert menu items to clickable buttons
  const botoesMenu = mainMenuItems.map(item => ({
    nome: item.nome,
    icone: item.icone,
    acao: () => setTela(item.rota)
  }));

  const botoesSenhaMenu = senhaMenuItems.map(item => ({
    nome: item.nome,
    icone: item.icone,
    acao: () => setTela(item.rota)
  }));

  if (!isLoggedIn) {
    return <Login onLogin={login} isLoading={isLoading} />;
  }

  if (isLoggedIn && tela === "operadores") {
    return <CadastroOperador onReturn={() => setTela("menu")} onCadastrar={handleCadastrarOperador} />;
  }

  if (isLoggedIn && tela === "cargos") {
    return <CadastroCargos onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "fornecedores") {
    return <CadastroFornecedor onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "unidades") {
    return <CadastroUnidade onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "grupos") {
    return <CadastroGrupoPagamento onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "registros") {
    return <RegistroLogs onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "analise") {
    return <Analises onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "boletos") {
    return <CadastroBoleto onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "senha_menu") {
    return (
      <Dashboard 
        boletosHoje={boletosHoje}
        valorHoje={valorHoje}
        boletosAtraso={boletosAtraso}
        dadosBoletos={dadosBoletos}
        dadosFornecedores={dadosFornecedores}
        botoesMenu={botoesSenhaMenu}
        onLogout={logout}
        userName={user?.nome}
        lastAccess={user?.ultimo_acesso}
      />
    );
  }

  if (isLoggedIn && tela === "alterar_senha") {
    return <AlteracaoSenha onReturn={() => setTela("senha_menu")} />;
  }

  if (isLoggedIn && tela === "resetar_senha") {
    return <ReseteSenha onReturn={() => setTela("senha_menu")} isAdmin={user?.nivel_acesso === "admin"} />;
  }

  if (isLoggedIn && tela === "faltas") {
    return <Faltas onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "cotacao") {
    return <CotacaoCompras onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "sala_representantes") {
    return <SalaRepresentantes onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "logs") {
    return <LogsSystem onReturn={() => setTela("menu")} />;
  }

  if (isLoggedIn && tela === "menu") {
    return (
      <Dashboard 
        boletosHoje={boletosHoje}
        valorHoje={valorHoje}
        boletosAtraso={boletosAtraso}
        dadosBoletos={dadosBoletos}
        dadosFornecedores={dadosFornecedores}
        botoesMenu={botoesMenu}
        onLogout={logout}
        userName={user?.nome}
        lastAccess={user?.ultimo_acesso}
      />
    );
  }

  return null;
};

export default AppRoutes;
