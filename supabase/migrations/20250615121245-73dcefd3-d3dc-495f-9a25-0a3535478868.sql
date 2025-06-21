
-- Drop the existing trades table
DROP TABLE IF EXISTS public.trades;

-- Create a new, more comprehensive trades table to match the UI components
CREATE TABLE public.trades (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Basic Info
  symbol TEXT,
  direction TEXT CHECK (direction IN ('Long', 'Short')),
  date DATE,
  status TEXT, -- e.g., 'Open', 'Completed', 'Cancelled'
  test_type TEXT,
  order_type TEXT, -- e.g., 'Market', 'Limit', 'Stop'

  -- Price & Financials
  entry NUMERIC,
  exit NUMERIC,
  quantity NUMERIC,
  risk NUMERIC,
  pnl NUMERIC,
  planned_vs_actual_pnl NUMERIC,
  fees NUMERIC,
  
  -- Context (with corrected typos)
  market_condition TEXT,
  order_liq TEXT,
  liq_entry_breakeven_risk TEXT,
  pnducm_imbalance TEXT, -- Kept as is from original code
  entry_liq TEXT,
  liquidity TEXT,

  -- Notes & Images
  notes TEXT,
  image_files TEXT[],
  post_trade_reflection TEXT,

  -- Psychological
  emotion TEXT,
  confidence_rating INTEGER,
  mistake_category TEXT,
  rules_followed BOOLEAN,

  -- Advanced Metrics
  max_adverse_excursion NUMERIC,
  max_favorable_excursion NUMERIC,
  trade_duration_hours NUMERIC,
  slippage NUMERIC,
  commission_breakdown TEXT,

  -- Strategy
  setup_type TEXT,
  strategy_name TEXT,
  timeframe TEXT,
  
  -- Market Context
  market_condition_detailed TEXT,
  time_of_day TEXT,
  economic_events TEXT,
  market_volatility TEXT
);

-- Add Row Level Security (RLS)
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own trades" ON public.trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trades" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" ON public.trades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades" ON public.trades
  FOR DELETE USING (auth.uid() = user_id);

