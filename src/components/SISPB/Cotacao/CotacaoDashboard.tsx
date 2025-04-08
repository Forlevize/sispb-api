
import React, { useState } from "react";
import { FileDown, Send, Trash2, Award, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NoProdutosWarning } from "../Faltas/components/NoProdutosWarning";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

interface Lance {
  id: number;
  fornecedor: string;
  valor: number;
  prazoEntrega: string;
  observacoes?: string;
}

interface CotacaoDashboardProps {
  produtosCotacao: ProdutoFalta[];
  onRemoverCotacao: (id: number) => void;
  onEnviarCotacao: () => void;
  unidadesSelecionadas: number;
}

export default function CotacaoDashboard({ 
  produtosCotacao, 
  onRemoverCotacao,
  onEnviarCotacao,
  unidadesSelecionadas
}: CotacaoDashboardProps) {
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoFalta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lanceSelecionado, setLanceSelecionado] = useState<number | null>(null);

  // Dados simulados de lances para o produto selecionado
  const lancesMock: Lance[] = [
    { id: 1, fornecedor: "Fornecedor A", valor: 25.50, prazoEntrega: "3 dias úteis", observacoes: "Disponível em estoque" },
    { id: 2, fornecedor: "Fornecedor B", valor: 22.80, prazoEntrega: "5 dias úteis" },
    { id: 3, fornecedor: "Fornecedor C", valor: 28.00, prazoEntrega: "2 dias úteis", observacoes: "Entrega prioritária" },
    { id: 4, fornecedor: "Fornecedor D", valor: 24.00, prazoEntrega: "4 dias úteis" },
  ];

  // Agrupar produtos por grupo
  const produtosAgrupados = produtosCotacao.reduce((grupos: Record<string, ProdutoFalta[]>, produto) => {
    const grupo = produto.grupo || "Sem grupo";
    if (!grupos[grupo]) {
      grupos[grupo] = [];
    }
    grupos[grupo].push(produto);
    return grupos;
  }, {});

  // Agrupar produtos por unidade
  const produtosPorUnidade = produtosCotacao.reduce((unidades: Record<string, ProdutoFalta[]>, produto) => {
    const unidade = produto.unidade;
    if (!unidades[unidade]) {
      unidades[unidade] = [];
    }
    unidades[unidade].push(produto);
    return unidades;
  }, {});

  const handleVerLances = (produto: ProdutoFalta) => {
    setProdutoSelecionado(produto);
    setDialogOpen(true);
  };

  const handleFecharDialog = () => {
    setDialogOpen(false);
    setProdutoSelecionado(null);
    setLanceSelecionado(null);
  };

  const handleAprovarLance = () => {
    if (!lanceSelecionado) {
      toast.error("Selecione um lance para aprovar");
      return;
    }

    const lanceSelecionadoObj = lancesMock.find(lance => lance.id === lanceSelecionado);
    
    toast.success("Lance aprovado com sucesso!", {
      description: `O fornecedor ${lanceSelecionadoObj?.fornecedor} venceu a cotação para o produto ${produtoSelecionado?.produtoNome}`
    });
    
    handleFecharDialog();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Dashboard de Cotação</h2>
            
            <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {unidadesSelecionadas} unidade(s) selecionada(s)
            </div>
          </div>
          
          {produtosCotacao.length === 0 ? (
            <NoProdutosWarning message="Nenhum produto adicionado à cotação. Adicione produtos da lista de unidades." />
          ) : (
            <div className="space-y-8">
              {/* Resumo por unidade */}
              <div>
                <h3 className="text-lg font-medium mb-3">Resumo por Unidade</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(produtosPorUnidade).map(([unidade, produtos]) => (
                    <Card key={unidade} className="bg-gray-50">
                      <CardContent className="p-4">
                        <h4 className="font-medium">{unidade}</h4>
                        <p className="text-2xl font-bold mt-2">{produtos.length} produto(s)</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Produtos agrupados */}
              <div>
                <h3 className="text-lg font-medium mb-3">Produtos por Grupo</h3>
                {Object.entries(produtosAgrupados).map(([grupo, produtos]) => (
                  <div key={grupo} className="border rounded-md overflow-hidden mb-4">
                    <div className="bg-gray-100 p-3 font-medium">
                      Grupo: {grupo} ({produtos.length} produto(s))
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Código de Barras</TableHead>
                          <TableHead>Unidade</TableHead>
                          <TableHead>Qtd. Solicitada</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {produtos.map(produto => (
                          <TableRow key={produto.id}>
                            <TableCell className="font-medium">{produto.produtoNome}</TableCell>
                            <TableCell>{produto.codigoBarras}</TableCell>
                            <TableCell>{produto.unidade}</TableCell>
                            <TableCell>{produto.quantidadeSolicitada}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 border-blue-600"
                                  onClick={() => handleVerLances(produto)}
                                >
                                  <Eye size={16} className="mr-1" /> Lances
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => onRemoverCotacao(produto.id)}
                                >
                                  <Trash2 size={16} className="mr-1" /> Remover
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" className="gap-2">
                  <FileDown size={16} /> Exportar Lista
                </Button>
                
                <Button 
                  className="bg-[#00c6a7] hover:bg-[#00a689]" 
                  onClick={onEnviarCotacao}
                  disabled={unidadesSelecionadas === 0}
                >
                  <Send size={16} className="mr-2" />
                  Fechar Lote e Enviar para Cotação
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para visualizar e selecionar lances */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Lances para o Produto</DialogTitle>
            <DialogDescription>
              Selecione o melhor lance para o produto {produtoSelecionado?.produtoNome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Produto</p>
                  <p className="font-medium">{produtoSelecionado?.produtoNome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Código de Barras</p>
                  <p className="font-medium">{produtoSelecionado?.codigoBarras}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unidade</p>
                  <p className="font-medium">{produtoSelecionado?.unidade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantidade Solicitada</p>
                  <p className="font-medium">{produtoSelecionado?.quantidadeSolicitada}</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">Selecionar</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Valor Unitário</TableHead>
                    <TableHead>Prazo de Entrega</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <RadioGroup value={lanceSelecionado?.toString()} onValueChange={(value) => setLanceSelecionado(Number(value))}>
                    {lancesMock.map(lance => (
                      <TableRow key={lance.id} className={lanceSelecionado === lance.id ? "bg-blue-50" : ""}>
                        <TableCell>
                          <RadioGroupItem value={lance.id.toString()} id={`lance-${lance.id}`} />
                        </TableCell>
                        <TableCell className="font-medium">{lance.fornecedor}</TableCell>
                        <TableCell>R$ {lance.valor.toFixed(2)}</TableCell>
                        <TableCell>{lance.prazoEntrega}</TableCell>
                        <TableCell>{lance.observacoes || "-"}</TableCell>
                        <TableCell>
                          {lance.valor === Math.min(...lancesMock.map(l => l.valor)) ? (
                            <Badge className="bg-green-100 text-green-800">Menor valor</Badge>
                          ) : (
                            <Badge variant="outline">Regular</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </RadioGroup>
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleFecharDialog}>
              Cancelar
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={handleAprovarLance}
              disabled={!lanceSelecionado}
            >
              <Award size={16} className="mr-2" />
              Aprovar Lance Selecionado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
