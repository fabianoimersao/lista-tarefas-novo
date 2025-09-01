'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  X,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TaskFormData, TaskPriority, TaskCategory } from '../types/task';

interface AddTaskFormProps {
  onAddTask: (task: TaskFormData) => void;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Baixa', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { value: 'medium', label: 'Média', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
];

const categoryOptions: { value: TaskCategory; label: string; icon: string }[] = [
  { value: 'work', label: 'Trabalho', icon: '💼' },
  { value: 'personal', label: 'Pessoal', icon: '🏠' },
  { value: 'shopping', label: 'Compras', icon: '🛒' },
  { value: 'health', label: 'Saúde', icon: '🏥' },
  { value: 'learning', label: 'Aprendizado', icon: '📚' },
  { value: 'other', label: 'Outros', icon: '📝' },
];

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('other');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [estimatedTime, setEstimatedTime] = useState<number>();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      tags,
      dueDate,
      estimatedTime,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('other');
    setTags([]);
    setNewTag('');
    setDueDate(undefined);
    setEstimatedTime(undefined);
    setIsExpanded(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card className="w-full animate-slide-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1 rounded-lg taskflow-gradient">
            <Plus className="h-4 w-4 text-white" />
          </div>
          Criar Nova Tarefa
          <Sparkles className="h-4 w-4 text-yellow-500 ml-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Digite o título da tarefa..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full text-lg"
            />
          </div>
          
          {isExpanded && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Adicione mais detalhes sobre a tarefa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-20 resize-none mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={category} onValueChange={(value: TaskCategory) => setCategory(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Data de Vencimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="estimatedTime">Tempo Estimado (minutos)</Label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="estimatedTime"
                      type="number"
                      placeholder="Ex: 30"
                      value={estimatedTime || ''}
                      onChange={(e) => setEstimatedTime(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="pl-10"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Adicionar tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10"
                    />
                  </div>
                  <Button type="button" onClick={addTag} variant="outline" size="sm">
                    Adicionar
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={!title.trim()} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Tarefa
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsExpanded(false);
                    setTitle('');
                    setDescription('');
                    setPriority('medium');
                    setCategory('other');
                    setTags([]);
                    setNewTag('');
                    setDueDate(undefined);
                    setEstimatedTime(undefined);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}