import * as model from "../../models/pcBuilderModel.js";
import * as priceService from "../../services/priceCalculatorService.js";
import * as compatibilityService from "../../services/pcCompatibilityService.js";
import db from "../../db.js";

/* ---------------- GET COMPONENTS ---------------- */

export const getComponents = async (req, res) => {

    try {

        const category = req.params.category;

        const components = await model.getComponentsByCategory(category);

        res.json(components);

    } catch (err) {

        console.error("Get components error:", err);

        res.status(500).json({
            error: "Failed to load components"
        });

    }

};


/* ---------------- SAVE BUILD ---------------- */

export const saveBuild = async (req, res) => {

    try {

        const userId = req.user.id;

        const { buildName, components } = req.body;

        if (!buildName || !components || components.length === 0) {

            return res.status(400).json({
                message: "Build name and components required"
            });

        }

        const totalPrice = priceService.calculateTotal(components);

        const buildId = await model.createBuild(
            userId,
            buildName,
            totalPrice
        );

        for (let comp of components) {

            await model.addBuildItem(
                buildId,
                comp.id,
                comp.category
            );

        }

        res.json({
            message: "Build saved successfully",
            buildId
        });

    } catch (err) {

        console.error("Save build error:", err);

        res.status(500).json({
            error: "Failed to save build"
        });

    }

};


/* ---------------- GET USER BUILDS ---------------- */

export const getMyBuilds = async (req, res) => {

    try {

        const userId = req.user.id;

        const builds = await model.getUserBuilds(userId);

        res.json(builds);

    } catch (err) {

        console.error("Get builds error:", err);

        res.status(500).json({
            error: "Failed to fetch builds"
        });

    }

};


/* ---------------- GET SINGLE BUILD ---------------- */

export const getBuild = async (req, res) => {

    try {

        const buildId = req.params.id;

        const items = await model.getBuildById(buildId);

        res.json(items);

    } catch (err) {

        console.error("Get build error:", err);

        res.status(500).json({
            error: "Failed to fetch build"
        });

    }

};


/* ---------------- ADD SAVED BUILD TO CART ---------------- */

export const addBuildToCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const buildId = req.params.id;

        const items = await model.getBuildById(buildId);

        if (!items || items.length === 0) {

            return res.status(404).json({
                message: "Build not found"
            });

        }

        for (let item of items) {

            await db.query(
                `INSERT INTO cart (user_id, product_id, quantity)
         VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE quantity = quantity + 1`,
                [userId, item.id]
            );

        }

        res.json({
            message: "Build added to cart successfully"
        });

    } catch (err) {

        console.error("Add build to cart error:", err);

        res.status(500).json({
            error: "Failed to add build to cart"
        });

    }

};


/* ---------------- ADD TEMP BUILD TO CART ---------------- */

export const addTempBuildToCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const components = req.body;

        if (!components || components.length === 0) {

            return res.status(400).json({
                message: "No components selected"
            });

        }

        for (let comp of components) {

            await db.query(
                `INSERT INTO cart (user_id, product_id, quantity)
         VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE quantity = quantity + 1`,
                [userId, comp.id]
            );

        }

        res.json({
            message: "Build added to cart successfully"
        });

    } catch (err) {

        console.error("Temp build cart error:", err);

        res.status(500).json({
            error: "Failed to add components to cart"
        });

    }

};


/* ---------------- DELETE BUILD ---------------- */

export const deleteBuild = async (req, res) => {

    try {

        const userId = req.user.id;

        const buildId = req.params.id;

        await model.deleteBuild(buildId, userId);

        res.json({
            message: "Build deleted successfully"
        });

    } catch (err) {

        console.error("Delete build error:", err);

        res.status(500).json({
            error: "Failed to delete build"
        });

    }

};


/* ---------------- COMPATIBILITY CHECK ---------------- */

export const checkCompatibility = async (req, res) => {

    try {

        const components = req.body.components;

        if (!components || components.length === 0) {

            return res.json({
                compatible: true,
                issues: []
            });

        }

        const result = compatibilityService.checkCompatibility(components);

        res.json(result);

    } catch (err) {

        console.error("Compatibility error:", err);

        res.status(500).json({
            error: "Compatibility check failed"
        });

    }

};