'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  CalendarDays
} from 'lucide-react';
import { TaskFilter, TaskSort, TaskStats } from '../types/task';

interface TaskFiltersProps {
  filter: TaskFilter;
  sort: TaskSort;
  searchQuery: string;
  stats: TaskStats;
  onFilterChange: (filter: TaskFilter) => void;
  onSortChange: (sort: TaskSort) => void;
  onSearchChange: (query: string) => void;
  onClearCompleted: () => void;
}

const filterOptions: { value: TaskFilter; label: string; icon: React.ReactNode; count?: keyof TaskStats }[] = [
  { value: 'all', label: 'Todas', icon: <CheckCircle2 className="h-4 w-4" />, count: 'total' },
  { value: 'todo', label: 'Pendentes', icon: <Clock className="h-4 w-4" />, count: 'todo' },
  { value: 'in-progress', label: 'Em Progresso', icon: <Clock className="h-4 w-4" />, count: 'inProgress' },
  { value: 'completed', label: 'Concluídas', icon: <CheckCircle2 className="h-4 w-4" />, count: 'completed' },
  { value: 'overdue', label: 'Atrasadas', icon: <AlertTriangle className="h-4 w-4" />, count: 'overdue' },
  { value: 'today', label: 'Hoje', icon: <Calendar className="h-4 w-4" /> },
  { value: 'this-week', label: 'Esta Semana', icon: <CalendarDays className="h-4 w-4" /> },
];

const sortOptions: { value: TaskSort; label: string }[] = [
  { value: 'created', label: 'Data de Criação' },
  { value: 'updated', label: 'Última Atualização' },
  { value: 'priority', label: 'Prioridade' },
  { value: 'dueDate', label: 'Data de Vencimento' },
  { value: 'title', label: 'Título (A-Z)' },
];

export function TaskFilters({
  filter,
  sort,
  searchQuery,
  stats,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onClearCompleted,
}: TaskFiltersProps) {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas, tags ou descrições..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const count = option.count ? stats[option.count] : undefined;
              const isActive = filter === option.value;
              
              return (
                <Button
                  key={option.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterChange(option.value)}
                  className="flex items-center gap-2"
                >
                  {option.icon}
                  {option.label}
                  {count !== undefined && (
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className="ml-1 text-xs"
                    >
                      {count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Sort and Actions */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <Select value={sort} onValueChange={(value: TaskSort) => onSortChange(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {stats.completed > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCompleted}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Limpar Concluídas ({stats.completed})
              </Button>
            )}
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || filter !== 'all') && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                {searchQuery && `Buscando por "${searchQuery}"`}
                {searchQuery && filter !== 'all' && ' • '}
                {filter !== 'all' && `Filtro: ${filterOptions.find(f => f.value === filter)?.label}`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}