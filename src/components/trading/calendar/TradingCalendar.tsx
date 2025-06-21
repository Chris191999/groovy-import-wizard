
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import TradeDetailModal from "../TradeDetailModal";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import MonthlyPnLSummary from "./MonthlyPnLSummary";

interface TradingCalendarProps {
  trades: Trade[];
}

interface DayData {
  date: Date;
  trades: Trade[];
  pnl: number;
  isCurrentMonth: boolean;
}

const TradingCalendar = ({ trades }: TradingCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayTrades, setSelectedDayTrades] = useState<Trade[]>([]);
  const [currentTradeIndex, setCurrentTradeIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and adjust for week starting on Monday
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    // Get last day and fill to complete week
    const lastDay = new Date(year, month + 1, 0);
    const endDate = new Date(lastDay);
    const remainingDays = 7 - (lastDay.getDay() === 0 ? 7 : lastDay.getDay());
    if (remainingDays < 7) {
      endDate.setDate(endDate.getDate() + remainingDays);
    }
    
    const days: DayData[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayTrades = trades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate.toDateString() === current.toDateString() && trade.status === 'Completed';
      });
      
      const dayPnL = dayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
      
      days.push({
        date: new Date(current),
        trades: dayTrades,
        pnl: dayPnL,
        isCurrentMonth: current.getMonth() === month
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate, trades]);

  const weeklyData = useMemo(() => {
    const weeks: DayData[][] = [];
    for (let i = 0; i < calendarData.length; i += 7) {
      weeks.push(calendarData.slice(i, i + 7));
    }
    return weeks;
  }, [calendarData]);

  const monthlyPnL = useMemo(() => {
    return calendarData
      .filter(day => day.isCurrentMonth)
      .reduce((sum, day) => sum + day.pnl, 0);
  }, [calendarData]);

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

  const handleDayClick = (dayData: DayData) => {
    if (dayData.trades.length > 0) {
      setSelectedDayTrades(dayData.trades);
      setCurrentTradeIndex(0);
      setIsModalOpen(true);
    }
  };

  const handleTradeNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentTradeIndex > 0) {
      setCurrentTradeIndex(currentTradeIndex - 1);
    } else if (direction === 'next' && currentTradeIndex < selectedDayTrades.length - 1) {
      setCurrentTradeIndex(currentTradeIndex + 1);
    }
  };

  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedTrade = selectedDayTrades[currentTradeIndex] || null;

  return (
    <>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CalendarHeader
            currentMonth={currentMonth}
            onNavigateMonth={navigateMonth}
          />
        </CardHeader>
        <CardContent>
          <CalendarGrid
            weeklyData={weeklyData}
            onDayClick={handleDayClick}
          />
          <MonthlyPnLSummary
            monthlyPnL={monthlyPnL}
            currentMonth={currentMonth}
          />
        </CardContent>
      </Card>

      <TradeDetailModal
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDayTrades([]);
          setCurrentTradeIndex(0);
        }}
        dayTrades={selectedDayTrades}
        currentTradeIndex={currentTradeIndex}
        onTradeNavigation={handleTradeNavigation}
      />
    </>
  );
};

export default TradingCalendar;
