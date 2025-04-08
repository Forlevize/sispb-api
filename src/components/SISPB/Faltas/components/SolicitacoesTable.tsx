
import { Falta, StatusFalta } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import { StatusUpdateButton } from "./StatusUpdateButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SolicitacoesTableProps {
  produtosFiltrados: Falta[];
  isAdmin: boolean;
  onDelete: (id: number) => void;
  onUpdateStatus: (falta: Falta, novoStatus: StatusFalta) => void;
}

export function SolicitacoesTable({ 
  produtosFiltrados, 
  isAdmin, 
  onDelete, 
  onUpdateStatus 
}: SolicitacoesTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Código</TableHead>
            <TableHead className="text-center">Qtd. Solicitada</TableHead>
            <TableHead className="text-center">Qtd. Disponível</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((falta) => (
              <TableRow key={falta.id}>
                <TableCell className="font-medium">{falta.produtoNome}</TableCell>
                <TableCell className="font-mono text-xs">{falta.codigoBarras}</TableCell>
                <TableCell className="text-center">{falta.quantidadeSolicitada}</TableCell>
                <TableCell className="text-center">{falta.quantidadeDisponivel}</TableCell>
                <TableCell>{falta.unidade}</TableCell>
                <TableCell>
                  {new Date(falta.dataLancamento).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <StatusBadge status={falta.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <StatusUpdateButton
                      falta={falta}
                      onUpdateStatus={onUpdateStatus}
                    />
                    
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              toast.info("Funcionalidade de edição em desenvolvimento");
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDelete(falta.id)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                Nenhum produto solicitado encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
