
import { useState, useEffect } from "react";
import { Falta, StatusFalta, FiltroFaltas } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { FiltrosComponent } from "./components/FiltrosComponent";
import { FaltasTable } from "./components/FaltasTable";
import { ExportButton } from "./components/ExportButton";

export default function ProdutosLancados() {
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Falta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [unidades, setUnidades] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filtros, setFiltros] = useState<FiltroFaltas>({
    dataInicio: "",
    dataFim: "",
    produto: "",
    unidade: "",
    status: ""
  });

  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);
        setIsAdmin(usuario.perfil === 'administrador' || usuario.permissoes?.includes('admin'));
      } catch (error) {
        console.error("Erro ao verificar permissões do usuário:", error);
      }
    }
  }, []);

  useEffect(() => {
    const faltasSalvas = localStorage.getItem("faltas");
    if (faltasSalvas) {
      const faltasCarregadas = JSON.parse(faltasSalvas);
      setFaltas(faltasCarregadas);
      setProdutosFiltrados(faltasCarregadas);

      const unidadesUnicas = [...new Set(faltasCarregadas.map((falta: Falta) => falta.unidade))];
      setUnidades(unidadesUnicas as string[]);
    }
  }, []);

  useEffect(() => {
    let resultado = [...faltas];

    if (searchTerm) {
      resultado = resultado.filter(
        falta =>
          falta.produtoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          falta.codigoBarras.includes(searchTerm)
      );
    }

    if (filtros.dataInicio) {
      resultado = resultado.filter(
        falta => new Date(falta.dataLancamento) >= new Date(filtros.dataInicio)
      );
    }

    if (filtros.dataFim) {
      resultado = resultado.filter(
        falta => new Date(falta.dataLancamento) <= new Date(filtros.dataFim)
      );
    }

    if (filtros.unidade) {
      resultado = resultado.filter(falta => falta.unidade === filtros.unidade);
    }

    if (filtros.status) {
      resultado = resultado.filter(falta => falta.status === filtros.status);
    }

    setProdutosFiltrados(resultado);
  }, [searchTerm, filtros, faltas]);

  const handleFiltroChange = (campo: keyof FiltroFaltas, valor: string) => {
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [campo]: valor
    }));
  };

  const handleLimparFiltros = () => {
    setFiltros({
      dataInicio: "",
      dataFim: "",
      produto: "",
      unidade: "",
      status: ""
    });
    setSearchTerm("");
  };

  const handleExcluirFalta = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      const novasFaltas = faltas.filter(falta => falta.id !== id);
      setFaltas(novasFaltas);
      localStorage.setItem("faltas", JSON.stringify(novasFaltas));
      toast.success("Item excluído com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-[#00c6a7]" />
                Produtos Lançados
              </h2>
              <ExportButton 
                items={produtosFiltrados} 
                filename="faltas" 
              />
            </div>

            <FiltrosComponent
              filtros={filtros}
              searchTerm={searchTerm}
              unidades={unidades}
              statusOptions={Object.values(StatusFalta)}
              onSearchChange={setSearchTerm}
              onFiltroChange={handleFiltroChange}
              onLimparFiltros={handleLimparFiltros}
            />

            <FaltasTable
              produtosFiltrados={produtosFiltrados}
              isAdmin={isAdmin}
              onDelete={handleExcluirFalta}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
