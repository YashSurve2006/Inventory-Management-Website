import db from "../db.js";

/* ======================================================
   DASHBOARD SUMMARY
====================================================== */

export const getDashboardSummary = (req, res) => {

    const sql = `
        SELECT 
            COUNT(*) AS total_skus,
            IFNULL(SUM(stock * price), 0) AS stock_value,
            SUM(CASE WHEN stock < 5 THEN 1 ELSE 0 END) AS low_stock
        FROM products
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("SUMMARY ERROR:", err);
            return res.status(500).json({
                error: "Dashboard summary failed"
            });
        }

        res.json(result[0]);

    });

};


/* ======================================================
   LOW STOCK PRODUCTS
====================================================== */

export const getLowStockProducts = (req, res) => {

    const sql = `
        SELECT 
            id,
            name,
            stock
        FROM products
        WHERE stock < 5
        ORDER BY stock ASC
        LIMIT 10
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("LOW STOCK ERROR:", err);
            return res.status(500).json({
                error: "Low stock fetch failed"
            });
        }

        res.json(result);

    });

};


/* ======================================================
   CATEGORY STOCK BREAKDOWN
====================================================== */

export const getCategoryStock = (req, res) => {

    const sql = `
        SELECT 
            category,
            IFNULL(SUM(stock), 0) AS stock
        FROM products
        GROUP BY category
        ORDER BY stock DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("CATEGORY STOCK ERROR:", err);
            return res.status(500).json({
                error: "Category stock fetch failed"
            });
        }

        res.json(result);

    });

};


/* ======================================================
   TOP SELLING PRODUCTS
   (Using stock as placeholder metric)
====================================================== */

export const getTopSellingProducts = (req, res) => {

    const sql = `
        SELECT 
            id,
            name,
            stock AS total_sold
        FROM products
        ORDER BY stock DESC
        LIMIT 5
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("TOP PRODUCTS ERROR:", err);
            return res.status(500).json({
                error: "Top products fetch failed"
            });
        }

        res.json(result);

    });

};


/* ======================================================
   MONTHLY SALES (DEMO DATA)
====================================================== */

export const getMonthlySales = (req, res) => {

    try {

        const data = [
            { month: "Jan", revenue: 12000, orders: 80 },
            { month: "Feb", revenue: 15000, orders: 95 },
            { month: "Mar", revenue: 18000, orders: 110 },
            { month: "Apr", revenue: 21000, orders: 130 },
            { month: "May", revenue: 24000, orders: 160 },
            { month: "Jun", revenue: 26000, orders: 175 }
        ];

        res.json(data);

    } catch (err) {

        console.error("MONTHLY SALES ERROR:", err);

        res.status(500).json({
            error: "Monthly sales fetch failed"
        });

    }

};