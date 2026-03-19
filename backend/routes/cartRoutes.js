import express from "express";
import { auth } from "../middleware/auth.js";
import * as cartController from "../controllers/cartController.js";

const router = express.Router();

/* =========================
   GET USER CART
========================= */

router.get(
    "/",
    auth,
    cartController.getCart
);

/* =========================
   ADD ITEM TO CART
========================= */

router.post(
    "/add",
    auth,
    cartController.addToCart
);

/* =========================
   UPDATE QUANTITY (+ / -)
========================= */

router.put(
    "/update",
    auth,
    cartController.updateCartQty
);

/* =========================
   REMOVE SINGLE ITEM
========================= */

router.delete(
    "/:id",
    auth,
    cartController.removeFromCart
);

/* =========================
   CLEAR ENTIRE CART
========================= */

router.delete(
    "/clear/all",
    auth,
    cartController.clearCart
);

export default router;