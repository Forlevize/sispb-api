
import { FormDataFalta, Produto, Falta, StatusFalta } from "../types";
import { findProductByBarcode, validateBarcodeLength } from "./productUtils";
import { toast } from "sonner";

// Helper function to get unit name from unit ID
export const getUnidadeNome = (unidadeId: string): string => {
  try {
    const unidadesSalvas = localStorage.getItem("unidades");
    if (unidadesSalvas) {
      const unidades = JSON.parse(unidadesSalvas);
      const unidade = unidades.find((u: any) => u.id.toString() === unidadeId);
      return unidade ? unidade.nome : "Unidade Desconhecida";
    }
  } catch (error) {
    console.error("Erro ao buscar nome da unidade:", error);
  }
  return "Unidade Desconhecida";
};

// Load units from localStorage 
export const loadUnidades = (): any[] => {
  const unidadesSalvas = localStorage.getItem("unidades");
  if (unidadesSalvas) {
    try {
      return JSON.parse(unidadesSalvas);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
      return getUnidadesPadrao();
    }
  } else {
    const unidadesPadrao = getUnidadesPadrao();
    localStorage.setItem("unidades", JSON.stringify(unidadesPadrao));
    return unidadesPadrao;
  }
};

// Default units if none are saved
const getUnidadesPadrao = () => {
  return [
    { id: 1, nome: "Matriz", endereco: "Endereço Matriz", cidade: "Cidade Principal", ativo: true },
    { id: 2, nome: "Filial 01", endereco: "Endereço Filial 01", cidade: "Cidade Secundária", ativo: true },
    { id: 3, nome: "Filial 02", endereco: "Endereço Filial 02", cidade: "Cidade Terciária", ativo: true }
  ];
};

// Save faltas to localStorage
export const salvarFaltas = (faltas: Falta[]) => {
  localStorage.setItem("faltas", JSON.stringify(faltas));
};

// Get default unit from user data
export const getDefaultUnidade = (): string => {
  const usuarioStr = localStorage.getItem('usuario');
  if (usuarioStr) {
    try {
      const usuario = JSON.parse(usuarioStr);
      if (usuario.unidade_id) {
        return usuario.unidade_id.toString();
      }
    } catch (error) {
      console.error("Erro ao ler dados do usuário:", error);
    }
  }
  return "1"; // Default to first unit
};

// Validate form data before submission
export const validateFormData = (
  formData: FormDataFalta, 
  faltas: Falta[]
): boolean => {
  if (!formData.codigoBarras || !formData.produtoNome || formData.quantidadeSolicitada <= 0 || !formData.unidade) {
    toast.error("Por favor, preencha todos os campos obrigatórios corretamente.");
    return false;
  }

  // Check if there's already an open shortage for this product in the same unit
  if (faltas.some(f => 
    f.codigoBarras === formData.codigoBarras && 
    f.status === StatusFalta.EM_ABERTO &&
    f.unidade === getUnidadeNome(formData.unidade)
  )) {
    toast.error("Já existe uma falta em aberto para este produto nesta unidade", {
      description: "Verifique a lista de Produtos Lançados."
    });
    return false;
  }

  return true;
};

// Process barcode input and find product
export const handleCodigoBarrasChange = (
  codigo: string,
  produtos: Produto[],
  setFormData: React.Dispatch<React.SetStateAction<FormDataFalta>>
) => {
  setFormData(prev => ({
    ...prev,
    codigoBarras: codigo,
    produtoNome: ""
  }));
  
  if (validateBarcodeLength(codigo)) {
    const produto = findProductByBarcode(produtos, codigo);
    if (produto) {
      setFormData(prev => ({
        ...prev,
        codigoBarras: codigo,
        produtoNome: produto.nome
      }));
    } else {
      toast.error("Produto não encontrado", {
        description: "O código de barras não está cadastrado no sistema."
      });
    }
  }
};

// Create a new falta object
export const createFalta = (
  formData: FormDataFalta, 
  produtos: Produto[], 
  faltas: Falta[]
): Falta | null => {
  const usuarioStr = localStorage.getItem('usuario');
  let nomeOperador = "Usuário";
  
  if (usuarioStr) {
    try {
      const usuario = JSON.parse(usuarioStr);
      nomeOperador = usuario.nome || "Usuário";
    } catch (error) {
      console.error("Erro ao ler dados do usuário:", error);
    }
  }

  const produto = produtos.find(p => p.codigoBarras === formData.codigoBarras);
  
  if (!produto) {
    toast.error("Produto não encontrado.");
    return null;
  }

  return {
    id: faltas.length + 1,
    produtoId: produto.id,
    produtoNome: formData.produtoNome,
    codigoBarras: formData.codigoBarras,
    quantidadeSolicitada: formData.quantidadeSolicitada,
    quantidadeDisponivel: formData.quantidadeDisponivel,
    operador: nomeOperador,
    unidade: getUnidadeNome(formData.unidade),
    dataLancamento: new Date().toISOString(),
    status: StatusFalta.EM_ABERTO
  };
};
