
import { useState } from "react";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AlteracaoSenhaProps {
  onReturn: () => void;
}

export default function AlteracaoSenha({ onReturn }: AlteracaoSenhaProps) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarSenhaNova, setMostrarSenhaNova] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!senhaAtual || !senhaNova || !confirmarSenha) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    
    if (senhaNova !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }
    
    // Simulação de alteração de senha
    toast.success("Senha alterada com sucesso!", {
      description: "Sua senha foi atualizada."
    });
    
    // Limpar campos
    setSenhaAtual("");
    setSenhaNova("");
    setConfirmarSenha("");
  };
  
  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onReturn} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-red-600">Alteração de Senha</h1>
      </div>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Alterar sua senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senhaAtual">Senha Atual*</Label>
              <div className="relative">
                <Input
                  id="senhaAtual"
                  type={mostrarSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                >
                  {mostrarSenhaAtual ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senhaNova">Nova Senha*</Label>
              <div className="relative">
                <Input
                  id="senhaNova"
                  type={mostrarSenhaNova ? "text" : "password"}
                  value={senhaNova}
                  onChange={(e) => setSenhaNova(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setMostrarSenhaNova(!mostrarSenhaNova)}
                >
                  {mostrarSenhaNova ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Nova Senha*</Label>
              <div className="relative">
                <Input
                  id="confirmarSenha"
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                >
                  {mostrarConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
