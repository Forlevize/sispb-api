
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  contato: string;
}

interface CadastroFornecedorProps {
  onReturn: () => void;
}

export default function CadastroFornecedor({ onReturn }: CadastroFornecedorProps) {
  const [tabAtual, setTabAtual] = useState("listagem");
  const [termo, setTermo] = useState("");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [isEditando, setIsEditando] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Dados simulados de fornecedores
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    {
      id: 1,
      nome: "Laboratório Médico LTDA",
      cnpj: "12.345.678/0001-90",
      telefone: "(11) 1234-5678",
      email: "contato@laboratorio.com",
      endereco: "Rua das Amostras, 123",
      contato: "Dr. Silva"
    },
    {
      id: 2,
      nome: "Distribuidora Farmacêutica S/A",
      cnpj: "98.765.432/0001-10",
      telefone: "(11) 9876-5432",
      email: "comercial@distribuidora.com",
      endereco: "Av. dos Remédios, 456",
      contato: "Maria Santos"
    },
  ]);
  
  // Formulário de cadastro
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [contato, setContato] = useState("");
  
  // Filtrar fornecedores pelo termo de busca
  const fornecedoresFiltrados = fornecedores.filter(
    fornecedor => 
      fornecedor.nome.toLowerCase().includes(termo.toLowerCase()) ||
      fornecedor.cnpj.includes(termo) ||
      fornecedor.email.toLowerCase().includes(termo.toLowerCase())
  );
  
  const handleCadastrar = () => {
    if (!nome || !cnpj) {
      toast.error("Preencha os campos obrigatórios!", {
        description: "Nome e CNPJ são campos obrigatórios"
      });
      return;
    }
    
    const novoFornecedor: Fornecedor = {
      id: fornecedores.length + 1,
      nome,
      cnpj,
      telefone,
      email,
      endereco,
      contato
    };
    
    setFornecedores([...fornecedores, novoFornecedor]);
    
    // Limpar formulário
    setNome("");
    setCnpj("");
    setTelefone("");
    setEmail("");
    setEndereco("");
    setContato("");
    
    toast.success("Fornecedor cadastrado com sucesso!", {
      description: "Os dados foram salvos no sistema."
    });
    
    setTabAtual("listagem");
  };
  
  const handleEditar = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setNome(fornecedor.nome);
    setCnpj(fornecedor.cnpj);
    setTelefone(fornecedor.telefone);
    setEmail(fornecedor.email);
    setEndereco(fornecedor.endereco);
    setContato(fornecedor.contato);
    setIsEditando(true);
    setTabAtual("cadastro");
  };
  
  const handleSalvarEdicao = () => {
    if (!fornecedorSelecionado) return;
    
    const fornecedoresAtualizados = fornecedores.map(f => {
      if (f.id === fornecedorSelecionado.id) {
        return {
          ...f,
          nome,
          cnpj,
          telefone,
          email,
          endereco,
          contato
        };
      }
      return f;
    });
    
    setFornecedores(fornecedoresAtualizados);
    
    // Limpar formulário
    setNome("");
    setCnpj("");
    setTelefone("");
    setEmail("");
    setEndereco("");
    setContato("");
    
    setFornecedorSelecionado(null);
    setIsEditando(false);
    
    toast.success("Fornecedor atualizado com sucesso!", {
      description: "Os dados foram atualizados no sistema."
    });
    
    setTabAtual("listagem");
  };
  
  const handleExcluir = (id: number) => {
    const fornecedoresAtualizados = fornecedores.filter(f => f.id !== id);
    setFornecedores(fornecedoresAtualizados);
    setDialogOpen(false);
    
    toast.success("Fornecedor excluído com sucesso!");
  };
  
  const handleVisualizarDetalhes = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00c6a7] to-[#00a689] p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Fornecedores</h1>
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
                placeholder="Pesquisar fornecedor..."
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
                  setTelefone("");
                  setEmail("");
                  setEndereco("");
                  setContato("");
                  setTabAtual("cadastro");
                }} 
                className="ml-auto bg-[#00c6a7] hover:bg-[#00a689]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fornecedoresFiltrados.map((fornecedor) => (
                <Card key={fornecedor.id} className="cursor-pointer hover:shadow-md hover:bg-blue-50 transition-shadow" onClick={() => handleVisualizarDetalhes(fornecedor)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">CNPJ: {fornecedor.cnpj}</p>
                    <p className="text-sm text-gray-500">Telefone: {fornecedor.telefone}</p>
                    <p className="text-sm text-gray-500">Email: {fornecedor.email}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {fornecedoresFiltrados.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhum fornecedor encontrado</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle>{isEditando ? "Editar Fornecedor" : "Novo Fornecedor"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome*</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Nome do fornecedor"
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@fornecedor.com"
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Endereço completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contato">Contato Principal</Label>
                    <Input
                      id="contato"
                      value={contato}
                      onChange={(e) => setContato(e.target.value)}
                      placeholder="Nome do contato"
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
                    {isEditando ? "Salvar Alterações" : "Cadastrar Fornecedor"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{fornecedorSelecionado?.nome}</DialogTitle>
              <DialogDescription>Detalhes do fornecedor</DialogDescription>
            </DialogHeader>
            
            {fornecedorSelecionado && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">CNPJ</h4>
                  <p>{fornecedorSelecionado.cnpj}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Contato</h4>
                  <p>{fornecedorSelecionado.telefone}</p>
                  <p>{fornecedorSelecionado.email}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Endereço</h4>
                  <p>{fornecedorSelecionado.endereco}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Pessoa de Contato</h4>
                  <p>{fornecedorSelecionado.contato}</p>
                </div>
              </div>
            )}
            
            <DialogFooter className="flex sm:justify-between">
              <Button 
                variant="destructive"
                onClick={() => handleExcluir(fornecedorSelecionado!.id)}
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
                    handleEditar(fornecedorSelecionado!);
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
