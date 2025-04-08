
import React from "react";
import { Input } from "@/components/ui/input";

interface QuantityInputsProps {
  quantidadeSolicitada: number;
  quantidadeDisponivel: number;
  onQuantidadeSolicitadaChange: (value: number) => void;
  onQuantidadeDisponivelChange: (value: number) => void;
}

export const QuantityInputs = ({ 
  quantidadeSolicitada,
  quantidadeDisponivel,
  onQuantidadeSolicitadaChange,
  onQuantidadeDisponivelChange
}: QuantityInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Quantidade Solicitada <span className="text-red-500">*</span>
        </label>
        <Input 
          type="number"
          min="1"
          value={quantidadeSolicitada || ""}
          onChange={(e) => onQuantidadeSolicitadaChange(parseInt(e.target.value) || 0)}
          placeholder="Informe a quantidade necessária"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Quantidade Disponível
        </label>
        <Input 
          type="number"
          min="0"
          value={quantidadeDisponivel || ""}
          onChange={(e) => onQuantidadeDisponivelChange(parseInt(e.target.value) || 0)}
          placeholder="Informe a quantidade atual em estoque"
        />
      </div>
    </>
  );
};
