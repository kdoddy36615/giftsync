-- Check if seed data exists
SELECT 'Gift Lists' as table_name, COUNT(*) as row_count FROM gift_lists
UNION ALL
SELECT 'Gift Items', COUNT(*) FROM gift_items
UNION ALL
SELECT 'Retailer Links', COUNT(*) FROM retailer_links;

-- Show the actual data
SELECT * FROM gift_lists ORDER BY name;
SELECT * FROM gift_items ORDER BY list_id, name;
SELECT * FROM retailer_links ORDER BY item_id, store_name;
