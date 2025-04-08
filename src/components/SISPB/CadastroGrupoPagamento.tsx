import { useState } from "react";
import { ArrowLeft, Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface GrupoPagamento {
  id: number;
  nome: string;
  descricao: string;
  prioridade: number;
  ativo: boolean;
}

interface CadastroGrupoPagamentoProps {
  onReturn: () => void;
}

export default function CadastroGrupoPagamento({ onReturn }: CadastroGrupoPagamentoProps) {
  const [tabAtual, setTabAtual] = useState("listagem");
  const [termo, setTermo] = useState("");
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoPagamento | null>(null);
  const [isEditando, setIsEditando] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Dados simulados de grupos de pagamento
  const [grupos, setGrupos] = useState<GrupoPagamento[]>([
    {
      id: 1,
      nome: "Grupo Prioritário",
      descricao: "Fornecedores essenciais que devem ser pagos primeiro",
      prioridade: 1,
      ativo: true
    },
    {
      id: 2,
      nome: "Grupo Secundário",
      descricao: "Fornecedores regulares",
      prioridade: 2,
      ativo: true
    },
    {
      id: 3,
      nome: "Grupo Periférico",
      descricao: "Fornecedores com menos urgência",
      prioridade: 3,
      ativo: false
    },
  ]);
  
  // Formulário de cadastro
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState<number>(3);
  const [ativo, setAtivo] = useState(true);
  
  // Filtrar grupos pelo termo de busca
  const gruposFiltrados = grupos.filter(
    grupo => 
      grupo.nome.toLowerCase().includes(termo.toLowerCase()) ||
      grupo.descricao.toLowerCase().includes(termo.toLowerCase())
  );
  
  const handleCadastrar = () => {
    if (!nome) {
      toast.error("Preencha os campos obrigatórios!", {
        description: "Nome é um campo obrigatório"
      });
      return;
    }
    
    const novoGrupo: GrupoPagamento = {
      id: grupos.length + 1,
      nome,
      descricao,
      prioridade: Number(prioridade),
      ativo
    };
    
    setGrupos([...grupos, novoGrupo]);
    
    // Limpar formulário
    setNome("");
    setDescricao("");
    setPrioridade(3);
    setAtivo(true);
    
    toast.success("Grupo de pagamento cadastrado com sucesso!", {
      description: "Os dados foram salvos no sistema."
    });
    
    setTabAtual("listagem");
  };
  
  const handleEditar = (grupo: GrupoPagamento) => {
    setGrupoSelecionado(grupo);
    setNome(grupo.nome);
    setDescricao(grupo.descricao);
    setPrioridade(grupo.prioridade);
    setAtivo(grupo.ativo);
    setIsEditando(true);
    setTabAtual("cadastro");
  };
  
  const handleSalvarEdicao = () => {
    if (!grupoSelecionado) return;
    
    const gruposAtualizados = grupos.map(g => {
      if (g.id === grupoSelecionado.id) {
        return {
          ...g,
          nome,
          descricao,
          prioridade: Number(prioridade),
          ativo
        };
      }
      return g;
    });
    
    setGrupos(gruposAtualizados);
    
    // Limpar formulário
    setNome("");
    setDescricao("");
    setPrioridade(3);
    setAtivo(true);
    
    setGrupoSelecionado(null);
    setIsEditando(false);
    
    toast.success("Grupo de pagamento atualizado com sucesso!", {
      description: "Os dados foram atualizados no sistema."
    });
    
    setTabAtual("listagem");
  };
  
  const handleExcluir = (id: number) => {
    const gruposAtualizados = grupos.filter(g => g.id !== id);
    setGrupos(gruposAtualizados);
    setDialogOpen(false);
    
    toast.success("Grupo de pagamento excluído com sucesso!");
  };
  
  const handleVisualizarDetalhes = (grupo: GrupoPagamento) => {
    setGrupoSelecionado(grupo);
    setDialogOpen(true);
  };
  
  const getPrioridadeLabel = (prioridade: number) => {
    switch(prioridade) {
      case 1: return "Alta";
      case 2: return "Média";
      case 3: return "Baixa";
      default: return "Indefinida";
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00c6a7] to-[#00a689] p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Grupos de Pagamento</h1>
          <Button 
            onClick={onReturn} 
            className="flex items-center gap-2 bg-[#00c6a7] text-white px-4 py-2 rounded-md hover:bg-[#00a689]"
          >
            <ArrowLeft size={16} /> Voltar
          </Button>
        </div>
      
        <Tabs value={tabAtual} onValueChange={setTabAtual} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="listagem">Listagem</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listagem">
            <div className="flex items-center mb-4 gap-2">
              <Input
                placeholder="Pesquisar grupo..."
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                className="max-w-lg"
              />
              <Button variant="outline" className="shrink-0">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button 
                onClick={() => {
                  setIsEditando(false);
                  setNome("");
                  setDescricao("");
                  setPrioridade(3);
                  setAtivo(true);
                  setTabAtual("cadastro");
                }} 
                className="ml-auto bg-[#00c6a7] hover:bg-[#00a689]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Grupo
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gruposFiltrados.map((grupo) => (
                <Card 
                  key={grupo.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow hover:bg-blue-50 ${!grupo.ativo ? "opacity-60" : ""}`}
                  onClick={() => handleVisualizarDetalhes(grupo)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {grupo.nome}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        grupo.prioridade === 1 ? "bg-red-100 text-red-800" :
                        grupo.prioridade === 2 ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {getPrioridadeLabel(grupo.prioridade)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">{grupo.descricao}</p>
                    <p className="text-sm text-gray-500">
                      Status: {grupo.ativo ? "Ativo" : "Inativo"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {gruposFiltrados.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhum grupo de pagamento encontrado</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle>{isEditando ? "Editar Grupo de Pagamento" : "Novo Grupo de Pagamento"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="nome">Nome*</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Nome do grupo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descrição do grupo"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <select
                      id="prioridade"
                      value={prioridade}
                      onChange={(e) => setPrioridade(Number(e.target.value))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={1}>Alta</option>
                      <option value={2}>Média</option>
                      <option value={3}>Baixa</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 flex items-center gap-2">
                    <Label htmlFor="ativo">Ativo</Label>
                    <Switch 
                      id="ativo" 
                      checked={ativo} 
                      onCheckedChange={setAtivo} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setTabAtual("listagem");
                      setIsEditando(false);
                    }}
                    className="border-[#00c6a7]/20 text-[#00c6a7] hover:bg-[#00c6a7]/10"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={isEditando ? handleSalvarEdicao : handleCadastrar}
                    className="bg-[#00c6a7] hover:bg-[#00a689]"
                  >
                    {isEditando ? "Salvar Alterações" : "Cadastrar Grupo"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{grupoSelecionado?.nome}</DialogTitle>
              <DialogDescription>Detalhes do grupo de pagamento</DialogDescription>
            </DialogHeader>
            
            {grupoSelecionado && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Descrição</h4>
                  <p>{grupoSelecionado.descricao || "Sem descrição"}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Prioridade</h4>
                  <p>{getPrioridadeLabel(grupoSelecionado.prioridade)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Status</h4>
                  <p>{grupoSelecionado.ativo ? "Ativo" : "Inativo"}</p>
                </div>
              </div>
            )}
            
            <DialogFooter className="flex sm:justify-between">
              <Button 
                variant="destructive"
                onClick={() => handleExcluir(grupoSelecionado!.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Fechar
                </Button>
                <Button 
                  className="bg-[#00c6a7] hover:bg-[#00a689]"
                  onClick={() => {
                    setDialogOpen(false);
                    handleEditar(grupoSelecionado!);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
