
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UnidadeSimplificada {
  id: number;
  nome: string;
  ativo?: boolean;
}

interface UnitSelectProps {
  selectedUnidade: string;
  onUnidadeChange: (value: string) => void;
}

export const UnitSelect = ({ 
  selectedUnidade, 
  onUnidadeChange 
}: UnitSelectProps) => {
  const [unidades, setUnidades] = useState<UnidadeSimplificada[]>([]);

  useEffect(() => {
    // Carregar unidades do localStorage (cadastradas no menu Unidades)
    const unidadesSalvas = localStorage.getItem("unidades");
    if (unidadesSalvas) {
      try {
        const parsedUnidades = JSON.parse(unidadesSalvas);
        setUnidades(parsedUnidades);
      } catch (error) {
        console.error("Erro ao carregar unidades:", error);
        // Fallback para unidades padrão se houver erro
        setUnidades([
          { id: 1, nome: "Matriz", ativo: true },
          { id: 2, nome: "Filial 01", ativo: true },
        ]);
      }
    } else {
      // Unidades padrão se não houver nenhuma salva
      setUnidades([
        { id: 1, nome: "Matriz", ativo: true },
        { id: 2, nome: "Filial 01", ativo: true },
      ]);
    }
  }, []);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Unidade <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Select 
          value={selectedUnidade} 
          onValueChange={onUnidadeChange}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma unidade" />
          </SelectTrigger>
          <SelectContent>
            {unidades
              .filter(u => u.ativo !== false) // Mostrar apenas unidades ativas
              .map(unidade => (
                <SelectItem 
                  key={unidade.id} 
                  value={unidade.id.toString()}
                >
                  {unidade.nome}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
