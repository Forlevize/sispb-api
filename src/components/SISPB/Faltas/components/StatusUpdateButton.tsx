
import { Falta, StatusFalta } from "../types";
import { Button } from "@/components/ui/button";
import { RotateCw, ClipboardCheck, TruckIcon, CheckCircle, ArrowUpCircle } from "lucide-react";

interface StatusUpdateButtonProps {
  falta: Falta;
  onUpdateStatus: (falta: Falta, novoStatus: StatusFalta) => void;
}

export function StatusUpdateButton({ falta, onUpdateStatus }: StatusUpdateButtonProps) {
  const getProximoStatus = (statusAtual: StatusFalta): StatusFalta => {
    switch (statusAtual) {
      case StatusFalta.SOLICITADO:
        return StatusFalta.EM_COTACAO;
      case StatusFalta.EM_COTACAO:
        return StatusFalta.PEDIDO_REALIZADO;
      case StatusFalta.PEDIDO_REALIZADO:
        return StatusFalta.RECEBIDO;
      default:
        return statusAtual;
    }
  };

  const getStatusIcon = (status: StatusFalta) => {
    switch (status) {
      case StatusFalta.SOLICITADO:
        return <ClipboardCheck className="h-4 w-4" />;
      case StatusFalta.EM_COTACAO:
        return <RotateCw className="h-4 w-4" />;
      case StatusFalta.PEDIDO_REALIZADO:
        return <TruckIcon className="h-4 w-4" />;
      case StatusFalta.RECEBIDO:
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <ArrowUpCircle className="h-4 w-4" />;
    }
  };

  if (falta.status === StatusFalta.RECEBIDO) {
    return (
      <span className="text-green-600 flex items-center justify-end">
        <CheckCircle className="h-4 w-4 mr-1" /> Finalizado
      </span>
    );
  }

  const proximoStatus = getProximoStatus(falta.status as StatusFalta);

  return (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center space-x-1"
      onClick={() => onUpdateStatus(falta, proximoStatus)}
    >
      {getStatusIcon(proximoStatus)}
      <span>
        {falta.status === StatusFalta.SOLICITADO
          ? "Em Cotação"
          : falta.status === StatusFalta.EM_COTACAO
          ? "Pedido Realizado"
          : "Recebido"}
      </span>
    </Button>
  );
}
