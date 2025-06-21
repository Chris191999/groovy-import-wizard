import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trade, PerformanceStats } from "@/types/trade";
import { TrendingUp, Award, AlertTriangle, Target, Shield, Brain } from "lucide-react";
import PerformanceRadarChart from "./PerformanceRadarChart";

interface OverallPerformanceScoreProps {
  trades: Trade[];
  stats: PerformanceStats;
}

const OverallPerformanceScore = ({ trades, stats }: OverallPerformanceScoreProps) => {
  const performanceScore = useMemo(() => {
    // Calculate overall performance score out of 100
    let score = 0;
    const maxScore = 100;
    
    // Win Rate (20 points max)
    const winRateScore = Math.min(20, (stats.winRate / 70) * 20); // 70% win rate = full points
    score += winRateScore;
    
    // Profit Factor (20 points max)
    const profitFactorScore = stats.profitFactor === Infinity ? 20 : Math.min(20, (stats.profitFactor / 2) * 20); // 2.0 PF = full points
    score += profitFactorScore;
    
    // Risk/Reward Ratio (15 points max)
    const rrScore = stats.riskRewardRatio === Infinity ? 15 : Math.min(15, (stats.riskRewardRatio / 2) * 15); // 2:1 RR = full points
    score += rrScore;
    
    // Expectancy (15 points max)
    const expectancyScore = Math.min(15, Math.max(0, (stats.expectancy / 0.5) * 15)); // 0.5R expectancy = full points
    score += expectancyScore;
    
    // System Quality Number (15 points max)
    const sqnScore = Math.min(15, (stats.systemQualityNumber / 3) * 15); // SQN of 3 = full points
    score += sqnScore;
    
    // Max Drawdown (10 points max) - lower is better
    const drawdownScore = Math.min(10, Math.max(0, (1 - stats.maxDrawdown / 20) * 10)); // 20% DD = 0 points
    score += drawdownScore;
    
    // Consistency (5 points max) - based on Sharpe ratio
    const consistencyScore = Math.min(5, (stats.sharpeRatio / 2) * 5); // Sharpe of 2 = full points
    score += consistencyScore;
    
    return Math.round(Math.min(maxScore, Math.max(0, score)));
  }, [stats]);

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "bg-green-500", description: "Exceptional" };
    if (score >= 80) return { grade: "A", color: "bg-green-400", description: "Excellent" };
    if (score >= 70) return { grade: "B", color: "bg-blue-500", description: "Good" };
    if (score >= 60) return { grade: "C", color: "bg-yellow-500", description: "Average" };
    if (score >= 50) return { grade: "D", color: "bg-orange-500", description: "Below Average" };
    return { grade: "F", color: "bg-red-500", description: "Poor" };
  };

  const scoreGrade = getScoreGrade(performanceScore);

  const keyMetrics = [
    { label: "Profit Factor", value: stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2), target: "2.0+" },
    { label: "Recovery Factor", value: stats.maxDrawdownAmount > 0 ? (stats.totalPnL / stats.maxDrawdownAmount).toFixed(2) : "∞", target: "3.0+" },
    { label: "Expectancy", value: `${stats.expectancy.toFixed(2)}R`, target: "0.3R+" },
    { label: "Max Drawdown", value: `${stats.maxDrawdown.toFixed(1)}%`, target: "<15%" },
    { label: "Consistency", value: stats.sharpeRatio.toFixed(2), target: "1.5+" },
    { label: "Win Rate", value: `${stats.winRate.toFixed(1)}%`, target: "60%+" }
  ];

  const performanceInsights = useMemo(() => {
    const insights = {
      profitability: [],
      riskManagement: [],
      consistency: [],
      tradingBehavior: []
    };

    // Profitability Insights
    if (stats.profitFactor >= 2.0) {
      insights.profitability.push({
        type: "positive",
        message: `Outstanding profit factor of ${stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)} demonstrates strong edge and trade selection`
      });
    } else if (stats.profitFactor >= 1.5) {
      insights.profitability.push({
        type: "positive",
        message: `Good profit factor of ${stats.profitFactor.toFixed(2)} shows profitable system with room for optimization`
      });
    } else if (stats.profitFactor >= 1.0) {
      insights.profitability.push({
        type: "warning",
        message: `Marginal profit factor of ${stats.profitFactor.toFixed(2)} - focus on improving win rate or risk/reward ratio`
      });
    } else {
      insights.profitability.push({
        type: "negative",
        message: `Unprofitable system with PF of ${stats.profitFactor.toFixed(2)} - immediate strategy revision needed`
      });
    }

    if (stats.expectancy >= 0.3) {
      insights.profitability.push({
        type: "positive",
        message: `Strong expectancy of ${stats.expectancy.toFixed(2)}R indicates each trade adds significant value`
      });
    } else if (stats.expectancy > 0) {
      insights.profitability.push({
        type: "warning",
        message: `Low expectancy of ${stats.expectancy.toFixed(2)}R - consider tightening entry criteria or improving exits`
      });
    } else {
      insights.profitability.push({
        type: "negative",
        message: `Negative expectancy of ${stats.expectancy.toFixed(2)}R - strategy is losing money on average per trade`
      });
    }

    // Risk Management Insights
    if (stats.maxDrawdown <= 10) {
      insights.riskManagement.push({
        type: "positive",
        message: `Excellent drawdown control at ${stats.maxDrawdown.toFixed(1)}% - shows disciplined risk management`
      });
    } else if (stats.maxDrawdown <= 20) {
      insights.riskManagement.push({
        type: "warning",
        message: `Moderate drawdown of ${stats.maxDrawdown.toFixed(1)}% - consider reducing position sizes or improving stops`
      });
    } else {
      insights.riskManagement.push({
        type: "negative",
        message: `High drawdown of ${stats.maxDrawdown.toFixed(1)}% indicates poor risk management - urgent attention needed`
      });
    }

    const recoveryFactor = stats.maxDrawdownAmount > 0 ? stats.totalPnL / stats.maxDrawdownAmount : Infinity;
    if (recoveryFactor >= 3) {
      insights.riskManagement.push({
        type: "positive",
        message: `Strong recovery factor of ${recoveryFactor === Infinity ? "∞" : recoveryFactor.toFixed(1)} shows profits significantly exceed worst losses`
      });
    } else if (recoveryFactor >= 1) {
      insights.riskManagement.push({
        type: "warning",
        message: `Recovery factor of ${recoveryFactor.toFixed(1)} could be improved - aim for higher profit relative to drawdown`
      });
    }

    if (stats.riskRewardRatio >= 2) {
      insights.riskManagement.push({
        type: "positive",
        message: `Excellent risk/reward ratio of ${stats.riskRewardRatio === Infinity ? "∞" : stats.riskRewardRatio.toFixed(1)}:1 allows for lower win rates while staying profitable`
      });
    } else if (stats.riskRewardRatio >= 1) {
      insights.riskManagement.push({
        type: "warning",
        message: `Risk/reward ratio of ${stats.riskRewardRatio.toFixed(1)}:1 requires high win rate to be profitable`
      });
    }

    // Consistency Insights
    if (stats.systemQualityNumber >= 2.5) {
      insights.consistency.push({
        type: "positive",
        message: `Excellent SQN of ${stats.systemQualityNumber.toFixed(1)} indicates highly reliable and consistent performance`
      });
    } else if (stats.systemQualityNumber >= 1.6) {
      insights.consistency.push({
        type: "positive",
        message: `Good SQN of ${stats.systemQualityNumber.toFixed(1)} shows above-average system quality`
      });
    } else if (stats.systemQualityNumber >= 1.0) {
      insights.consistency.push({
        type: "warning",
        message: `Average SQN of ${stats.systemQualityNumber.toFixed(1)} - work on reducing trade result variability`
      });
    } else {
      insights.consistency.push({
        type: "negative",
        message: `Poor SQN of ${stats.systemQualityNumber.toFixed(1)} indicates inconsistent performance and high variability`
      });
    }

    if (stats.sharpeRatio >= 1.5) {
      insights.consistency.push({
        type: "positive",
        message: `Strong Sharpe ratio of ${stats.sharpeRatio.toFixed(2)} demonstrates consistent risk-adjusted returns`
      });
    } else if (stats.sharpeRatio >= 1.0) {
      insights.consistency.push({
        type: "warning",
        message: `Moderate Sharpe ratio of ${stats.sharpeRatio.toFixed(2)} - focus on reducing return volatility`
      });
    }

    // Trading Behavior Insights
    if (stats.winRate >= 70) {
      insights.tradingBehavior.push({
        type: "positive",
        message: `Exceptional win rate of ${stats.winRate.toFixed(1)}% indicates excellent trade selection and timing`
      });
    } else if (stats.winRate >= 60) {
      insights.tradingBehavior.push({
        type: "positive",
        message: `Strong win rate of ${stats.winRate.toFixed(1)}% shows good trade identification skills`
      });
    } else if (stats.winRate >= 50) {
      insights.tradingBehavior.push({
        type: "warning",
        message: `Average win rate of ${stats.winRate.toFixed(1)}% - ensure risk/reward ratio compensates for lower accuracy`
      });
    } else {
      insights.tradingBehavior.push({
        type: "warning",
        message: `Low win rate of ${stats.winRate.toFixed(1)}% requires excellent risk/reward management to stay profitable`
      });
    }

    if (stats.longestLossStreak >= 5) {
      insights.tradingBehavior.push({
        type: "negative",
        message: `Long losing streak of ${stats.longestLossStreak} trades suggests need for better market timing or strategy adjustment`
      });
    } else if (stats.longestWinStreak >= 5) {
      insights.tradingBehavior.push({
        type: "positive",
        message: `Longest winning streak of ${stats.longestWinStreak} trades shows ability to capitalize on favorable conditions`
      });
    }

    return insights;
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Performance Radar Chart */}
      <PerformanceRadarChart trades={trades} stats={stats} />

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-yellow-500" />
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl font-bold text-white">{performanceScore}</div>
              <div className="text-gray-400 text-lg">/100</div>
            </div>
            <Badge className={`${scoreGrade.color} text-white text-lg px-4 py-2`}>
              {scoreGrade.grade} - {scoreGrade.description}
            </Badge>
          </div>
          <Progress value={performanceScore} className="h-3 mb-4" />
          <div className="text-sm text-gray-400">
            Score based on: Win Rate (20%), Profit Factor (20%), Risk/Reward (15%), Expectancy (15%), 
            System Quality (15%), Drawdown Management (10%), Consistency (5%)
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-xs text-gray-500">Target: {metric.target}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profitability Analysis */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-green-400" />
              Profitability Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceInsights.profitability.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  {insight.type === "positive" && <TrendingUp size={16} className="mt-0.5 text-green-400" />}
                  {insight.type === "warning" && <AlertTriangle size={16} className="mt-0.5 text-orange-400" />}
                  {insight.type === "negative" && <AlertTriangle size={16} className="mt-0.5 text-red-400" />}
                  <span className={`text-sm ${
                    insight.type === "positive" ? "text-green-400" : 
                    insight.type === "warning" ? "text-orange-400" : "text-red-400"
                  }`}>
                    {insight.message}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Management Analysis */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-400" />
              Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceInsights.riskManagement.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  {insight.type === "positive" && <TrendingUp size={16} className="mt-0.5 text-green-400" />}
                  {insight.type === "warning" && <AlertTriangle size={16} className="mt-0.5 text-orange-400" />}
                  {insight.type === "negative" && <AlertTriangle size={16} className="mt-0.5 text-red-400" />}
                  <span className={`text-sm ${
                    insight.type === "positive" ? "text-green-400" : 
                    insight.type === "warning" ? "text-orange-400" : "text-red-400"
                  }`}>
                    {insight.message}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Consistency Analysis */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Consistency & Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceInsights.consistency.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  {insight.type === "positive" && <TrendingUp size={16} className="mt-0.5 text-green-400" />}
                  {insight.type === "warning" && <AlertTriangle size={16} className="mt-0.5 text-orange-400" />}
                  {insight.type === "negative" && <AlertTriangle size={16} className="mt-0.5 text-red-400" />}
                  <span className={`text-sm ${
                    insight.type === "positive" ? "text-green-400" : 
                    insight.type === "warning" ? "text-orange-400" : "text-red-400"
                  }`}>
                    {insight.message}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trading Behavior Analysis */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-cyan-400" />
              Trading Behavior
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceInsights.tradingBehavior.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  {insight.type === "positive" && <TrendingUp size={16} className="mt-0.5 text-green-400" />}
                  {insight.type === "warning" && <AlertTriangle size={16} className="mt-0.5 text-orange-400" />}
                  {insight.type === "negative" && <AlertTriangle size={16} className="mt-0.5 text-red-400" />}
                  <span className={`text-sm ${
                    insight.type === "positive" ? "text-green-400" : 
                    insight.type === "warning" ? "text-orange-400" : "text-red-400"
                  }`}>
                    {insight.message}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverallPerformanceScore;
