import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export function TimerDisplay({ 
  initialTime = '00:00',
  isCountdown = false,
  onTimeUpdate,
  onPeriodEnd,
  disabled = false,
  showControls = true
}) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  const parseTime = (timeStr) => {
    const [mins, secs] = timeStr.split(':').map(Number);
    return { mins, secs };
  };

  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const updateTimer = () => {
    const { mins, secs } = parseTime(time);
    let newSecs, newMins;

    if (isCountdown) {
      if (mins === 0 && secs === 0) {
        stopTimer();
        onPeriodEnd?.();
        return;
      }
      newSecs = secs - 1;
      newMins = mins;
      if (newSecs < 0) {
        newSecs = 59;
        newMins = mins - 1;
      }
    } else {
      newSecs = secs + 1;
      newMins = mins;
      if (newSecs === 60) {
        newSecs = 0;
        newMins = mins + 1;
      }
    }

    const newTime = formatTime(newMins, newSecs);
    setTime(newTime);
    onTimeUpdate?.(newTime);
  };

  const startTimer = () => {
    if (!isRunning && !disabled) {
      const interval = setInterval(updateTimer, 1000);
      setTimerInterval(interval);
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTime(initialTime);
    onTimeUpdate?.(initialTime);
  };

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-4xl font-mono font-bold">{time}</div>
      {showControls && (
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <Button
              size="sm"
              variant="outline"
              onClick={startTimer}
              disabled={disabled}
            >
              <Play className="w-4 h-4 mr-1" />
              Start
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={stopTimer}
              disabled={disabled}
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={resetTimer}
            disabled={disabled || isRunning}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}

export default TimerDisplay; 