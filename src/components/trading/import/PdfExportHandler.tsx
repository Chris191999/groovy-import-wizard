import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { FileText, Download, Loader2 } from "lucide-react";
import { generateTradingReportPdf } from "@/utils/pdfGenerator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface PdfExportHandlerProps {
  trades: Trade[];
}

const PdfExportHandler = ({ trades }: PdfExportHandlerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      if (dateFrom && trade.date < dateFrom) return false;
      if (dateTo && trade.date > dateTo) return false;
      return true;
    });
  }, [trades, dateFrom, dateTo]);

  const handleExportToPdf = async () => {
    if (filteredTrades.length === 0) {
      alert("No trades to export");
      return;
    }

    setIsGenerating(true);
    try {
      await generateTradingReportPdf(filteredTrades);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={20} />
          Export Trading Report PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 items-end mb-2">
          <div>
            <label className="block text-xs mb-1">Date From</label>
            <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[140px] justify-start text-left font-normal"
                >
                  {dateFrom ? format(new Date(dateFrom), "yyyy-MM-dd") : <span className="text-muted-foreground">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={dateFrom ? new Date(dateFrom) : undefined}
                  onSelect={date => {
                    setDateFrom(date ? format(date, "yyyy-MM-dd") : undefined);
                    setDateFromOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-xs mb-1">Date To</label>
            <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[140px] justify-start text-left font-normal"
                >
                  {dateTo ? format(new Date(dateTo), "yyyy-MM-dd") : <span className="text-muted-foreground">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={dateTo ? new Date(dateTo) : undefined}
                  onSelect={date => {
                    setDateTo(date ? format(date, "yyyy-MM-dd") : undefined);
                    setDateToOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button variant="ghost" size="sm" type="button" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate a comprehensive PDF report with all your trading data, analytics, and performance metrics.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Report includes:</p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Complete trade log with all details</li>
            <li>• Performance metrics and statistics</li>
            <li>• Risk management analysis</li>
            <li>• Psychological trading patterns</li>
            <li>• Time-based performance analysis</li>
            <li>• Charts and visual analytics</li>
          </ul>
        </div>
        <Button 
          onClick={handleExportToPdf}
          disabled={filteredTrades.length === 0 || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export as PDF ({filteredTrades.length} trades)
            </>
          )}
        </Button>
        {filteredTrades.length === 0 && (
          <p className="text-sm text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
            Add some trades or adjust your date filter to generate a PDF report.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfExportHandler;
