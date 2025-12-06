-- Seed data for demo@test.com
-- User ID: 96c9be54-ac92-4266-a672-b6d4afe90dbf

-- Temporarily disable RLS for seeding
ALTER TABLE gift_lists DISABLE ROW LEVEL SECURITY;
ALTER TABLE gift_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_links DISABLE ROW LEVEL SECURITY;

-- Insert Gift Lists (People)
INSERT INTO gift_lists (id, user_id, name, color) VALUES
  ('d1111111-1111-1111-1111-111111111111', '96c9be54-ac92-4266-a672-b6d4afe90dbf', 'Emily', '#6366f1'),
  ('d2222222-2222-2222-2222-222222222222', '96c9be54-ac92-4266-a672-b6d4afe90dbf', 'Jake', '#ec4899'),
  ('d3333333-3333-3333-3333-333333333333', '96c9be54-ac92-4266-a672-b6d4afe90dbf', 'Mom', '#10b981');

-- Insert Gift Items for Emily
INSERT INTO gift_items (id, list_id, name, status, price_low, price_high, value_tag, is_completed) VALUES
  ('da111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Wireless Headphones', 'required', 75.00, 150.00, 'electronics', false),
  ('da222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'Yoga Mat', 'optional', 25.00, 60.00, 'fitness', false),
  ('da333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'Coffee Maker', 'required', 80.00, 200.00, 'kitchen', false),
  ('da444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'Running Shoes', 'required', 90.00, 180.00, 'fitness', false);

-- Insert Gift Items for Jake
INSERT INTO gift_items (id, list_id, name, status, price_low, price_high, value_tag, is_completed) VALUES
  ('db111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'Gaming Mouse', 'required', 40.00, 120.00, 'gaming', false),
  ('db222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'Mechanical Keyboard', 'required', 100.00, 250.00, 'gaming', false),
  ('db333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', 'Desk Lamp', 'optional', 30.00, 80.00, 'home', false);

-- Insert Gift Items for Mom
INSERT INTO gift_items (id, list_id, name, status, price_low, price_high, value_tag, is_completed) VALUES
  ('dc111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333', 'Instant Pot', 'required', 70.00, 130.00, 'kitchen', false),
  ('dc222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', 'Essential Oil Diffuser', 'optional', 20.00, 50.00, 'wellness', false),
  ('dc333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'Gardening Tools Set', 'required', 40.00, 90.00, 'outdoor', false);

-- Insert Retailer Links for Emily's Wireless Headphones
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('da111111-1111-1111-1111-111111111111', 'Amazon', 'https://amazon.com/headphones-1', 89.99, true, false),
  ('da111111-1111-1111-1111-111111111111', 'Best Buy', 'https://bestbuy.com/headphones-1', 129.99, false, false),
  ('da111111-1111-1111-1111-111111111111', 'Apple Store', 'https://apple.com/headphones-1', 149.99, false, true);

-- Insert Retailer Links for Emily's Yoga Mat
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('da222222-2222-2222-2222-222222222222', 'Amazon', 'https://amazon.com/yoga-mat-1', 29.99, true, false),
  ('da222222-2222-2222-2222-222222222222', 'Target', 'https://target.com/yoga-mat-1', 35.99, false, false),
  ('da222222-2222-2222-2222-222222222222', 'Lululemon', 'https://lululemon.com/yoga-mat-1', 58.00, false, true);

-- Insert Retailer Links for Emily's Coffee Maker
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('da333333-3333-3333-3333-333333333333', 'Amazon', 'https://amazon.com/coffee-maker-1', 99.99, true, false),
  ('da333333-3333-3333-3333-333333333333', 'Walmart', 'https://walmart.com/coffee-maker-1', 110.00, false, false),
  ('da333333-3333-3333-3333-333333333333', 'Williams Sonoma', 'https://williams-sonoma.com/coffee-maker-1', 189.99, false, true);

-- Insert Retailer Links for Emily's Running Shoes
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('da444444-4444-4444-4444-444444444444', 'Amazon', 'https://amazon.com/running-shoes-1', 110.00, true, false),
  ('da444444-4444-4444-4444-444444444444', 'Nike', 'https://nike.com/running-shoes-1', 140.00, false, false),
  ('da444444-4444-4444-4444-444444444444', 'Foot Locker', 'https://footlocker.com/running-shoes-1', 165.00, false, true);

-- Insert Retailer Links for Jake's Gaming Mouse
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('db111111-1111-1111-1111-111111111111', 'Amazon', 'https://amazon.com/gaming-mouse-1', 49.99, true, false),
  ('db111111-1111-1111-1111-111111111111', 'Best Buy', 'https://bestbuy.com/gaming-mouse-1', 69.99, false, false),
  ('db111111-1111-1111-1111-111111111111', 'Razer', 'https://razer.com/gaming-mouse-1', 119.99, false, true);

-- Insert Retailer Links for Jake's Mechanical Keyboard
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('db222222-2222-2222-2222-222222222222', 'Amazon', 'https://amazon.com/keyboard-1', 119.99, true, false),
  ('db222222-2222-2222-2222-222222222222', 'Best Buy', 'https://bestbuy.com/keyboard-1', 139.99, false, false),
  ('db222222-2222-2222-2222-222222222222', 'Corsair', 'https://corsair.com/keyboard-1', 229.99, false, true);

-- Insert Retailer Links for Jake's Desk Lamp
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('db333333-3333-3333-3333-333333333333', 'Amazon', 'https://amazon.com/desk-lamp-1', 34.99, true, false),
  ('db333333-3333-3333-3333-333333333333', 'IKEA', 'https://ikea.com/desk-lamp-1', 45.00, false, false),
  ('db333333-3333-3333-3333-333333333333', 'West Elm', 'https://westelm.com/desk-lamp-1', 78.00, false, true);

-- Insert Retailer Links for Mom's Instant Pot
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('dc111111-1111-1111-1111-111111111111', 'Amazon', 'https://amazon.com/instant-pot-1', 79.99, true, false),
  ('dc111111-1111-1111-1111-111111111111', 'Target', 'https://target.com/instant-pot-1', 89.99, false, false),
  ('dc111111-1111-1111-1111-111111111111', 'Sur La Table', 'https://surlatable.com/instant-pot-1', 129.99, false, true);

-- Insert Retailer Links for Mom's Essential Oil Diffuser
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('dc222222-2222-2222-2222-222222222222', 'Amazon', 'https://amazon.com/diffuser-1', 24.99, true, false),
  ('dc222222-2222-2222-2222-222222222222', 'Bed Bath & Beyond', 'https://bedbathandbeyond.com/diffuser-1', 32.99, false, false),
  ('dc222222-2222-2222-2222-222222222222', 'Vitruvi', 'https://vitruvi.com/diffuser-1', 49.00, false, true);

-- Insert Retailer Links for Mom's Gardening Tools Set
INSERT INTO retailer_links (item_id, store_name, url, price, is_best_price, is_highend) VALUES
  ('dc333333-3333-3333-3333-333333333333', 'Amazon', 'https://amazon.com/garden-tools-1', 44.99, true, false),
  ('dc333333-3333-3333-3333-333333333333', 'Home Depot', 'https://homedepot.com/garden-tools-1', 59.99, false, false),
  ('dc333333-3333-3333-3333-333333333333', 'Gardeners Supply', 'https://gardeners.com/garden-tools-1', 89.99, false, true);

-- Re-enable RLS
ALTER TABLE gift_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_links ENABLE ROW LEVEL SECURITY;

-- Verify the data was inserted
SELECT 'Gift Lists' as table_name, COUNT(*) as row_count FROM gift_lists WHERE user_id = '96c9be54-ac92-4266-a672-b6d4afe90dbf'
UNION ALL
SELECT 'Gift Items', COUNT(*) FROM gift_items WHERE list_id IN (SELECT id FROM gift_lists WHERE user_id = '96c9be54-ac92-4266-a672-b6d4afe90dbf')
UNION ALL
SELECT 'Retailer Links', COUNT(*) FROM retailer_links WHERE item_id IN (SELECT id FROM gift_items WHERE list_id IN (SELECT id FROM gift_lists WHERE user_id = '96c9be54-ac92-4266-a672-b6d4afe90dbf'));
