'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PomodoroTimer } from './PomodoroTimer';
import { 
  Trophy, 
  Target, 
  Flame, 
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  Award
} from 'lucide-react';
import { TaskStats } from '../types/task';

interface ProductivityDashboardProps {
  stats: TaskStats;
}

export function ProductivityDashboard({ stats }: ProductivityDashboardProps) {
  const getProductivityLevel = (score: number) => {
    if (score >= 90) return { level: 'Ninja', color: 'text-purple-600', icon: <Trophy className="h-4 w-4" /> };
    if (score >= 75) return { level: 'Expert', color: 'text-blue-600', icon: <Award className="h-4 w-4" /> };
    if (score >= 60) return { level: 'Avançado', color: 'text-green-600', icon: <Target className="h-4 w-4" /> };
    if (score >= 40) return { level: 'Intermediário', color: 'text-yellow-600', icon: <Zap className="h-4 w-4" /> };
    return { level: 'Iniciante', color: 'text-gray-600', icon: <Clock className="h-4 w-4" /> };
  };

  const productivity = getProductivityLevel(stats.productivityScore);
  const streak = Math.min(stats.completedThisWeek, 7); // Simulated streak

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      {/* Productivity Score */}
      <Card className="animate-scale-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-lg taskflow-gradient">
              {productivity.icon}
            </div>
            Nível de Produtividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{stats.productivityScore}%</div>
              <Badge className={`${productivity.color} bg-transparent border-current`}>
                {productivity.level}
              </Badge>
            </div>
            
            <Progress value={stats.productivityScore} className="h-2" />
            
            <div className="text-sm text-muted-foreground text-center">
              {stats.completed} de {stats.total} tarefas concluídas
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Streak */}
      <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Flame className="h-4 w-4 text-orange-600" />
            </div>
            Sequência Diária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{streak}</div>
              <div className="text-sm text-muted-foreground">
                dias consecutivos
              </div>
            </div>
            
            <div className="flex justify-center gap-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    i < streak 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i < streak ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                </div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              {streak === 7 ? 'Semana perfeita! 🎉' : `Faltam ${7 - streak} dias para completar a semana`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Ver tarefas de hoje ({stats.completedToday})
            </Button>
            
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Tarefas em progresso ({stats.inProgress})
            </Button>
            
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Flame className="h-4 w-4 mr-2" />
              Tarefas urgentes
            </Button>
            
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground mb-2">Meta semanal</div>
              <Progress value={(stats.completedThisWeek / 10) * 100} className="h-1" />
              <div className="text-xs text-muted-foreground mt-1">
                {stats.completedThisWeek}/10 tarefas esta semana
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pomodoro Timer */}
      <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
        <PomodoroTimer />
      </div>
    </div>
  );
}