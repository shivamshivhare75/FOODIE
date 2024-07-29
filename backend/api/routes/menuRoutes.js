const express = require("express");

const menuController = require("../controllers/menuController");
const router = express.Router();

// get all menu items from db

router.get("/", menuController.getAllMenuItems)
router.post("/", menuController.postMenuItem)

router.delete("/:id", menuController.deleteMenuItem)

// get single menu item

router.get("/:id", menuController.singleMenuItem)

// update single item

router.patch("/:id", menuController.updateMenuItem)
module.exports = router

router.put('/:id/stock', menuController.updateStockStatus);