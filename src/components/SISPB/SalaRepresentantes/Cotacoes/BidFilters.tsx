
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BidFilters } from "../types";

interface BidFiltersProps {
  filters: BidFilters;
  onFilterChange: (name: keyof BidFilters, value: string) => void;
  onResetFilters: () => void;
  availableUnits: Array<{ value: string; label: string }>;
  statusOptions: Array<{ value: string; label: string }>;
}

const BidFiltersComponent: React.FC<BidFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableUnits,
  statusOptions
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="unitFilter">Unidade</Label>
          <Select 
            value={filters.unit} 
            onValueChange={(value) => onFilterChange("unit", value)}
          >
            <SelectTrigger id="unitFilter">
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              {availableUnits.map(unit => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="statusFilter">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger id="statusFilter">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="productNameFilter">Nome do Produto</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="productNameFilter"
              placeholder="Buscar produto..."
              value={filters.productName}
              onChange={(e) => onFilterChange("productName", e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="startDateFilter">Data Inicial</Label>
          <Input
            id="startDateFilter"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange("startDate", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="endDateFilter">Data Final</Label>
          <Input
            id="endDateFilter"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange("endDate", e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={onResetFilters}
          className="mr-2"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default BidFiltersComponent;
