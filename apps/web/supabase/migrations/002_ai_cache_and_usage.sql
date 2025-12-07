-- AI Quick Add: Cache and Usage Tracking Tables

-- Cache table: Store AI responses to avoid redundant API calls
CREATE TABLE ai_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash text NOT NULL UNIQUE,
  query_text text NOT NULL,
  response_json jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  hit_count integer DEFAULT 0
);

CREATE INDEX idx_ai_cache_hash ON ai_cache(query_hash);
CREATE INDEX idx_ai_cache_expires ON ai_cache(expires_at);

-- Usage tracking: Per-user monthly AI budget tracking
CREATE TABLE ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year text NOT NULL,
  tokens_used integer DEFAULT 0,
  cost_cents integer DEFAULT 0,
  request_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month_year)
);

CREATE INDEX idx_ai_usage_user_month ON ai_usage(user_id, month_year);

-- Row Level Security
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Cache is readable by all authenticated users (shared benefit)
CREATE POLICY "Cache readable by authenticated users"
  ON ai_cache FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert/update cache
CREATE POLICY "Service role can manage cache"
  ON ai_cache FOR ALL
  TO service_role
  USING (true);

-- Users can view their own usage
CREATE POLICY "Users can view own usage"
  ON ai_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only service role can update usage
CREATE POLICY "Service role can manage usage"
  ON ai_usage FOR ALL
  TO service_role
  USING (true);
