'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  Calendar,
  Zap
} from 'lucide-react';
import { TaskStats } from '../types/task';

interface StatsOverviewProps {
  stats: TaskStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Tasks */}
      <Card className="animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {stats.todo} pendentes
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stats.inProgress} em progresso
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.completed} de {stats.total} concluídas
          </p>
        </CardContent>
      </Card>

      {/* Overdue Tasks */}
      <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Precisam de atenção urgente
          </p>
        </CardContent>
      </Card>

      {/* Productivity Score */}
      <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Score de Produtividade</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.productivityScore}</div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <p className="text-xs text-muted-foreground">
              {stats.completedToday} concluídas hoje
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Time Tracking */}
      {(stats.totalEstimatedTime > 0 || stats.totalActualTime > 0) && (
        <Card className="animate-fade-in md:col-span-2" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Controle de Tempo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Tempo Estimado</p>
                <p className="text-lg font-semibold">{formatTime(stats.totalEstimatedTime)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tempo Real</p>
                <p className="text-lg font-semibold">{formatTime(stats.totalActualTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Progress */}
      <Card className="animate-fade-in md:col-span-2" style={{ animationDelay: '0.5s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progresso Semanal</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedThisWeek}</div>
          <p className="text-xs text-muted-foreground">
            tarefas concluídas esta semana
          </p>
          <div className="mt-2">
            <Badge variant={stats.completedThisWeek >= 7 ? "default" : "secondary"}>
              {stats.completedThisWeek >= 7 ? "Meta atingida!" : "Continue assim!"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}