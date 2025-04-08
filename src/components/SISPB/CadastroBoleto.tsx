
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, CreditCard, Search, UploadCloud, Filter, ListFilter, PlusCircle, Eye, Download, Copy, Edit, MessageSquare, Image, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface CadastroBoletosProps {
  onReturn: () => void;
}

// Interface para boleto
interface Boleto {
  id: number;
  unidade: string;
  fornecedor: string;
  tipoFornecedor: string;
  grupo: string;
  linhaDigitavel: string;
  referencia: string;
  dataVencimento: string;
  valor: number;
  notaFiscal?: string;
  pago: boolean;
  dataPagamento?: string;
  valorPago?: number;
  paraReembolso: boolean;
  dataLancamento?: string;
  operador?: string;
  anexoImagem?: string; // Novo campo para armazenar a URL da imagem
}

// Interface para unidade
interface Unidade {
  id: number;
  nome: string;
}

// Interface para fornecedor
interface Fornecedor {
  id: number;
  nome: string;
}

// Interface para grupo de pagamento
interface GrupoPagamento {
  id: number;
  nome: string;
}

// Função para interpretar a linha digitável do boleto
function interpretarLinhaDigitavel(linha: string) {
  const limpa = linha.replace(/[.\\s]/g, "");

  if (limpa.length !== 47 && limpa.length !== 48) {
    return { erro: "Linha digitável inválida" };
  }

  const vencimentoFator = parseInt(limpa.slice(33, 37), 10);
  const valorCentavos = parseInt(limpa.slice(37), 10);

  const dataBase = new Date(1997, 9, 7); // 07/10/1997
  const dataVencimento = new Date(dataBase.getTime() + vencimentoFator * 24 * 60 * 60 * 1000);

  return {
    vencimento: dataVencimento.toLocaleDateString("pt-BR"),
    valor: (valorCentavos / 100).toFixed(2)
  };
}

export default function CadastroBoleto({ onReturn }: CadastroBoletosProps) {
  const [activeTab, setActiveTab] = useState<string>("cadastro");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBoleto, setSelectedBoleto] = useState<Boleto | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dados simulados
  const [unidades, setUnidades] = useState<Unidade[]>([
    { id: 1, nome: "Matriz São Luís" },
    { id: 2, nome: "Filial Imperatriz" },
    { id: 3, nome: "Filial Bacabal" },
    { id: 4, nome: "Filial Timon" },
    { id: 5, nome: "Filial Caxias" }
  ]);
  
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    { id: 1, nome: "Distribuidor A" },
    { id: 2, nome: "Distribuidor B" },
    { id: 3, nome: "Laboratório C" },
    { id: 4, nome: "Fornecedor D" },
    { id: 5, nome: "Fornecedor E" }
  ]);
  
  const [gruposPagamento, setGruposPagamento] = useState<GrupoPagamento[]>([
    { id: 1, nome: "Medicamentos" },
    { id: 2, nome: "Aluguel" },
    { id: 3, nome: "Serviços" },
    { id: 4, nome: "Equipamentos" },
    { id: 5, nome: "Publicidade" }
  ]);
  
  const hoje = new Date();
  const [boletos, setBoletos] = useState<Boleto[]>([
    {
      id: 1,
      unidade: "Matriz São Luís",
      fornecedor: "Distribuidor A",
      tipoFornecedor: "Novo",
      grupo: "Medicamentos",
      linhaDigitavel: "23790123456789012345678901234567890123456789",
      referencia: "Compra mensal",
      dataVencimento: "2025-04-10",
      valor: 2500.00,
      notaFiscal: "NF-001234",
      pago: false,
      paraReembolso: false,
      dataLancamento: "2025-04-01",
      operador: "EMANUEL DE MORAES NERES"
    },
    {
      id: 2,
      unidade: "Filial Imperatriz",
      fornecedor: "Laboratório C",
      tipoFornecedor: "Antigo",
      grupo: "Medicamentos",
      linhaDigitavel: "23790123456789012345678901234567890987654321",
      referencia: "Pedido especial",
      dataVencimento: "2025-04-05",
      valor: 1850.50,
      notaFiscal: "NF-005678",
      pago: true,
      dataPagamento: "2025-04-05",
      valorPago: 1850.50,
      paraReembolso: false,
      dataLancamento: "2025-03-28",
      operador: "EMANUEL DE MORAES NERES"
    },
    {
      id: 3,
      unidade: "Matriz São Luís",
      fornecedor: "Fornecedor D",
      tipoFornecedor: "Novo",
      grupo: "Aluguel",
      linhaDigitavel: "23790123456789012345678901234567890123789456",
      referencia: "Aluguel Abril/2025",
      dataVencimento: "2025-04-15",
      valor: 3500.00,
      pago: false,
      paraReembolso: false,
      dataLancamento: "2025-04-02",
      operador: "EMANUEL DE MORAES NERES"
    }
  ]);
  
  // Form data e filtros
  const [formData, setFormData] = useState({
    unidade: "",
    fornecedor: "",
    tipoFornecedor: "Novo",
    grupo: "",
    linhaDigitavel: "",
    referencia: "",
    dataVencimento: "",
    valor: "",
    notaFiscal: "",
    pago: false,
    dataPagamento: "",
    valorPago: "",
    paraReembolso: false,
    anexoImagem: "" // Novo campo para armazenar a URL da imagem
  });

  const [filtros, setFiltros] = useState({
    unidade: "",
    fornecedor: "",
    grupo: "",
    dataInicio: "",
    dataFim: "",
    statusPagamento: "todos",
    valorMinimo: "",
    valorMaximo: "",
    reembolso: "todos"
  });

  const [searchTerm, setSearchTerm] = useState("");
  
  // Função para lidar com alterações no formulário
  const handleFormChange = (field: string, value: any) => {
    // Se a linha digitável for alterada, extrair dados automáticos usando a nova função
    if (field === "linhaDigitavel" && value.length >= 40) {
      try {
        // Usar a função de interpretação da linha digitável
        const resultado = interpretarLinhaDigitavel(value);
        
        if (resultado.erro) {
          toast.error("Linha digitável inválida", {
            description: resultado.erro
          });
          setFormData({
            ...formData,
            linhaDigitavel: value
          });
        } else {
          // Converter data do formato BR (DD/MM/YYYY) para o formato ISO (YYYY-MM-DD)
          const partesData = resultado.vencimento.split('/');
          const dataISO = `${partesData[2]}-${partesData[1].padStart(2, '0')}-${partesData[0].padStart(2, '0')}`;
          
          setFormData({
            ...formData,
            linhaDigitavel: value,
            dataVencimento: dataISO,
            valor: resultado.valor
          });
          
          toast.success("Dados extraídos com sucesso", {
            description: `Vencimento: ${resultado.vencimento} | Valor: R$ ${resultado.valor}`
          });
        }
      } catch (error) {
        console.error("Erro ao processar linha digitável:", error);
        toast.error("Erro ao processar a linha digitável", {
          description: "Verifique se o código está correto."
        });
        setFormData({
          ...formData,
          linhaDigitavel: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };
  
  // Função para lidar com alterações nos filtros
  const handleFiltroChange = (field: string, value: any) => {
    setFiltros({
      ...filtros,
      [field]: value
    });
  };
  
  // Função para aplicar filtros
  const boletosFilterados = boletos.filter(boleto => {
    // Filtro de busca
    const matchSearch = searchTerm === "" || 
      boleto.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boleto.grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boleto.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boleto.linhaDigitavel.includes(searchTerm);
    
    // Filtros específicos
    const matchUnidade = filtros.unidade === "" || boleto.unidade === filtros.unidade;
    const matchFornecedor = filtros.fornecedor === "" || boleto.fornecedor === filtros.fornecedor;
    const matchGrupo = filtros.grupo === "" || boleto.grupo === filtros.grupo;
    
    // Filtro de data
    const dataVencimento = new Date(boleto.dataVencimento);
    const matchDataInicio = filtros.dataInicio === "" || dataVencimento >= new Date(filtros.dataInicio);
    const matchDataFim = filtros.dataFim === "" || dataVencimento <= new Date(filtros.dataFim);
    
    // Filtro de status
    const matchStatus = filtros.statusPagamento === "todos" || 
      (filtros.statusPagamento === "pagos" && boleto.pago) ||
      (filtros.statusPagamento === "pendentes" && !boleto.pago);
    
    // Filtro de valor
    const matchValorMinimo = filtros.valorMinimo === "" || boleto.valor >= parseFloat(filtros.valorMinimo);
    const matchValorMaximo = filtros.valorMaximo === "" || boleto.valor <= parseFloat(filtros.valorMaximo);
    
    // Filtro de reembolso
    const matchReembolso = filtros.reembolso === "todos" || 
      (filtros.reembolso === "sim" && boleto.paraReembolso) ||
      (filtros.reembolso === "nao" && !boleto.paraReembolso);
    
    return matchSearch && matchUnidade && matchFornecedor && matchGrupo && 
           matchDataInicio && matchDataFim && matchStatus && 
           matchValorMinimo && matchValorMaximo && matchReembolso;
  });
  
  // Calcular o valor total dos boletos filtrados
  const valorTotalFiltrado = boletosFilterados.reduce((total, boleto) => total + boleto.valor, 0);
  
  // Função para abrir diálogo de upload
  const handleOpenUploadDialog = () => {
    setPreviewImage(null);
    setUploadDialogOpen(true);
  };

  // Função para selecionar arquivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar tipo do arquivo
      if (!file.type.includes('image/')) {
        toast.error("Tipo de arquivo inválido", {
          description: "Por favor, selecione apenas arquivos de imagem."
        });
        return;
      }

      // Verificar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande", {
          description: "O tamanho máximo permitido é 5MB."
        });
        return;
      }

      // Criar URL de preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  // Função para confirmar upload
  const handleConfirmUpload = () => {
    if (previewImage) {
      // Em um sistema real, o arquivo seria enviado para um servidor
      // Aqui, apenas simulamos o sucesso do upload
      setFormData({
        ...formData,
        anexoImagem: previewImage
      });
      toast.success("Imagem anexada com sucesso!");
      setUploadDialogOpen(false);
    } else {
      toast.error("Nenhuma imagem selecionada");
    }
  };

  // Função para remover anexo
  const handleRemoveAnexo = () => {
    setFormData({
      ...formData,
      anexoImagem: ""
    });
    toast.success("Anexo removido");
  };
  
  // Função para submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.unidade || !formData.fornecedor || !formData.grupo || !formData.linhaDigitavel || !formData.dataVencimento || !formData.valor) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    // Se boleto estiver marcado como pago, verificar se tem data e valor de pagamento
    if (formData.pago && (!formData.dataPagamento || !formData.valorPago)) {
      toast.error("Para boletos pagos, é necessário informar a data e o valor do pagamento.");
      return;
    }
    
    // Criar novo boleto
    const novoBoleto: Boleto = {
      id: boletos.length + 1,
      unidade: formData.unidade,
      fornecedor: formData.fornecedor,
      tipoFornecedor: formData.tipoFornecedor,
      grupo: formData.grupo,
      linhaDigitavel: formData.linhaDigitavel,
      referencia: formData.referencia,
      dataVencimento: formData.dataVencimento,
      valor: parseFloat(formData.valor),
      notaFiscal: formData.notaFiscal,
      pago: formData.pago,
      dataPagamento: formData.pago ? formData.dataPagamento : undefined,
      valorPago: formData.pago ? parseFloat(formData.valorPago) : undefined,
      paraReembolso: formData.paraReembolso,
      anexoImagem: formData.anexoImagem || undefined,
      dataLancamento: new Date().toISOString().split('T')[0],
      operador: "EMANUEL DE MORAES NERES"
    };
    
    // Adicionar à lista
    setBoletos([...boletos, novoBoleto]);
    
    // Limpar formulário
    setFormData({
      unidade: "",
      fornecedor: "",
      tipoFornecedor: "Novo",
      grupo: "",
      linhaDigitavel: "",
      referencia: "",
      dataVencimento: "",
      valor: "",
      notaFiscal: "",
      pago: false,
      dataPagamento: "",
      valorPago: "",
      paraReembolso: false,
      anexoImagem: ""
    });
    
    toast.success("Boleto cadastrado com sucesso!");
  };
  
  // Função para visualizar detalhes do boleto
  const handleViewBoleto = (boleto: Boleto) => {
    setSelectedBoleto(boleto);
    setIsDialogOpen(true);
  };
  
  // Função para marcar boleto como pago
  const handleMarcarPago = (boleto: Boleto) => {
    if (boleto.pago) {
      return;
    }
    
    const hoje = new Date();
    const boletosAtualizados = boletos.map(b => {
      if (b.id === boleto.id) {
        return {
          ...b,
          pago: true,
          dataPagamento: hoje.toISOString().split('T')[0],
          valorPago: b.valor
        };
      }
      return b;
    });
    
    setBoletos(boletosAtualizados);
    
    if (selectedBoleto && selectedBoleto.id === boleto.id) {
      setSelectedBoleto({
        ...boleto,
        pago: true,
        dataPagamento: hoje.toISOString().split('T')[0],
        valorPago: boleto.valor
      });
    }
    
    toast.success("Boleto marcado como pago!");
  };

  // Função para abrir o diálogo de edição de status
  const handleEditStatus = (boleto: Boleto) => {
    setSelectedBoleto(boleto);
    setIsStatusDialogOpen(true);
  };

  // Função para atualizar o status do boleto
  const handleAtualizarStatus = () => {
    if (!selectedBoleto) return;
    
    const boletosAtualizados = boletos.map(b => {
      if (b.id === selectedBoleto.id) {
        return selectedBoleto;
      }
      return b;
    });
    
    setBoletos(boletosAtualizados);
    setIsStatusDialogOpen(false);
    toast.success("Status do boleto atualizado com sucesso!");
  };

  // Função para copiar linha digitável
  const handleCopyLinhaDigitavel = (linhaDigitavel: string) => {
    navigator.clipboard.writeText(linhaDigitavel);
    toast.success("Linha digitável copiada para a área de transferência!");
  };

  // Função para enviar informações para o WhatsApp
  const handleSendWhatsApp = (boleto: Boleto) => {
    // Formatar a mensagem com as informações do boleto
    const mensagem1 = `*Informações do Boleto*
Lançado por: ${boleto.operador || "Não informado"}
Unidade: ${boleto.unidade}
Fornecedor: ${boleto.fornecedor}
Data de Lançamento: ${boleto.dataLancamento ? new Date(boleto.dataLancamento).toLocaleDateString('pt-BR') : "Não informada"}
Data de Vencimento: ${new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}
Valor: R$ ${boleto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Status: ${boleto.pago ? "Pago" : "Pendente"}`;

    const mensagem = encodeURIComponent(mensagem1);
    const url = `https://wa.me/?text=${mensagem}`;
    window.open(url, '_blank');
    
    // Em uma mensagem separada, enviar a linha digitável
    setTimeout(() => {
      const mensagem2 = encodeURIComponent(`*Linha Digitável do Boleto*
${boleto.linhaDigitavel}`);
      const url2 = `https://wa.me/?text=${mensagem2}`;
      window.open(url2, '_blank');
    }, 500);
  };

  // Função para visualizar a imagem anexada
  const handleViewImage = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-4 md:p-6" 
         style={{ backgroundImage: "url('/farmacia-fundo.png')" }}>
      <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-[#00c6a7] mr-2" />
            <h2 className="text-xl font-bold text-[#00c6a7]">Gerenciamento de Boletos</h2>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === "cadastro" ? "default" : "outline"} 
              onClick={() => setActiveTab("cadastro")}
              className={activeTab === "cadastro" ? "bg-[#00c6a7] hover:bg-[#00c6a7]/90" : "border-[#00c6a7]/20 text-[#00c6a7] hover:bg-[#00c6a7]/10"}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Cadastrar
            </Button>
            <Button 
              variant={activeTab === "listagem" ? "default" : "outline"} 
              onClick={() => setActiveTab("listagem")}
              className={activeTab === "listagem" ? "bg-[#00c6a7] hover:bg-[#00c6a7]/90" : "border-[#00c6a7]/20 text-[#00c6a7] hover:bg-[#00c6a7]/10"}
            >
              <ListFilter className="w-4 h-4 mr-1" />
              Listar/Filtrar
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="cadastro">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Unidade <span className="text-[#00c6a7]">*</span></label>
                  <Select 
                    value={formData.unidade} 
                    onValueChange={(value) => handleFormChange("unidade", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.nome}>{unidade.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Fornecedor <span className="text-[#00c6a7]">*</span></label>
                  <Select 
                    value={formData.fornecedor} 
                    onValueChange={(value) => handleFormChange("fornecedor", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {fornecedores.map((fornecedor) => (
                        <SelectItem key={fornecedor.id} value={fornecedor.nome}>{fornecedor.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Tipo de Fornecedor <span className="text-[#00c6a7]">*</span></label>
                  <Select 
                    value={formData.tipoFornecedor} 
                    onValueChange={(value) => handleFormChange("tipoFornecedor", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Novo">Novo</SelectItem>
                      <SelectItem value="Antigo">Antigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Grupo de Pagamento <span className="text-[#00c6a7]">*</span></label>
                  <Select 
                    value={formData.grupo} 
                    onValueChange={(value) => handleFormChange("grupo", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {gruposPagamento.map((grupo) => (
                        <SelectItem key={grupo.id} value={grupo.nome}>{grupo.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Linha Digitável <span className="text-red-500">*</span></label>
                  <Input 
                    placeholder="Código de barras do boleto" 
                    value={formData.linhaDigitavel}
                    onChange={(e) => handleFormChange("linhaDigitavel", e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A linha digitável preencherá automaticamente data e valor se o código for válido.
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Referência</label>
                  <Input 
                    placeholder="Mês/ano ou descrição da despesa" 
                    value={formData.referencia}
                    onChange={(e) => handleFormChange("referencia", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Data de Vencimento <span className="text-red-500">*</span></label>
                  <Input 
                    type="date" 
                    value={formData.dataVencimento}
                    onChange={(e) => handleFormChange("dataVencimento", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Valor (R$) <span className="text-red-500">*</span></label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0,00" 
                    value={formData.valor}
                    onChange={(e) => handleFormChange("valor", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nota Fiscal (opcional)</label>
                  <div className="flex">
                    <Input 
                      placeholder="Número da NF" 
                      value={formData.notaFiscal}
                      onChange={(e) => handleFormChange("notaFiscal", e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="ml-2 border-dashed border-gray-300"
                      onClick={handleOpenUploadDialog}
                    >
                      <UploadCloud className="h-4 w-4 mr-1" />
                      Anexar
                    </Button>
                  </div>
                </div>
                
                {/* Visualização do anexo */}
                {formData.anexoImagem && (
                  <div className="col-span-2 mt-2">
                    <div className="flex items-center border rounded-md p-2 bg-gray-50">
                      <div className="mr-2">
                        <Image className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium">Imagem anexada</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => handleViewImage(formData.anexoImagem)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={handleRemoveAnexo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="pago"
                    checked={formData.pago}
                    onCheckedChange={(checked) => handleFormChange("pago", checked)}
                  />
                  <label
                    htmlFor="pago"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Já está pago?
                  </label>
                </div>
                
                {formData.pago && (
                  <>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Data do Pagamento <span className="text-red-500">*</span></label>
                      <Input 
                        type="date" 
                        value={formData.dataPagamento}
                        onChange={(e) => handleFormChange("dataPagamento", e.target.value)}
                        required={formData.pago}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Valor Pago (R$) <span className="text-red-500">*</span></label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0,00" 
                        value={formData.valorPago}
                        onChange={(e) => handleFormChange("valorPago", e.target.value)}
                        required={formData.pago}
                      />
                    </div>
                  </>
                )}
                
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="reembolso"
                    checked={formData.paraReembolso}
                    onCheckedChange={(checked) => handleFormChange("paraReembolso", checked)}
                  />
                  <label
                    htmlFor="reembolso"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Marcar para reembolso
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
                <Button 
                  variant="outline" 
                  onClick={onReturn}
                  className="border-[#00c6a7]/20 text-[#00c6a7] hover:bg-[#00c6a7]/10"
                >
                  Retornar ao Menu
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#00c6a7] hover:bg-[#00c6a7]/90"
                >
                  Cadastrar Boleto
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="listagem">
            {/* Barra de busca e filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-8"
                  placeholder="Buscar boletos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-shrink-0">
                    <Filter className="h-4 w-4 mr-1" />
                    Filtros
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <h3 className="font-medium mb-3">Filtrar Boletos</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Unidade</label>
                      <Select 
                        value={filtros.unidade} 
                        onValueChange={(value) => handleFiltroChange("unidade", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas</SelectItem>
                          {unidades.map((unidade) => (
                            <SelectItem key={unidade.id} value={unidade.nome}>{unidade.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Fornecedor</label>
                      <Select 
                        value={filtros.fornecedor} 
                        onValueChange={(value) => handleFiltroChange("fornecedor", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          {fornecedores.map((fornecedor) => (
                            <SelectItem key={fornecedor.id} value={fornecedor.nome}>{fornecedor.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Grupo de Pagamento</label>
                      <Select 
                        value={filtros.grupo} 
                        onValueChange={(value) => handleFiltroChange("grupo", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          {gruposPagamento.map((grupo) => (
                            <SelectItem key={grupo.id} value={grupo.nome}>{grupo.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Período de Vencimento</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input 
                            type="date" 
                            placeholder="De" 
                            value={filtros.dataInicio}
                            onChange={(e) => handleFiltroChange("dataInicio", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input 
                            type="date" 
                            placeholder="Até" 
                            value={filtros.dataFim}
                            onChange={(e) => handleFiltroChange("dataFim", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Status de Pagamento</label>
                      <Select 
                        value={filtros.statusPagamento} 
                        onValueChange={(value) => handleFiltroChange("statusPagamento", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="pagos">Pagos</SelectItem>
                          <SelectItem value="pendentes">Pendentes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Faixa de Valor (R$)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input 
                            type="number" 
                            placeholder="Mínimo" 
                            value={filtros.valorMinimo}
                            onChange={(e) => handleFiltroChange("valorMinimo", e.target.value)}
                          />
                        </div>
                        <div>
                          <Input 
                            type="number" 
                            placeholder="Máximo" 
                            value={filtros.valorMaximo}
                            onChange={(e) => handleFiltroChange("valorMaximo", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Para Reembolso</label>
                      <Select 
                        value={filtros.reembolso} 
                        onValueChange={(value) => handleFiltroChange("reembolso", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFiltros({
                          unidade: "",
                          fornecedor: "",
                          grupo: "",
                          dataInicio: "",
                          dataFim: "",
                          statusPagamento: "todos",
                          valorMinimo: "",
                          valorMaximo: "",
                          reembolso: "todos"
                        });
                      }}
                      className="text-sm"
                    >
                      Limpar Filtros
                    </Button>
                    <Button 
                      onClick={() => setIsFilterOpen(false)}
                      className="bg-[#00c6a7] hover:bg-[#00c6a7]/90 text-sm"
                    >
                      Aplicar Filtros
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Resultado de filtros e tabela */}
            <div className="mt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <div>
                  <p className="text-sm text-gray-500">
                    {boletosFilterados.length} boleto(s) encontrado(s)
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-sm font-medium">
                    Valor Total: <span className="text-[#00c6a7]">R$ {valorTotalFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </p>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Fornecedor/Ref.</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor (R$)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boletosFilterados.length > 0 ? (
                      boletosFilterados.map((boleto) => (
                        <TableRow key={boleto.id}>
                          <TableCell className="font-medium">{boleto.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{boleto.fornecedor}</p>
                              <p className="text-xs text-gray-500">{boleto.referencia || boleto.grupo}</p>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>R$ {boleto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            {boleto.pago ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pago</Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pendente</Badge>
                            )}
                            {boleto.paraReembolso && (
                              <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-200">Reembolso</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-gray-600"
                                onClick={() => handleViewBoleto(boleto)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {!boleto.pago && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-green-600"
                                  onClick={() => handleMarcarPago(boleto)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-blue-600"
                                onClick={() => handleCopyLinhaDigitavel(boleto.linhaDigitavel)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-amber-600"
                                onClick={() => handleEditStatus(boleto)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-emerald-600"
                                onClick={() => handleSendWhatsApp(boleto)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                          Nenhum boleto encontrado com os filtros aplicados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Modal de visualização de boleto */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Boleto</DialogTitle>
            </DialogHeader>
            
            {selectedBoleto && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fornecedor</h3>
                    <p>{selectedBoleto.fornecedor} ({selectedBoleto.tipoFornecedor})</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Unidade</h3>
                    <p>{selectedBoleto.unidade}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Grupo de Pagamento</h3>
                    <p>{selectedBoleto.grupo}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Referência</h3>
                    <p>{selectedBoleto.referencia || "-"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data de Vencimento</h3>
                    <p>{new Date(selectedBoleto.dataVencimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Valor</h3>
                    <p>R$ {selectedBoleto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nota Fiscal</h3>
                    <p>{selectedBoleto.notaFiscal || "-"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      {selectedBoleto.pago ? (
                        <Badge className="bg-green-100 text-green-800">Pago</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800">Pendente</Badge>
                      )}
                      {selectedBoleto.paraReembolso && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800">Para Reembolso</Badge>
                      )}
                    </div>
                  </div>
                  
                  {selectedBoleto.pago && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Data de Pagamento</h3>
                        <p>{selectedBoleto.dataPagamento ? new Date(selectedBoleto.dataPagamento).toLocaleDateString('pt-BR') : "-"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Valor Pago</h3>
                        <p>R$ {selectedBoleto.valorPago?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "-"}</p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data de Lançamento</h3>
                    <p>{selectedBoleto.dataLancamento ? new Date(selectedBoleto.dataLancamento).toLocaleDateString('pt-BR') : "-"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Operador</h3>
                    <p>{selectedBoleto.operador || "-"}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Linha Digitável</h3>
                  <div className="flex items-center p-2 bg-gray-50 rounded border">
                    <p className="font-mono text-sm flex-1 break-all">{selectedBoleto.linhaDigitavel}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2"
                      onClick={() => handleCopyLinhaDigitavel(selectedBoleto.linhaDigitavel)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Exibir imagem anexada se houver */}
                {selectedBoleto.anexoImagem && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Anexo</h3>
                    <div className="flex items-center border rounded-md p-2 bg-gray-50">
                      <div className="mr-2">
                        <Image className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium">Imagem anexada</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => handleViewImage(selectedBoleto.anexoImagem!)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Fechar
              </Button>
              
              <div className="flex gap-2">
                {selectedBoleto && !selectedBoleto.pago && (
                  <Button 
                    onClick={() => {
                      handleMarcarPago(selectedBoleto);
                      setIsDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Marcar como Pago
                  </Button>
                )}
                
                {selectedBoleto && (
                  <Button 
                    onClick={() => handleSendWhatsApp(selectedBoleto)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Enviar para WhatsApp
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Modal de edição de status */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Status do Boleto</DialogTitle>
            </DialogHeader>
            
            {selectedBoleto && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status de Pagamento</h3>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedBoleto.pago}
                          onCheckedChange={(checked) => {
                            setSelectedBoleto({
                              ...selectedBoleto,
                              pago: checked,
                              dataPagamento: checked ? (selectedBoleto.dataPagamento || new Date().toISOString().split('T')[0]) : undefined,
                              valorPago: checked ? (selectedBoleto.valorPago || selectedBoleto.valor) : undefined
                            });
                          }}
                        />
                        <Label htmlFor="airplane-mode">Boleto Pago</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reembolso</h3>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedBoleto.paraReembolso}
                          onCheckedChange={(checked) => {
                            setSelectedBoleto({
                              ...selectedBoleto,
                              paraReembolso: checked
                            });
                          }}
                        />
                        <Label htmlFor="airplane-mode">Marcar para Reembolso</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedBoleto.pago && (
                  <>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Data do Pagamento</label>
                      <Input 
                        type="date" 
                        value={selectedBoleto.dataPagamento || ''}
                        onChange={(e) => {
                          setSelectedBoleto({
                            ...selectedBoleto,
                            dataPagamento: e.target.value
                          });
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Valor Pago (R$)</label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0,00" 
                        value={selectedBoleto.valorPago || ''}
                        onChange={(e) => {
                          setSelectedBoleto({
                            ...selectedBoleto,
                            valorPago: parseFloat(e.target.value)
                          });
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAtualizarStatus}
                className="bg-[#00c6a7] hover:bg-[#00c6a7]/90"
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Diálogo de upload de imagem */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Anexar Imagem</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                {previewImage ? (
                  <div className="relative w-full max-w-md">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-auto max-h-[300px] object-contain rounded-md"
                    />
                    <Button 
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white"
                      onClick={() => {
                        setPreviewImage(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Clique para selecionar ou arraste uma imagem</p>
                    <p className="text-xs text-gray-500">PNG, JPG ou JPEG (máx. 5MB)</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={previewImage ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                  onChange={handleFileSelect}
                />
                
                {!previewImage && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Selecionar Arquivo
                  </Button>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setUploadDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmUpload}
                disabled={!previewImage}
                className="bg-[#00c6a7] hover:bg-[#00c6a7]/90"
              >
                Confirmar Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
