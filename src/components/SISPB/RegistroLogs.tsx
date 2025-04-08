
import { useState } from "react";
import { ArrowLeft, Search, FileText, Filter, Calendar, Download, Check, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Types
import { DocumentType, CienciaStatus } from "./types";

interface RegistroLogsProps {
  onReturn: () => void;
}

export default function RegistroLogs({ onReturn }: RegistroLogsProps) {
  const [activeTab, setActiveTab] = useState("documentos");
  const [termo, setTermo] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [status, setStatus] = useState("");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [assinaturaTexto, setAssinaturaTexto] = useState("");
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentType | null>(null);
  
  // Dados simulados para documentos
  const documentos: DocumentType[] = [
    { 
      id: 1, 
      titulo: "Comunicado Interno 001/2025", 
      tipo: "Comunicado", 
      data: "2025-04-08", 
      departamento: "Recursos Humanos", 
      assunto: "Novas políticas de trabalho remoto", 
      status: "pendente", 
      conteudo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut auctor felis at massa efficitur, ac tempus sapien tempor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras vulputate suscipit metus, vel mattis dui vehicula non. Fusce auctor erat eu enim suscipit, non rutrum est posuere. Integer in hendrerit orci. Proin pulvinar eros ac metus lacinia, nec ornare quam tincidunt. Sed consectetur eleifend mi, ut eleifend augue molestie in. Cras eu nunc purus. Ut ultricies augue eget sapien commodo, vitae cursus nibh pellentesque. Nullam sed egestas justo. Pellentesque sit amet augue aliquet, elementum leo quis, ornare lectus.",
      urgencia: "alta"
    },
    { 
      id: 2, 
      titulo: "Circular 023/2025", 
      tipo: "Circular", 
      data: "2025-04-07", 
      departamento: "Diretoria", 
      assunto: "Métricas de desempenho para Q2", 
      status: "pendente", 
      conteudo: "Nullam tristique, enim ut efficitur molestie, odio nulla finibus leo, ac eleifend odio erat in purus. Maecenas lacinia odio lacus, quis tempor nisi imperdiet ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam dapibus nulla nec risus molestie, sit amet efficitur metus pharetra. Donec lobortis enim et justo elementum, non commodo nisi tempor. Aenean metus sem, finibus sit amet nibh et, eleifend tincidunt augue. Sed posuere porta congue. Donec pellentesque massa in tellus porta, eu accumsan tellus ultrices.",
      urgencia: "média"
    },
    { 
      id: 3, 
      titulo: "Procedimento SOPF-2025-012", 
      tipo: "Procedimento", 
      data: "2025-04-06", 
      departamento: "Operações", 
      assunto: "Orientações de segurança para armazenamento", 
      status: "assinado", 
      conteudo: "Fusce venenatis, nulla a vehicula pellentesque, lacus nunc tristique leo, sed posuere odio enim eu eros. Praesent rhoncus, orci vel ultricies sollicitudin, ipsum risus hendrerit nisi, ut eleifend justo erat eu enim. Proin eu mauris libero. Morbi feugiat felis nec arcu tempor elementum. In suscipit vehicula eros, et lacinia justo blandit at. Sed malesuada nibh sapien, nec luctus est placerat vel. Duis vitae euismod massa. Nulla molestie leo vel auctor condimentum. Nunc quis augue neque. Fusce lacinia tortor nec lorem molestie, at pulvinar nunc ultricies. Praesent facilisis metus quis ultrices auctor.",
      urgencia: "baixa"
    },
    { 
      id: 4, 
      titulo: "Norma Regulamentar NR-002", 
      tipo: "Norma", 
      data: "2025-04-05", 
      departamento: "Compliance", 
      assunto: "Atualização da política de segurança da informação", 
      status: "pendente", 
      conteudo: "Integer ac arcu lectus. Cras dictum, odio eget dictum faucibus, ligula dui rhoncus nulla, ultrices pulvinar dolor dolor non lorem. Mauris iaculis, purus eu fermentum eleifend, dolor felis aliquam purus, eu semper magna quam at metus. Duis posuere, est ut scelerisque maximus, lorem massa posuere ipsum, vel placerat felis orci non leo. Praesent eget nulla a enim ornare iaculis. Ut luctus nulla sed diam lobortis, nec congue felis condimentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam placerat enim ac massa pulvinar, a convallis nulla porttitor.",
      urgencia: "alta"
    },
    { 
      id: 5, 
      titulo: "Memorando Técnico 045", 
      tipo: "Memorando", 
      data: "2025-04-04", 
      departamento: "TI", 
      assunto: "Atualização dos sistemas críticos", 
      status: "assinado", 
      conteudo: "Phasellus a lacus metus. Sed quis metus sit amet orci interdum hendrerit. Donec sed arcu a magna hendrerit auctor. Nullam ac rutrum tortor. Praesent ultrices ipsum mauris, vel blandit metus lobortis non. Suspendisse a rutrum magna. Cras pulvinar venenatis ligula vitae scelerisque. Quisque tempus euismod sapien, ut sollicitudin nisi congue ut. Integer ac mi et magna feugiat porttitor. Nullam varius orci nec turpis condimentum sagittis. Vivamus condimentum sapien sed turpis tempus luctus. Nam vehicula ipsum id magna condimentum, eu consequat risus consequat. Aliquam auctor turpis quis nisl egestas, vel condimentum nibh facilisis.",
      urgencia: "média"
    },
  ];
  
  // Filtrar documentos
  const documentosFiltrados = documentos.filter(doc => {
    const matchTermo = 
      doc.titulo.toLowerCase().includes(termo.toLowerCase()) ||
      doc.assunto.toLowerCase().includes(termo.toLowerCase()) ||
      doc.departamento.toLowerCase().includes(termo.toLowerCase());
    
    const matchTipo = tipoDocumento ? doc.tipo === tipoDocumento : true;
    const matchStatus = status ? doc.status === status : true;
    
    // Filtro de data
    let matchData = true;
    if (dataInicio) {
      const docDate = new Date(doc.data);
      const startDate = new Date(dataInicio);
      startDate.setHours(0, 0, 0, 0);
      
      if (docDate < startDate) {
        matchData = false;
      }
    }
    
    if (dataFim && matchData) {
      const docDate = new Date(doc.data);
      const endDate = new Date(dataFim);
      endDate.setHours(23, 59, 59, 999);
      
      if (docDate > endDate) {
        matchData = false;
      }
    }
    
    return matchTermo && matchTipo && matchStatus && matchData;
  });
  
  // Obter valores únicos para os filtros
  const tiposDocumento = Array.from(new Set(documentos.map(doc => doc.tipo)));
  const statusOptions = ["pendente", "assinado"];
  
  const handleExportar = () => {
    toast.success("Documentos exportados com sucesso!", {
      description: "O arquivo foi baixado para o seu computador."
    });
  };

  const handleAssinarDocumento = () => {
    if (!assinaturaTexto.trim()) {
      toast.error("Por favor, digite seu nome completo para assinar", {
        description: "É necessário fornecer a assinatura digital."
      });
      return;
    }

    if (documentoSelecionado) {
      toast.success(`Documento "${documentoSelecionado.titulo}" assinado com sucesso!`, {
        description: "Sua ciência foi registrada no sistema."
      });
      setAssinaturaTexto("");
      setDocumentoSelecionado(null);
    }
  };

  const renderStatusBadge = (status: CienciaStatus) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" /> Pendente
          </Badge>
        );
      case "assinado":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="w-3 h-3 mr-1" /> Assinado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onReturn} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-red-600">Central de Documentos</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="documentos">
            <FileText className="h-4 w-4 mr-2" />
            Documentos para Ciência
          </TabsTrigger>
          <TabsTrigger value="historico">
            <Clock className="h-4 w-4 mr-2" />
            Histórico de Assinaturas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documentos">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Input
                    placeholder="Pesquisar documentos..."
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                  />
                </div>
                
                <div>
                  <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {tiposDocumento.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt === "pendente" ? "Pendente" : "Assinado"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {dataInicio ? dataInicio.toLocaleDateString() : "Data Início"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dataInicio}
                        onSelect={setDataInicio}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {dataFim ? dataFim.toLocaleDateString() : "Data Fim"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dataFim}
                        onSelect={setDataFim}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => {
                  setTermo("");
                  setTipoDocumento("");
                  setStatus("");
                  setDataInicio(undefined);
                  setDataFim(undefined);
                }}>
                  Limpar Filtros
                </Button>
                
                <Button variant="outline" onClick={handleExportar}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Documentos
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {documentosFiltrados.length > 0 ? (
              documentosFiltrados.map((doc) => (
                <Card key={doc.id} className={`overflow-hidden border ${
                  doc.urgencia === 'alta' ? 'border-red-200' : 
                  doc.urgencia === 'média' ? 'border-amber-200' : 'border-blue-200'
                }`}>
                  <CardHeader className={`py-3 ${
                    doc.urgencia === 'alta' ? 'bg-red-50' : 
                    doc.urgencia === 'média' ? 'bg-amber-50' : 'bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        {doc.titulo}
                      </CardTitle>
                      {renderStatusBadge(doc.status as CienciaStatus)}
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <div>{doc.tipo} • {doc.departamento}</div>
                      <div>Data: {new Date(doc.data).toLocaleDateString()}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <h4 className="font-semibold mb-1">Assunto:</h4>
                      <p>{doc.assunto}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-1">Resumo:</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{doc.conteudo}</p>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Visualizar Documento</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>{doc.titulo}</DialogTitle>
                            <DialogDescription>
                              {doc.tipo} • {doc.departamento} • {new Date(doc.data).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Assunto:</h4>
                            <p className="mb-4">{doc.assunto}</p>
                            
                            <h4 className="font-semibold mb-2">Conteúdo:</h4>
                            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                              {doc.conteudo}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {doc.status !== 'assinado' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              onClick={() => setDocumentoSelecionado(doc)}
                              className={`${
                                doc.urgencia === 'alta' ? 'bg-red-600 hover:bg-red-700' : 
                                doc.urgencia === 'média' ? 'bg-amber-600 hover:bg-amber-700' : 
                                'bg-blue-600 hover:bg-blue-700'
                              }`}>
                              Dar Ciência
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assinar Documento</DialogTitle>
                              <DialogDescription>
                                Sua assinatura digital será registrada para o documento: <span className="font-medium">{doc.titulo}</span>
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Digite seu nome completo para confirmar:</h4>
                              <Input
                                value={assinaturaTexto}
                                onChange={(e) => setAssinaturaTexto(e.target.value)}
                                placeholder="Seu nome completo"
                              />
                              
                              <div className="mt-4">
                                <Textarea 
                                  placeholder="Observações (opcional)"
                                  className="resize-none h-20"
                                />
                              </div>
                            </div>
                            
                            <DialogFooter className="mt-4">
                              <Button variant="outline" onClick={() => {
                                setAssinaturaTexto("");
                                setDocumentoSelecionado(null);
                              }}>
                                Cancelar
                              </Button>
                              <Button onClick={handleAssinarDocumento}>
                                Confirmar Assinatura
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 border rounded-lg bg-gray-50">
                <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-lg font-medium text-gray-600">Nenhum documento encontrado</p>
                <p className="text-sm text-gray-500">Tente ajustar os filtros de busca</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Histórico de Documentos Assinados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Data Assinatura</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.filter(doc => doc.status === "assinado").length > 0 ? (
                    documentos
                      .filter(doc => doc.status === "assinado")
                      .map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.titulo}</TableCell>
                          <TableCell>{doc.tipo}</TableCell>
                          <TableCell>{doc.departamento}</TableCell>
                          <TableCell>{new Date(doc.data).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(doc.data).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Visualizar</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>{doc.titulo}</DialogTitle>
                                  <DialogDescription>
                                    {doc.tipo} • {doc.departamento} • {new Date(doc.data).toLocaleDateString()}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="mt-4">
                                  <h4 className="font-semibold mb-2">Assunto:</h4>
                                  <p className="mb-4">{doc.assunto}</p>
                                  
                                  <h4 className="font-semibold mb-2">Conteúdo:</h4>
                                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                                    {doc.conteudo}
                                  </div>
                                  
                                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-green-800 flex items-center">
                                      <Check className="h-4 w-4 mr-2" />
                                      Assinado em {new Date(doc.data).toLocaleDateString()} às 15:30
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="font-medium text-gray-600">Nenhum documento assinado</p>
                        <p className="text-sm text-gray-500">
                          Quando você assinar documentos, eles aparecerão aqui
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
