
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { FormDataFalta, Produto, Falta } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PackageOpen } from "lucide-react";
import { BarcodeInput } from "./components/BarcodeInput";
import { ProductNameInput } from "./components/ProductNameInput";
import { QuantityInputs } from "./components/QuantityInputs";
import { UnitSelect } from "./components/UnitSelect";
import { NoProdutosWarning } from "./components/NoProdutosWarning";
import { 
  getDefaultUnidade, 
  salvarFaltas, 
  validateFormData, 
  createFalta,
  getUnidadeNome
} from "./utils/formUtils";

export default function LancamentoFalta() {
  const [formData, setFormData] = useState<FormDataFalta>({
    codigoBarras: "",
    produtoNome: "",
    quantidadeSolicitada: 0,
    quantidadeDisponivel: 0,
    unidade: ""
  });

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load products
    const produtosSalvos = localStorage.getItem("produtos");
    if (produtosSalvos) {
      setProdutos(JSON.parse(produtosSalvos));
    }
    
    // Load faltas
    const faltasSalvas = localStorage.getItem("faltas");
    if (faltasSalvas) {
      setFaltas(JSON.parse(faltasSalvas));
    }

    // Set default unit
    setFormData(prev => ({
      ...prev,
      unidade: getDefaultUnidade()
    }));

    // Focus on barcode input
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const handleUnidadeChange = (value: string) => {
    setFormData({
      ...formData,
      unidade: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    if (!validateFormData(formData, faltas)) {
      setIsSubmitting(false);
      return;
    }

    // Create new falta
    const novaFalta = createFalta(formData, produtos, faltas);
    
    if (!novaFalta) {
      setIsSubmitting(false);
      return;
    }

    // Update state and localStorage
    const novasFaltas = [...faltas, novaFalta];
    setFaltas(novasFaltas);
    salvarFaltas(novasFaltas);

    // Reset form
    setFormData({
      codigoBarras: "",
      produtoNome: "",
      quantidadeSolicitada: 0,
      quantidadeDisponivel: 0,
      unidade: formData.unidade // Keep the selected unit for next entry
    });

    toast.success("Falta lançada com sucesso!");
    setIsSubmitting(false);
    
    // Focus back on barcode input
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <PackageOpen className="mr-2 h-5 w-5 text-[#00c6a7]" />
            Lançamento de Falta
          </h2>
          
          {produtos.length === 0 ? (
            <NoProdutosWarning />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BarcodeInput 
                  codigoBarras={formData.codigoBarras}
                  produtos={produtos}
                  setFormData={setFormData}
                  inputRef={barcodeInputRef}
                />
                
                <ProductNameInput produtoNome={formData.produtoNome} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuantityInputs 
                  quantidadeSolicitada={formData.quantidadeSolicitada}
                  quantidadeDisponivel={formData.quantidadeDisponivel}
                  onQuantidadeSolicitadaChange={(value) => 
                    setFormData({...formData, quantidadeSolicitada: value})
                  }
                  onQuantidadeDisponivelChange={(value) => 
                    setFormData({...formData, quantidadeDisponivel: value})
                  }
                />

                <UnitSelect
                  selectedUnidade={formData.unidade}
                  onUnidadeChange={handleUnidadeChange}
                />
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#00c6a7] hover:bg-[#00a689]"
                >
                  Lançar Falta
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
