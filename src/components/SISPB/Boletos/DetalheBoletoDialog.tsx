
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageSquare, Copy, Eye, Image } from "lucide-react";
import { Boleto } from "./types";

interface DetalheBoletoDialogProps {
  boleto: Boleto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarcarPago: (boleto: Boleto) => void;
  onCopyLinhaDigitavel: (linhaDigitavel: string) => void;
  onSendWhatsApp: (boleto: Boleto) => void;
  onViewImage: (imageUrl: string) => void;
}

export default function DetalheBoletoDialog({
  boleto,
  open,
  onOpenChange,
  onMarcarPago,
  onCopyLinhaDigitavel,
  onSendWhatsApp,
  onViewImage
}: DetalheBoletoDialogProps) {
  if (!boleto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Boleto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fornecedor</h3>
              <p>{boleto.fornecedor} ({boleto.tipoFornecedor})</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Unidade</h3>
              <p>{boleto.unidade}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Grupo de Pagamento</h3>
              <p>{boleto.grupo}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Referência</h3>
              <p>{boleto.referencia || "-"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Vencimento</h3>
              <p>{new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Valor</h3>
              <p>R$ {boleto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nota Fiscal</h3>
              <p>{boleto.notaFiscal || "-"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="mt-1">
                {boleto.pago ? (
                  <Badge className="bg-green-100 text-green-800">Pago</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800">Pendente</Badge>
                )}
                {boleto.paraReembolso && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">Para Reembolso</Badge>
                )}
              </div>
            </div>
            
            {boleto.pago && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data de Pagamento</h3>
                  <p>{boleto.dataPagamento ? new Date(boleto.dataPagamento).toLocaleDateString('pt-BR') : "-"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Valor Pago</h3>
                  <p>R$ {boleto.valorPago?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "-"}</p>
                </div>
              </>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Lançamento</h3>
              <p>{boleto.dataLancamento ? new Date(boleto.dataLancamento).toLocaleDateString('pt-BR') : "-"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Operador</h3>
              <p>{boleto.operador || "-"}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Linha Digitável</h3>
            <div className="flex items-center p-2 bg-gray-50 rounded border">
              <p className="font-mono text-sm flex-1 break-all">{boleto.linhaDigitavel}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2"
                onClick={() => onCopyLinhaDigitavel(boleto.linhaDigitavel)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Display attached image if available */}
          {boleto.anexoImagem && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Anexo</h3>
              <div className="flex items-center border rounded-md p-2 bg-gray-50">
                <div className="mr-2">
                  <Image className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium">Imagem anexada</p>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-blue-600"
                    onClick={() => onViewImage(boleto.anexoImagem!)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          
          <div className="flex gap-2">
            {!boleto.pago && (
              <Button 
                onClick={() => {
                  onMarcarPago(boleto);
                  onOpenChange(false);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Marcar como Pago
              </Button>
            )}
            
            <Button 
              onClick={() => onSendWhatsApp(boleto)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Enviar para WhatsApp
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
