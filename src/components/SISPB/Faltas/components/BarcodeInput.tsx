
import React from "react";
import { Input } from "@/components/ui/input";
import { Barcode } from "lucide-react";
import { Produto } from "../types";
import { handleCodigoBarrasChange } from "../utils/formUtils";

interface BarcodeInputProps {
  codigoBarras: string;
  produtos: Produto[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const BarcodeInput = ({ 
  codigoBarras, 
  produtos, 
  setFormData,
  inputRef 
}: BarcodeInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Código de Barras <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Barcode className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input 
          ref={inputRef}
          value={codigoBarras}
          onChange={(e) => handleCodigoBarrasChange(e.target.value, produtos, setFormData)}
          placeholder="Escaneie ou digite o código de barras"
          className="pl-8"
          required
        />
      </div>
    </div>
  );
};
