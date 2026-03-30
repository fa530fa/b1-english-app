-- B1 English Prep - Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/tgnhhlwzpxsvpmadpbre/sql)

-- Categories / Tags
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile TEXT NOT NULL,            -- 'waikwan' or 'poping'
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Q&A Cards
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile TEXT NOT NULL,            -- 'waikwan' or 'poping'
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  question_en TEXT NOT NULL,
  question_zh TEXT,
  answer_en TEXT NOT NULL,
  answer_zh TEXT,
  notes TEXT,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- No RLS needed (no auth, personal app)
-- Allow public access via anon key
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access categories"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public access cards"
  ON cards FOR ALL
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_cards_profile ON cards(profile);
CREATE INDEX idx_cards_category_id ON cards(category_id);
CREATE INDEX idx_categories_profile ON categories(profile);
