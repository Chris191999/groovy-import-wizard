
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PerformanceMetrics from "@/components/trading/PerformanceMetrics";
import TradeList from "@/components/trading/TradeList";
import TradingCalendar from "@/components/trading/calendar/TradingCalendar";
import { Trade } from "@/types/trade";

interface OverviewTabProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
}

const OverviewTab = ({ trades, onEdit, onDelete }: OverviewTabProps) => {
  return (
    <TabsContent value="overview">
      <div className="grid gap-6">
        <PerformanceMetrics trades={trades} />
        
        <TradingCalendar trades={trades} />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeList 
              trades={trades.slice(-5)} 
              onEdit={onEdit}
              onDelete={onDelete}
              compact={true}
            />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default OverviewTab;
