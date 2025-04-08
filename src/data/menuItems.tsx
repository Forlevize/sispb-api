
import React from "react";
import { 
  Shield, 
  UserCheck, 
  FileCheck2, 
  Users, 
  Lock, 
  CreditCard, 
  Building2, 
  FileText, 
  LineChart, 
  ShoppingCart, 
  AlertTriangle,
  ArrowLeft,
  Key,
  MessageSquare,
  FileSignature,
  ClipboardList
} from "lucide-react";

export const mainMenuItems = [
  { nome: "Cargos", icone: <Shield className="w-8 h-8" />, rota: "cargos" },
  { nome: "Operadores", icone: <UserCheck className="w-8 h-8" />, rota: "operadores" },
  { nome: "Central de Documentos", icone: <FileSignature className="w-8 h-8" />, rota: "registros" },
  { nome: "Fornecedores", icone: <Users className="w-8 h-8" />, rota: "fornecedores" },
  { nome: "Senhas", icone: <Lock className="w-8 h-8" />, rota: "senha_menu" },
  { nome: "Boletos", icone: <CreditCard className="w-8 h-8" />, rota: "boletos" },
  { nome: "Unidades", icone: <Building2 className="w-8 h-8" />, rota: "unidades" },
  { nome: "Grupos", icone: <FileText className="w-8 h-8" />, rota: "grupos" },
  { nome: "Análise", icone: <LineChart className="w-8 h-8" />, rota: "analise" },
  { nome: "Cotação de Compras", icone: <ShoppingCart className="w-8 h-8" />, rota: "cotacao" },
  { nome: "Faltas", icone: <AlertTriangle className="w-8 h-8" />, rota: "faltas" },
  { 
    nome: "Sala dos Representantes", 
    icone: <MessageSquare className="w-8 h-8" />, 
    rota: "sala_representantes" 
  },
  { 
    nome: "Logs do Sistema", 
    icone: <ClipboardList className="w-8 h-8" />, 
    rota: "logs" 
  },
];

export const senhaMenuItems = [
  { nome: "Alterar Senha", icone: <Key className="w-8 h-8" />, rota: "alterar_senha" },
  { nome: "Resetar Senha", icone: <Lock className="w-8 h-8" />, rota: "resetar_senha" },
  { nome: "Voltar", icone: <ArrowLeft className="w-8 h-8" />, rota: "menu" },
];
