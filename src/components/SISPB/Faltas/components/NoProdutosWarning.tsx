
import React from "react";
import { AlertTriangle } from "lucide-react";

interface NoProdutosWarningProps {
  message?: string;
}

export const NoProdutosWarning = ({ 
  message = "Nenhum produto cadastrado. Por favor, cadastre produtos primeiro." 
}: NoProdutosWarningProps) => {
  return (
    <div className="flex items-center justify-center p-6 bg-yellow-50 rounded-md border border-yellow-200">
      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
      <p className="text-yellow-700">
        {message}
      </p>
    </div>
  );
};
