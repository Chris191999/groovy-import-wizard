
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";

interface MarketContextProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
}

const MarketContext = ({ formData, onFieldChange }: MarketContextProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Market Context</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="market_condition_detailed">Market Condition</Label>
          <select
            id="market_condition_detailed"
            value={formData.market_condition_detailed || 'trending_up'}
            onChange={(e) => onFieldChange('market_condition_detailed', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="trending_up">Trending Up</option>
            <option value="trending_down">Trending Down</option>
            <option value="ranging">Ranging/Sideways</option>
            <option value="volatile">Highly Volatile</option>
            <option value="low_volume">Low Volume</option>
          </select>
        </div>

        <div>
          <Label htmlFor="market_volatility">Market Volatility</Label>
          <select
            id="market_volatility"
            value={formData.market_volatility || 'medium'}
            onChange={(e) => onFieldChange('market_volatility', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <Label htmlFor="economic_events">Economic Events</Label>
          <Input
            id="economic_events"
            value={formData.economic_events || ''}
            onChange={(e) => onFieldChange('economic_events', e.target.value)}
            placeholder="e.g., FOMC, Earnings, NFP"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketContext;
