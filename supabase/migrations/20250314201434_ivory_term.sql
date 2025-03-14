/*
  # Initial Way2Go Schema

  1. New Tables
    - users
      - Extends Supabase auth.users
      - Stores user preferences and eco-points
    - routes
      - Stores saved routes and journey history
      - Tracks carbon footprint
    - transport_modes
      - Available transportation options
    - eco_rewards
      - Tracks eco-points and rewards

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Secure route history
*/

-- Users table extending auth.users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE,
  eco_points integer DEFAULT 0,
  carbon_saved float DEFAULT 0,
  preferred_mode text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Transport modes
CREATE TABLE IF NOT EXISTS transport_modes (
  id serial PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  carbon_factor float NOT NULL,
  points_per_km integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transport_modes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read transport modes"
  ON transport_modes
  FOR SELECT
  TO authenticated
  USING (true);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  start_location jsonb NOT NULL,
  end_location jsonb NOT NULL,
  transport_mode_id integer REFERENCES transport_modes(id),
  distance float NOT NULL,
  carbon_footprint float NOT NULL,
  eco_points_earned integer NOT NULL,
  journey_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own routes"
  ON routes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routes"
  ON routes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Eco rewards
CREATE TABLE IF NOT EXISTS eco_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  points_required integer NOT NULL,
  reward_type text NOT NULL,
  reward_description text NOT NULL,
  is_claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  claimed_at timestamptz
);

ALTER TABLE eco_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rewards"
  ON eco_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim rewards"
  ON eco_rewards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert initial transport modes
INSERT INTO transport_modes (name, icon, carbon_factor, points_per_km) VALUES
  ('Public Transit', 'Train', 0.04, 2),
  ('Cycling', 'Bike', 0, 3),
  ('Carpool', 'Car', 0.07, 1)
ON CONFLICT DO NOTHING;