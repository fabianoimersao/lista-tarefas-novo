'use client';

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TaskFlowLogo } from "./components/TaskFlowLogo";
import { StatsOverview } from "./components/StatsOverview";
import { ProductivityDashboard } from "./components/ProductivityDashboard";
import { AnalyticsWidget } from "./components/AnalyticsWidget";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskList } from "./components/TaskList";
import { TaskFilters } from "./components/TaskFilters";
import { NotificationCenter } from "./components/NotificationCenter";
import { useTasks } from "./hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Github, 
  Heart, 
  Zap,
  TrendingUp,
  Users,
  Star,
  LayoutDashboard,
  CheckSquare,
  BarChart3
} from "lucide-react";

export default function Home() {
  const {
    tasks,
    filter,
    sort,
    searchQuery,
    stats,
    addTask,
    toggleTask,
    updateTaskStatus,
    deleteTask,
    updateTask,
    clearCompleted,
    duplicateTask,
    setFilter,
    setSort,
    setSearchQuery,
  } = useTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-in">
          <TaskFlowLogo size="lg" />
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
              <Zap className="h-3 w-3" />
              v2.0 - Produtividade Avançada
            </Badge>
            <NotificationCenter stats={stats} />
            <ThemeToggle />
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-lg text-muted-foreground mb-2">
            Transforme suas ideias em conquistas
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Uma experiência completa de gerenciamento de tarefas com estatísticas em tempo real, 
            filtros inteligentes e design moderno para maximizar sua produtividade.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tarefas
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Overview */}
            <StatsOverview stats={stats} />
            
            {/* Productivity Dashboard */}
            <ProductivityDashboard stats={stats} />
            
            {/* Quick Add Task */}
            <AddTaskForm onAddTask={addTask} />
            
            {/* Recent Tasks Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    Tarefas Recentes
                  </h3>
                  <div className="space-y-3">
                    {tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className={`w-3 h-3 rounded-full ${
                          task.priority === 'urgent' ? 'bg-red-500' :
                          task.priority === 'high' ? 'bg-orange-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.category === 'work' ? '💼 Trabalho' :
                             task.category === 'personal' ? '🏠 Pessoal' :
                             task.category === 'shopping' ? '🛒 Compras' :
                             task.category === 'health' ? '🏥 Saúde' :
                             task.category === 'learning' ? '📚 Aprendizado' : '📝 Outros'}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {task.status === 'todo' ? 'Pendente' : 
                           task.status === 'in-progress' ? 'Em Progresso' : 
                           task.status === 'completed' ? 'Concluída' : 'Cancelada'}
                        </Badge>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma tarefa criada ainda
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <AnalyticsWidget stats={stats} />
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            {/* Add Task Form */}
            <AddTaskForm onAddTask={addTask} />

            {/* Task Filters */}
            <TaskFilters
              filter={filter}
              sort={sort}
              searchQuery={searchQuery}
              stats={stats}
              onFilterChange={setFilter}
              onSortChange={setSort}
              onSearchChange={setSearchQuery}
              onClearCompleted={clearCompleted}
            />

            {/* Task List */}
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onDuplicate={duplicateTask}
              onUpdateStatus={updateTaskStatus}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Stats Overview */}
            <StatsOverview stats={stats} />
            
            {/* Analytics Widget */}
            <AnalyticsWidget stats={stats} />
            
            {/* Productivity Dashboard */}
            <ProductivityDashboard stats={stats} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="animate-fade-in mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <TaskFlowLogo size="sm" showText={false} />
                <div>
                  <h3 className="font-semibold">TaskFlow</h3>
                  <p className="text-sm text-muted-foreground">
                    Desenvolvido com Next.js 15 e React 19
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Feito com amor para produtividade</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <span className="hidden sm:inline">GitHub</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span className="hidden sm:inline">Avaliar</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>© 2024 TaskFlow. Todos os direitos reservados.</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Versão 2.0.0</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Construído para equipes e indivíduos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}