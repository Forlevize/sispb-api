
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Award, ShoppingBasket, Clock } from "lucide-react";

// Import mock data
import { mockBidItems, mockOngoingQuotations, mockStats } from "./MockData";

// Import components for each tab
import RepresentanteDashboard from "./Dashboard/RepresentanteDashboard";
import CotacoesTab from "./Cotacoes/CotacoesTab";
import EmAndamentoTab from "./EmAndamento/EmAndamentoTab";

interface SalaRepresentantesProps {
  onReturn: () => void;
}

const SalaRepresentantes: React.FC<SalaRepresentantesProps> = ({ onReturn }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sala dos Representantes</h1>
        <Button onClick={onReturn} variant="outline">Voltar ao Menu</Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">
            <Award className="mr-2" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="cotacoes">
            <ShoppingBasket className="mr-2" /> Cotações
          </TabsTrigger>
          <TabsTrigger value="em-andamento">
            <Clock className="mr-2" /> Em Andamento
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <RepresentanteDashboard stats={mockStats} />
        </TabsContent>
        
        <TabsContent value="cotacoes">
          <CotacoesTab bidItems={mockBidItems} />
        </TabsContent>

        <TabsContent value="em-andamento">
          <EmAndamentoTab ongoingQuotations={mockOngoingQuotations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalaRepresentantes;
