USE inventorydb;

CREATE TABLE pc_builds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    build_name VARCHAR(150),
    total_price DECIMAL(10 , 2 ) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

CREATE TABLE pc_build_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    build_id INT NOT NULL,
    product_id INT NOT NULL,
    category VARCHAR(100),
    FOREIGN KEY (build_id) REFERENCES pc_builds(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

SHOW TABLES;