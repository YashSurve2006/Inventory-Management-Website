import db from "../db.js";

export const getComponentsByCategory = async (category) => {

    const [rows] = await db.query(
        "SELECT id, name, price, category FROM products WHERE category = ?",
        [category]
    );

    return rows;

};

export const createBuild = async (userId, buildName, totalPrice) => {

    const [result] = await db.query(
        "INSERT INTO pc_builds (user_id, build_name, total_price) VALUES (?, ?, ?)",
        [userId, buildName, totalPrice]
    );

    return result.insertId;

};

export const addBuildItem = async (buildId, productId, category) => {

    await db.query(
        "INSERT INTO pc_build_items (build_id, product_id, category) VALUES (?, ?, ?)",
        [buildId, productId, category]
    );

};

export const getUserBuilds = async (userId) => {

    const [rows] = await db.query(
        "SELECT * FROM pc_builds WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
    );

    return rows;

};

export const getBuildItems = async (buildId) => {

    const [rows] = await db.query(
        `SELECT p.id, p.name, p.price, p.category
     FROM pc_build_items bi
     JOIN products p ON bi.product_id = p.id
     WHERE bi.build_id = ?`,
        [buildId]
    );

    return rows;

};

export const deleteBuild = async (buildId, userId) => {

    await db.query(
        "DELETE FROM pc_builds WHERE id = ? AND user_id = ?",
        [buildId, userId]
    );

};

export const getBuildById = async (buildId) => {

    const [rows] = await db.query(
        `SELECT p.id, p.name, p.price, p.category
     FROM pc_build_items bi
     JOIN products p ON bi.product_id = p.id
     WHERE bi.build_id = ?`,
        [buildId]
    );

    return rows;

};