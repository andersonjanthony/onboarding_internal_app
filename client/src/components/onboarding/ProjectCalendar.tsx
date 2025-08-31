import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProjectMilestone } from '@shared/schema';

interface ProjectCalendarProps {
  clientId: string;
}

export default function ProjectCalendar({ clientId }: ProjectCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025
  
  const { data: milestones = [] } = useQuery<ProjectMilestone[]>({
    queryKey: ['/api/clients', clientId, 'milestones'],
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getMilestoneForDate = (day: number | null) => {
    if (!day) return null;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return milestones.find(m => m.date === dateStr);
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'kickoff':
        return 'bg-secondary/20 text-secondary';
      case 'review':
        return 'bg-accent/20 text-accent';
      case 'delivery':
        return 'bg-primary/20 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-card-foreground">Your Project Calendar</h3>
        <p className="text-sm text-muted-foreground">Track meetings, milestones, and deliverables</p>
      </div>
      
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
          <span className="font-medium text-card-foreground" data-testid="text-calendar-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth('prev')}
              data-testid="button-prev-month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth('next')}
              data-testid="button-next-month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-muted/30">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground border-r border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const milestone = getMilestoneForDate(day);
            return (
              <div 
                key={index} 
                className="min-h-[60px] p-1 border-r border-b border-border last:border-r-0"
                data-testid={`calendar-cell-${day || 'empty'}`}
              >
                {day && (
                  <>
                    <div className="text-xs text-muted-foreground">{day}</div>
                    {milestone && (
                      <div className={`mt-1 w-full truncate rounded-md px-1.5 py-0.5 text-xs font-medium ${getMilestoneColor(milestone.type)}`}>
                        {milestone.title}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Calendar Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-secondary/20"></div>
          <span className="text-muted-foreground">Kickoff</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-accent/20"></div>
          <span className="text-muted-foreground">Review</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
          <span className="text-muted-foreground">Delivery</span>
        </div>
      </div>
    </div>
  );
}
