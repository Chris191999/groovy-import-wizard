
import { useMemo, useState } from "react";
import { Trade, PerformanceStats } from "@/types/trade";
import { 
  calculateCalmarRatio, 
  calculateSortinoRatio, 
  calculateRiskOfRuin, 
  calculateKellyPercentage, 
  calculateValueAtRisk, 
  calculateMAEMFE 
} from "@/utils/riskCalculations";
import { calculateTradeDurationStats } from "@/utils/timeAnalysis";
import MetricsFilters from "./metrics/MetricsFilters";
import CoreMetricsSection from "./metrics/CoreMetricsSection";
import RiskRewardMetricsSection from "./metrics/RiskRewardMetricsSection";
import DrawdownStreakSection from "./metrics/DrawdownStreakSection";
import SystemQualitySection from "./metrics/SystemQualitySection";
import EquityCurveChart from "./metrics/EquityCurveChart";
import DetailedMetricsCards from "./metrics/DetailedMetricsCards";
import PerformanceCharts from "./metrics/PerformanceCharts";
import SymbolPerformance from "./metrics/SymbolPerformance";

interface AdvancedPerformanceMetricsProps {
  trades: Trade[];
  detailed?: boolean;
}

const AdvancedPerformanceMetrics = ({ trades, detailed = false }: AdvancedPerformanceMetricsProps) => {
  const [accountBalance, setAccountBalance] = useState(10000);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("all");

  // Get unique symbols for filter dropdown
  const uniqueSymbols = useMemo(() => {
    const symbols = Array.from(new Set(trades.map(trade => trade.symbol))).sort();
    return symbols;
  }, [trades]);

  // Filter trades based on selected criteria
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      // Date filtering
      if (dateFrom && trade.date < dateFrom) return false;
      if (dateTo && trade.date > dateTo) return false;
      
      // Symbol filtering
      if (selectedSymbol !== "all" && trade.symbol !== selectedSymbol) return false;
      
      return true;
    });
  }, [trades, dateFrom, dateTo, selectedSymbol]);

  // Clear all filters
  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedSymbol("all");
  };

  const stats: PerformanceStats = useMemo(() => {
    if (filteredTrades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        breakEvenTrades: 0,
        winRate: 0,
        totalPnL: 0,
        totalFees: 0,
        netPnL: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        largestWin: 0,
        largestLoss: 0,
        averageRoi: 0,
        sharpeRatio: 0,
        totalR: 0,
        avgWinR: 0,
        avgLossR: 0,
        riskRewardRatio: 0,
        expectancy: 0,
        maxDrawdown: 0,
        maxDrawdownAmount: 0,
        longestWinStreak: 0,
        longestLossStreak: 0,
        systemQualityNumber: 0,
        calmarRatio: 0,
        sortinoRatio: 0,
        riskOfRuin: 0,
        kellyPercentage: 0,
        valueAtRisk95: 0,
        valueAtRisk99: 0,
        averageMAE: 0,
        averageMFE: 0,
        avgTradeDuration: 0
      };
    }

    const completedTrades = filteredTrades.filter(trade => trade.status === 'Completed' && trade.pnl !== undefined);
    
    // Calculate R-multiples for each trade
    const tradesWithR = completedTrades.map(trade => {
      const rMultiple = trade.risk > 0 ? (trade.pnl || 0) / trade.risk : 0;
      return { ...trade, rMultiple };
    });

    const wins = tradesWithR.filter(trade => (trade.pnl || 0) > 0);
    const losses = tradesWithR.filter(trade => (trade.pnl || 0) < 0);
    const breakEvens = tradesWithR.filter(trade => (trade.pnl || 0) === 0);
    
    const totalPnL = completedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalFees = filteredTrades.reduce((sum, trade) => sum + (trade.fees || 0), 0);
    const totalWins = wins.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalLosses = Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
    
    // R-multiple calculations
    const totalR = tradesWithR.reduce((sum, trade) => sum + trade.rMultiple, 0);
    const avgWinR = wins.length > 0 ? wins.reduce((sum, trade) => sum + trade.rMultiple, 0) / wins.length : 0;
    const avgLossR = losses.length > 0 ? Math.abs(losses.reduce((sum, trade) => sum + trade.rMultiple, 0) / losses.length) : 0;
    
    // Drawdown calculation
    let runningPnL = 0;
    let peak = 0;
    let maxDrawdown = 0;
    let maxDrawdownAmount = 0;
    
    completedTrades.forEach(trade => {
      runningPnL += (trade.pnl || 0);
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdownAmount) {
        maxDrawdownAmount = drawdown;
        maxDrawdown = peak > 0 ? (drawdown / peak) * 100 : 0;
      }
    });

    // Streak calculations
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let longestWinStreak = 0;
    let longestLossStreak = 0;

    completedTrades.forEach(trade => {
      if ((trade.pnl || 0) > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
      } else if ((trade.pnl || 0) < 0) {
        currentLossStreak++;
        currentWinStreak = 0;
        longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
      } else {
        currentWinStreak = 0;
        currentLossStreak = 0;
      }
    });

    // System Quality Number (SQN) calculation
    const expectancy = completedTrades.length > 0 ? totalR / completedTrades.length : 0;
    const rValues = tradesWithR.map(trade => trade.rMultiple);
    const standardDeviation = rValues.length > 1 ? 
      Math.sqrt(rValues.reduce((sum, r) => sum + Math.pow(r - expectancy, 2), 0) / (rValues.length - 1)) : 0;
    const systemQualityNumber = standardDeviation > 0 ? 
      (expectancy / standardDeviation) * Math.sqrt(completedTrades.length) : 0;

    // Sharpe Ratio calculation (simplified)
    const sharpeRatio = standardDeviation > 0 ? expectancy / standardDeviation : 0;

    // Calculate advanced metrics
    const winRate = completedTrades.length > 0 ? (wins.length / completedTrades.length) : 0;
    const averageWin = wins.length > 0 ? totalWins / wins.length : 0;
    const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0;
    
    const calmarRatio = calculateCalmarRatio(totalPnL, maxDrawdown, 1);
    const sortinoRatio = calculateSortinoRatio(completedTrades, 0);
    const riskOfRuin = calculateRiskOfRuin(winRate, averageWin, averageLoss, 0.02, accountBalance);
    const kellyPercentage = calculateKellyPercentage(winRate, averageWin, averageLoss);
    const valueAtRisk95 = calculateValueAtRisk(completedTrades, 0.95);
    const valueAtRisk99 = calculateValueAtRisk(completedTrades, 0.99);
    
    const { avgMAE, avgMFE } = calculateMAEMFE(completedTrades);
    const { avgDuration } = calculateTradeDurationStats(completedTrades);

    return {
      totalTrades: filteredTrades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      breakEvenTrades: breakEvens.length,
      winRate: winRate * 100,
      totalPnL,
      totalFees,
      netPnL: totalPnL - totalFees,
      averageWin,
      averageLoss,
      profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
      largestWin: wins.length > 0 ? Math.max(...wins.map(trade => trade.pnl || 0)) : 0,
      largestLoss: losses.length > 0 ? Math.min(...losses.map(trade => trade.pnl || 0)) : 0,
      averageRoi: 0,
      sharpeRatio: Math.abs(sharpeRatio),
      totalR,
      avgWinR,
      avgLossR,
      riskRewardRatio: avgLossR > 0 ? avgWinR / avgLossR : avgWinR > 0 ? Infinity : 0,
      expectancy,
      maxDrawdown,
      maxDrawdownAmount,
      longestWinStreak,
      longestLossStreak,
      systemQualityNumber: Math.abs(systemQualityNumber),
      calmarRatio,
      sortinoRatio,
      riskOfRuin,
      kellyPercentage,
      valueAtRisk95,
      valueAtRisk99,
      averageMAE: avgMAE,
      averageMFE: avgMFE,
      avgTradeDuration: avgDuration
    };
  }, [filteredTrades, accountBalance]);

  const equityCurveData = useMemo(() => {
    let runningBalance = accountBalance;
    return filteredTrades
      .filter(trade => trade.status === 'Completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((trade, index) => {
        runningBalance += (trade.pnl || 0);
        return {
          day: `Day ${index + 1}`,
          balance: runningBalance,
          date: trade.date
        };
      });
  }, [filteredTrades, accountBalance]);

  // Additional calculations for detailed view
  const additionalMetrics = useMemo(() => {
    if (!detailed) return {
      mostProfitableDay: { date: 'N/A', pnl: 0 },
      leastProfitableDay: { date: 'N/A', pnl: 0 },
      avgTradesPerDay: 0,
      avgWinningTradePnL: 0,
      avgLosingTradePnL: 0
    };

    const completedTrades = filteredTrades.filter(trade => trade.status === 'Completed' && trade.pnl !== undefined);
    
    if (completedTrades.length === 0) {
      return {
        mostProfitableDay: { date: 'N/A', pnl: 0 },
        leastProfitableDay: { date: 'N/A', pnl: 0 },
        avgTradesPerDay: 0,
        avgWinningTradePnL: 0,
        avgLosingTradePnL: 0
      };
    }

    // Group trades by date for daily analysis
    const dailyPnL = new Map<string, number>();
    const dailyTradeCount = new Map<string, number>();
    
    completedTrades.forEach(trade => {
      const date = trade.date.split('T')[0]; // Get just the date part
      const pnl = trade.pnl || 0;
      
      dailyPnL.set(date, (dailyPnL.get(date) || 0) + pnl);
      dailyTradeCount.set(date, (dailyTradeCount.get(date) || 0) + 1);
    });

    // Find most and least profitable days
    let mostProfitableDay = { date: 'N/A', pnl: -Infinity };
    let leastProfitableDay = { date: 'N/A', pnl: Infinity };
    
    dailyPnL.forEach((pnl, date) => {
      if (pnl > mostProfitableDay.pnl) {
        mostProfitableDay = { date, pnl };
      }
      if (pnl < leastProfitableDay.pnl) {
        leastProfitableDay = { date, pnl };
      }
    });

    // Calculate average trades per day
    const uniqueDays = dailyTradeCount.size;
    const avgTradesPerDay = uniqueDays > 0 ? completedTrades.length / uniqueDays : 0;

    // Calculate average winning and losing trade P&L
    const winningTrades = completedTrades.filter(trade => (trade.pnl || 0) > 0);
    const losingTrades = completedTrades.filter(trade => (trade.pnl || 0) < 0);
    
    const avgWinningTradePnL = winningTrades.length > 0 
      ? winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTrades.length 
      : 0;
    
    const avgLosingTradePnL = losingTrades.length > 0 
      ? losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTrades.length 
      : 0;

    return {
      mostProfitableDay,
      leastProfitableDay,
      avgTradesPerDay,
      avgWinningTradePnL,
      avgLosingTradePnL
    };
  }, [filteredTrades, detailed]);

  const chartData = useMemo(() => {
    if (!detailed) return [];
    
    let cumulativePnL = 0;
    return filteredTrades
      .filter(trade => trade.status === 'Completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(trade => {
        cumulativePnL += (trade.pnl || 0);
        return {
          date: trade.date,
          pnl: trade.pnl || 0,
          cumulative: cumulativePnL
        };
      });
  }, [filteredTrades, detailed]);

  const symbolStats = useMemo(() => {
    if (!detailed) return [];
    
    const symbolMap = new Map();
    
    filteredTrades
      .filter(trade => trade.status === 'Completed')
      .forEach(trade => {
        const symbol = trade.symbol;
        if (!symbolMap.has(symbol)) {
          symbolMap.set(symbol, {
            symbol,
            trades: 0,
            pnl: 0,
            wins: 0,
            winRate: 0
          });
        }
        
        const stat = symbolMap.get(symbol);
        stat.trades++;
        stat.pnl += (trade.pnl || 0);
        if ((trade.pnl || 0) > 0) stat.wins++;
        stat.winRate = (stat.wins / stat.trades) * 100;
      });
    
    return Array.from(symbolMap.values()).sort((a, b) => b.pnl - a.pnl);
  }, [filteredTrades, detailed]);

  return (
    <div className="space-y-6 bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Performance Analysis</h2>
      
      <MetricsFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        selectedSymbol={selectedSymbol}
        uniqueSymbols={uniqueSymbols}
        filteredTradesCount={filteredTrades.length}
        totalTradesCount={trades.length}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSymbolChange={setSelectedSymbol}
        onClearFilters={clearFilters}
      />

      <CoreMetricsSection stats={stats} />
      
      {detailed && <DetailedMetricsCards stats={stats} additionalMetrics={additionalMetrics} />}
      
      <RiskRewardMetricsSection stats={stats} />
      
      <DrawdownStreakSection stats={stats} />
      
      <SystemQualitySection stats={stats} />
      
      <EquityCurveChart
        equityCurveData={equityCurveData}
        accountBalance={accountBalance}
        onAccountBalanceChange={setAccountBalance}
      />

      {detailed && <PerformanceCharts chartData={chartData} />}
      
      {detailed && <SymbolPerformance symbolStats={symbolStats} />}
    </div>
  );
};

export default AdvancedPerformanceMetrics;
