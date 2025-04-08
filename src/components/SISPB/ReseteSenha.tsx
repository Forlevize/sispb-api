
import { useState } from "react";
import { ArrowLeft, Save, Users, Search } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ReseteSenhaProps {
  onReturn: () => void;
  isAdmin: boolean;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  ultimo_acesso: string;
}

export default function ReseteSenha({ onReturn, isAdmin }: ReseteSenhaProps) {
  const [termo, setTermo] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Dados simulados
  const usuarios: Usuario[] = [
    { id: 1, nome: "Emanuel de Moraes Neres", email: "emanuel@example.com", ultimo_acesso: "2025-04-08 10:30" },
    { id: 2, nome: "Ana Silva", email: "ana.silva@example.com", ultimo_acesso: "2025-04-07 14:15" },
    { id: 3, nome: "João Oliveira", email: "joao.oliveira@example.com", ultimo_acesso: "2025-04-06 09:45" },
    { id: 4, nome: "Márcia Santos", email: "marcia.santos@example.com", ultimo_acesso: "2025-04-05 16:20" },
  ];
  
  // Filtrar usuários pelo termo de busca
  const usuariosFiltrados = usuarios.filter(
    usuario => 
      usuario.nome.toLowerCase().includes(termo.toLowerCase()) ||
      usuario.email.toLowerCase().includes(termo.toLowerCase())
  );
  
  const handleResetarSenha = () => {
    if (!usuarioSelecionado) return;
    
    // Simulação de reset de senha
    toast.success("Senha resetada com sucesso!", {
      description: `Uma nova senha foi gerada para ${usuarioSelecionado.nome}.`
    });
    
    setDialogOpen(false);
  };
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onReturn} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-red-600">Resetar Senha</h1>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-6">
            <p className="mb-4">Você não possui permissões administrativas para acessar esta funcionalidade.</p>
            <Button variant="outline" onClick={onReturn}>
              Voltar ao Menu Principal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onReturn} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-red-600">Resetar Senha</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Resetar Senha de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Input
              placeholder="Buscar usuário..."
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              className="max-w-sm mr-2"
            />
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFiltrados.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.ultimo_acesso}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setUsuarioSelecionado(usuario);
                          setDialogOpen(true);
                        }}
                      >
                        Resetar Senha
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {usuariosFiltrados.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Resetar Senha</DialogTitle>
            <DialogDescription>
              Você está prestes a resetar a senha do usuário {usuarioSelecionado?.nome}.
              Uma nova senha temporária será gerada.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500">
              O usuário receberá a nova senha e deverá alterá-la no próximo acesso.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleResetarSenha}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
