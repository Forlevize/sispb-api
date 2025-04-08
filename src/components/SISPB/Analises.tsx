
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Building2, CreditCard, TrendingUp, Calendar } from "lucide-react";
import { LineChart as LucideLineChart } from "lucide-react";
import { BarChart, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Bar, LineChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface AnalisesProps {
  onReturn: () => void;
}

// Dados simulados para os gráficos
const dadosOperadores = [
  { nome: "Emanuel Neres", logins: 45, boletosRegistrados: 32, grupo: "Administrador" },
  { nome: "Maria Silva", logins: 30, boletosRegistrados: 20, grupo: "Financeiro" },
  { nome: "João Santos", logins: 25, boletosRegistrados: 15, grupo: "Farmacêutico" },
  { nome: "Ana Oliveira", logins: 18, boletosRegistrados: 8, grupo: "Balconista Nível I" },
  { nome: "Carlos Pereira", logins: 12, boletosRegistrados: 5, grupo: "Balconista Nível II" },
];

const dadosFornecedores = [
  { nome: "Distribuidor A", totalBoletos: 35, valor: 25000, status: "Regular" },
  { nome: "Distribuidor B", totalBoletos: 28, valor: 18500, status: "Regular" },
  { nome: "Laboratório C", totalBoletos: 22, valor: 15000, status: "Atraso" },
  { nome: "Fornecedor D", totalBoletos: 15, valor: 9800, status: "Regular" },
  { nome: "Fornecedor E", totalBoletos: 12, valor: 7500, status: "Atraso" },
];

const dadosPagamentosMensais = [
  { mes: "Jan", boletos: 42, valor: 32500, pagos: 38 },
  { mes: "Fev", boletos: 38, valor: 28900, pagos: 35 },
  { mes: "Mar", boletos: 45, valor: 34200, pagos: 40 },
  { mes: "Abr", boletos: 39, valor: 29800, pagos: 32 },
  { mes: "Mai", boletos: 47, valor: 36500, pagos: 42 },
  { mes: "Jun", boletos: 50, valor: 39000, pagos: 46 },
  { mes: "Jul", boletos: 48, valor: 37500, pagos: 43 },
  { mes: "Ago", boletos: 52, valor: 41000, pagos: 48 },
  { mes: "Set", boletos: 54, valor: 42500, pagos: 50 },
  { mes: "Out", boletos: 49, valor: 38700, pagos: 45 },
  { mes: "Nov", boletos: 51, valor: 40200, pagos: 47 },
  { mes: "Dez", boletos: 58, valor: 45000, pagos: 53 },
];

const dadosUnidades = [
  { nome: "Matriz São Luís", boletos: 120, valorTotal: 85000, boletosAtrasados: 8 },
  { nome: "Filial Imperatriz", boletos: 85, valorTotal: 62000, boletosAtrasados: 5 },
  { nome: "Filial Bacabal", boletos: 65, valorTotal: 48000, boletosAtrasados: 3 },
  { nome: "Filial Timon", boletos: 55, valorTotal: 42000, boletosAtrasados: 4 },
  { nome: "Filial Caxias", boletos: 40, valorTotal: 32000, boletosAtrasados: 2 },
];

const dadosGruposPagamento = [
  { nome: "Medicamentos", valor: 125000, percentual: 45 },
  { nome: "Aluguel", valor: 55000, percentual: 20 },
  { nome: "Serviços", valor: 35000, percentual: 12 },
  { nome: "Equipamentos", valor: 25000, percentual: 9 },
  { nome: "Publicidade", valor: 15000, percentual: 5 },
  { nome: "Outros", valor: 25000, percentual: 9 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Analises({ onReturn }: AnalisesProps) {
  const [periodoOperadores, setPeriodoOperadores] = useState("mes");
  const [periodoFornecedores, setPeriodoFornecedores] = useState("mes");
  const [periodoUnidades, setPeriodoUnidades] = useState("mes");
  const [periodoPagamentos, setPeriodoPagamentos] = useState("ano");

  return (
    <div className="min-h-screen bg-[#00c6a7] bg-cover bg-center p-4 md:p-6" 
         style={{ backgroundImage: "url('/farmacia-fundo.png')" }}>
      <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <LucideLineChart className="h-6 w-6 text-[#00c6a7] mr-2" />
            <h2 className="text-xl font-bold text-[#00c6a7]">Análises e Estatísticas</h2>
          </div>
        </div>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="operadores">Operadores</TabsTrigger>
            <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
            <TabsTrigger value="unidades">Unidades</TabsTrigger>
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          </TabsList>
          
          {/* Tab Visão Geral */}
          <TabsContent value="geral">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-[#00c6a7]" />
                    Resumo de Pagamentos (Anual)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dadosPagamentosMensais}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="boletos"
                          stroke="#8884d8"
                          name="Total Boletos"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="pagos"
                          stroke="#82ca9d"
                          name="Boletos Pagos"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-[#00c6a7]" />
                    Distribuição por Grupo de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosGruposPagamento}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="valor"
                          nameKey="nome"
                          label={({ nome, percentual }) => `${nome}: ${percentual}%`}
                        >
                          {dadosGruposPagamento.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Valor']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Users className="h-5 w-5 mr-2 text-[#00c6a7]" />
                    Top Fornecedores (Por Valor)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosFornecedores}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Valor']} />
                        <Legend />
                        <Bar dataKey="valor" name="Valor Total (R$)" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-[#00c6a7]" />
                    Comparativo por Unidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosUnidades}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="boletos" name="Total de Boletos" fill="#8884d8" />
                        <Bar dataKey="boletosAtrasados" name="Boletos Atrasados" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Operadores */}
          <TabsContent value="operadores">
            <div className="mb-4 flex justify-end">
              <Select value={periodoOperadores} onValueChange={setPeriodoOperadores}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mês</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Users className="h-5 w-5 mr-2 text-red-600" />
                    Atividade de Operadores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosOperadores}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="nome" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="logins" name="Número de Logins" fill="#8884d8" />
                        <Bar dataKey="boletosRegistrados" name="Boletos Registrados" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-red-600" />
                    Evolução de Atividade (Por Dia)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { dia: '01/04', acessos: 15, registros: 10 },
                          { dia: '02/04', acessos: 18, registros: 12 },
                          { dia: '03/04', acessos: 14, registros: 8 },
                          { dia: '04/04', acessos: 20, registros: 15 },
                          { dia: '05/04', acessos: 25, registros: 18 },
                          { dia: '06/04', acessos: 22, registros: 16 },
                          { dia: '07/04', acessos: 12, registros: 7 },
                          { dia: '08/04', acessos: 24, registros: 19 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="acessos" name="Acessos" stroke="#8884d8" />
                        <Line type="monotone" dataKey="registros" name="Registros" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Fornecedores */}
          <TabsContent value="fornecedores">
            <div className="mb-4 flex justify-end">
              <Select value={periodoFornecedores} onValueChange={setPeriodoFornecedores}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mês</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Users className="h-5 w-5 mr-2 text-red-600" />
                    Fornecedores por Volume de Boletos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosFornecedores}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalBoletos" name="Boletos Registrados" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-red-600" />
                    Fornecedores por Valor Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosFornecedores}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="valor"
                        >
                          {dadosFornecedores.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Valor Total']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Unidades */}
          <TabsContent value="unidades">
            <div className="mb-4 flex justify-end">
              <Select value={periodoUnidades} onValueChange={setPeriodoUnidades}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mês</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-red-600" />
                    Comparativo de Boletos por Unidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosUnidades}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="nome" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="boletos" name="Total de Boletos" fill="#8884d8" />
                        <Bar dataKey="boletosAtrasados" name="Boletos Atrasados" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-red-600" />
                    Comparativo de Valores por Unidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosUnidades}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Valor Total']} />
                        <Legend />
                        <Bar dataKey="valorTotal" name="Valor Total (R$)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Pagamentos */}
          <TabsContent value="pagamentos">
            <div className="mb-4 flex justify-end">
              <Select value={periodoPagamentos} onValueChange={setPeriodoPagamentos}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="semestre">Último semestre</SelectItem>
                  <SelectItem value="ano">Último ano</SelectItem>
                  <SelectItem value="2anos">Últimos 2 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-red-600" />
                    Evolução de Boletos por Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dadosPagamentosMensais}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="boletos" name="Boletos Totais" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="pagos" name="Boletos Pagos" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-red-600" />
                    Evolução de Valores por Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosPagamentosMensais}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Valor Total']} />
                        <Legend />
                        <Bar dataKey="valor" name="Valor Total (R$)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={onReturn}
            className="border-[#00c6a7] text-[#00c6a7] hover:bg-blue-50"
          >
            Retornar ao Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
