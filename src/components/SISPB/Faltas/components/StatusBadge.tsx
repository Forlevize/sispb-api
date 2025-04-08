
import { StatusFalta } from "../types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: StatusFalta;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={
        status === StatusFalta.EM_ABERTO 
          ? "border-orange-200 bg-orange-100 text-orange-800" 
          : status === StatusFalta.SOLICITADO 
          ? "border-blue-200 bg-blue-100 text-blue-800"
          : status === StatusFalta.EM_COTACAO
          ? "border-purple-200 bg-purple-100 text-purple-800"
          : status === StatusFalta.PEDIDO_REALIZADO
          ? "border-cyan-200 bg-cyan-100 text-cyan-800"
          : "border-green-200 bg-green-100 text-green-800"
      }
    >
      {status}
    </Badge>
  );
}
