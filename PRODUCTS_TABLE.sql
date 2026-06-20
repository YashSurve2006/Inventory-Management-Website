 USE inventorydb;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(50),
    brand VARCHAR(100),
    price DECIMAL(10,2),
    socket VARCHAR(50),
    ram_type VARCHAR(20),
    wattage INT,
    storage_type VARCHAR(50),
    size VARCHAR(50),
    stock INT DEFAULT 20
);

-- ======================
-- CPUs
-- ======================

INSERT INTO products (name,category,brand,price,socket,stock) VALUES
('Intel Core i3 12100F','CPU','Intel',8900,'LGA1700',20),
('Intel Core i5 12400F','CPU','Intel',14500,'LGA1700',20),
('Intel Core i5 13400F','CPU','Intel',18900,'LGA1700',20),
('Intel Core i5 13600K','CPU','Intel',27900,'LGA1700',15),
('Intel Core i7 12700K','CPU','Intel',32900,'LGA1700',12),
('Intel Core i7 13700K','CPU','Intel',38900,'LGA1700',12),
('Intel Core i9 13900K','CPU','Intel',58900,'LGA1700',10),
('AMD Ryzen 5 5600','CPU','AMD',13900,'AM4',20),
('AMD Ryzen 5 5600X','CPU','AMD',15900,'AM4',20),
('AMD Ryzen 7 5700X','CPU','AMD',21900,'AM4',15),
('AMD Ryzen 7 5800X','CPU','AMD',24900,'AM4',15),
('AMD Ryzen 9 5900X','CPU','AMD',39900,'AM4',10),
('AMD Ryzen 5 7600','CPU','AMD',22900,'AM5',20),
('AMD Ryzen 5 7600X','CPU','AMD',25900,'AM5',20),
('AMD Ryzen 7 7700X','CPU','AMD',33900,'AM5',15),
('AMD Ryzen 7 7800X3D','CPU','AMD',44900,'AM5',12),
('AMD Ryzen 9 7900X','CPU','AMD',46900,'AM5',10),
('AMD Ryzen 9 7950X','CPU','AMD',57900,'AM5',10);

-- ======================
-- RAM (Large Variants)
-- ======================

INSERT INTO products (name,category,brand,price,ram_type,stock)
SELECT 
CONCAT(b.brand,' ',s.size,'GB ',t.type,' ',sp.speed,'MHz'),
'RAM',
b.brand,
( s.size * 500 + sp.speed ),
t.type,
40
FROM 
(SELECT 'Corsair' brand UNION SELECT 'G.Skill' UNION SELECT 'Kingston' UNION SELECT 'Crucial') b,
(SELECT 8 size UNION SELECT 16 UNION SELECT 32 UNION SELECT 64) s,
(SELECT 'DDR4' type UNION SELECT 'DDR5') t,
(SELECT 3200 speed UNION SELECT 3600 UNION SELECT 5200 UNION SELECT 6000) sp;

-- ======================
-- STORAGE (SSD + HDD)
-- ======================

INSERT INTO products (name,category,brand,price,storage_type,stock)
SELECT 
CONCAT(b.brand,' ',c.capacity,'GB ',t.type),
'Storage',
b.brand,
c.capacity * 8,
t.type,
30
FROM
(SELECT 'Samsung' brand UNION SELECT 'WD' UNION SELECT 'Crucial' UNION SELECT 'Seagate') b,
(SELECT 256 capacity UNION SELECT 512 UNION SELECT 1024 UNION SELECT 2048 UNION SELECT 4096) c,
(SELECT 'NVMe' type UNION SELECT 'SATA' UNION SELECT 'HDD') t;

-- ======================
-- PSUs (Many Wattages)
-- ======================

INSERT INTO products (name,category,brand,price,wattage,stock)
SELECT
CONCAT(b.brand,' ',w.watt,'W PSU'),
'PSU',
b.brand,
w.watt * 12,
w.watt,
30
FROM
(SELECT 'Corsair' brand UNION SELECT 'Cooler Master' UNION SELECT 'Gigabyte' UNION SELECT 'EVGA') b,
(SELECT 450 watt UNION SELECT 550 UNION SELECT 650 UNION SELECT 750 UNION SELECT 850 UNION SELECT 1000) w;

-- ======================
-- CABINETS (Many Variants)
-- ======================

INSERT INTO products (name,category,brand,price,size,stock)
SELECT
CONCAT(b.brand,' ',m.model,' Gaming Case'),
'Cabinet',
b.brand,
(2000 + RAND()*5000),
m.model,
25
FROM
(SELECT 'Corsair' brand UNION SELECT 'NZXT' UNION SELECT 'Cooler Master' UNION SELECT 'Lian Li' UNION SELECT 'Deepcool') b,
(SELECT 'ATX' model UNION SELECT 'MicroATX' UNION SELECT 'MiniITX') m;

-- ======================
-- GPU
-- ======================

INSERT INTO products (name,category,brand,price,wattage,stock) VALUES
('NVIDIA RTX 3050','GPU','NVIDIA',21900,450,15),
('NVIDIA RTX 3060','GPU','NVIDIA',28900,550,15),
('NVIDIA RTX 3060 Ti','GPU','NVIDIA',33900,600,12),
('NVIDIA RTX 3070','GPU','NVIDIA',41900,650,10),
('NVIDIA RTX 3070 Ti','GPU','NVIDIA',46900,650,10),
('NVIDIA RTX 3080','GPU','NVIDIA',69900,750,8),
('NVIDIA RTX 3090','GPU','NVIDIA',99900,850,6),
('NVIDIA RTX 4060','GPU','NVIDIA',29900,550,15),
('NVIDIA RTX 4060 Ti','GPU','NVIDIA',36900,600,12),
('NVIDIA RTX 4070','GPU','NVIDIA',55900,650,10),
('AMD RX 6500 XT','GPU','AMD',15900,450,15),
('AMD RX 6600','GPU','AMD',22900,500,15),
('AMD RX 6600 XT','GPU','AMD',25900,550,12),
('AMD RX 6700 XT','GPU','AMD',32900,650,10),
('AMD RX 6800','GPU','AMD',45900,700,8),
('AMD RX 6800 XT','GPU','AMD',52900,750,8),
('AMD RX 6900 XT','GPU','AMD',69900,850,6);

-- ======================
-- COOLING
-- ======================

INSERT INTO products (name,category,brand,price,stock)
SELECT
CONCAT(b.brand,' CPU Cooler ',n.num),
'Cooling',
b.brand,
(2000 + RAND()*8000),
20
FROM
(SELECT 'Corsair' brand UNION SELECT 'Cooler Master' UNION SELECT 'Deepcool' UNION SELECT 'NZXT') b,
(SELECT 1 num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) n;

-- ======================
-- ACCESSORIES
-- ======================

INSERT INTO products (name,category,brand,price,stock)
SELECT
CONCAT(b.brand,' Gaming Accessory ',n.num),
'Accessory',
b.brand,
(1000 + RAND()*5000),
50
FROM
(SELECT 'Logitech' brand UNION SELECT 'Razer' UNION SELECT 'SteelSeries' UNION SELECT 'HyperX') b,
(SELECT 1 num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) n;

-- ======================
-- MONITORS
-- ======================

INSERT INTO products (name,category,brand,price,stock)
SELECT
CONCAT(b.brand,' ',s.size,'" Gaming Monitor ',hz.hz,'Hz'),
'Monitor',
b.brand,
(8000 + hz.hz*40),
30
FROM
(SELECT 'LG' brand UNION SELECT 'Acer' UNION SELECT 'Samsung' UNION SELECT 'ASUS') b,
(SELECT 24 size UNION SELECT 27 UNION SELECT 32) s,
(SELECT 75 hz UNION SELECT 144 UNION SELECT 165 UNION SELECT 240) hz;

-- ======================
-- CASE FANS
-- ======================

INSERT INTO products (name,category,brand,price,stock)
SELECT
CONCAT(b.brand,' RGB Fan ',n.num),
'Fan',
b.brand,
(700 + RAND()*1200),
40
FROM
(SELECT 'Corsair' brand UNION SELECT 'NZXT' UNION SELECT 'Cooler Master') b,
(SELECT 1 num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8) n;


INSERT INTO products (name,category,brand,price,socket,ram_type,size,stock) VALUES

-- ASUS
('ASUS PRIME B450M-A','Motherboard','ASUS',7500,'AM4','DDR4','MicroATX',20),
('ASUS TUF B550M-PLUS','Motherboard','ASUS',11500,'AM4','DDR4','MicroATX',20),
('ASUS ROG STRIX B550-F','Motherboard','ASUS',18500,'AM4','DDR4','ATX',15),
('ASUS PRIME X570-P','Motherboard','ASUS',19500,'AM4','DDR4','ATX',15),
('ASUS ROG STRIX X570-E','Motherboard','ASUS',32900,'AM4','DDR4','ATX',10),

('ASUS PRIME B650M-A','Motherboard','ASUS',14500,'AM5','DDR5','MicroATX',20),
('ASUS TUF B650-PLUS','Motherboard','ASUS',18900,'AM5','DDR5','ATX',15),
('ASUS ROG STRIX B650E-F','Motherboard','ASUS',28900,'AM5','DDR5','ATX',12),
('ASUS PRIME X670-P','Motherboard','ASUS',29900,'AM5','DDR5','ATX',10),
('ASUS ROG STRIX X670E-E','Motherboard','ASUS',42900,'AM5','DDR5','ATX',8),

-- MSI
('MSI B450M PRO-VDH','Motherboard','MSI',7200,'AM4','DDR4','MicroATX',20),
('MSI B550M PRO-VDH WIFI','Motherboard','MSI',10900,'AM4','DDR4','MicroATX',20),
('MSI MAG B550 TOMAHAWK','Motherboard','MSI',16900,'AM4','DDR4','ATX',15),
('MSI MPG X570 GAMING EDGE','Motherboard','MSI',22900,'AM4','DDR4','ATX',12),
('MSI MEG X570 ACE','Motherboard','MSI',39900,'AM4','DDR4','ATX',8),

('MSI PRO B650M-A','Motherboard','MSI',14500,'AM5','DDR5','MicroATX',20),
('MSI MAG B650 TOMAHAWK','Motherboard','MSI',18900,'AM5','DDR5','ATX',15),
('MSI MPG B650 CARBON WIFI','Motherboard','MSI',26900,'AM5','DDR5','ATX',12),
('MSI PRO X670-P','Motherboard','MSI',27900,'AM5','DDR5','ATX',10),
('MSI MEG X670E ACE','Motherboard','MSI',45900,'AM5','DDR5','ATX',8),

-- Gigabyte
('Gigabyte B450M DS3H','Motherboard','Gigabyte',6900,'AM4','DDR4','MicroATX',20),
('Gigabyte B550M AORUS ELITE','Motherboard','Gigabyte',11500,'AM4','DDR4','MicroATX',20),
('Gigabyte B550 AORUS PRO','Motherboard','Gigabyte',16900,'AM4','DDR4','ATX',15),
('Gigabyte X570 AORUS ELITE','Motherboard','Gigabyte',22900,'AM4','DDR4','ATX',12),
('Gigabyte X570 AORUS MASTER','Motherboard','Gigabyte',36900,'AM4','DDR4','ATX',8),

('Gigabyte B650M DS3H','Motherboard','Gigabyte',13900,'AM5','DDR5','MicroATX',20),
('Gigabyte B650 AORUS ELITE','Motherboard','Gigabyte',17900,'AM5','DDR5','ATX',15),
('Gigabyte B650 AORUS PRO','Motherboard','Gigabyte',24900,'AM5','DDR5','ATX',12),
('Gigabyte X670 AORUS ELITE','Motherboard','Gigabyte',28900,'AM5','DDR5','ATX',10),
('Gigabyte X670E AORUS MASTER','Motherboard','Gigabyte',43900,'AM5','DDR5','ATX',8),

-- Intel boards
('ASUS PRIME B660M-A','Motherboard','ASUS',12900,'LGA1700','DDR4','MicroATX',20),
('ASUS TUF B660-PLUS','Motherboard','ASUS',16500,'LGA1700','DDR4','ATX',15),
('ASUS ROG STRIX Z690-E','Motherboard','ASUS',34900,'LGA1700','DDR5','ATX',10),
('ASUS PRIME Z790-P','Motherboard','ASUS',26900,'LGA1700','DDR5','ATX',12),
('ASUS ROG MAXIMUS Z790 HERO','Motherboard','ASUS',64900,'LGA1700','DDR5','ATX',6),

('MSI PRO B660M-A','Motherboard','MSI',11900,'LGA1700','DDR4','MicroATX',20),
('MSI MAG B660 TOMAHAWK','Motherboard','MSI',16900,'LGA1700','DDR4','ATX',15),
('MSI MPG Z690 EDGE','Motherboard','MSI',32900,'LGA1700','DDR5','ATX',10),
('MSI PRO Z790-P','Motherboard','MSI',25900,'LGA1700','DDR5','ATX',12),
('MSI MEG Z790 ACE','Motherboard','MSI',59900,'LGA1700','DDR5','ATX',6),

('Gigabyte B660M DS3H','Motherboard','Gigabyte',10900,'LGA1700','DDR4','MicroATX',20),
('Gigabyte B660 AORUS PRO','Motherboard','Gigabyte',15900,'LGA1700','DDR4','ATX',15),
('Gigabyte Z690 AORUS ELITE','Motherboard','Gigabyte',28900,'LGA1700','DDR5','ATX',10),
('Gigabyte Z790 AORUS ELITE','Motherboard','Gigabyte',29900,'LGA1700','DDR5','ATX',10),
('Gigabyte Z790 AORUS MASTER','Motherboard','Gigabyte',54900,'LGA1700','DDR5','ATX',6);

SELECT COUNT(*) FROM products WHERE category='Motherboard';