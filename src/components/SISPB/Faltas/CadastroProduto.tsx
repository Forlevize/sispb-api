
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FormDataProduto, Produto, GrupoProduto } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Barcode, Package, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CadastroProduto() {
  const [formData, setFormData] = useState<FormDataProduto>({
    nome: "",
    codigoBarras: "",
    grupo: ""
  });

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [grupos, setGrupos] = useState<GrupoProduto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar produtos e grupos do localStorage na inicialização
  useEffect(() => {
    const produtosSalvos = localStorage.getItem("produtos");
    if (produtosSalvos) {
      setProdutos(JSON.parse(produtosSalvos));
    }

    const gruposSalvos = localStorage.getItem("grupos");
    if (gruposSalvos) {
      setGrupos(JSON.parse(gruposSalvos));
    }
  }, []);

  // Função para salvar produtos no localStorage
  const salvarProdutos = (produtos: Produto[]) => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validação básica
    if (!formData.nome || !formData.codigoBarras) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    // Verificar se o código de barras já existe
    const codigoExistente = produtos.some(p => p.codigoBarras === formData.codigoBarras);
    if (codigoExistente) {
      toast.error("Código de barras já cadastrado!", {
        description: "Este produto já existe no sistema."
      });
      setIsSubmitting(false);
      return;
    }

    // Criar novo produto
    const novoProduto: Produto = {
      id: produtos.length + 1,
      nome: formData.nome,
      codigoBarras: formData.codigoBarras,
      grupo: formData.grupo,
      dataCadastro: new Date().toISOString()
    };

    // Adicionar ao estado e localStorage
    const novosProdutos = [...produtos, novoProduto];
    setProdutos(novosProdutos);
    salvarProdutos(novosProdutos);

    // Limpar formulário
    setFormData({
      nome: "",
      codigoBarras: "",
      grupo: ""
    });

    toast.success("Produto cadastrado com sucesso!");
    setIsSubmitting(false);
  };

  // Filtrar produtos com base no termo de pesquisa
  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    produto.codigoBarras.includes(searchTerm) ||
    (produto.grupo && produto.grupo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Encontrar o nome do grupo pelo id
  const getNomeGrupo = (grupoId: string | undefined) => {
    if (!grupoId) return "-";
    const grupo = grupos.find(g => g.id.toString() === grupoId);
    return grupo ? grupo.nome : "-";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Package className="mr-2 h-5 w-5 text-[#00c6a7]" />
            Cadastro de Novo Produto
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nome do Produto <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Digite o nome do produto"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Código de Barras <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Barcode className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    value={formData.codigoBarras}
                    onChange={(e) => setFormData({...formData, codigoBarras: e.target.value})}
                    placeholder="Digite ou escaneie o código de barras"
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Grupo do Produto
                </label>
                <Select 
                  value={formData.grupo} 
                  onValueChange={(value) => setFormData({...formData, grupo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">- Sem grupo -</SelectItem>
                    {grupos.map((grupo) => (
                      <SelectItem key={grupo.id} value={grupo.id.toString()}>
                        {grupo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#00c6a7] hover:bg-[#00a689]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Produto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Produtos Cadastrados</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Nome do Produto</TableHead>
                  <TableHead>Código de Barras</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((produto, index) => (
                    <TableRow key={produto.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.codigoBarras}</TableCell>
                      <TableCell>{getNomeGrupo(produto.grupo)}</TableCell>
                      <TableCell>
                        {new Date(produto.dataCadastro).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
