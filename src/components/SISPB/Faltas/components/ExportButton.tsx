
import { Falta } from "../types";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface ExportButtonProps {
  items: Falta[];
  filename: string;
}

export function ExportButton({ items, filename }: ExportButtonProps) {
  const handleExportarCSV = () => {
    if (items.length === 0) {
      return;
    }

    const headers = ["Produto", "Código de Barras", "Qtd. Solicitada", "Qtd. Disponível", "Operador", "Unidade", "Data", "Status"];
    
    const csvContent = [
      headers.join(","),
      ...items.map(falta => [
        `"${falta.produtoNome.replace(/"/g, '""')}"`,
        `"${falta.codigoBarras}"`,
        falta.quantidadeSolicitada,
        falta.quantidadeDisponivel,
        `"${falta.operador.replace(/"/g, '""')}"`,
        `"${falta.unidade}"`,
        new Date(falta.dataLancamento).toLocaleDateString('pt-BR'),
        `"${falta.status}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExportarCSV}
      disabled={items.length === 0}
      className="flex items-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      Exportar
    </Button>
  );
}
