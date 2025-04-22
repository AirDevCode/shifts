
import ApiService from "@/api/ApiService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent,
  CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { AuthState, initialState, User } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  BellRing, CheckCircle,
  Clock,
  Coffee,
  History,
  Pause,
  Play,
  UserCheck,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

const AdvisorConsole = () => {
  const [advisorStatus, setAdvisorStatus] = useState("available");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<User>(null);
  const [activeTime, setActiveTime] = useState(0);
  const [currentClient, setCurrentClient] = useState<any>(null);
  //const [waitingQueue, setWaitingQueue] = useState(ApiService.fetchAdvisorQueue());

  const { data: waitingQueue = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['waitingQueue'],
    queryFn: () => ApiService.fetchAdvisorQueue()
  });

  

   // Update time every second
   useEffect(() => {
    setUser(initialState.user);
   }, []);

  const [servedClients, setServedClients] = useState([
    { id: "T-001", name: "Ana Martínez", priority: "Alta", serveTime: "10:30", duration: "12:05" },
    { id: "T-002", name: "Juan Pérez", priority: "Alta", serveTime: "10:45", duration: "08:22" },
  ]);
  
  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      if (advisorStatus === "serving" && currentClient) {
        setActiveTime(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [advisorStatus, currentClient]);
  
  // Format active time
  const formatActiveTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  
  // Call next client
  const callNextClient = async () => {
    if (waitingQueue.length > 0 && !currentClient) {
      try {
                
        const nextClient = await ApiService.fetchAdvisorNextQueue();
        setCurrentClient(nextClient);
        // setWaitingQueue(waitingQueue.slice(1));
        setAdvisorStatus("serving");
        setActiveTime(0);
      } catch (error) {
        console.error("Error fetching next client:", error);
      }
    }
  };


  const callClientTurn  = async (currentClient:any) => {
    
    if (waitingQueue.length > 0 && currentClient !=  null) {
      try {
        
        const nextClient = await ApiService.fetchAdvisorQueueTurn(currentClient.queueId);
        setCurrentClient(nextClient);
        // setWaitingQueue(waitingQueue.slice(1));
        setAdvisorStatus("serving");
        setActiveTime(0);
      } catch (error) {
        console.error("Error fetching next client:", error);
      }
    }
  };
  
  // Complete current client
  const completeClient =  async (urrentClient:any) => {
    if (currentClient) {
      await ApiService.queueComplete(currentClient.queueId);
      setServedClients([
        {
          ...currentClient,
          serveTime: currentTime.toLocaleTimeString("es-ES", { 
            hour: "2-digit", 
            minute: "2-digit" 
          }),
          duration: formatActiveTime(activeTime)
        },
        ...servedClients
      ]);
      setCurrentClient(null);
      setAdvisorStatus("available");
    }
  };
  
  // Cancel current client
  const cancelClient = async (currentClient:any) => {
    await ApiService.queueCancel(currentClient.queueId);
    if (currentClient) {
      setCurrentClient(null);
      setAdvisorStatus("available");
    }
  };


  
  
  // Toggle advisor status (pause/resume)
  const togglePause = () => {
    if (advisorStatus === "paused") {
      setAdvisorStatus(currentClient ? "serving" : "available");
    } else {
      setAdvisorStatus("paused");
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-display font-medium tracking-tight animate-fade-in">
          Consola de Asesor
        </h1>
        
        <div className="flex items-center gap-2 text-sm animate-fade-in">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {currentTime.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
          <span className="font-medium">
            {currentTime.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
      
      {/* Advisor Status Card */}
      <Card className="glassmorphism animate-scale-in">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="mr-4 relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-medium">
                  CG
                </div>
                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-card ${
                  advisorStatus === "available" 
                    ? "bg-green-500" 
                    : advisorStatus === "serving"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}></span>
              </div>
              
              {user != null &&  (
                <div className="flex flex-col">
                  <h2 className="text-xl font-display font-medium">{user.name}</h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Mesa 1 - General
                  </div>
                </div>
              )}
       
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Badge variant={advisorStatus === "available" ? "default" : advisorStatus === "serving" ? "outline" : "secondary"} className="py-1.5">
                {advisorStatus === "available" 
                  ? "Disponible" 
                  : advisorStatus === "serving" 
                  ? "En Atención" 
                  : "En Pausa"}
              </Badge>
              
              <Button 
                variant={advisorStatus === "paused" ? "default" : "outline"} 
                size="sm" 
                onClick={togglePause}
                className="h-9"
              >
                {advisorStatus === "paused" ? (
                  <>
                    <Play size={16} className="mr-2" />
                    Reanudar
                  </>
                ) : (
                  <>
                    <Pause size={16} className="mr-2" />
                    Pausar
                  </>
                )}
              </Button>
              
              <Select value={advisorStatus} onValueChange={setAdvisorStatus}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Cambiar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="serving">En Atención</SelectItem>
                  <SelectItem value="paused">En Pausa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Client */}
        <Card className="glassmorphism lg:col-span-2 animate-slide-up ">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-display">Cliente Actual</CardTitle>
          </CardHeader>
          
          <CardContent>
            {currentClient ? (
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="w-full sm:w-auto">
                  <div className="text-sm text-muted-foreground mb-1">Turno</div>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-display font-medium text-primary">
                      {currentClient.code}
                    </div>
                    <Badge 
                      className={`${
                        currentClient.type === "Alta" 
                          ? "bg-red-100 hover:bg-red-100 text-red-800 border-red-200" 
                          : currentClient.type === "Media"
                          ? "bg-yellow-100 hover:bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-blue-100 hover:bg-blue-100 text-blue-800 border-blue-200"
                      }`}
                    >
                      {currentClient.type}
                    </Badge>
                  </div>
                  <div className="text-xl font-medium mt-2">
                    {currentClient.customer}
                  </div>
                </div>
                
                <div className="w-full sm:w-auto space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Tiempo de Atención</div>
                    <div className="text-2xl font-medium">
                      {formatActiveTime(activeTime)}
                    </div>
                  </div>
                  
                  <Progress value={Math.min((activeTime / 600) * 100, 100)} className="h-2" />
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { cancelClient(currentClient) }} 
                      className="w-full sm:w-auto"
                    >
                      <XCircle size={16} className="mr-2 text-red-500" />
                      Cancelar
                    </Button>
                    
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => { completeClient(currentClient) }} 
                      className="w-full sm:w-auto"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Completar
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {advisorStatus === "paused" 
                    ? "Estás en pausa. Reanuda para atender clientes."
                    : "No hay clientes en atención actualmente."}
                </div>
                
                {advisorStatus !== "paused" && (
                  <Button onClick={callNextClient} disabled={waitingQueue.length === 0}>
                    <BellRing size={16} className="mr-2" />
                    Llamar Siguiente Cliente
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Session Stats */}
        <Card className="glassmorphism animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-display">Estadísticas de Sesión</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Clientes Atendidos</div>
                <div className="text-3xl font-medium">{servedClients.length}</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">En Espera</div>
                <div className="text-3xl font-medium">{waitingQueue.length}</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Tiempo Medio</div>
                <div className="text-3xl font-medium">10:14</div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Tiempo Total</div>
                <div className="text-3xl font-medium">2:05h</div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Pausas</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div>3 de 5 pausas</div>
                  <div className="text-xs text-muted-foreground">Tiempo total: 25 min</div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Coffee size={16} className="mr-2" />
                  Solicitar Pausa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Clients Tabs */}
      <Card className="glassmorphism overflow-hidden animate-slide-up" style={{ animationDelay: "150ms" }}>
        <Tabs defaultValue="waiting" className="w-full">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xl font-display">Clientes</CardTitle>
              <TabsList>
                <TabsTrigger value="waiting">En Espera ({waitingQueue.length})</TabsTrigger>
                <TabsTrigger value="served">Atendidos ({servedClients.length})</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          
          <TabsContent value="waiting" className="m-0">
            <CardContent className="p-0">
              {waitingQueue.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-y border-border text-sm text-muted-foreground">
                        <th className="py-3 px-4 text-left font-medium">Turno</th>
                        <th className="py-3 px-4 text-left font-medium">Cliente</th>
                        <th className="py-3 px-4 text-left font-medium">Prioridad</th>
                        <th className="py-3 px-4 text-left font-medium">Tiempo Espera</th>
                        <th className="py-3 px-4 text-left font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitingQueue.map((client, index) => (
                        <tr 
                          key={client.code} 
                          className={`text-sm hover:bg-muted/50 transition-colors ${
                            index !== waitingQueue.length - 1 ? "border-b border-border" : ""
                          }`}
                        >
                          <td className="py-3 px-4">{client.code}</td>
                          <td className="py-3 px-4 font-medium">{client.customer}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              client.type === "Alta" 
                                ? "bg-red-100 text-red-800" 
                                : client.type === "Media"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {client.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">{client.scheduled}</td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={currentClient !== null || advisorStatus === "paused"}
                              onClick={() => { callClientTurn(client) }}
                            >
                              <BellRing size={16} className="mr-2" />
                              Llamar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No hay clientes en espera
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="served" className="m-0">
            <CardContent className="p-0">
              {servedClients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-y border-border text-sm text-muted-foreground">
                        <th className="py-3 px-4 text-left font-medium">Turno</th>
                        <th className="py-3 px-4 text-left font-medium">Cliente</th>
                        <th className="py-3 px-4 text-left font-medium">Prioridad</th>
                        <th className="py-3 px-4 text-left font-medium">Hora</th>
                        <th className="py-3 px-4 text-left font-medium">Duración</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servedClients.map((client, index) => (
                        <tr 
                          key={client.id} 
                          className={`text-sm hover:bg-muted/50 transition-colors ${
                            index !== servedClients.length - 1 ? "border-b border-border" : ""
                          }`}
                        >
                          <td className="py-3 px-4">{client.id}</td>
                          <td className="py-3 px-4 font-medium">{client.name}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              client.priority === "Alta" 
                                ? "bg-red-100 text-red-800" 
                                : client.priority === "Media"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {client.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">{client.serveTime}</td>
                          <td className="py-3 px-4">{client.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No has atendido clientes en esta sesión
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <CardFooter className="flex justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Mostrando datos de la sesión actual
            </div>
            <Button variant="outline" size="sm">
              <History size={16} className="mr-2" />
              Ver Historial Completo
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdvisorConsole;
