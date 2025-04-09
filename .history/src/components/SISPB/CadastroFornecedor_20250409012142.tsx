import { useState } from "react";
import { ArrowLeft, Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

// UI Components (supondo que estes componentes estejam configurados no seu projeto)
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
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  
  // Campos do formulário
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [contato, setContato] = useState("");
  
  // Para edição (se necessário)
  const [isEditando, setIsEditando] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filtrar fornecedores (se houver busca)
  const fornecedoresFiltrados = fornecedores.filter(
    f =>
      f.nome.toLowerCase().includes(termo.toLowerCase()) ||
      f.cnpj.includes(termo) ||
      f.email.toLowerCase().includes(termo.toLowerCase())
  );
  
  // Endpoint da API (substitua a URL pelo domínio fornecido pelo Railway)
  const API_URL = "https://sispb-production.up.railway.app/inserir_fornecedor.php"; // Ajuste essa URL conforme necessário

  // Função para cadastrar um fornecedor via API
  const handleCadastrar = async () => {
    if (!nome || !cnpj) {
      toast.error("Preencha os campos obrigatórios!", {
        description: "Nome e CNPJ são obrigatórios.",
      });
      return;
    }
    
    const novoFornecedor = {
      nome,
      cnpj,
      telefone,
      email,
      endereco,
      contato,
    };

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(novoFornecedor),
        mode: "no-cors"

      });
      
      const data = await resposta.json();
      if (data.status === "success") {
        // Atualiza o estado local (opcional)
        setFornecedores([...fornecedores, { id: fornecedores.length + 1, ...novoFornecedor }]);
        toast.success("Fornecedor cadastrado com sucesso!");
        // Limpar os campos
        setNome("");
        setCnpj("");
        setTelefone("");
        setEmail("");
        setEndereco("");
        setContato("");
        setTabAtual("listagem");
      } else {
        toast.error("Falha ao cadastrar o fornecedor: " + data.message);
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro inesperado ao cadastrar fornecedor.");
    }
  };

  // (Funções handleEditar, handleSalvarEdicao, handleExcluir e handleVisualizarDetalhes
  // podem permanecer ou ser ajustadas conforme sua necessidade.)
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00c6a7] to-[#00a689] p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Fornecedores</h1>
          <Button onClick={onReturn} className="flex items-center gap-2 bg-[#00c6a7] text-white px-4 py-2 rounded-md hover:bg-[#00a689]">
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
                <Search className="h-4 w-4 mr-2" /> Buscar
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
                <Plus className="h-4 w-4 mr-2" /> Novo Fornecedor
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fornecedoresFiltrados.map((fornecedor) => (
                <Card
                  key={fornecedor.id}
                  className="cursor-pointer hover:shadow-md hover:bg-blue-50 transition-shadow"
                  onClick={() => {
                    // Aqui você pode implementar visualização de detalhes
                  }}
                >
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
                    onClick={handleCadastrar}
                    className="bg-[#00c6a7] hover:bg-[#00a689]"
                  >
                    Cadastrar Fornecedor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
