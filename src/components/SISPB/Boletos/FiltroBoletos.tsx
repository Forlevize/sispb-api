
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiltrosBoleto, Unidade, Fornecedor, GrupoPagamento } from "./types";

interface FiltroBoletosProps {
  filtros: FiltrosBoleto;
  unidades: Unidade[];
  fornecedores: Fornecedor[];
  gruposPagamento: GrupoPagamento[];
  onFiltroChange: (field: string, value: any) => void;
  onClearFiltros: () => void;
  onClose: () => void;
}

export default function FiltroBoletos({
  filtros,
  unidades,
  fornecedores,
  gruposPagamento,
  onFiltroChange,
  onClearFiltros,
  onClose
}: FiltroBoletosProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium mb-3">Filtrar Boletos</h3>
      
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Unidade</label>
        <Select 
          value={filtros.unidade} 
          onValueChange={(value) => onFiltroChange("unidade", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {unidades.map((unidade) => (
              <SelectItem key={unidade.id} value={unidade.nome}>{unidade.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Fornecedor</label>
        <Select 
          value={filtros.fornecedor} 
          onValueChange={(value) => onFiltroChange("fornecedor", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {fornecedores.map((fornecedor) => (
              <SelectItem key={fornecedor.id} value={fornecedor.nome}>{fornecedor.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Grupo de Pagamento</label>
        <Select 
          value={filtros.grupo} 
          onValueChange={(value) => onFiltroChange("grupo", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {gruposPagamento.map((grupo) => (
              <SelectItem key={grupo.id} value={grupo.nome}>{grupo.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Período de Vencimento</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input 
              type="date" 
              placeholder="De" 
              value={filtros.dataInicio}
              onChange={(e) => onFiltroChange("dataInicio", e.target.value)}
            />
          </div>
          <div>
            <Input 
              type="date" 
              placeholder="Até" 
              value={filtros.dataFim}
              onChange={(e) => onFiltroChange("dataFim", e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Status de Pagamento</label>
        <Select 
          value={filtros.statusPagamento} 
          onValueChange={(value) => onFiltroChange("statusPagamento", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pagos">Pagos</SelectItem>
            <SelectItem value="pendentes">Pendentes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Faixa de Valor (R$)</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input 
              type="number" 
              placeholder="Mínimo" 
              value={filtros.valorMinimo}
              onChange={(e) => onFiltroChange("valorMinimo", e.target.value)}
            />
          </div>
          <div>
            <Input 
              type="number" 
              placeholder="Máximo" 
              value={filtros.valorMaximo}
              onChange={(e) => onFiltroChange("valorMaximo", e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="text-sm text-gray-600 mb-1 block">Para Reembolso</label>
        <Select 
          value={filtros.reembolso} 
          onValueChange={(value) => onFiltroChange("reembolso", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="sim">Sim</SelectItem>
            <SelectItem value="nao">Não</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={onClearFiltros}
          className="text-sm"
        >
          Limpar Filtros
        </Button>
        <Button 
          onClick={onClose}
          className="bg-[#00c6a7] hover:bg-[#00c6a7]/90 text-sm"
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
