
import React, { useState, useEffect } from "react";
import { ArrowLeft, Filter, ShoppingCart, Send, Plus, Trash2, FileDown, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Falta, StatusFalta } from "../Faltas/types";
import { NoProdutosWarning } from "../Faltas/components/NoProdutosWarning";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UnidadesGrid from "./UnidadesGrid";
import CotacaoDashboard from "./CotacaoDashboard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CotacaoComprasProps {
  onReturn: () => void;
}

interface ProdutoFalta {
  id: number;
  produtoNome: string;
  codigoBarras: string;
  grupo: string;
  quantidadeSolicitada: number;
  quantidadeDisponivel: number;
  unidade: string;
  dataLancamento: string;
}

interface Unidade {
  id: number;
  nome: string;
  ativo?: boolean;
}

interface Lote {
  id: number;
  data: string;
  unidades: string[];
  produtos: ProdutoFalta[];
  status: "Em Andamento" | "Enviado" | "Respondido" | "Finalizado";
}

export default function CotacaoCompras({ onReturn }: CotacaoComprasProps) {
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [produtosCotacao, setProdutosCotacao] = useState<ProdutoFalta[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("unidades");
  const [unidadesSelecionadas, setUnidadesSelecionadas] = useState<number[]>([]);
  const [lotesEnviados, setLotesEnviados] = useState<Lote[]>([]);
  const [filtroUnidade, setFiltroUnidade] = useState<string>("todas");

  useEffect(() => {
    // Carregar unidades
    const unidadesSalvas = localStorage.getItem("unidades");
    if (unidadesSalvas) {
      const unidadesParsed = JSON.parse(unidadesSalvas);
      setUnidades(unidadesParsed.filter((u: any) => u.ativo !== false));
      // Selecionar todas as unidades por padrão
      setUnidadesSelecionadas(unidadesParsed.filter((u: any) => u.ativo !== false).map((u: any) => u.id));
    }

    // Carregar faltas
    const faltasSalvas = localStorage.getItem("faltas");
    if (faltasSalvas) {
      setFaltas(JSON.parse(faltasSalvas));
    }

    // Carregar lotes enviados
    const lotesSalvos = localStorage.getItem("lotes_cotacao");
    if (lotesSalvos) {
      setLotesEnviados(JSON.parse(lotesSalvos));
    } else {
      // Criar lotes vazios
      setLotesEnviados([]);
      localStorage.setItem("lotes_cotacao", JSON.stringify([]));
    }
  }, []);

  const handleToggleUnidade = (id: number) => {
    setUnidadesSelecionadas(prev => {
      if (prev.includes(id)) {
        return prev.filter(uId => uId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllUnidades = () => {
    const todasUnidades = unidades.map(u => u.id);
    setUnidadesSelecionadas(todasUnidades);
  };

  const handleUnselectAllUnidades = () => {
    setUnidadesSelecionadas([]);
  };

  const handleAdicionarCotacao = (produto: ProdutoFalta) => {
    if (!produtosCotacao.some(p => p.id === produto.id)) {
      setProdutosCotacao([...produtosCotacao, produto]);
      toast.success(`${produto.produtoNome} adicionado à cotação`);
    } else {
      toast.error("Este produto já está na cotação");
    }
  };

  const handleRemoverCotacao = (id: number) => {
    setProdutosCotacao(produtosCotacao.filter(p => p.id !== id));
    toast.success("Produto removido da cotação");
  };

  const handleEnviarCotacao = () => {
    if (produtosCotacao.length === 0) {
      toast.error("Adicione produtos à cotação primeiro");
      return;
    }
    
    if (unidadesSelecionadas.length === 0) {
      toast.error("Selecione pelo menos uma unidade para enviar a cotação");
      return;
    }
    
    setConfirmDialogOpen(true);
  };

  const confirmarEnvio = () => {
    // Atualizar status das faltas para "Em Cotação"
    const novasFaltas = faltas.map(falta => {
      if (produtosCotacao.some(p => p.id === falta.id)) {
        return { ...falta, status: StatusFalta.EM_COTACAO };
      }
      return falta;
    });

    setFaltas(novasFaltas);
    localStorage.setItem("faltas", JSON.stringify(novasFaltas));
    
    // Criar novo lote
    const novoLote: Lote = {
      id: Date.now(),
      data: new Date().toISOString(),
      unidades: unidadesSelecionadas.map(id => {
        const unidade = unidades.find(u => u.id === id);
        return unidade ? unidade.nome : "";
      }).filter(Boolean),
      produtos: produtosCotacao,
      status: "Enviado"
    };

    const novosLotes = [...lotesEnviados, novoLote];
    setLotesEnviados(novosLotes);
    localStorage.setItem("lotes_cotacao", JSON.stringify(novosLotes));
    
    // Limpar produtos da cotação
    setProdutosCotacao([]);
    setConfirmDialogOpen(false);
    
    toast.success("Lote fechado e enviado para cotação com sucesso!", {
      description: `${produtosCotacao.length} produtos enviados para cotação para ${unidadesSelecionadas.length} unidade(s)`
    });
  };

  // Filtrar unidades selecionadas
  const unidadesFiltradas = unidades.filter(unidade => 
    unidadesSelecionadas.includes(unidade.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00c6a7] to-[#00a689] p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cotação de Compras</h1>
          <Button 
            onClick={onReturn} 
            className="flex items-center gap-2 bg-[#00c6a7] text-white px-4 py-2 rounded-md hover:bg-[#00a689]"
          >
            <ArrowLeft size={16} /> Voltar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="unidades" className="flex items-center gap-2">
              <Building2 size={16} />
              Unidades
            </TabsTrigger>
            <TabsTrigger value="cotacao" className="flex items-center gap-2">
              <ShoppingCart size={16} />
              Dashboard de Cotação ({produtosCotacao.length})
            </TabsTrigger>
            <TabsTrigger value="lotes" className="flex items-center gap-2">
              <FileDown size={16} />
              Lotes Enviados ({lotesEnviados.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unidades">
            <div className="mb-6 bg-gray-50 p-4 rounded-md border">
              <h3 className="text-lg font-medium mb-3">Selecionar Unidades para Cotação</h3>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {unidades.map(unidade => (
                  <div key={unidade.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`unidade-${unidade.id}`} 
                      checked={unidadesSelecionadas.includes(unidade.id)}
                      onCheckedChange={() => handleToggleUnidade(unidade.id)}
                    />
                    <Label htmlFor={`unidade-${unidade.id}`}>{unidade.nome}</Label>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAllUnidades}
                >
                  Selecionar Todas
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUnselectAllUnidades}
                >
                  Limpar Seleção
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end mb-6">
              <Button 
                className="bg-[#00c6a7] hover:bg-[#00a689]" 
                onClick={handleEnviarCotacao}
                disabled={produtosCotacao.length === 0 || unidadesSelecionadas.length === 0}
              >
                <Send size={16} className="mr-2" />
                Fechar Lote e Enviar para Cotação ({produtosCotacao.length})
              </Button>
            </div>
            
            <UnidadesGrid 
              unidades={unidadesFiltradas.length > 0 ? unidadesFiltradas : unidades} 
              faltas={faltas} 
              produtosCotacao={produtosCotacao}
              onAdicionarCotacao={handleAdicionarCotacao}
              onRemoverCotacao={handleRemoverCotacao}
            />
          </TabsContent>
          
          <TabsContent value="cotacao">
            <CotacaoDashboard 
              produtosCotacao={produtosCotacao}
              onRemoverCotacao={handleRemoverCotacao}
              onEnviarCotacao={handleEnviarCotacao}
              unidadesSelecionadas={unidadesSelecionadas.length}
            />
          </TabsContent>
          
          <TabsContent value="lotes">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Lotes Enviados</h2>
                  
                  <div className="flex items-center gap-3">
                    <Label htmlFor="filtro-unidade">Filtrar por Unidade:</Label>
                    <Select 
                      value={filtroUnidade} 
                      onValueChange={setFiltroUnidade}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Todas as unidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as unidades</SelectItem>
                        {unidades.map(unidade => (
                          <SelectItem key={unidade.id} value={unidade.nome}>
                            {unidade.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {lotesEnviados.length === 0 ? (
                  <NoProdutosWarning message="Nenhum lote enviado para cotação" />
                ) : (
                  <div className="space-y-6">
                    {lotesEnviados
                      .filter(lote => 
                        filtroUnidade === "todas" || 
                        lote.unidades.includes(filtroUnidade)
                      )
                      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                      .map(lote => (
                        <Card key={lote.id} className="overflow-hidden">
                          <div className={`
                            p-4 text-white flex items-center justify-between
                            ${lote.status === "Enviado" ? "bg-blue-600" : 
                              lote.status === "Respondido" ? "bg-amber-600" : 
                              lote.status === "Finalizado" ? "bg-green-600" : "bg-gray-600"}
                          `}>
                            <div>
                              <h3 className="font-bold">Lote #{lote.id}</h3>
                              <p className="text-sm">
                                {new Date(lote.data).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="bg-white text-gray-800 rounded-md px-2 py-1 text-sm font-medium">
                                {lote.status}
                              </div>
                              <div className="bg-white text-gray-800 rounded-md px-2 py-1 text-sm font-medium">
                                {lote.produtos.length} produto(s)
                              </div>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Unidades:</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {lote.unidades.map((unidade, index) => (
                                <span 
                                  key={index}
                                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
                                >
                                  {unidade}
                                </span>
                              ))}
                            </div>
                            
                            <h4 className="font-medium mb-2">Produtos por grupo:</h4>
                            {Object.entries(
                              lote.produtos.reduce((grupos: Record<string, any[]>, produto) => {
                                const grupo = produto.grupo || "Sem grupo";
                                if (!grupos[grupo]) grupos[grupo] = [];
                                grupos[grupo].push(produto);
                                return grupos;
                              }, {})
                            ).map(([grupo, produtos]) => (
                              <div key={grupo} className="mb-2">
                                <p className="font-medium">{grupo} ({produtos.length})</p>
                              </div>
                            ))}
                            
                            <div className="flex justify-end mt-4">
                              <Button variant="outline" className="text-blue-600">
                                Ver Detalhes
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Envio</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja fechar o lote e enviar todos os itens para cotação?
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Esta ação mudará o status dos produtos para "Em Cotação" e notificará os fornecedores.
              </p>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">Detalhes do envio:</p>
                <ul className="text-sm list-disc pl-5 mt-1">
                  <li>{produtosCotacao.length} produtos serão enviados para cotação</li>
                  <li>{unidadesSelecionadas.length} unidades selecionadas</li>
                </ul>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-[#00c6a7] hover:bg-[#00a689]" 
                onClick={confirmarEnvio}
              >
                Confirmar e Enviar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
