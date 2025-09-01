'use client';

import { TaskItem } from './TaskItem';
import { Task } from '../types/task';
import { FileX, Sparkles } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDuplicate?: (id: string) => void;
  onUpdateStatus?: (id: string, status: any) => void;
}

export function TaskList({ 
  tasks, 
  onToggle, 
  onDelete, 
  onUpdate, 
  onDuplicate,
  onUpdateStatus 
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-muted/50">
            <FileX className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-muted-foreground">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Que tal criar sua primeira tarefa? Use o formulário acima para começar a organizar seu dia!
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Dica: Use tags e categorias para organizar melhor suas tarefas</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div 
          key={task.id} 
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <TaskItem
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onDuplicate={onDuplicate}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
      ))}
    </div>
  );
}