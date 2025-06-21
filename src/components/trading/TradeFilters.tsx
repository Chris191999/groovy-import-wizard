import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { format } from "date-fns";

const tradeTypes = ["Day Trading", "Investing"];
const statuses = ["Completed", "Open", "Cancelled"];
const emotions = [
  "confident", "fearful", "fomo", "greedy", "disciplined", "uncertain", "undisciplined", "tilt"
];
const mistakeCategories = [
  "early_exit", "late_entry", "oversized", "revenge_trade", "fomo", "none", "late_exit", "early_entry", "position_too_small"
];

export interface TradeFiltersProps {
  filters: {
    dateFrom?: string;
    dateTo?: string;
    tradeType?: string;
    status?: string;
    strategyName?: string;
    economicEvents?: string;
    emotion?: string;
    mistakeCategory?: string;
  };
  onChange: (filters: TradeFiltersProps["filters"]) => void;
  onReset?: () => void;
  strategyNames?: string[];
  economicEvents?: string[];
}

export default function TradeFilters({ filters, onChange, onReset, strategyNames = [], economicEvents = [] }: TradeFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  return (
    <div className="bg-muted rounded-lg p-4 mb-4 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs mb-1">Date From</label>
          <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[140px] justify-start text-left font-normal"
              >
                {filters.dateFrom ? format(new Date(filters.dateFrom), "yyyy-MM-dd") : <span className="text-muted-foreground">Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                onSelect={date => {
                  onChange({ ...filters, dateFrom: date ? format(date, "yyyy-MM-dd") : undefined });
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
                {filters.dateTo ? format(new Date(filters.dateTo), "yyyy-MM-dd") : <span className="text-muted-foreground">Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                onSelect={date => {
                  onChange({ ...filters, dateTo: date ? format(date, "yyyy-MM-dd") : undefined });
                  setDateToOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="block text-xs mb-1">Trade Type</label>
          <Select
            value={filters.tradeType || "all"}
            onValueChange={v => onChange({ ...filters, tradeType: v === "all" ? undefined : v })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {tradeTypes.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-xs mb-1">Status</label>
          <Select
            value={filters.status || "all"}
            onValueChange={v => onChange({ ...filters, status: v === "all" ? undefined : v })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {statuses.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-xs mb-1">Strategy Name</label>
          <Select
            value={filters.strategyName || "all"}
            onValueChange={v => onChange({ ...filters, strategyName: v === "all" ? undefined : v })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {strategyNames.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" type="button" onClick={() => setShowAdvanced(v => !v)}>
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </Button>
        {onReset && (
          <Button variant="ghost" size="sm" type="button" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
      {showAdvanced && (
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs mb-1">Economic Events</label>
            <Select
              value={filters.economicEvents || "all"}
              onValueChange={v => onChange({ ...filters, economicEvents: v === "all" ? undefined : v })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {economicEvents.map(e => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs mb-1">Emotion</label>
            <Select
              value={filters.emotion || "all"}
              onValueChange={v => onChange({ ...filters, emotion: v === "all" ? undefined : v })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {emotions.map(e => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs mb-1">Mistake Category</label>
            <Select
              value={filters.mistakeCategory || "all"}
              onValueChange={v => onChange({ ...filters, mistakeCategory: v === "all" ? undefined : v })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {mistakeCategories.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
} 