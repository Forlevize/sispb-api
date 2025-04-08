
import { useState } from "react";
import { ArrowLeft, PackageOpen, Package, ShoppingCart, ClipboardList, Tags } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CadastroProduto from "./CadastroProduto";
import CadastroGrupo from "./CadastroGrupo";
import LancamentoFalta from "./LancamentoFalta";
import ProdutosLancados from "./ProdutosLancados";
import ProdutosSolicitados from "./ProdutosSolicitados";

interface FaltasProps {
  onReturn: () => void;
}

export default function Faltas({ onReturn }: FaltasProps) {
  const [activeTab, setActiveTab] = useState<string>("cadastro");

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00c6a7] to-[#00a689] p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Controle de Faltas</h1>
          <button
            onClick={onReturn}
            className="flex items-center gap-2 bg-[#00c6a7] text-white px-4 py-2 rounded-md hover:bg-[#00a689]"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="cadastro" className="flex items-center gap-2">
              <Package size={16} />
              Cadastro de Produto
            </TabsTrigger>
            <TabsTrigger value="grupos" className="flex items-center gap-2">
              <Tags size={16} />
              Cadastro de Grupos
            </TabsTrigger>
            <TabsTrigger value="lancamento" className="flex items-center gap-2">
              <PackageOpen size={16} />
              Lançamento de Falta
            </TabsTrigger>
            <TabsTrigger value="lancados" className="flex items-center gap-2">
              <ClipboardList size={16} />
              Produtos Lançados
            </TabsTrigger>
            <TabsTrigger value="solicitados" className="flex items-center gap-2">
              <ShoppingCart size={16} />
              Produtos Solicitados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cadastro">
            <CadastroProduto />
          </TabsContent>

          <TabsContent value="grupos">
            <CadastroGrupo />
          </TabsContent>

          <TabsContent value="lancamento">
            <LancamentoFalta />
          </TabsContent>

          <TabsContent value="lancados">
            <ProdutosLancados />
          </TabsContent>

          <TabsContent value="solicitados">
            <ProdutosSolicitados />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
