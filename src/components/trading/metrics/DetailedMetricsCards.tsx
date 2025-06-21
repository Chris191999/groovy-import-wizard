
import { TrendingUp, TrendingDown, Calendar, Target, Clock } from "lucide-react";
import { PerformanceStats } from "@/types/trade";
import { AdditionalMetrics } from "@/types/metrics";
import { formatDateSafely } from "@/utils/dateValidation";
import { formatCurrency } from "@/utils/formatters";
import MetricCard from "./MetricCard";

interface DetailedMetricsCardsProps {
  stats: PerformanceStats;
  additionalMetrics: AdditionalMetrics;
}

const DetailedMetricsCards = ({ stats, additionalMetrics }: DetailedMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        title="Largest Profit"
        value={formatCurrency(stats.largestWin)}
        subtitle="Best single trade"
        trend="positive"
        icon={TrendingUp}
      />

      <MetricCard
        title="Largest Loss"
        value={formatCurrency(stats.largestLoss)}
        subtitle="Worst single trade"
        trend="negative"
        icon={TrendingDown}
      />

      <MetricCard
        title="Avg Winning Trade"
        value={formatCurrency(additionalMetrics.avgWinningTradePnL)}
        subtitle="Average profit per win"
        trend="positive"
        icon={TrendingUp}
      />

      <MetricCard
        title="Avg Losing Trade"
        value={formatCurrency(additionalMetrics.avgLosingTradePnL)}
        subtitle="Average loss per trade"
        trend="negative"
        icon={TrendingDown}
      />

      <MetricCard
        title="Most Profitable Day"
        value={formatCurrency(additionalMetrics.mostProfitableDay.pnl)}
        subtitle={additionalMetrics.mostProfitableDay.date !== 'N/A' 
          ? formatDateSafely(additionalMetrics.mostProfitableDay.date)
          : 'N/A'
        }
        trend="positive"
        icon={Calendar}
      />

      <MetricCard
        title="Least Profitable Day"
        value={formatCurrency(additionalMetrics.leastProfitableDay.pnl)}
        subtitle={additionalMetrics.leastProfitableDay.date !== 'N/A' 
          ? formatDateSafely(additionalMetrics.leastProfitableDay.date)
          : 'N/A'
        }
        trend="negative"
        icon={Calendar}
      />

      <MetricCard
        title="Avg Trades Per Day"
        value={additionalMetrics.avgTradesPerDay.toFixed(1)}
        subtitle="Daily trading frequency"
        trend="neutral"
        icon={Target}
      />

      <MetricCard
        title="Avg Trade Duration"
        value={`${stats.avgTradeDuration.toFixed(1)}h`}
        subtitle="Hours per trade"
        trend="neutral"
        icon={Clock}
      />
    </div>
  );
};

export default DetailedMetricsCards;
