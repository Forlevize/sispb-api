
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, PlusCircle, ListFilter } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Boleto, Unidade, Fornecedor, GrupoPagamento } from "./types";
import { formatarMensagemWhatsApp } from "./utils";
import FormBoleto from "./FormBoleto";
import ListaBoletos from "./ListaBoletos";
import DetalheBoletoDialog from "./DetalheBoletoDialog";
import StatusBoletoDialog from "./StatusBoletoDialog";

interface CadastroBoletosProps {
  onReturn: () => void;
}

export default function CadastroBoleto({ onReturn }: CadastroBoletosProps) {
  const [activeTab, setActiveTab] = useState<string>("cadastro");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedBoleto, setSelectedBoleto] = useState<Boleto | null>(null);
  
  // Simulated data
  const [unidades] = useState<Unidade[]>([
    { id: 1, nome: "Matriz São Luís" },
    { id: 2, nome: "Filial Imperatriz" },
    { id: 3, nome: "Filial Bacabal" },
    { id: 4, nome: "Filial Timon" },
    { id: 5, nome: "Filial Caxias" }
  ]);
  
  const [fornecedores] = useState<Fornecedor[]>([
    { id: 1, nome: "Distribuidor A" },
    { id: 2, nome: "Distribuidor B" },
    { id: 3, nome: "Laboratório C" },
    { id: 4, nome: "Fornecedor D" },
    { id: 5, nome: "Fornecedor E" }
  ]);
  
  const [gruposPagamento] = useState<GrupoPagamento[]>([
    { id: 1, nome: "Medicamentos" },
    { id: 2, nome: "Aluguel" },
    { id: 3, nome: "Serviços" },
    { id: 4, nome: "Equipamentos" },
    { id: 5, nome: "Publicidade" }
  ]);
  
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
  
  // Function to add a new boleto
  const handleSubmitForm = (novoBoleto: Boleto) => {
    // Set the ID
    novoBoleto.id = boletos.length + 1;
    
    // Add to list
    setBoletos([...boletos, novoBoleto]);
    
    toast.success("Boleto cadastrado com sucesso!");
  };
  
  // Function to view boleto details
  const handleViewBoleto = (boleto: Boleto) => {
    setSelectedBoleto(boleto);
    setIsDialogOpen(true);
  };
  
  // Function to mark boleto as paid
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

  // Function to open the status edit dialog
  const handleEditStatus = (boleto: Boleto) => {
    setSelectedBoleto(boleto);
    setIsStatusDialogOpen(true);
  };

  // Function to update boleto status
  const handleAtualizarStatus = (boletoAtualizado: Boleto) => {
    const boletosAtualizados = boletos.map(b => {
      if (b.id === boletoAtualizado.id) {
        return boletoAtualizado;
      }
      return b;
    });
    
    setBoletos(boletosAtualizados);
    setIsStatusDialogOpen(false);
    toast.success("Status do boleto atualizado com sucesso!");
  };

  // Function to copy reference line
  const handleCopyLinhaDigitavel = (linhaDigitavel: string) => {
    navigator.clipboard.writeText(linhaDigitavel);
    toast.success("Linha digitável copiada para a área de transferência!");
  };

  // Function to send information to WhatsApp
  const handleSendWhatsApp = (boleto: Boleto) => {
    // Format the message with boleto information
    const mensagens = formatarMensagemWhatsApp(boleto);
    
    const mensagemEncoded = encodeURIComponent(mensagens.mensagem1);
    const url = `https://wa.me/?text=${mensagemEncoded}`;
    window.open(url, '_blank');
    
    // In a separate message, send the reference line
    setTimeout(() => {
      const mensagem2Encoded = encodeURIComponent(mensagens.mensagem2);
      const url2 = `https://wa.me/?text=${mensagem2Encoded}`;
      window.open(url2, '_blank');
    }, 500);
  };

  // Function to view the attached image
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
            <FormBoleto 
              unidades={unidades}
              fornecedores={fornecedores}
              gruposPagamento={gruposPagamento}
              onSubmit={handleSubmitForm}
              onReturn={onReturn}
            />
          </TabsContent>
          
          <TabsContent value="listagem">
            <ListaBoletos 
              boletos={boletos}
              unidades={unidades}
              fornecedores={fornecedores}
              gruposPagamento={gruposPagamento}
              onViewBoleto={handleViewBoleto}
              onMarcarPago={handleMarcarPago}
              onEditStatus={handleEditStatus}
              onCopyLinhaDigitavel={handleCopyLinhaDigitavel}
              onSendWhatsApp={handleSendWhatsApp}
            />
          </TabsContent>
        </Tabs>
        
        {/* Boleto details dialog */}
        <DetalheBoletoDialog 
          boleto={selectedBoleto}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onMarcarPago={handleMarcarPago}
          onCopyLinhaDigitavel={handleCopyLinhaDigitavel}
          onSendWhatsApp={handleSendWhatsApp}
          onViewImage={handleViewImage}
        />
        
        {/* Status edit dialog */}
        <StatusBoletoDialog 
          boleto={selectedBoleto}
          open={isStatusDialogOpen}
          onOpenChange={setIsStatusDialogOpen}
          onAtualizarStatus={handleAtualizarStatus}
        />
      </div>
    </div>
  );
}
