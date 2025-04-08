
import { AlertCircle, CreditCard } from "lucide-react";

interface InfoCardsProps {
  boletosHoje: number;
  valorHoje: number;
  boletosAtraso: number;
}

export default function InfoCards({ boletosHoje, valorHoje, boletosAtraso }: InfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 shadow-md">
        <div className="flex items-center">
          <div className="rounded-full bg-yellow-200 p-2 mr-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Boletos para hoje</p>
            <p className="text-xl font-bold">{boletosHoje}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-100 text-blue-800 rounded-lg p-4 shadow-md">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-200 p-2 mr-3">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Valor total de hoje</p>
            <p className="text-xl font-bold">R$ {valorHoje.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-red-100 text-red-800 rounded-lg p-4 shadow-md">
        <div className="flex items-center">
          <div className="rounded-full bg-red-200 p-2 mr-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Boletos em atraso</p>
            <p className="text-xl font-bold">{boletosAtraso}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
