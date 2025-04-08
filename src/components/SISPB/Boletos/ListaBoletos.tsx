
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, CheckCircle, Eye, Copy, Edit, MessageSquare } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { filtrarBoletos, calcularValorTotal } from "./utils";
import { Boleto, Unidade, Fornecedor, GrupoPagamento, FiltrosBoleto } from "./types";
import FiltroBoletos from "./FiltroBoletos";

interface ListaBoletosProps {
  boletos: Boleto[];
  unidades: Unidade[];
  fornecedores: Fornecedor[];
  gruposPagamento: GrupoPagamento[];
  onViewBoleto: (boleto: Boleto) => void;
  onMarcarPago: (boleto: Boleto) => void;
  onEditStatus: (boleto: Boleto) => void;
  onCopyLinhaDigitavel: (linhaDigitavel: string) => void;
  onSendWhatsApp: (boleto: Boleto) => void;
}

export default function ListaBoletos({
  boletos,
  unidades,
  fornecedores,
  gruposPagamento,
  onViewBoleto,
  onMarcarPago,
  onEditStatus,
  onCopyLinhaDigitavel,
  onSendWhatsApp
}: ListaBoletosProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosBoleto>({
    unidade: "",
    fornecedor: "",
    grupo: "",
    dataInicio: "",
    dataFim: "",
    statusPagamento: "todos",
    valorMinimo: "",
    valorMaximo: "",
    reembolso: "todos"
  });

  // Apply filters
  const boletosFilterados = filtrarBoletos(boletos, searchTerm, filtros);
  
  // Calculate the total value of filtered boletos
  const valorTotalFiltrado = calcularValorTotal(boletosFilterados);

  // Function to handle filter changes
  const handleFiltroChange = (field: string, value: any) => {
    setFiltros({
      ...filtros,
      [field]: value
    });
  };

  // Function to clear filters
  const handleClearFiltros = () => {
    setFiltros({
      unidade: "",
      fornecedor: "",
      grupo: "",
      dataInicio: "",
      dataFim: "",
      statusPagamento: "todos",
      valorMinimo: "",
      valorMaximo: "",
      reembolso: "todos"
    });
  };

  return (
    <div>
      {/* Search bar and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-8"
            placeholder="Buscar boletos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-shrink-0">
              <Filter className="h-4 w-4 mr-1" />
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <FiltroBoletos 
              filtros={filtros} 
              unidades={unidades}
              fornecedores={fornecedores}
              gruposPagamento={gruposPagamento}
              onFiltroChange={handleFiltroChange}
              onClearFiltros={handleClearFiltros}
              onClose={() => setIsFilterOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Filter results and table */}
      <div className="mt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <div>
            <p className="text-sm text-gray-500">
              {boletosFilterados.length} boleto(s) encontrado(s)
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-sm font-medium">
              Valor Total: <span className="text-[#00c6a7]">R$ {valorTotalFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </p>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Fornecedor/Ref.</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor (R$)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boletosFilterados.length > 0 ? (
                boletosFilterados.map((boleto) => (
                  <TableRow key={boleto.id}>
                    <TableCell className="font-medium">{boleto.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{boleto.fornecedor}</p>
                        <p className="text-xs text-gray-500">{boleto.referencia || boleto.grupo}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>R$ {boleto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      {boleto.pago ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pago</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pendente</Badge>
                      )}
                      {boleto.paraReembolso && (
                        <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-200">Reembolso</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-gray-600"
                          onClick={() => onViewBoleto(boleto)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!boleto.pago && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600"
                            onClick={() => onMarcarPago(boleto)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => onCopyLinhaDigitavel(boleto.linhaDigitavel)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-amber-600"
                          onClick={() => onEditStatus(boleto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-emerald-600"
                          onClick={() => onSendWhatsApp(boleto)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    Nenhum boleto encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
