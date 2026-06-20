USE inventorydb;

INSERT INTO suppliers (name, contact, address) VALUES
('Tech Supplies India', '9876543201', 'Mumbai'),
('Universal Traders', '9823456712', 'Pune'),
('Mega Electronics', '8899001122', 'Delhi'),
('Hardware Hub', '7766554433', 'Bangalore'),
('Star Components', '9988776655', 'Hyderabad'),
('Bright Traders', '9123456789', 'Nashik'),
('Super Parts Co.', '9001122334', 'Kolkata'),
('Nova Electronics', '7001234567', 'Chennai'),
('Prime Distributors', '8800112233', 'Surat'),
('Galaxy TechMart', '8321456790', 'Jaipur'),
('Reliable Suppliers', '7890654321', 'Nagpur'),
('Digital Ware', '9595959595', 'Goa'),
('Alpha Components', '9667788990', 'Indore'),
('Beta Electronics', '9112233445', 'Lucknow'),
('Global Parts Ltd.', '8300123499', 'Patna'),
('Rapid Supplies', '7200456712', 'Ranchi'),
('TechnoBase', '9400556677', 'Ahmedabad'),
('Elite Distributors', '9811122233', 'Chandigarh'),
('City Tech Supplies', '8523697410', 'Delhi'),
('GearUp Traders', '9009988776', 'Mumbai'),
('ElectroMart', '9696969696', 'Trivandrum'),
('Core Components', '8090909090', 'Bhopal'),
('Swift Supply Co.', '7007007007', 'Kochi'),
('Modern Tech Distributors', '7771114448', 'Pune'),
('Power Electronics', '6001122334', 'Bangalore');

INSERT INTO products (name, category, quantity, price, min_quantity) VALUES
-- Normal Stock (25 items)
('SSD 512GB NVMe', 'Storage', 40, 4200, 10),
('SSD 1TB NVMe', 'Storage', 32, 6200, 10),
('HDD 1TB', 'Storage', 50, 3200, 10),
('HDD 2TB', 'Storage', 30, 4500, 10),
('16GB DDR4 RAM', 'Memory', 60, 2800, 10),
('8GB DDR4 RAM', 'Memory', 70, 1800, 10),
('Keyboard Wireless', 'Accessories', 55, 699, 10),
('Mouse Wireless', 'Accessories', 80, 499, 10),
('HDMI Cable 1.5m', 'Cables', 100, 150, 10),
('HDMI Cable 3m', 'Cables', 95, 220, 10),
('LAN Cable 5m', 'Cables', 70, 180, 10),
('Laptop Charger 65W', 'Power', 35, 1200, 10),
('Laptop Charger 45W', 'Power', 45, 1100, 10),
('Earbuds Wireless', 'Audio', 75, 1900, 10),
('Bluetooth Speaker', 'Audio', 40, 2200, 10),
('Webcam HD', 'Accessories', 33, 1500, 10),
('LED Monitor 24"', 'Displays', 20, 9200, 5),
('LED Monitor 27"', 'Displays', 18, 13500, 5),
('Gaming Mouse', 'Accessories', 42, 1500, 10),
('Mechanical Keyboard', 'Accessories', 25, 3100, 10),
('Portable HDD 1TB', 'Storage', 28, 4200, 10),
('Power Bank 20k mAh', 'Power', 60, 1700, 10),
('USB-C Cable', 'Cables', 110, 120, 10),
('Type-C Adapter', 'Accessories', 90, 350, 10),
('Wireless Router AC1200', 'Networking', 22, 2800, 10),

-- LOW STOCK ITEMS (10 items)
('Thermal Paste 4g', 'Accessories', 3, 150, 10),       -- LOW STOCK
('Office Chair Wheels', 'Furniture', 2, 260, 8),        -- LOW STOCK
('Laptop Stand', 'Accessories', 4, 950, 10),            -- LOW STOCK
('RJ45 Connectors Pack', 'Cables', 5, 120, 15),         -- LOW STOCK
('HD Webcam Pro', 'Accessories', 1, 3200, 5),           -- LOW STOCK
('Gaming Headset', 'Audio', 6, 2400, 10),               -- LOW STOCK
('Wireless Keyboard Combo', 'Accessories', 3, 2200, 10), -- LOW STOCK
('LED Strip Light', 'Lighting', 4, 300, 12),            -- LOW STOCK
('Bluetooth USB Receiver', 'Accessories', 2, 299, 10), -- LOW STOCK
('Printer Ink Cartridge', 'Supplies', 1, 650, 10);     -- LOW STOCK



INSERT INTO transactions (product_id, supplier_id, quantity, type) VALUES
(1, 1, 10, 'IN'),
(2, 3, 5, 'OUT'),
(3, 2, 15, 'IN'),
(4, 4, 8, 'OUT'),
(5, 6, 25, 'IN'),
(6, 5, 20, 'IN'),
(7, 8, 12, 'OUT'),
(8, 9, 15, 'IN'),
(9, 10, 30, 'IN'),
(10, 11, 18, 'OUT'),
(11, 12, 14, 'IN'),
(12, 13, 10, 'IN'),
(13, 14, 9, 'OUT'),
(14, 15, 20, 'IN'),
(15, 16, 6, 'OUT'),
(16, 17, 12, 'IN'),
(17, 18, 5, 'OUT'),
(18, 19, 11, 'OUT'),
(19, 20, 7, 'IN'),
(20, 21, 14, 'OUT'),
(21, 22, 9, 'IN'),
(22, 23, 8, 'OUT'),
(23, 24, 25, 'IN'),
(24, 25, 30, 'IN'),
(25, 5, 6, 'OUT');

INSERT INTO inventory_logs (product_id, change_amount, action) VALUES
(1, 10, 'Stock Added'),
(2, -5, 'Stock Removed'),
(3, 15, 'Stock Added'),
(4, -8, 'Stock Removed'),
(5, 25, 'Stock Added'),
(6, 20, 'Stock Added'),
(7, -12, 'Stock Removed'),
(8, 15, 'Stock Added'),
(9, 30, 'Stock Added'),
(10, -18, 'Stock Removed'),
(11, 14, 'Stock Added'),
(12, 10, 'Stock Added'),
(13, -9, 'Stock Removed'),
(14, 20, 'Stock Added'),
(15, -6, 'Stock Removed'),
(16, 12, 'Stock Added'),
(17, -5, 'Stock Removed'),
(18, -11, 'Stock Removed'),
(19, 7, 'Stock Added'),
(20, -14, 'Stock Removed'),
(21, 9, 'Stock Added'),
(22, -8, 'Stock Removed'),
(23, 25, 'Stock Added'),
(24, 30, 'Stock Added'),
(25, -6, 'Stock Removed');


