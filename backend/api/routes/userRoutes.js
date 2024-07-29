const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const verifyAdmin = require("../middlewares/verifyAdmin")

router.get("/", verifyToken, verifyAdmin, userController.getAllUsers)
router.post("/", userController.createUser)
router.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser)
router.get("/admin/:email", verifyToken, userController.getAdmin);
router.patch("/admin/:id", verifyToken, verifyAdmin, userController.makeAdmin)

module.exports = router