
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { OngoingQuotation, QuotationFormData } from "../types";

interface QuotationFormProps {
  selectedQuotation: OngoingQuotation;
  formData: QuotationFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const QuotationForm: React.FC<QuotationFormProps> = ({
  selectedQuotation,
  formData,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <h3 className="font-bold text-lg">{selectedQuotation.productName}</h3>
        <p className="text-sm text-gray-600">
          Quantidade: {selectedQuotation.quantity} | Unidade: {selectedQuotation.unit}
        </p>
        <p className="text-sm text-gray-600">
          Prazo: {selectedQuotation.deadline}
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bidPrice">Valor da Proposta (R$)*</Label>
            <Input
              id="bidPrice"
              name="bidPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.bidPrice}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Data de Entrega*</Label>
            <Input
              id="deliveryDate"
              name="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={onInputChange}
            placeholder="Adicione informações adicionais, termos ou condições especiais..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          <Send className="mr-2 h-4 w-4" /> Enviar Cotação
        </Button>
      </div>
    </div>
  );
};

export default QuotationForm;
