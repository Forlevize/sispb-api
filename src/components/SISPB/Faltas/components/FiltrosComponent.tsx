
import { useState, useEffect } from "react";
import { FiltroFaltas } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CalendarRange } from "lucide-react";

interface FiltrosComponentProps {
  filtros: FiltroFaltas;
  searchTerm: string;
  unidades: string[];
  statusOptions: string[];
  onSearchChange: (value: string) => void;
  onFiltroChange: (campo: keyof FiltroFaltas, valor: string) => void;
  onLimparFiltros: () => void;
}

export function FiltrosComponent({
  filtros,
  searchTerm,
  unidades,
  statusOptions,
  onSearchChange,
  onFiltroChange,
  onLimparFiltros
}: FiltrosComponentProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por produto ou código de barras..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <div>
          <Select
            value={filtros.unidade}
            onValueChange={(value) => onFiltroChange("unidade", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as unidades</SelectItem>
              {unidades.map((unidade, index) => (
                <SelectItem key={index} value={unidade}>
                  {unidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filtros.status}
            onValueChange={(value) => onFiltroChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <CalendarRange className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">De:</span>
          </div>
          <Input
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => onFiltroChange("dataInicio", e.target.value)}
            className="flex-grow"
          />

          <div className="flex items-center space-x-2">
            <CalendarRange className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Até:</span>
          </div>
          <Input
            type="date"
            value={filtros.dataFim}
            onChange={(e) => onFiltroChange("dataFim", e.target.value)}
            className="flex-grow"
          />
        </div>

        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={onLimparFiltros}
            className="w-full md:w-auto"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
    </>
  );
}
