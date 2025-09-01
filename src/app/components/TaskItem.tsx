'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  MoreHorizontal,
  Copy,
  Clock,
  Calendar,
  Flag,
  Tag as TagIcon,
  Play,
  Pause,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task, TaskStatus, TaskPriority } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDuplicate?: (id: string) => void;
  onUpdateStatus?: (id: string, status: TaskStatus) => void;
}

const priorityColors = {
  low: 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
  medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
  high: 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20',
  urgent: 'border-l-red-500 bg-red-50 dark:bg-red-950/20',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

const categoryColors = {
  work: 'category-work',
  personal: 'category-personal',
  shopping: 'category-shopping',
  health: 'category-health',
  learning: 'category-learning',
  other: 'category-other',
};

const statusIcons = {
  todo: <Clock className="h-4 w-4" />,
  'in-progress': <Play className="h-4 w-4" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <X className="h-4 w-4" />,
};

export function TaskItem({ 
  task, 
  onToggle, 
  onDelete, 
  onUpdate, 
  onDuplicate,
  onUpdateStatus 
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSave = () => {
    if (!editTitle.trim()) return;
    
    onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'completed';
  const isCompleted = task.status === 'completed';

  return (
    <Card className={`w-full transition-all duration-200 animate-slide-in border-l-4 ${priorityColors[task.priority]} ${isCompleted ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full"
                  placeholder="Título da tarefa"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="min-h-20 resize-none"
                  placeholder="Descrição (opcional)"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={!editTitle.trim()}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-medium leading-tight ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {statusIcons[task.status]}
                      <Badge variant="outline" className="text-xs">
                        {task.status === 'todo' ? 'Pendente' : 
                         task.status === 'in-progress' ? 'Em Progresso' : 
                         task.status === 'completed' ? 'Concluída' : 'Cancelada'}
                      </Badge>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm text-muted-foreground ${isCompleted ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Tags and Metadata */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`text-xs ${categoryColors[task.category]}`}>
                    {task.category === 'work' ? '💼 Trabalho' :
                     task.category === 'personal' ? '🏠 Pessoal' :
                     task.category === 'shopping' ? '🛒 Compras' :
                     task.category === 'health' ? '🏥 Saúde' :
                     task.category === 'learning' ? '📚 Aprendizado' : '📝 Outros'}
                  </Badge>
                  
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    {priorityLabels[task.priority]}
                  </Badge>

                  {task.dueDate && (
                    <Badge 
                      variant={isOverdue ? "destructive" : "outline"} 
                      className="text-xs flex items-center gap-1"
                    >
                      <Calendar className="h-3 w-3" />
                      {format(task.dueDate, "dd/MM", { locale: ptBR })}
                    </Badge>
                  )}

                  {task.estimatedTime && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.estimatedTime}min
                    </Badge>
                  )}

                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                      <TagIcon className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  Criado em {format(task.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  {task.updatedAt.getTime() !== task.createdAt.getTime() && (
                    <span> • Atualizado em {format(task.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex items-center gap-1">
              {/* Status Change Buttons */}
              {onUpdateStatus && (
                <div className="flex gap-1">
                  {task.status === 'todo' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUpdateStatus(task.id, 'in-progress')}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-600"
                      title="Iniciar tarefa"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  {task.status === 'in-progress' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUpdateStatus(task.id, 'todo')}
                      className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-600"
                      title="Pausar tarefa"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              {/* More Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(task.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}