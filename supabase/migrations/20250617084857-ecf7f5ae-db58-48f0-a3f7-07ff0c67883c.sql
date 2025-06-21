
-- Add the missing position_size column to the trades table
ALTER TABLE public.trades 
ADD COLUMN position_size NUMERIC;
