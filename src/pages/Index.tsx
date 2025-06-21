import { useAuth } from "@/hooks/useAuth";
import TradingDashboard from "@/components/trading/TradingDashboard";
import { useState } from "react";
import { Trade } from "@/types/trade";
import { useTrades } from "@/hooks/trading/useTrades";
import { UserMenu } from "@/components/layout/UserMenu";
import { LandingPage } from "@/components/layout/LandingPage";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const {
    trades,
    isLoadingTrades,
    addTrade,
    updateTrade,
    deleteTrade,
    deleteAllTrades,
    importTrades,
  } = useTrades();

  const handleAddTrade = (trade: Trade) => {
    addTrade(trade, {
      onSuccess: () => {
        setSelectedTrade(null);
      },
    });
  };

  const handleUpdateTrade = (trade: Trade) => {
    updateTrade(trade, {
      onSuccess: () => {
        setSelectedTrade(null);
      },
    });
  };

  const handleEditTrade = (trade: Trade | null) => {
    setSelectedTrade(trade);
  };

  if (loading || (user && isLoadingTrades)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 relative">
        <UserMenu />
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            <span style={{ color: '#db6dfe' }}>TRADEMIND</span>
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || user.email}.
          </p>
        </div>
        <TradingDashboard
          trades={trades || []}
          selectedTrade={selectedTrade}
          onAddTrade={handleAddTrade}
          onUpdateTrade={handleUpdateTrade}
          onDeleteTrade={deleteTrade}
          onImportTrades={importTrades}
          onDeleteAllTrades={deleteAllTrades}
          onEditTrade={handleEditTrade}
        />
      </main>
    </div>
  );
};

export default Index;
