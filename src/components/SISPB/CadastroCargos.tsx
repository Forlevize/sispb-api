import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Shield, ShieldCheck, ShieldAlert, Pencil, PlusCircle, Eye } from "lucide-react";
import { toast } from "sonner";

interface Cargo {
  id: number;
  nome: string;
  nivel_acesso: 'admin' | 'financeiro' | 'farmaceutico' | 'balconista_i' | 'balconista_ii';
  descricao: string;
  permissoes: {
    boletos: boolean;
    operadores: boolean;
    registros: boolean;
    fornecedores: boolean;
    senhas: boolean;
    pagamentos: boolean;
    unidades: boolean;
    grupos: boolean;
    analise: boolean;
    cargos: boolean;
  };
}

interface CadastroCargoProps {
  onReturn: () => void;
}

export default function CadastroCargos({ onReturn }: CadastroCargoProps) {
  const [activeView, setActiveView] = useState<"cadastro" | "listagem">("listagem");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCargo, setEditedCargo] = useState<Cargo | null>(null);

  const [cargos, setCargos] = useState<Cargo[]>([
    {
      id: 1,
      nome: "Administrador",
      nivel_acesso: "admin",
      descricao: "Acesso total ao sistema",
      permissoes: {
        boletos: true,
        operadores: true,
        registros: true,
        fornecedores: true,
        senhas: true,
        pagamentos: true,
        unidades: true,
        grupos: true,
        analise: true,
        cargos: true
      }
    },
    {
      id: 2,
      nome: "Financeiro",
      nivel_acesso: "financeiro",
      descricao: "Acesso à gestão financeira",
      permissoes: {
        boletos: true,
        operadores: false,
        registros: true,
        fornecedores: true,
        senhas: false,
        pagamentos: true,
        unidades: false,
        grupos: true,
        analise: true,
        cargos: false
      }
    },
    {
      id: 3,
      nome: "Farmacêutico",
      nivel_acesso: "farmaceutico",
      descricao: "Acesso às funções farmacêuticas",
      permissoes: {
        boletos: false,
        operadores: false,
        registros: true,
        fornecedores: true,
        senhas: false,
        pagamentos: false,
        unidades: true,
        grupos: false,
        analise: false,
        cargos: false
      }
    },
    {
      id: 4,
      nome: "Balconista Nível I",
      nivel_acesso: "balconista_i",
      descricao: "Acesso básico ao sistema",
      permissoes: {
        boletos: false,
        operadores: false,
        registros: false,
        fornecedores: false,
        senhas: false,
        pagamentos: false,
        unidades: false,
        grupos: false,
        analise: false,
        cargos: false
      }
    },
    {
      id: 5,
      nome: "Balconista Nível II",
      nivel_acesso: "balconista_ii",
      descricao: "Acesso intermediário ao sistema",
      permissoes: {
        boletos: false,
        operadores: false,
        registros: true,
        fornecedores: false,
        senhas: false,
        pagamentos: false,
        unidades: false,
        grupos: false,
        analise: false,
        cargos: false
      }
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cargo cadastrado com sucesso!");
    setActiveView("listagem");
  };

  const handleCargoClick = (cargo: Cargo) => {
    setSelectedCargo(cargo);
    setEditedCargo({...cargo});
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditMode = () => {
    setIsEditing(true);
  };

  const handleViewMode = () => {
    setIsEditing(false);
    setEditedCargo({...selectedCargo!});
  };

  const handleInputChange = (field: keyof Cargo, value: any) => {
    if (editedCargo) {
      setEditedCargo({
        ...editedCargo,
        [field]: value
      });
    }
  };

  const handlePermissionChange = (permission: keyof Cargo['permissoes'], value: boolean) => {
    if (editedCargo) {
      setEditedCargo({
        ...editedCargo,
        permissoes: {
          ...editedCargo.permissoes,
          [permission]: value
        }
      });
    }
  };

  const handleSaveChanges = () => {
    if (editedCargo) {
      setCargos(cargos.map(c => 
        c.id === editedCargo.id ? editedCargo : c
      ));
      
      setSelectedCargo(editedCargo);
      
      setIsEditing(false);
      toast.success("Cargo atualizado com sucesso!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00c6a7] to-[#00a689] p-4 md:p-6">
      <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-[#00c6a7] mr-2" />
            <h2 className="text-xl font-bold text-[#00a689]">
              {activeView === "cadastro" ? "Cadastro de Cargo" : "Listagem de Cargos"}
            </h2>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={activeView === "cadastro" ? "default" : "outline"} 
              onClick={() => setActiveView("cadastro")}
              className={activeView === "cadastro" ? "bg-[#00c6a7] hover:bg-[#00a689]" : "border-[#00c6a7] text-[#00a689] hover:bg-[#e6f7f4]"}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Cadastrar
            </Button>
            <Button 
              variant={activeView === "listagem" ? "default" : "outline"} 
              onClick={() => setActiveView("listagem")}
              className={activeView === "listagem" ? "bg-[#00c6a7] hover:bg-[#00a689]" : "border-[#00c6a7] text-[#00a689] hover:bg-[#e6f7f4]"}
            >
              <Shield className="w-4 h-4 mr-1" />
              Listar
            </Button>
          </div>
        </div>

        {activeView === "cadastro" ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nome do Cargo</label>
                <Input placeholder="Ex: Gerente" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nível de Acesso</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o nível de acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="farmaceutico">Farmacêutico</SelectItem>
                    <SelectItem value="balconista_i">Balconista Nível I</SelectItem>
                    <SelectItem value="balconista_ii">Balconista Nível II</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">Descrição</label>
                <Input placeholder="Descreva as funções deste cargo" />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Permissões do Sistema</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-boletos" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-boletos" className="text-sm text-gray-700">Boletos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-operadores" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-operadores" className="text-sm text-gray-700">Operadores</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-registros" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-registros" className="text-sm text-gray-700">Registros</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-fornecedores" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-fornecedores" className="text-sm text-gray-700">Fornecedores</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-senhas" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-senhas" className="text-sm text-gray-700">Senhas</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-pagamentos" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-pagamentos" className="text-sm text-gray-700">Pagamentos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-unidades" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-unidades" className="text-sm text-gray-700">Unidades</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-grupos" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-grupos" className="text-sm text-gray-700">Grupos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-analise" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-analise" className="text-sm text-gray-700">Análise</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm-cargos" className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" />
                  <label htmlFor="perm-cargos" className="text-sm text-gray-700">Cargos</label>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start mb-6">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                O cadastro de cargos define quais módulos cada operador do sistema poderá acessar, de acordo com sua função.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={onReturn}
                className="border-[#00c6a7] text-[#00a689] hover:bg-[#e6f7f4]"
              >
                Retornar ao Menu
              </Button>
              <Button 
                type="submit"
                className="bg-[#00c6a7] hover:bg-[#00a689]"
              >
                Cadastrar Cargo
              </Button>
            </div>
          </form>
        ) : (
          <div>
            {cargos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Nível de Acesso</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Permissões</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cargos.map((cargo) => (
                      <TableRow 
                        key={cargo.id}
                        className="cursor-pointer hover:bg-[#e6f7f4]"
                        onClick={() => handleCargoClick(cargo)}
                      >
                        <TableCell className="font-semibold text-[#00a689]">{cargo.nome}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {cargo.nivel_acesso === 'admin' ? (
                              <ShieldAlert className="h-4 w-4 mr-1 text-[#00c6a7]" />
                            ) : cargo.nivel_acesso === 'financeiro' || cargo.nivel_acesso === 'farmaceutico' ? (
                              <ShieldCheck className="h-4 w-4 mr-1 text-[#00c6a7]" />
                            ) : (
                              <Shield className="h-4 w-4 mr-1 text-[#00c6a7]" />
                            )}
                            {cargo.nivel_acesso === 'admin' ? 'Administrador' : 
                              cargo.nivel_acesso === 'financeiro' ? 'Financeiro' : 
                              cargo.nivel_acesso === 'farmaceutico' ? 'Farmacêutico' : 
                              cargo.nivel_acesso === 'balconista_i' ? 'Balconista I' : 'Balconista II'}
                          </div>
                        </TableCell>
                        <TableCell>{cargo.descricao}</TableCell>
                        <TableCell>
                          {Object.entries(cargo.permissoes).filter(([_, value]) => value).length} módulos
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum cargo cadastrado</h3>
                <p className="text-gray-600 mb-4">
                  Não há cargos cadastrados no sistema. Clique no botão abaixo para adicionar seu primeiro cargo.
                </p>
                <Button 
                  onClick={() => setActiveView("cadastro")} 
                  className="bg-[#00c6a7] hover:bg-[#00a689]"
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Cadastrar Cargo
                </Button>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={onReturn}
                className="border-[#00c6a7] text-[#00a689] hover:bg-[#e6f7f4]"
              >
                Retornar ao Menu
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="h-5 w-5 text-[#00c6a7] mr-2" />
              {isEditing ? "Editar Cargo" : "Detalhes do Cargo"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCargo && editedCargo && (
            <div>
              <div className="flex justify-end space-x-2 mb-4">
                {isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleViewMode}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Modo Visualização
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEditMode}
                    className="text-[#00a689] border-[#00c6a7] hover:bg-[#e6f7f4]"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nome do Cargo</label>
                  {isEditing ? (
                    <Input 
                      value={editedCargo.nome} 
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedCargo.nome}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nível de Acesso</label>
                  {isEditing ? (
                    <Select 
                      value={editedCargo.nivel_acesso}
                      onValueChange={(value) => handleInputChange('nivel_acesso', value as any)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="farmaceutico">Farmacêutico</SelectItem>
                        <SelectItem value="balconista_i">Balconista Nível I</SelectItem>
                        <SelectItem value="balconista_ii">Balconista Nível II</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedCargo.nivel_acesso === 'admin' ? 'Administrador' : 
                       selectedCargo.nivel_acesso === 'financeiro' ? 'Financeiro' : 
                       selectedCargo.nivel_acesso === 'farmaceutico' ? 'Farmacêutico' : 
                       selectedCargo.nivel_acesso === 'balconista_i' ? 'Balconista Nível I' : 'Balconista Nível II'}
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">Descrição</label>
                  {isEditing ? (
                    <Input 
                      value={editedCargo.descricao} 
                      onChange={(e) => handleInputChange('descricao', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedCargo.descricao}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Permissões do Sistema</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(editedCargo.permissoes).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      {isEditing ? (
                        <input 
                          type="checkbox" 
                          id={`perm-${key}`} 
                          checked={value}
                          onChange={(e) => handlePermissionChange(key as keyof Cargo['permissoes'], e.target.checked)}
                          className="rounded border-gray-300 text-[#00c6a7] focus:ring-[#00a689]" 
                        />
                      ) : (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${value ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {value ? '✓' : '✗'}
                        </div>
                      )}
                      <label htmlFor={`perm-${key}`} className="text-sm text-gray-700 capitalize">
                        {key === 'boletos' ? 'Boletos' : 
                         key === 'operadores' ? 'Operadores' :
                         key === 'registros' ? 'Registros' :
                         key === 'fornecedores' ? 'Fornecedores' :
                         key === 'senhas' ? 'Senhas' :
                         key === 'pagamentos' ? 'Pagamentos' :
                         key === 'unidades' ? 'Unidades' :
                         key === 'grupos' ? 'Grupos' :
                         key === 'analise' ? 'Análise' : 'Cargos'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {isEditing ? "Cancelar" : "Fechar"}
                </Button>
                {isEditing && (
                  <Button 
                    className="bg-[#00c6a7] hover:bg-[#00a689]" 
                    onClick={handleSaveChanges}
                  >
                    Salvar Alterações
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
