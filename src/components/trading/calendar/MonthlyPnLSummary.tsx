
interface MonthlyPnLSummaryProps {
  monthlyPnL: number;
  currentMonth: string;
}

const MonthlyPnLSummary = ({ monthlyPnL, currentMonth }: MonthlyPnLSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="mt-4 p-4 rounded border border-gray-700 bg-gray-800/50">
      <div className="flex justify-between items-center">
        <span className="text-white font-medium">Monthly P&L ({currentMonth}):</span>
        <span className={`text-lg font-bold ${
          monthlyPnL > 0 ? 'text-green-400' : monthlyPnL < 0 ? 'text-red-400' : 'text-gray-400'
        }`}>
          {formatCurrency(monthlyPnL)}
        </span>
      </div>
    </div>
  );
};

export default MonthlyPnLSummary;
