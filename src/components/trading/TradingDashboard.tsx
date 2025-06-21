
import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Trade } from "@/types/trade";
import TradingJournalTabs from "@/components/pages/TradingJournalTabs";
import OverviewTab from "@/components/pages/tabs/OverviewTab";
import TradesTab from "@/components/pages/tabs/TradesTab";
import AddTradeTab from "@/components/pages/tabs/AddTradeTab";
import ImportTab from "@/components/pages/tabs/ImportTab";
import AnalyticsTab from "@/components/pages/tabs/AnalyticsTab";
import AdvancedTab from "@/components/pages/tabs/AdvancedTab";

interface TradingDashboardProps {
  trades: Trade[];
  selectedTrade: Trade | null;
  onAddTrade: (trade: Trade) => void;
  onUpdateTrade: (updatedTrade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onImportTrades: (importedTrades: Trade[]) => void;
  onDeleteAllTrades: () => void;
  onEditTrade: (trade: Trade | null) => void;
}

const ACTIVE_TAB_STORAGE_KEY = 'trading_dashboard_active_tab';

const TradingDashboard = ({
  trades,
  selectedTrade,
  onAddTrade,
  onUpdateTrade,
  onDeleteTrade,
  onImportTrades,
  onDeleteAllTrades,
  onEditTrade,
}: TradingDashboardProps) => {
  // Initialize activeTab from sessionStorage or default to overview
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return sessionStorage.getItem(ACTIVE_TAB_STORAGE_KEY) || "overview";
    } catch {
      return "overview";
    }
  });

  // Save active tab to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab);
    } catch (error) {
      console.error('Failed to save active tab:', error);
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedTrade) {
      setActiveTab("add-trade");
    }
  }, [selectedTrade]);

  const handleSubmit = (trade: Trade) => {
    if (selectedTrade) {
      onUpdateTrade(trade);
    } else {
      onAddTrade(trade);
    }
    setActiveTab("trades");
  };

  const handleCancel = () => {
    onEditTrade(null);
    setActiveTab("trades");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TradingJournalTabs />

      <OverviewTab 
        trades={trades}
        onEdit={onEditTrade}
        onDelete={onDeleteTrade}
      />

      <TradesTab 
        trades={trades}
        onEdit={onEditTrade}
        onDelete={onDeleteTrade}
      />

      <AddTradeTab 
        selectedTrade={selectedTrade}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <ImportTab 
        trades={trades}
        onImport={onImportTrades}
        onDeleteAll={onDeleteAllTrades}
      />

      <AnalyticsTab trades={trades} />

      <AdvancedTab trades={trades} />
    </Tabs>
  );
};

export default TradingDashboard;
