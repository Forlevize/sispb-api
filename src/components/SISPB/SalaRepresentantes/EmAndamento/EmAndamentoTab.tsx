
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { OngoingQuotation, QuotationFormData } from "../types";
import QuotationForm from "./QuotationForm";
import QuotationsList from "./QuotationsList";
import { toast } from "sonner";

interface EmAndamentoTabProps {
  ongoingQuotations: OngoingQuotation[];
}

const EmAndamentoTab: React.FC<EmAndamentoTabProps> = ({ ongoingQuotations }) => {
  const [selectedQuotation, setSelectedQuotation] = useState<OngoingQuotation | null>(null);
  const [formData, setFormData] = useState<QuotationFormData>({
    bidPrice: 0,
    deliveryDate: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitQuotation = () => {
    if (!selectedQuotation) return;
    
    if (!formData.bidPrice || !formData.deliveryDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Here we would normally send the data to an API
    console.log("Submitting quotation for:", selectedQuotation.id);
    console.log("Form data:", formData);
    
    toast.success("Cotação enviada com sucesso!", {
      description: "Sua proposta foi enviada para análise."
    });
    
    // Reset form and selected quotation
    setSelectedQuotation(null);
    setFormData({
      bidPrice: 0,
      deliveryDate: "",
      notes: ""
    });
  };

  const handleSelectQuotation = (quotation: OngoingQuotation) => {
    setSelectedQuotation(quotation);
  };

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Cotações em Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedQuotation ? (
            <QuotationForm 
              selectedQuotation={selectedQuotation}
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmitQuotation}
              onCancel={() => setSelectedQuotation(null)}
            />
          ) : (
            <QuotationsList 
              quotations={ongoingQuotations}
              onSelectQuotation={handleSelectQuotation}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmAndamentoTab;
