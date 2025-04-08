
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

interface Unidade {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  responsavel: string;
  observacoes: string;
}

interface CadastroUnidadeProps {
  onReturn: () => void;
}

export default function CadastroUnidade({ onReturn }: CadastroUnidadeProps) {
  const [tabAtual, setTabAtual] = useState("listagem");
  const [termo, setTermo] = useState("");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | null>(null);
  const [isEditando, setIsEditando] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Dados simulados de unidades
  const [unidades, setUnidades] = useState<Unidade[]>([
    {
      id: 1,
      nome: "Farmácia Preço Baixo - Centro",
      cnpj: "12.345.678/0001-90",
      endereco: "Av. Central, 123 - Centro",
      telefone: "(11) 1234-5678",
      responsavel: "João Silva",
      observacoes: "Unidade principal da rede"
    },
    {
      id: 2,
      nome: "Farmácia Preço Baixo - Sul",
      cnpj: "12.345.678/0002-71",
      endereco: "Rua das Flores, 456 - Zona Sul",
      telefone: "(11) 9876-5432",
      responsavel: "Maria Oliveira",
      observacoes: "Unidade com atendimento 24h"
    },
  ]);
  
  // Formulário de cadastro
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");
  
  // Filtrar unidades pelo termo de busca
  const unidadesFiltradas = unidades.filter(
    unidade => 
      unidade.nome.toLowerCase().includes(termo.toLowerCase()) ||
      unidade.cnpj.includes(termo) ||
      unidade.endereco.toLowerCase().includes(termo.toLowerCase())
  );
  
  const handleCadastrar = () => {
    if (!nome || !cnpj || !endereco) {
      toast.error("Preencha os campos obrigatórios!", {
        description: "Nome, CNPJ e Endereço são campos obrigatórios"
      });
      return;
    }
    
    const novaUnidade: Unidade = {
      id: unidades.length + 1,
      nome,
      cnpj,
      endereco,
      telefone,
      responsavel,
      observacoes
    };
    
    setUnidades([...unidades, novaUnidade]);
    
    // Limpar formulário
    setNome("");
    setCnpj("");
    setEndereco("");
    setTelefone("");
    setResponsavel("");
    setObservacoes("");
    
    toast.success("Unidade cadastrada com sucesso!", {
      description: "Os dados foram salvos no sistema."
    });
    
    setTabAtual("listagem");
  };
  
  const handleEditar = (unidade: Unidade) => {
    setUnidadeSelecionada(unidade);
    setNome(unidade.nome);
    setCnpj(unidade.cnpj);
    setEndereco(unidade.endereco);
    setTelefone(unidade.telefone);
    setResponsavel(unidade.responsavel);
    setObservacoes(unidade.observacoes);
    setIsEditando(true);
    setTabAtual("cadastro");
  };
  
  const handleSalvarEdicao = () => {
    if (!unidadeSelecionada) return;
    
    const unidadesAtualizadas = unidades.map(u => {
      if (u.id === unidadeSelecionada.id) {
        return {
          ...u,
          nome,
          cnpj,
          endereco,
          telefone,
          responsavel,
          observacoes
        };
      }
      return u;
    });
    
    setUnidades(unidadesAtualizadas);
    
    // Limpar formulário
    setNome("");
    setCnpj("");
    setEndereco("");
    setTelefone("");
    setResponsavel("");
    setObservacoes("");
    
    setUnidadeSelecionada(null);
    setIsEditando(false);
    
    toast.success("Unidade atualizada com sucesso!", {
      description: "Os dados foram atualizados no sistema."
    });
    
    setTabAtual("listagem");
  };
  
  const handleExcluir = (id: number) => {
    const unidadesAtualizadas = unidades.filter(u => u.id !== id);
    setUnidades(unidadesAtualizadas);
    setDialogOpen(false);
    
    toast.success("Unidade excluída com sucesso!");
  };
  
  const handleVisualizarDetalhes = (unidade: Unidade) => {
    setUnidadeSelecionada(unidade);
    setDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00c6a7] to-[#00a689] p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Unidades</h1>
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
                placeholder="Pesquisar unidade..."
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
                  setCnpj("");
                  setEndereco("");
                  setTelefone("");
                  setResponsavel("");
                  setObservacoes("");
                  setTabAtual("cadastro");
                }} 
                className="ml-auto bg-[#00c6a7] hover:bg-[#00a689]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Unidade
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unidadesFiltradas.map((unidade) => (
                <Card key={unidade.id} className="cursor-pointer hover:shadow-md hover:bg-blue-50 transition-shadow" onClick={() => handleVisualizarDetalhes(unidade)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{unidade.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">CNPJ: {unidade.cnpj}</p>
                    <p className="text-sm text-gray-500">Endereço: {unidade.endereco}</p>
                    <p className="text-sm text-gray-500">Responsável: {unidade.responsavel}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {unidadesFiltradas.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhuma unidade encontrada</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle>{isEditando ? "Editar Unidade" : "Nova Unidade"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome*</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Nome da unidade"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ*</Label>
                    <Input
                      id="cnpj"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="endereco">Endereço*</Label>
                    <Input
                      id="endereco"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Endereço completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input
                      id="responsavel"
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      placeholder="Nome do responsável"
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Observações sobre a unidade"
                      rows={3}
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
                    {isEditando ? "Salvar Alterações" : "Cadastrar Unidade"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{unidadeSelecionada?.nome}</DialogTitle>
              <DialogDescription>Detalhes da unidade</DialogDescription>
            </DialogHeader>
            
            {unidadeSelecionada && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">CNPJ</h4>
                  <p>{unidadeSelecionada.cnpj}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Endereço</h4>
                  <p>{unidadeSelecionada.endereco}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Contato</h4>
                  <p>{unidadeSelecionada.telefone}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Responsável</h4>
                  <p>{unidadeSelecionada.responsavel}</p>
                </div>
                
                {unidadeSelecionada.observacoes && (
                  <div>
                    <h4 className="font-semibold">Observações</h4>
                    <p>{unidadeSelecionada.observacoes}</p>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="flex sm:justify-between">
              <Button 
                variant="destructive"
                onClick={() => handleExcluir(unidadeSelecionada!.id)}
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
                    handleEditar(unidadeSelecionada!);
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
