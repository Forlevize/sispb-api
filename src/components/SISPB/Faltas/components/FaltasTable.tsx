
import { Falta, StatusFalta } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FaltasTableProps {
  produtosFiltrados: Falta[];
  isAdmin: boolean;
  onDelete: (id: number) => void;
}

export function FaltasTable({ produtosFiltrados, isAdmin, onDelete }: FaltasTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Código</TableHead>
            <TableHead className="text-center">Qtd. Solicitada</TableHead>
            <TableHead className="text-center">Qtd. Disponível</TableHead>
            <TableHead>Operador</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            {isAdmin && <TableHead className="text-right">Ações</TableHead>}
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
                <TableCell>{falta.operador}</TableCell>
                <TableCell>{falta.unidade}</TableCell>
                <TableCell>
                  {new Date(falta.dataLancamento).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <StatusBadge status={falta.status} />
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
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
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isAdmin ? 9 : 8} className="text-center h-24 text-muted-foreground">
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
