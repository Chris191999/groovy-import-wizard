import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { Upload, Download, Trash2, FileText } from "lucide-react";
import ImportZipHandler from "./import/ImportZipHandler";
import ExportDataHandler from "./import/ExportDataHandler";
import DeleteDataHandler from "./import/DeleteDataHandler";
import CsvImportHandler from "./import/CsvImportHandler";
import PdfExportHandler from "./import/PdfExportHandler";

interface TradeImportProps {
  onImport: (trades: Trade[]) => void;
  onDeleteAll: () => void;
  trades: Trade[];
}

const TradeImport = ({ onImport, onDeleteAll, trades }: TradeImportProps) => {
  const sampleCsv = `symbol,direction,date,status,test_type,order_type,entry,exit,risk,planned_vs_actual_pnl,fees,market_condition,order_liq,liq_entry_breakeven_risk,pnducm_imbalance,entry_liq,liquidity,notes,id,image_files,pnl,emotion,confidence_rating,mistake_category,rules_followed,post_trade_reflection,market_condition_detailed,time_of_day,economic_events,market_volatility,trade_duration_hours,max_adverse_excursion,max_favorable_excursion,slippage,commission_breakdown,setup_type,strategy_name,timeframe
AAPL,Long,2024-01-15,Completed,Swing,Market,150.00,155.00,100,500,2.50,Bullish,High,Good,Low,High,Excellent,Great breakout trade,1,d290f1ee-6c54-4b01-90e6-d701748f0851.png;f47ac10b-58cc-4372-a567-0e02b2c3d479.png,500,confident,8,none,true,Excellent execution following the plan,trending_up,09:30,FOMC,medium,24,50,200,0.05,"entry:1.25,exit:1.25",breakout,momentum,1d
TSLA,Short,2024-01-16,Completed,Day,Limit,200.00,195.00,150,750,3.00,Bearish,Medium,Fair,High,Medium,Good,Good resistance rejection,2,9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.png,750,disciplined,9,none,true,Perfect short at resistance level,trending_down,14:15,Earnings,high,4,25,300,0.10,"entry:1.50,exit:1.50",resistance,reversal,1h`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={20} />
              Import Trading Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImportZipHandler onImport={onImport} />
            <div className="border-t pt-4">
              <CsvImportHandler onImport={onImport} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download size={20} />
              Export Trading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExportDataHandler trades={trades} />
          </CardContent>
        </Card>

        <PdfExportHandler trades={trades} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 size={20} />
              Delete All Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeleteDataHandler trades={trades} onDeleteAll={onDeleteAll} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enhanced CSV Format Example</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Your CSV now supports comprehensive trade data including psychological analysis, market context, and advanced metrics:
          </p>
          <div className="bg-muted p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">New Fields Added:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 grid grid-cols-2 gap-2">
              <li>• Psychological: emotion, confidence_rating, mistake_category</li>
              <li>• Market Context: market_condition_detailed, time_of_day, volatility</li>
              <li>• Advanced Data: MAE, MFE, trade_duration_hours, slippage</li>
              <li>• Strategy: setup_type, strategy_name, timeframe</li>
              <li>• Reflection: post_trade_reflection, rules_followed</li>
              <li>• Events: economic_events, commission_breakdown</li>
            </ul>
          </div>
          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
            {sampleCsv}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeImport;
