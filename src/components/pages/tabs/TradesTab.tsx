import { useState, useMemo } from "react";
import { TabsContent } from "@/components/ui/tabs";
import TradeList from "@/components/trading/TradeList";
import TradeFilters from "@/components/trading/TradeFilters";
import { Trade } from "@/types/trade";

interface TradesTabProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
}

const TradesTab = ({ trades, onEdit, onDelete }: TradesTabProps) => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    tradeType: '',
    status: '',
    strategyName: '',
    economicEvents: '',
    emotion: '',
    mistakeCategory: '',
  });

  const strategyNames = useMemo(() => {
    const set = new Set<string>();
    trades.forEach(t => { if (t.strategy_name) set.add(t.strategy_name); });
    return Array.from(set).sort();
  }, [trades]);

  const economicEvents = useMemo(() => {
    const set = new Set<string>();
    trades.forEach(t => { if (t.economic_events) set.add(t.economic_events); });
    return Array.from(set).sort();
  }, [trades]);

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      if (filters.dateFrom && trade.date < filters.dateFrom) return false;
      if (filters.dateTo && trade.date > filters.dateTo) return false;
      if (filters.tradeType && trade.trade_type !== filters.tradeType) return false;
      if (filters.status && trade.status !== filters.status) return false;
      if (filters.strategyName && trade.strategy_name !== filters.strategyName) return false;
      if (filters.economicEvents && trade.economic_events !== filters.economicEvents) return false;
      if (filters.emotion && trade.emotion !== filters.emotion) return false;
      if (filters.mistakeCategory && trade.mistake_category !== filters.mistakeCategory) return false;
      return true;
    });
  }, [trades, filters]);

  return (
    <TabsContent value="trades" className="mt-0">
      <TradeFilters
        filters={filters}
        onChange={(newFilters) => setFilters(prev => ({...prev, ...newFilters}))}
        onReset={() => setFilters({
          dateFrom: '',
          dateTo: '',
          tradeType: '',
          status: '',
          strategyName: '',
          economicEvents: '',
          emotion: '',
          mistakeCategory: '',
        })}
        strategyNames={strategyNames}
        economicEvents={economicEvents}
      />
      <TradeList 
        trades={filteredTrades}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </TabsContent>
  );
};

export default TradesTab;
