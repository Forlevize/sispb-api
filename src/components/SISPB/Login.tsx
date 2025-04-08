import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
}

export default function Login({ onLogin, isLoading }: LoginProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  const handleCaptchaChange = (value: string | null) => {
    setCaptchaVerified(!!value);
  };

  const handleLogin = () => {
    if (!email || !senha) {
      toast.error("Preencha e-mail e senha corretamente.", {
        description: "Todos os campos são obrigatórios."
      });
      return;
    }
    
    if (!captchaVerified) {
      toast.error("Verificação de robô necessária", {
        description: "Por favor, complete a verificação reCAPTCHA."
      });
      return;
    }
    
    onLogin(email, senha);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ 
        backgroundColor: "#00c6a7", 
        backgroundImage: "url('/farmacia-fundo.png')" 
      }}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 z-10">
        <div className="flex justify-center mb-4">
          <img 
            src="/logo-farmacia.png" 
            alt="Logo Farmácias Preço Baixo" 
            className="h-20 w-auto"
          />
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-center">SISPB</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Seja bem-vindo ao futuro da gestão das Farmácias Preço Baixo Maranhão.</p>

        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-2.5 text-gray-400" />
          <Input 
            className="pl-10" 
            placeholder="E-mail principal" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="mb-4 relative">
          <KeyRound className="absolute left-3 top-2.5 text-gray-400" />
          <Input 
            className="pl-10" 
            type="password" 
            placeholder="Senha da conta" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="text-right text-sm text-blue-600 mb-4 cursor-pointer hover:underline">
          Esqueceu sua senha?
        </div>
        
        <div className="flex justify-center mb-4">
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={handleCaptchaChange}
          />
        </div>
        
        <Button 
          className="w-full bg-[#00c6a7] hover:bg-[#00a689]" 
          onClick={handleLogin}
          disabled={isLoading || !captchaVerified}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <div className="text-center mt-6 text-xs text-gray-500">
          Suporte: (98) 98256-7707
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-white text-sm">
        <p className="font-bold">Farmácias Preço Baixo Maranhão</p>
        <p className="text-xs">Cuidando de você e da sua família.</p>
      </div>
    </div>
  );
}
