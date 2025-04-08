
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { BidItem, BidFilters } from "../types";
import BidFiltersComponent from "./BidFilters";
import BidItemsList from "./BidItemsList";

// Available units for filtering
const availableUnits = [
  { value: "all", label: "Todas Unidades" },
  { value: "Unidade A", label: "Unidade A" },
  { value: "Unidade B", label: "Unidade B" },
  { value: "Unidade C", label: "Unidade C" },
  { value: "Caixa", label: "Caixa" }
];

// Available status options for filtering
const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "won", label: "Ganhos" },
  { value: "lost", label: "Perdidos" }
];

interface CotacoesTabProps {
  bidItems: BidItem[];
}

const CotacoesTab: React.FC<CotacoesTabProps> = ({ bidItems }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BidFilters>({
    unit: "all",
    startDate: "",
    endDate: "",
    productName: "",
    status: "all"
  });

  // Filter change handlers
  const handleFilterChange = (name: keyof BidFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      unit: "all",
      startDate: "",
      endDate: "",
      productName: "",
      status: "all"
    });
  };

  // Apply filters to bid items
  const filteredBidItems = React.useMemo(() => {
    return bidItems.filter(item => {
      // Filter by unit
      if (filters.unit !== "all" && item.unit !== filters.unit) {
        return false;
      }
      
      // Filter by date range
      if (filters.startDate && new Date(item.victoryDate) < new Date(filters.startDate)) {
        return false;
      }
      
      if (filters.endDate && new Date(item.victoryDate) > new Date(filters.endDate)) {
        return false;
      }
      
      // Filter by product name
      if (filters.productName && !item.productName.toLowerCase().includes(filters.productName.toLowerCase())) {
        return false;
      }
      
      // Filter by status
      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  }, [filters, bidItems]);

  return (
    <div className="mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Itens Vitoriosos</CardTitle>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" /> 
              {showFilters ? "Ocultar Filtros" : "Exibir Filtros"}
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <BidFiltersComponent 
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            availableUnits={availableUnits}
            statusOptions={statusOptions}
          />
        )}

        <CardContent>
          <BidItemsList items={filteredBidItems} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CotacoesTab;
