
import React from "react";
import { Building2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Falta, StatusFalta } from "../Faltas/types";
import { NoProdutosWarning } from "../Faltas/components/NoProdutosWarning";
import { Badge } from "@/components/ui/badge";

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

interface UnidadesGridProps {
  unidades: any[];
  faltas: Falta[];
  produtosCotacao: ProdutoFalta[];
  onAdicionarCotacao: (produto: ProdutoFalta) => void;
  onRemoverCotacao: (id: number) => void;
}

export default function UnidadesGrid({ 
  unidades, 
  faltas, 
  produtosCotacao,
  onAdicionarCotacao, 
  onRemoverCotacao 
}: UnidadesGridProps) {
  // Função para buscar o grupo do produto
  const obterGrupoProduto = (codigoBarras: string) => {
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
    const produto = produtos.find((p: any) => p.codigoBarras === codigoBarras);
    return produto?.grupo || "Sem grupo";
  };

  // Função para mapear falta para o formato ProdutoFalta
  const mapearParaProdutoFalta = (falta: Falta): ProdutoFalta => {
    return {
      id: falta.id,
      produtoNome: falta.produtoNome,
      codigoBarras: falta.codigoBarras,
      grupo: obterGrupoProduto(falta.codigoBarras),
      quantidadeSolicitada: falta.quantidadeSolicitada,
      quantidadeDisponivel: falta.quantidadeDisponivel,
      unidade: falta.unidade,
      dataLancamento: falta.dataLancamento
    };
  };

  // Verificar se um produto já está na cotação
  const estaNaCotacao = (id: number) => {
    return produtosCotacao.some(p => p.id === id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {unidades.length === 0 ? (
        <div className="col-span-3">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6 text-center">
              <p className="text-yellow-700 font-medium">
                Nenhuma unidade selecionada. Selecione pelo menos uma unidade para visualizar as faltas.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        unidades.map((unidade) => {
          // Filtrar faltas por unidade e status em aberto
          const faltasDaUnidade = faltas.filter(
            f => f.unidade === unidade.nome && f.status === StatusFalta.EM_ABERTO
          );

          // Contar produtos já na cotação
          const produtosNaCotacao = faltasDaUnidade.filter(f => estaNaCotacao(f.id)).length;

          return (
            <Card key={unidade.id} className="overflow-hidden">
              <div className="bg-[#00c6a7] text-white p-4 flex items-center gap-3">
                <Building2 size={20} />
                <h3 className="text-lg font-medium">{unidade.nome}</h3>
                <div className="flex gap-2 ml-auto items-center">
                  {produtosNaCotacao > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                      {produtosNaCotacao} na cotação
                    </Badge>
                  )}
                  <div className="bg-white text-[#00c6a7] text-sm font-bold rounded-full px-3 py-1">
                    {faltasDaUnidade.length} item(s)
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                {faltasDaUnidade.length === 0 ? (
                  <NoProdutosWarning message="Nenhum produto com falta registrada nesta unidade" />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Grupo</TableHead>
                          <TableHead>Qtd.</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {faltasDaUnidade.map(falta => (
                          <TableRow key={falta.id}>
                            <TableCell className="font-medium">{falta.produtoNome}</TableCell>
                            <TableCell>{obterGrupoProduto(falta.codigoBarras)}</TableCell>
                            <TableCell>{falta.quantidadeSolicitada}</TableCell>
                            <TableCell>
                              {estaNaCotacao(falta.id) ? (
                                <Button 
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => onRemoverCotacao(falta.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              ) : (
                                <Button 
                                  size="sm"
                                  className="bg-[#00c6a7] hover:bg-[#00a689]"
                                  onClick={() => onAdicionarCotacao(mapearParaProdutoFalta(falta))}
                                >
                                  <Plus size={16} />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
