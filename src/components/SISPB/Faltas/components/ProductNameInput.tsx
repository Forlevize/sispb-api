
import React from "react";
import { Input } from "@/components/ui/input";

interface ProductNameInputProps {
  produtoNome: string;
  label?: string;
  className?: string;
}

export const ProductNameInput = ({ 
  produtoNome, 
  label = "Nome do Produto",
  className = ""
}: ProductNameInputProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium">
        {label}
      </label>
      <Input 
        value={produtoNome}
        readOnly
        className="bg-gray-50 cursor-not-allowed"
        placeholder="Nome do produto aparecerá automaticamente"
      />
    </div>
  );
};
