
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Boleto } from "./types";
import { useState, useEffect } from "react";

interface StatusBoletoDialogProps {
  boleto: Boleto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAtualizarStatus: (boletoAtualizado: Boleto) => void;
}

export default function StatusBoletoDialog({
  boleto,
  open,
  onOpenChange,
  onAtualizarStatus
}: StatusBoletoDialogProps) {
  const [boletoAtualizado, setBoletoAtualizado] = useState<Boleto | null>(null);

  // Update local state when boleto changes
  useEffect(() => {
    if (boleto) {
      setBoletoAtualizado({ ...boleto });
    }
  }, [boleto]);

  if (!boleto || !boletoAtualizado) return null;

  const handleSave = () => {
    onAtualizarStatus(boletoAtualizado);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Status do Boleto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status de Pagamento</h3>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={boletoAtualizado.pago}
                    onCheckedChange={(checked) => {
                      setBoletoAtualizado({
                        ...boletoAtualizado,
                        pago: checked,
                        dataPagamento: checked ? (boletoAtualizado.dataPagamento || new Date().toISOString().split('T')[0]) : undefined,
                        valorPago: checked ? (boletoAtualizado.valorPago || boletoAtualizado.valor) : undefined
                      });
                    }}
                  />
                  <Label>Boleto Pago</Label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Reembolso</h3>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={boletoAtualizado.paraReembolso}
                    onCheckedChange={(checked) => {
                      setBoletoAtualizado({
                        ...boletoAtualizado,
                        paraReembolso: checked
                      });
                    }}
                  />
                  <Label>Marcar para Reembolso</Label>
                </div>
              </div>
            </div>
          </div>
          
          {boletoAtualizado.pago && (
            <>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Data do Pagamento</label>
                <Input 
                  type="date" 
                  value={boletoAtualizado.dataPagamento || ''}
                  onChange={(e) => {
                    setBoletoAtualizado({
                      ...boletoAtualizado,
                      dataPagamento: e.target.value
                    });
                  }}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Valor Pago (R$)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0,00" 
                  value={boletoAtualizado.valorPago || ''}
                  onChange={(e) => {
                    setBoletoAtualizado({
                      ...boletoAtualizado,
                      valorPago: parseFloat(e.target.value)
                    });
                  }}
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-[#00c6a7] hover:bg-[#00c6a7]/90"
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
