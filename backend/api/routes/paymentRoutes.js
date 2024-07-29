const express = require("express");

const router = express.Router();
const Payment = require("../models/Payments")
const Cart = require("../models/Carts")
const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
// token verify
const verifyToken = require("../middlewares/verifyToken");

// post payment info to db

router.post("/", verifyToken, async (req, res) => {
    const payment = req.body;

    try {
        const paymentRequest = await Payment.create(payment);

        // delete cart after payments
        const cartIds = payment.cartItems.map(id => new ObjectId(id))
        const deletedCartRequest = await Cart.deleteMany({ _id: { $in: cartIds } })
        res.status(200).json({ paymentRequest, deletedCartRequest })
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
})
router.get("/", verifyToken, async (req, res) => {
    const email = req.query.email;
    const query = { email: email }
    try {
        const decodedEmail = req.decoded.email;
        if (email !== decodedEmail) {
            res.status(403).json({ message: "Forbiden Access" })
        }
        const result = await Payment.find(query).sort({ createdAt: -1 }).exec()
        res.status(200).json(result)
    } catch (error) {

    }
})



module.exports = router
