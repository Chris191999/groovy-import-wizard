
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Target } from "lucide-react";
import { PerformanceStats } from "@/types/trade";

interface KeyMetricsCardsProps {
  stats: PerformanceStats;
}

const KeyMetricsCards = ({ stats }: KeyMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTrades}</div>
          <p className="text-xs text-muted-foreground">
            {stats.winningTrades} wins, {stats.losingTrades} losses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.winRate.toFixed(1)}%
          </div>
          <Badge variant={stats.winRate >= 50 ? "default" : "secondary"}>
            {stats.winRate >= 50 ? "Good" : "Needs Improvement"}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalPnL)}
          </div>
          <p className="text-xs text-muted-foreground">
            Net: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.netPnL)} (after fees)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
          </div>
          <Badge variant={stats.profitFactor >= 1.5 ? "default" : "secondary"}>
            {stats.profitFactor >= 1.5 ? "Excellent" : stats.profitFactor >= 1 ? "Good" : "Poor"}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetricsCards;
