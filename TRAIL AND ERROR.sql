USE inventorydb;

INSERT INTO transactions (product_id, supplier_id, quantity, type)
VALUES
-- IN transactions
(26, 1, 20, 'IN'),
(27, 2, 15, 'IN'),
(28, 3, 30, 'IN'),
(29, 4, 25, 'IN'),
(30, 5, 10, 'IN'),
(31, 2, 18, 'IN'),
(32, 3, 40, 'IN'),
(33, 1, 35, 'IN'),
(34, 4, 12, 'IN'),
(35, 5, 50, 'IN'),

-- OUT transactions
(26, NULL, 5, 'OUT'),
(27, NULL, 3, 'OUT'),
(28, NULL, 8, 'OUT'),
(29, NULL, 10, 'OUT'),
(30, NULL, 4, 'OUT'),
(31, NULL, 6, 'OUT'),
(32, NULL, 15, 'OUT'),
(33, NULL, 12, 'OUT'),
(34, NULL, 9, 'OUT'),
(35, NULL, 20, 'OUT'),

-- Mixed activity
(36, 1, 22, 'IN'),
(36, NULL, 10, 'OUT'),
(37, 2, 12, 'IN'),
(38, 3, 28, 'IN'),
(39, NULL, 14, 'OUT');
INSERT INTO inventory_logs (product_id, change_amount, action)
VALUES
(26,  +20, 'Stock Added'),
(27,  +15, 'Stock Added'),
(28,  +30, 'Stock Added'),
(29,  +25, 'Stock Added'),
(30,  +10, 'Stock Added'),
(31,  -6,  'Stock Removed'),
(32,  +40, 'Stock Added'),
(33,  -12, 'Stock Removed'),
(34,  +12, 'Stock Added'),
(35,  -20, 'Stock Removed'),
(36,  +22, 'Stock Added'),
(36,  -10, 'Stock Removed'),
(37,  +12, 'Stock Added'),
(38,  +28, 'Stock Added'),
(39,  -14, 'Stock Removed');

