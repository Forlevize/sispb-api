
import React from "react";
import { OngoingQuotation } from "../types";

interface QuotationsListProps {
  quotations: OngoingQuotation[];
  onSelectQuotation: (quotation: OngoingQuotation) => void;
}

const QuotationsList: React.FC<QuotationsListProps> = ({
  quotations,
  onSelectQuotation
}) => {
  return (
    <div className="space-y-4">
      {quotations.map(quotation => (
        <div 
          key={quotation.id} 
          className={`p-4 border rounded-md ${
            quotation.status === 'open' 
              ? 'hover:border-blue-400 cursor-pointer' 
              : 'bg-gray-50 opacity-75'
          }`}
          onClick={() => quotation.status === 'open' && onSelectQuotation(quotation)}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{quotation.productName}</p>
              <p className="text-sm text-gray-600">
                Quantidade: {quotation.quantity} | Unidade: {quotation.unit}
              </p>
            </div>
            <div className="text-right">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                quotation.status === 'open' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {quotation.status === 'open' ? 'Aberta' : 'Enviada'}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Prazo: {quotation.deadline}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuotationsList;
