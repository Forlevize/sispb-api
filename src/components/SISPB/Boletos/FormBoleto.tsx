
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, UploadCloud, Eye, Image, X } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { interpretarLinhaDigitavel } from "./utils";
import { Boleto, Unidade, Fornecedor, GrupoPagamento, FormDataBoleto } from "./types";
import ImageUploadDialog from "./ImageUploadDialog";

interface FormBoletoProps {
  unidades: Unidade[];
  fornecedores: Fornecedor[];
  gruposPagamento: GrupoPagamento[];
  onSubmit: (boleto: Boleto) => void;
  onReturn: () => void;
}

export default function FormBoleto({ 
  unidades, 
  fornecedores, 
  gruposPagamento, 
  onSubmit, 
  onReturn 
}: FormBoletoProps) {
  const [formData, setFormData] = useState<FormDataBoleto>({
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

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Function to handle form changes
  const handleFormChange = (field: string, value: any) => {
    // If the barcode line is changed, extract automatic data using the new function
    if (field === "linhaDigitavel" && value.length >= 40) {
      try {
        // Use the line interpretation function
        const resultado = interpretarLinhaDigitavel(value);
        
        if ("erro" in resultado) {
          toast.error("Linha digitável inválida", {
            description: resultado.erro
          });
          setFormData({
            ...formData,
            linhaDigitavel: value
          });
        } else {
          // Convert date from BR format (DD/MM/YYYY) to ISO format (YYYY-MM-DD)
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

  // Function to handle image upload
  const handleConfirmUpload = (imageUrl: string) => {
    setFormData({
      ...formData,
      anexoImagem: imageUrl
    });
    toast.success("Imagem anexada com sucesso!");
    setUploadDialogOpen(false);
  };

  // Function to remove attachment
  const handleRemoveAnexo = () => {
    setFormData({
      ...formData,
      anexoImagem: ""
    });
    toast.success("Anexo removido");
  };

  // Function to view the attached image
  const handleViewImage = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  // Function to submit the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.unidade || !formData.fornecedor || !formData.grupo || !formData.linhaDigitavel || !formData.dataVencimento || !formData.valor) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    // If boleto is marked as paid, check if it has payment date and value
    if (formData.pago && (!formData.dataPagamento || !formData.valorPago)) {
      toast.error("Para boletos pagos, é necessário informar a data e o valor do pagamento.");
      return;
    }
    
    // Create new boleto
    const novoBoleto: Boleto = {
      id: Date.now(), // This will be replaced by the parent component
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
    
    // Send to parent component
    onSubmit(novoBoleto);
    
    // Clear form
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
  };

  return (
    <>
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
                onClick={() => setUploadDialogOpen(true)}
              >
                <UploadCloud className="h-4 w-4 mr-1" />
                Anexar
              </Button>
            </div>
          </div>
          
          {/* Attachment visualization */}
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
            type="button"
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
            <PlusCircle className="h-4 w-4 mr-1" />
            Cadastrar Boleto
          </Button>
        </div>
      </form>

      <ImageUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onConfirm={handleConfirmUpload}
      />
    </>
  );
}
