
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GrupoProduto, FormDataGrupo } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Tags, Trash2, FileEdit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

export default function CadastroGrupo() {
  const [formData, setFormData] = useState<FormDataGrupo>({
    nome: "",
    descricao: ""
  });

  const [grupos, setGrupos] = useState<GrupoProduto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<GrupoProduto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Carregar grupos do localStorage na inicialização
  useEffect(() => {
    const gruposSalvos = localStorage.getItem("grupos");
    if (gruposSalvos) {
      setGrupos(JSON.parse(gruposSalvos));
    }
  }, []);

  // Função para salvar grupos no localStorage
  const salvarGrupos = (grupos: GrupoProduto[]) => {
    localStorage.setItem("grupos", JSON.stringify(grupos));
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: ""
    });
    setEditingGrupo(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validação básica
    if (!formData.nome) {
      toast.error("Por favor, preencha o nome do grupo.");
      setIsSubmitting(false);
      return;
    }

    if (editingGrupo) {
      // Atualizar grupo existente
      const gruposAtualizados = grupos.map(grupo => 
        grupo.id === editingGrupo.id 
          ? { 
              ...grupo, 
              nome: formData.nome, 
              descricao: formData.descricao 
            } 
          : grupo
      );
      
      setGrupos(gruposAtualizados);
      salvarGrupos(gruposAtualizados);
      toast.success("Grupo atualizado com sucesso!");
    } else {
      // Verificar se o nome do grupo já existe
      const nomeExistente = grupos.some(g => g.nome.toLowerCase() === formData.nome.toLowerCase());
      if (nomeExistente) {
        toast.error("Este nome de grupo já está cadastrado!");
        setIsSubmitting(false);
        return;
      }

      // Criar novo grupo
      const novoGrupo: GrupoProduto = {
        id: grupos.length > 0 ? Math.max(...grupos.map(g => g.id)) + 1 : 1,
        nome: formData.nome,
        descricao: formData.descricao,
        dataCadastro: new Date().toISOString()
      };

      // Adicionar ao estado e localStorage
      const novosGrupos = [...grupos, novoGrupo];
      setGrupos(novosGrupos);
      salvarGrupos(novosGrupos);
      toast.success("Grupo cadastrado com sucesso!");
    }

    // Limpar formulário
    resetForm();
    setIsSubmitting(false);
  };

  const handleEdit = (grupo: GrupoProduto) => {
    setEditingGrupo(grupo);
    setFormData({
      nome: grupo.nome,
      descricao: grupo.descricao
    });
  };

  const handleDelete = (id: number) => {
    setIsDialogOpen(true);
    const grupoToDelete = grupos.find(g => g.id === id);
    if (grupoToDelete) {
      setEditingGrupo(grupoToDelete);
    }
  };

  const confirmDelete = () => {
    if (editingGrupo) {
      const novosGrupos = grupos.filter(g => g.id !== editingGrupo.id);
      setGrupos(novosGrupos);
      salvarGrupos(novosGrupos);
      toast.success("Grupo excluído com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    }
  };

  // Filtrar grupos com base no termo de pesquisa
  const gruposFiltrados = grupos.filter(grupo => 
    grupo.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (grupo.descricao && grupo.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Tags className="mr-2 h-5 w-5 text-[#00c6a7]" />
            {editingGrupo ? "Editar Grupo" : "Cadastro de Novo Grupo"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nome do Grupo <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Digite o nome do grupo (ex: Ético, Genérico)"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea 
                  value={formData.descricao || ""}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Digite uma breve descrição (opcional)"
                  className="min-h-[80px]"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              {editingGrupo && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#00c6a7] hover:bg-[#00a689]"
              >
                <Plus className="mr-2 h-4 w-4" />
                {editingGrupo ? "Atualizar Grupo" : "Cadastrar Grupo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Grupos Cadastrados</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar grupos..."
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
                  <TableHead>Nome do Grupo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gruposFiltrados.length > 0 ? (
                  gruposFiltrados.map((grupo, index) => (
                    <TableRow key={grupo.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{grupo.nome}</TableCell>
                      <TableCell>{grupo.descricao || "-"}</TableCell>
                      <TableCell>
                        {new Date(grupo.dataCadastro).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(grupo)}
                            className="h-8 w-8 p-0"
                          >
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(grupo.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      {searchTerm ? "Nenhum grupo encontrado" : "Nenhum grupo cadastrado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Tem certeza que deseja excluir o grupo "{editingGrupo?.nome}"? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
