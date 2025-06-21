
import { usePerformanceStats } from "@/hooks/usePerformanceStats";
import KeyMetricsCards from "./metrics/KeyMetricsCards";
import DetailedMetricsCards from "./metrics/DetailedMetricsCards";
import PerformanceCharts from "./metrics/PerformanceCharts";
import SymbolPerformance from "./metrics/SymbolPerformance";
import { Trade } from "@/types/trade";

interface PerformanceMetricsProps {
  trades: Trade[];
  detailed?: boolean;
}

const PerformanceMetrics = ({ trades, detailed = false }: PerformanceMetricsProps) => {
  const { stats, additionalMetrics, chartData, symbolStats } = usePerformanceStats(trades);

  return (
    <div className="space-y-6">
      <KeyMetricsCards stats={stats} />
      
      {detailed && (
        <>
          <DetailedMetricsCards stats={stats} additionalMetrics={additionalMetrics} />
          <PerformanceCharts chartData={chartData} />
          <SymbolPerformance symbolStats={symbolStats} />
        </>
      )}
    </div>
  );
};

export default PerformanceMetrics;
