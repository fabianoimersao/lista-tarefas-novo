'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TaskStats } from '../types/task';

interface AnalyticsWidgetProps {
  stats: TaskStats;
}

export function AnalyticsWidget({ stats }: AnalyticsWidgetProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'time' | 'trends'>('overview');

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };

  const efficiency = stats.totalEstimatedTime > 0 
    ? Math.round((stats.totalActualTime / stats.totalEstimatedTime) * 100)
    : 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics & Insights
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </Button>
          <Button
            variant={activeTab === 'time' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('time')}
          >
            Tempo
          </Button>
          <Button
            variant={activeTab === 'trends' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('trends')}
          >
            Tendências
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Task Distribution */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Distribuição de Tarefas
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pendentes</span>
                    <Badge variant="outline">{stats.todo}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Em Progresso</span>
                    <Badge variant="outline">{stats.inProgress}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Concluídas</span>
                    <Badge variant="outline">{stats.completed}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Atrasadas</span>
                    <Badge variant="destructive">{stats.overdue}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Performance Metrics */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Métricas de Performance
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.productivityScore}%</div>
                  <div className="text-xs text-muted-foreground">Taxa de Conclusão</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.completedToday}</div>
                  <div className="text-xs text-muted-foreground">Concluídas Hoje</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="space-y-6">
            {/* Time Tracking */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Controle de Tempo
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Tempo Estimado Total</div>
                    <div className="text-sm text-muted-foreground">Para todas as tarefas</div>
                  </div>
                  <div className="text-xl font-bold">{formatTime(stats.totalEstimatedTime)}</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Tempo Real Gasto</div>
                    <div className="text-sm text-muted-foreground">Em tarefas concluídas</div>
                  </div>
                  <div className="text-xl font-bold">{formatTime(stats.totalActualTime)}</div>
                </div>

                {efficiency > 0 && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">Eficiência</div>
                      <div className="text-sm text-muted-foreground">Real vs Estimado</div>
                    </div>
                    <div className={`text-xl font-bold ${efficiency <= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                      {efficiency}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* Weekly Trends */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tendências Semanais
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Tarefas Concluídas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{stats.completedThisWeek}</span>
                    <Badge variant="outline">esta semana</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Média Diária</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{Math.round(stats.completedThisWeek / 7)}</span>
                    <Badge variant="outline">por dia</Badge>
                  </div>
                </div>

                {stats.overdue > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span>Atenção Necessária</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-red-600">{stats.overdue}</span>
                      <Badge variant="destructive">atrasadas</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Insights */}
            <div>
              <h4 className="font-medium mb-3">Insights</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {stats.productivityScore >= 80 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Excelente produtividade! Continue assim.
                  </div>
                )}
                {stats.overdue > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-3 w-3" />
                    Você tem {stats.overdue} tarefa{stats.overdue > 1 ? 's' : ''} atrasada{stats.overdue > 1 ? 's' : ''}.
                  </div>
                )}
                {stats.completedToday === 0 && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Target className="h-3 w-3" />
                    Que tal começar o dia concluindo uma tarefa?
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}