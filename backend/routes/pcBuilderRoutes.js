import express from "express";
import * as controller from "../controllers/pcbuilder/pcBuilderController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* ---------------- COMPONENTS ---------------- */

// Get components by category
router.get("/components/:category", controller.getComponents);


/* ---------------- BUILDS ---------------- */

// Save build
router.post("/save-build", auth, controller.saveBuild);

// Get logged user's builds
router.get("/my-builds", auth, controller.getMyBuilds);

// Get single build
router.get("/build/:id", auth, controller.getBuild);

// Delete build
router.delete("/build/:id", auth, controller.deleteBuild);


/* ---------------- CART ---------------- */

// Add saved build to cart
router.post("/build/:id/add-to-cart", auth, controller.addBuildToCart);

// Add temporary build (selected components) to cart
router.post("/add-build-to-cart", auth, controller.addTempBuildToCart);


/* ---------------- COMPATIBILITY ---------------- */

// Check compatibility
router.post("/check-compatibility", controller.checkCompatibility);

export default router;