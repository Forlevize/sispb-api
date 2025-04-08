import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, UserCheck, Users, PlusCircle, Building2, Eye, Pencil, KeyRound, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

interface CadastroOperadorProps {
  onReturn: () => void;
  onCadastrar: () => void;
}

// Interface para operador
interface Operador {
  id: number;
  nome: string;
  unidade: string;
  cargo: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco?: string;
  bairro?: string;
  cep?: string;
  usuario?: string;
  ultimoAcesso?: string;
}

// Interface para cargo
interface Cargo {
  id: number;
  nome: string;
  nivel_acesso: string;
}

export default function CadastroOperador({ onReturn, onCadastrar }: CadastroOperadorProps) {
  const [activeView, setActiveView] = useState<"cadastro" | "listagem">("cadastro");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedOperador, setSelectedOperador] = useState<Operador | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOperador, setEditedOperador] = useState<Operador | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("admin"); // Simulação do nível de acesso do usuário atual
  
  // Dados simulados de operadores
  const [operadores, setOperadores] = useState<Operador[]>([
    {
      id: 1,
      nome: "Emanuel de Moraes Neres",
      unidade: "Matriz São Luís",
      cargo: "Administrador",
      cpf: "123.456.789-10",
      email: "emanuel@farmaciasprecobaixo.com.br",
      telefone: "(98) 98256-7707",
      endereco: "Av. Jerônimo de Albuquerque, 123",
      bairro: "Cohama",
      cep: "65070-900",
      usuario: "emanuel.neres",
      ultimoAcesso: "2025-04-08 08:32:15"
    }
  ]);

  // Cargos disponíveis
  const [cargos, setCargos] = useState<Cargo[]>([
    { id: 1, nome: "Administrador", nivel_acesso: "admin" },
    { id: 2, nome: "Financeiro", nivel_acesso: "financeiro" },
    { id: 3, nome: "Farmacêutico", nivel_acesso: "farmaceutico" },
    { id: 4, nome: "Balconista Nível I", nivel_acesso: "balconista_i" },
    { id: 5, nome: "Balconista Nível II", nivel_acesso: "balconista_ii" }
  ]);

  // Form data
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    bairro: "",
    cep: "",
    unidade: "",
    cargo: "",
    usuario: "",
    senha: "",
    confirmarSenha: ""
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleFormChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }
    
    const novoOperador: Operador = {
      id: operadores.length + 1,
      nome: formData.nome,
      cpf: formData.cpf,
      email: formData.email,
      telefone: formData.telefone,
      endereco: formData.endereco,
      bairro: formData.bairro,
      cep: formData.cep,
      unidade: formData.unidade,
      cargo: formData.cargo,
      usuario: formData.usuario
    };
    
    setOperadores([...operadores, novoOperador]);
    
    // Limpar formulário
    setFormData({
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      endereco: "",
      bairro: "",
      cep: "",
      unidade: "",
      cargo: "",
      usuario: "",
      senha: "",
      confirmarSenha: ""
    });
    
    onCadastrar();
    toast.success("Operador cadastrado com sucesso!");
  };

  const handleOperadorClick = (operador: Operador) => {
    setSelectedOperador(operador);
    setEditedOperador({...operador});
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditMode = () => {
    setIsEditing(true);
  };

  const handleViewMode = () => {
    setIsEditing(false);
    setEditedOperador({...selectedOperador!});
  };

  const handleInputChange = (field: keyof Operador, value: string) => {
    if (editedOperador) {
      setEditedOperador({
        ...editedOperador,
        [field]: value
      });
    }
  };

  const handleSaveChanges = () => {
    if (editedOperador) {
      // Atualizar o operador na lista
      setOperadores(operadores.map(op => 
        op.id === editedOperador.id ? editedOperador : op
      ));
      
      // Atualizar o operador selecionado
      setSelectedOperador(editedOperador);
      
      setIsEditing(false);
      toast.success("Operador atualizado com sucesso!");
    }
  };

  const handleOpenResetPassword = () => {
    setIsResetPasswordDialogOpen(true);
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    // Aqui seria a implementação real do reset de senha
    toast.success("Senha resetada com sucesso!");
    setIsResetPasswordDialogOpen(false);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00c6a7] to-[#00a689] p-4 md:p-6">
      <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {activeView === "cadastro" ? (
              <UserCheck className="h-6 w-6 text-[#00c6a7] mr-2" />
            ) : (
              <Users className="h-6 w-6 text-[#00c6a7] mr-2" />
            )}
            <h2 className="text-xl font-bold text-[#00a689]">
              {activeView === "cadastro" ? "Cadastro de Operador" : "Listagem de Operadores"}
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
              <Users className="w-4 h-4 mr-1" />
              Listar
            </Button>
          </div>
        </div>

        {activeView === "cadastro" ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nome completo</label>
                <Input 
                  placeholder="Ex: João da Silva" 
                  value={formData.nome}
                  onChange={(e) => handleFormChange("nome", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">CPF</label>
                <Input 
                  placeholder="000.000.000-00" 
                  value={formData.cpf}
                  onChange={(e) => handleFormChange("cpf", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">E-mail</label>
                <Input 
                  placeholder="exemplo@farmaciapreco.com.br" 
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Telefone</label>
                <Input 
                  placeholder="(00) 00000-0000" 
                  value={formData.telefone}
                  onChange={(e) => handleFormChange("telefone", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Endereço</label>
                <Input 
                  placeholder="Rua, número" 
                  value={formData.endereco}
                  onChange={(e) => handleFormChange("endereco", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Bairro</label>
                <Input 
                  placeholder="Nome do bairro" 
                  value={formData.bairro}
                  onChange={(e) => handleFormChange("bairro", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">CEP</label>
                <Input 
                  placeholder="00000-000" 
                  value={formData.cep}
                  onChange={(e) => handleFormChange("cep", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Unidade (local)</label>
                <Input 
                  placeholder="Ex: Matriz São Luís" 
                  value={formData.unidade}
                  onChange={(e) => handleFormChange("unidade", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Cargo</label>
                <Select 
                  value={formData.cargo}
                  onValueChange={(value) => handleFormChange("cargo", value)}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((cargo) => (
                      <SelectItem key={cargo.id} value={cargo.nome}>
                        {cargo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nome de usuário</label>
                <Input 
                  placeholder="Ex: joao.silva" 
                  value={formData.usuario}
                  onChange={(e) => handleFormChange("usuario", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Senha para login</label>
                <Input 
                  placeholder="********" 
                  type="password" 
                  value={formData.senha}
                  onChange={(e) => handleFormChange("senha", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Confirmar senha</label>
                <Input 
                  placeholder="********" 
                  type="password" 
                  value={formData.confirmarSenha}
                  onChange={(e) => handleFormChange("confirmarSenha", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start mb-6">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700">
                O cadastro de operadores permite que novos usuários tenham acesso ao sistema SISPB com diferentes níveis de permissão.
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
                Cadastrar Operador
              </Button>
            </div>
          </form>
        ) : (
          <div>
            {operadores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {operadores.map((operador) => (
                  <Card 
                    key={operador.id} 
                    className="shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:border-[#00c6a7]" 
                    onClick={() => handleOperadorClick(operador)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-[#00a689]">{operador.nome}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Building2 className="h-4 w-4 mr-1 text-[#00c6a7]" />
                            <span className="text-sm">{operador.unidade}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Cargo:</span> {operador.cargo}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Usuário:</span> {operador.usuario}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span> {operador.email}
                          </p>
                          {operador.ultimoAcesso && (
                            <p className="text-xs text-gray-500 mt-2">
                              Último acesso: {operador.ultimoAcesso}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum operador cadastrado</h3>
                <p className="text-gray-600 mb-4">
                  Não há operadores cadastrados no sistema. Clique no botão abaixo para adicionar seu primeiro operador.
                </p>
                <Button 
                  onClick={() => setActiveView("cadastro")} 
                  className="bg-[#00c6a7] hover:bg-[#00a689]"
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Cadastrar Operador
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

      {/* Dialog para visualizar/editar operador */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserCheck className="h-5 w-5 text-[#00c6a7] mr-2" />
              {isEditing ? "Editar Operador" : "Detalhes do Operador"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOperador && editedOperador && (
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
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEditMode}
                      className="text-[#00a689] border-[#00c6a7] hover:bg-[#e6f7f4]"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    {currentUserRole === "admin" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleOpenResetPassword}
                        className="text-[#00a689] border-[#00c6a7] hover:bg-[#e6f7f4]"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Resetar Senha
                      </Button>
                    )}
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nome completo</label>
                  {isEditing ? (
                    <Input 
                      value={editedOperador.nome} 
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.nome}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">CPF</label>
                  {isEditing ? (
                    <Input 
                      value={editedOperador.cpf} 
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.cpf}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">E-mail</label>
                  {isEditing ? (
                    <Input 
                      value={editedOperador.email} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.email}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Telefone</label>
                  {isEditing ? (
                    <Input 
                      value={editedOperador.telefone} 
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.telefone}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Endereço</label>
                  {isEditing ? (
                    <Input 
                      value={editedOperador.endereco || ''} 
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.endereco || '-'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Bairro</label>
                  {isEditing ? (
                    <Input 
                      value={editedOperador.bairro || ''} 
                      onChange={(e) => handleInputChange('bairro', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.bairro || '-'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">CEP</label>
                  {isEditing ? (
                    <Input 
                      value={editedOperador.cep || ''} 
                      onChange={(e) => handleInputChange('cep', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.cep || '-'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Unidade (local)</label>
                  {isEditing ? (
                    <Input 
                      value={editedOperador.unidade} 
                      onChange={(e) => handleInputChange('unidade', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.unidade}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Cargo</label>
                  {isEditing ? (
                    <Select 
                      value={editedOperador.cargo}
                      onValueChange={(value) => handleInputChange('cargo', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cargos.map((cargo) => (
                          <SelectItem key={cargo.id} value={cargo.nome}>
                            {cargo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.cargo}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nome de usuário</label>
                  {isEditing ? (
                    <Input 
                      value={editedOperador.usuario || ''} 
                      onChange={(e) => handleInputChange('usuario', e.target.value)}
                    />
                  ) : (
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.usuario || '-'}
                    </div>
                  )}
                </div>
                
                {selectedOperador.ultimoAcesso && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Último acesso</label>
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
                      {selectedOperador.ultimoAcesso}
                    </div>
                  </div>
                )}
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
      
      {/* Dialog para resetar senha */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <KeyRound className="h-5 w-5 text-[#00c6a7] mr-2" />
              Resetar senha do operador
            </DialogTitle>
            <DialogDescription>
              {selectedOperador && `Definir nova senha para ${selectedOperador.nome}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nova senha</label>
              <Input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Confirmar nova senha</label>
              <Input 
                type="password" 
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirmar nova senha"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#00c6a7] hover:bg-[#00a689]" 
              onClick={handleResetPassword}
            >
              Resetar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
