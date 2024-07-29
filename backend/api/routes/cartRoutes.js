const express = require("express");
const cartController = require("../controllers/cartController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// get all menu items from db


router.get("/", verifyToken, cartController.getCartByEmail)

router.post("/", cartController.addToCart)

router.delete("/:id", cartController.deleteCart)

router.put("/:id", cartController.updateCart)

router.get("/", cartController.getSingleCart)

module.exports = router