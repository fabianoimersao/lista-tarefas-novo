'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X,
  Calendar,
  Clock
} from 'lucide-react';
import { TaskStats } from '../types/task';

interface NotificationCenterProps {
  stats: TaskStats;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationCenter({ stats }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const newNotifications: Notification[] = [];

    // Check for overdue tasks
    if (stats.overdue > 0) {
      newNotifications.push({
        id: 'overdue-tasks',
        type: 'warning',
        title: 'Tarefas Atrasadas',
        message: `Você tem ${stats.overdue} tarefa${stats.overdue > 1 ? 's' : ''} atrasada${stats.overdue > 1 ? 's' : ''}`,
        timestamp: new Date(),
        read: false,
      });
    }

    // Check for productivity milestones
    if (stats.productivityScore >= 90) {
      newNotifications.push({
        id: 'productivity-milestone',
        type: 'success',
        title: 'Produtividade Excelente!',
        message: `Parabéns! Você atingiu ${stats.productivityScore}% de produtividade`,
        timestamp: new Date(),
        read: false,
      });
    }

    // Check for daily goals
    if (stats.completedToday >= 5) {
      newNotifications.push({
        id: 'daily-goal',
        type: 'success',
        title: 'Meta Diária Atingida!',
        message: `Você completou ${stats.completedToday} tarefas hoje`,
        timestamp: new Date(),
        read: false,
      });
    }

    // Weekly progress
    if (stats.completedThisWeek >= 7) {
      newNotifications.push({
        id: 'weekly-progress',
        type: 'info',
        title: 'Progresso Semanal',
        message: `Ótimo trabalho! ${stats.completedThisWeek} tarefas completadas esta semana`,
        timestamp: new Date(),
        read: false,
      });
    }

    setNotifications(newNotifications);
  }, [stats]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getBadgeVariant = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'info':
        return 'secondary';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 z-50 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Notificações</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read 
                      ? 'bg-muted/50 border-muted' 
                      : 'bg-background border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {notification.timestamp.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs h-6"
                          >
                            Marcar como lida
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}