
import React from "react";
import { BidItem } from "../types";

interface BidItemsListProps {
  items: BidItem[];
}

const BidItemsList: React.FC<BidItemsListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum item encontrado com os filtros selecionados.
      </div>
    );
  }

  return (
    <>
      {items.map(item => (
        <div 
          key={item.id} 
          className={`p-4 border-b last:border-b-0 ${
            item.status === 'won' 
              ? 'bg-green-50 border-green-100' 
              : 'bg-red-50 border-red-100'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.productName}</p>
              <p className="text-sm text-gray-600">
                Lote: {item.batch} | Unidade: {item.unit}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">
                {item.status === 'won' ? 'Ganho' : 'Perdido'}
              </p>
              <p className="text-sm text-gray-600">
                Data: {item.victoryDate}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BidItemsList;
