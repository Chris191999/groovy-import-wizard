
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Trade } from "@/types/trade";
import type { PsychologicalAnalysis as PsychAnalysisType } from "@/types/trade";
import { Brain, Heart, AlertCircle, CheckCircle } from "lucide-react";

interface PsychologicalAnalysisProps {
  trades: Trade[];
}

const PsychologicalAnalysis = ({ trades }: PsychologicalAnalysisProps) => {
  const analysis: PsychAnalysisType = useMemo(() => {
    const completedTrades = trades.filter(trade => trade.status === 'Completed');
    
    // Emotion breakdown
    const emotionMap = new Map<string, { trades: number; totalPnl: number }>();
    const confidenceMap = new Map<number, { trades: number; totalPnl: number }>();
    const mistakeMap = new Map<string, { frequency: number; totalLoss: number }>();
    
    completedTrades.forEach(trade => {
      const pnl = trade.pnl || 0;
      
      // Emotion analysis
      if (trade.emotion) {
        const existing = emotionMap.get(trade.emotion) || { trades: 0, totalPnl: 0 };
        emotionMap.set(trade.emotion, {
          trades: existing.trades + 1,
          totalPnl: existing.totalPnl + pnl
        });
      }
      
      // Confidence analysis
      if (trade.confidence_rating) {
        const existing = confidenceMap.get(trade.confidence_rating) || { trades: 0, totalPnl: 0 };
        confidenceMap.set(trade.confidence_rating, {
          trades: existing.trades + 1,
          totalPnl: existing.totalPnl + pnl
        });
      }
      
      // Mistake analysis
      if (trade.mistake_category && trade.mistake_category !== 'none' && pnl < 0) {
        const existing = mistakeMap.get(trade.mistake_category) || { frequency: 0, totalLoss: 0 };
        mistakeMap.set(trade.mistake_category, {
          frequency: existing.frequency + 1,
          totalLoss: existing.totalLoss + Math.abs(pnl)
        });
      }
    });
    
    return {
      emotionBreakdown: Array.from(emotionMap.entries()).map(([emotion, data]) => ({
        emotion,
        trades: data.trades,
        avgPnl: data.totalPnl / data.trades
      })),
      
      confidenceCorrelation: Array.from(confidenceMap.entries()).map(([rating, data]) => ({
        rating,
        trades: data.trades,
        avgPnl: data.totalPnl / data.trades
      })).sort((a, b) => a.rating - b.rating),
      
      mistakeAnalysis: Array.from(mistakeMap.entries()).map(([mistake, data]) => ({
        mistake,
        frequency: data.frequency,
        totalLoss: data.totalLoss
      }))
    };
  }, [trades]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const chartConfig = {
    avgPnl: {
      label: "Average P&L",
      color: "hsl(var(--chart-1))",
    },
    trades: {
      label: "Number of Trades",
      color: "hsl(var(--chart-2))",
    },
  };

  const rulesFollowedStats = useMemo(() => {
    const completedTrades = trades.filter(trade => trade.status === 'Completed');
    const rulesFollowed = completedTrades.filter(trade => trade.rules_followed === true);
    const rulesNotFollowed = completedTrades.filter(trade => trade.rules_followed === false);
    
    const avgPnlRulesFollowed = rulesFollowed.length > 0 
      ? rulesFollowed.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / rulesFollowed.length
      : 0;
      
    const avgPnlRulesNotFollowed = rulesNotFollowed.length > 0
      ? rulesNotFollowed.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / rulesNotFollowed.length
      : 0;
    
    return {
      rulesFollowed: rulesFollowed.length,
      rulesNotFollowed: rulesNotFollowed.length,
      avgPnlRulesFollowed,
      avgPnlRulesNotFollowed,
      total: completedTrades.length
    };
  }, [trades]);

  return (
    <div className="space-y-6">
      {/* Rules Adherence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rules Followed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {rulesFollowedStats.rulesFollowed}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg P&L: {formatCurrency(rulesFollowedStats.avgPnlRulesFollowed)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rules Violated</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {rulesFollowedStats.rulesNotFollowed}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg P&L: {formatCurrency(rulesFollowedStats.avgPnlRulesNotFollowed)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherence Rate</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {rulesFollowedStats.total > 0 
                ? ((rulesFollowedStats.rulesFollowed / rulesFollowedStats.total) * 100).toFixed(1)
                : 0}%
            </div>
            <Badge variant={
              (rulesFollowedStats.rulesFollowed / rulesFollowedStats.total) >= 0.8 
                ? "default" 
                : "destructive"
            }>
              {(rulesFollowedStats.rulesFollowed / rulesFollowedStats.total) >= 0.8 ? "Good" : "Needs Work"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discipline Impact</CardTitle>
            <Heart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {formatCurrency(rulesFollowedStats.avgPnlRulesFollowed - rulesFollowedStats.avgPnlRulesNotFollowed)}
            </div>
            <p className="text-xs text-muted-foreground">
              Difference per trade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Performance */}
        {analysis.emotionBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance by Emotion</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.emotionBreakdown}>
                    <XAxis dataKey="emotion" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgPnl" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Confidence Correlation */}
        {analysis.confidenceCorrelation.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Confidence vs Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.confidenceCorrelation}>
                    <XAxis dataKey="rating" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgPnl" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mistake Analysis */}
      {analysis.mistakeAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mistake Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.mistakeAnalysis.map((mistake, index) => (
                <div key={mistake.mistake} className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold capitalize text-red-700 dark:text-red-300">
                      {mistake.mistake.replace('_', ' ')}
                    </h4>
                    <Badge variant="destructive">
                      {mistake.frequency} times
                    </Badge>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Total Loss: {formatCurrency(mistake.totalLoss)}
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-400">
                    Avg Loss: {formatCurrency(mistake.totalLoss / mistake.frequency)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PsychologicalAnalysis;
