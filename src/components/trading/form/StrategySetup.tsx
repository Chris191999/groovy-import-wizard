
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";

interface StrategySetupProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
}

const StrategySetup = ({ formData, onFieldChange }: StrategySetupProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Strategy & Setup</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="strategy_name">Strategy Name</Label>
          <Input
            id="strategy_name"
            value={formData.strategy_name || ''}
            onChange={(e) => onFieldChange('strategy_name', e.target.value)}
            placeholder="e.g., Breakout, Pullback"
          />
        </div>

        <div>
          <Label htmlFor="setup_type">Setup Type</Label>
          <Input
            id="setup_type"
            value={formData.setup_type || ''}
            onChange={(e) => onFieldChange('setup_type', e.target.value)}
            placeholder="e.g., Flag, Triangle, Support/Resistance"
          />
        </div>

        <div>
          <Label htmlFor="timeframe">Timeframe</Label>
          <select
            id="timeframe"
            value={formData.timeframe || '1h'}
            onChange={(e) => onFieldChange('timeframe', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="1m">1 Minute</option>
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="1d">1 Day</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StrategySetup;
