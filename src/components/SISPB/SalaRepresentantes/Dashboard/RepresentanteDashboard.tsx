
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { RepresentativeStats } from "../types";

interface RepresentanteDashboardProps {
  stats: RepresentativeStats;
}

const RepresentanteDashboard: React.FC<RepresentanteDashboardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Desempenho</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <CheckCircle className="text-green-500 w-12 h-12" />
            <div>
              <p className="text-gray-600">Itens Ganhos</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalItemsWon}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <XCircle className="text-red-500 w-12 h-12" />
            <div>
              <p className="text-gray-600">Itens Perdidos</p>
              <p className="text-3xl font-bold text-red-600">{stats.totalItemsLost}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximas Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Nenhuma ação pendente no momento.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepresentanteDashboard;
