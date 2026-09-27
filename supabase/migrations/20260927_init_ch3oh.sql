-- ===================================================================
-- CH3OH: Master Database Schema & Full-Spectrum Security Migration
-- Version: 1.0.0
-- Security: Row Level Security (RLS) on 100% of tables
-- ===================================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  birthday DATE,
  address TEXT,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. GROUPS TABLE
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  picture_url TEXT,
  banner_image TEXT NOT NULL DEFAULT '1.jpg',
  currency TEXT NOT NULL DEFAULT 'INR',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- 3. GROUP MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_group_user UNIQUE (group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Policies for Groups & Group Members
CREATE POLICY "Group members can view their groups"
  ON public.groups FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
    OR created_by = auth.uid()
  );

CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins or creator can update groups"
  ON public.groups FOR UPDATE
  TO authenticated
  USING (
    id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid() AND role = 'admin')
    OR created_by = auth.uid()
  );

CREATE POLICY "Members can view other members in their groups"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can add members or join groups"
  ON public.group_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can leave or admins can remove members"
  ON public.group_members FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 4. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  amount INTEGER NOT NULL CHECK (amount > 0), -- Stored strictly in paise/cents
  currency TEXT NOT NULL DEFAULT 'INR',
  paid_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  split_mode TEXT NOT NULL DEFAULT 'equal' CHECK (split_mode IN ('equal', 'exact', 'percentage', 'shares', 'adjustment')),
  notes TEXT,
  receipt_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view expenses in their groups"
  ON public.expenses FOR SELECT
  TO authenticated
  USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can insert expenses in their groups"
  ON public.expenses FOR INSERT
  TO authenticated
  WITH CHECK (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Members can update expenses in their groups"
  ON public.expenses FOR UPDATE
  TO authenticated
  USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Creator or payer can delete expenses"
  ON public.expenses FOR DELETE
  TO authenticated
  USING (
    paid_by_id = auth.uid() OR created_by = auth.uid()
  );

-- 5. EXPENSE SPLITS TABLE
CREATE TABLE IF NOT EXISTS public.expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount >= 0), -- Share in paise
  percentage NUMERIC(5, 2),
  shares INTEGER DEFAULT 1,
  is_settled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_expense_split_user UNIQUE (expense_id, user_id)
);

ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view splits for group expenses"
  ON public.expense_splits FOR SELECT
  TO authenticated
  USING (
    expense_id IN (
      SELECT e.id FROM public.expenses e
      JOIN public.group_members gm ON e.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert splits for group expenses"
  ON public.expense_splits FOR INSERT
  TO authenticated
  WITH CHECK (
    expense_id IN (
      SELECT e.id FROM public.expenses e
      JOIN public.group_members gm ON e.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update splits for group expenses"
  ON public.expense_splits FOR UPDATE
  TO authenticated
  USING (
    expense_id IN (
      SELECT e.id FROM public.expenses e
      JOIN public.group_members gm ON e.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

-- 6. SETTLEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  payee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  amount INTEGER NOT NULL CHECK (amount > 0), -- paise
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL DEFAULT 'UPI',
  notes TEXT,
  settled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view settlements"
  ON public.settlements FOR SELECT
  TO authenticated
  USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Group members can create settlements"
  ON public.settlements FOR INSERT
  TO authenticated
  WITH CHECK (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
    AND (payer_id = auth.uid() OR payee_id = auth.uid())
  );

-- 7. BIKES REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.bikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT,
  reg_number TEXT NOT NULL,
  photo_url TEXT,
  current_odometer NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (current_odometer >= 0),
  last_parked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'parked' CHECK (status IN ('parked', 'in_ride', 'maintenance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view bikes"
  ON public.bikes FOR SELECT
  TO authenticated
  USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Group members can add bikes"
  ON public.bikes FOR INSERT
  TO authenticated
  WITH CHECK (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Group members can update bikes"
  ON public.bikes FOR UPDATE
  TO authenticated
  USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

-- 8. BIKE SECURE DOCUMENTS VAULT
CREATE TABLE IF NOT EXISTS public.bike_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id UUID NOT NULL REFERENCES public.bikes(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('RC', 'Insurance', 'PUC', 'Invoice', 'Other')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.bike_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view bike documents"
  ON public.bike_documents FOR SELECT
  TO authenticated
  USING (
    bike_id IN (
      SELECT b.id FROM public.bikes b
      JOIN public.group_members gm ON b.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can upload bike documents"
  ON public.bike_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    bike_id IN (
      SELECT b.id FROM public.bikes b
      JOIN public.group_members gm ON b.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

-- 9. BIKE RIDES (THE ODOMETER CHAIN)
CREATE TABLE IF NOT EXISTS public.bike_rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id UUID NOT NULL REFERENCES public.bikes(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  start_odometer NUMERIC(10, 2) NOT NULL,
  end_odometer NUMERIC(10, 2) NOT NULL,
  distance NUMERIC(10, 2) GENERATED ALWAYS AS (end_odometer - start_odometer) STORED,
  ride_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  fuel_cost_share INTEGER DEFAULT 0, -- paise
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_odometer_direction CHECK (end_odometer >= start_odometer)
);

ALTER TABLE public.bike_rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view bike rides"
  ON public.bike_rides FOR SELECT
  TO authenticated
  USING (
    bike_id IN (
      SELECT b.id FROM public.bikes b
      JOIN public.group_members gm ON b.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Riders can insert bike rides"
  ON public.bike_rides FOR INSERT
  TO authenticated
  WITH CHECK (
    rider_id = auth.uid()
    AND bike_id IN (
      SELECT b.id FROM public.bikes b
      JOIN public.group_members gm ON b.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

-- 10. BIKE RIDE PASSENGERS (CO-RIDERS)
CREATE TABLE IF NOT EXISTS public.bike_ride_passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES public.bike_rides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_ride_passenger UNIQUE (ride_id, user_id)
);

ALTER TABLE public.bike_ride_passengers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view ride passengers"
  ON public.bike_ride_passengers FOR SELECT
  TO authenticated
  USING (
    ride_id IN (
      SELECT r.id FROM public.bike_rides r
      JOIN public.bikes b ON r.bike_id = b.id
      JOIN public.group_members gm ON b.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Riders can add passengers"
  ON public.bike_ride_passengers FOR INSERT
  TO authenticated
  WITH CHECK (
    ride_id IN (SELECT id FROM public.bike_rides WHERE rider_id = auth.uid())
  );

-- 11. BIKE FUEL LOGS
CREATE TABLE IF NOT EXISTS public.bike_fuel_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id UUID NOT NULL REFERENCES public.bikes(id) ON DELETE CASCADE,
  filled_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  litres NUMERIC(6, 2) NOT NULL CHECK (litres > 0),
  total_cost INTEGER NOT NULL CHECK (total_cost > 0), -- paise
  odometer_at_fill NUMERIC(10, 2) NOT NULL,
  is_full_tank BOOLEAN NOT NULL DEFAULT true,
  receipt_url TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.bike_fuel_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view fuel logs"
  ON public.bike_fuel_logs FOR SELECT
  TO authenticated
  USING (
    bike_id IN (
      SELECT b.id FROM public.bikes b
      JOIN public.group_members gm ON b.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can insert fuel logs"
  ON public.bike_fuel_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    bike_id IN (
      SELECT b.id FROM public.bikes b
      JOIN public.group_members gm ON b.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

-- 12. BIKE ODOMETER GAPS (SUSPICIOUS VOIDS)
CREATE TABLE IF NOT EXISTS public.bike_odometer_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id UUID NOT NULL REFERENCES public.bikes(id) ON DELETE CASCADE,
  detected_start_odometer NUMERIC(10, 2) NOT NULL,
  previous_stop_odometer NUMERIC(10, 2) NOT NULL,
  gap_distance NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved_guest_ride', 'rejected')),
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.bike_odometer_gaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view odometer gaps"
  ON public.bike_odometer_gaps FOR SELECT
  TO authenticated
  USING (
    bike_id IN (
      SELECT b.id FROM public.bikes b
      JOIN public.group_members gm ON b.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can insert/resolve odometer gaps"
  ON public.bike_odometer_gaps FOR ALL
  TO authenticated
  USING (
    bike_id IN (
      SELECT b.id FROM public.bikes b
      JOIN public.group_members gm ON b.group_id = gm.group_id
      WHERE gm.user_id = auth.uid()
    )
  );

-- 13. WALL CALENDAR EVENTS (INTEGRATED CALENDAR)
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TEXT NOT NULL, -- Format: YYYY-MM-DD
  time TEXT,
  category TEXT NOT NULL DEFAULT 'expense' CHECK (category IN ('expense', 'settlement', 'ride', 'fuel', 'reminder')),
  expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view calendar events in their groups"
  ON public.calendar_events FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their calendar events"
  ON public.calendar_events FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- 14. IMMUTABLE AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  performed_by UUID,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins or members can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (true);

-- 15. ATOMIC RPC FUNCTION: CREATE EXPENSE WITH SPLITS
CREATE OR REPLACE FUNCTION public.create_expense_with_splits(
  p_group_id UUID,
  p_title TEXT,
  p_category TEXT,
  p_amount INTEGER,
  p_currency TEXT,
  p_paid_by_id UUID,
  p_expense_date DATE,
  p_split_mode TEXT,
  p_notes TEXT,
  p_splits JSONB
) RETURNS UUID AS $$
DECLARE
  v_expense_id UUID;
  v_split RECORD;
  v_total_split INTEGER := 0;
BEGIN
  -- Insert base expense
  INSERT INTO public.expenses (
    group_id, title, category, amount, currency, paid_by_id, expense_date, split_mode, notes, created_by
  ) VALUES (
    p_group_id, p_title, p_category, p_amount, p_currency, p_paid_by_id, p_expense_date, p_split_mode, p_notes, auth.uid()
  ) RETURNING id INTO v_expense_id;

  -- Iterate and insert splits
  FOR v_split IN SELECT * FROM jsonb_to_recordset(p_splits) AS x(
    user_id UUID, amount INTEGER, percentage NUMERIC, shares INTEGER
  ) LOOP
    INSERT INTO public.expense_splits (
      expense_id, user_id, amount, percentage, shares
    ) VALUES (
      v_expense_id, v_split.user_id, v_split.amount, v_split.percentage, COALESCE(v_split.shares, 1)
    );
    v_total_split := v_total_split + v_split.amount;
  END LOOP;

  -- Verify zero paisa leakage
  IF v_total_split <> p_amount THEN
    RAISE EXCEPTION 'Split sum (%) does not equal total expense amount (%) in paise', v_total_split, p_amount;
  END IF;

  -- Auto-link to calendar_events
  INSERT INTO public.calendar_events (
    user_id, group_id, title, date, category, expense_id
  ) VALUES (
    p_paid_by_id, p_group_id, p_title || ' (' || p_currency || ' ' || (p_amount / 100.0)::text || ')',
    p_expense_date::text, 'expense', v_expense_id
  );

  RETURN v_expense_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
