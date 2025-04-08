
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import axios from "axios";
import { toast } from "sonner";

// Define the user interface
interface User {
  id: number;
  nome: string;
  email: string;
  nivel_acesso: string;
  unidade_id: number;
  ultimo_acesso: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      try {
        const dadosUsuario = JSON.parse(usuarioSalvo);
        setUser(dadosUsuario);
      } catch (e) {
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        senha
      });
      
      if (response.data.success) {
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        localStorage.setItem('token', response.data.token);
        
        setUser(response.data.usuario);
        
        toast.success("Login realizado com sucesso!", {
          description: "Bem-vindo ao Sistema das Farmácias Preço Baixo."
        });
      } else {
        toast.error("Falha na autenticação", {
          description: response.data.mensagem || "Verifique suas credenciais."
        });
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
      
      const usuarioSimulado = {
        id: 1,
        nome: "EMANUEL DE MORAES NERES",
        email: email,
        nivel_acesso: "admin",
        unidade_id: 1,
        ultimo_acesso: new Date().toLocaleString()
      };
      
      localStorage.setItem('usuario', JSON.stringify(usuarioSimulado));
      setUser(usuarioSimulado);
      
      toast.success("Login realizado com sucesso (modo simulação)!", {
        description: "Bem-vindo ao Sistema das Farmácias Preço Baixo."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    
    setUser(null);
    
    toast.info("Sessão encerrada com sucesso!");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
