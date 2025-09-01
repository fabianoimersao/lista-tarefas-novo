'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface PomodoroTimerProps {
  onComplete?: () => void;
}

export function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessions, setSessions] = useState(0);

  const workTime = 25 * 60;
  const breakTime = 5 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') {
        setSessions(prev => prev + 1);
        setMode('break');
        setTimeLeft(breakTime);
        onComplete?.();
      } else {
        setMode('work');
        setTimeLeft(workTime);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workTime : breakTime);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? workTime : breakTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((workTime - timeLeft) / workTime) * 100
    : ((breakTime - timeLeft) / breakTime) * 100;

  return (
    <Card className="animate-scale-in">
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 rounded-lg taskflow-gradient">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold">Pomodoro Timer</h3>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-2 justify-center">
            <Button
              variant={mode === 'work' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchMode('work')}
              className="flex items-center gap-1"
            >
              <Target className="h-3 w-3" />
              Foco
            </Button>
            <Button
              variant={mode === 'break' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchMode('break')}
              className="flex items-center gap-1"
            >
              <Zap className="h-3 w-3" />
              Pausa
            </Button>
          </div>

          {/* Timer Display */}
          <div className="space-y-4">
            <div className="text-6xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <Badge variant={mode === 'work' ? 'default' : 'secondary'}>
              {mode === 'work' ? 'Tempo de Foco' : 'Tempo de Pausa'}
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <Button
              onClick={toggleTimer}
              className="flex items-center gap-2"
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Iniciar
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={resetTimer}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Sessions Counter */}
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <span>Sessões completadas:</span>
              <Badge variant="outline">{sessions}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}