-- Create the function to add the trade_type column
CREATE OR REPLACE FUNCTION add_trade_type_column()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add the trade_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'trades' 
    AND column_name = 'trade_type'
  ) THEN
    ALTER TABLE public.trades 
    ADD COLUMN trade_type TEXT CHECK (trade_type IN ('Day Trading', 'Investing'));
  END IF;
END;
$$; 