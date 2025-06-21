
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";

interface BasicTradeInfoProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
}

const BasicTradeInfo = ({ formData, onFieldChange }: BasicTradeInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Basic Trade Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="symbol">Symbol *</Label>
          <Input
            id="symbol"
            value={formData.symbol || ''}
            onChange={(e) => onFieldChange('symbol', e.target.value)}
            placeholder="e.g., AAPL, BTC"
            required
          />
        </div>

        <div>
          <Label htmlFor="trade_type">Trade Type</Label>
          <select
            id="trade_type"
            value={formData.trade_type || 'Day Trading'}
            onChange={(e) => onFieldChange('trade_type', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Day Trading">Day Trading</option>
            <option value="Investing">Investing</option>
          </select>
        </div>

        <div>
          <Label htmlFor="direction">Direction</Label>
          <select
            id="direction"
            value={formData.direction || 'Long'}
            onChange={(e) => onFieldChange('direction', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => onFieldChange('date', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="time_of_day">Time of Day</Label>
          <Input
            id="time_of_day"
            type="time"
            value={formData.time_of_day || ''}
            onChange={(e) => onFieldChange('time_of_day', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status || 'Open'}
            onChange={(e) => onFieldChange('status', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Open">Open</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <Label htmlFor="order_type">Order Type</Label>
          <select
            id="order_type"
            value={formData.order_type || 'Market'}
            onChange={(e) => onFieldChange('order_type', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Market">Market</option>
            <option value="Limit">Limit</option>
            <option value="Stop">Stop</option>
            <option value="Forward">Forward</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BasicTradeInfo;
