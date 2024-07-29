const Payment = require("../models/Payments")

const getAllBookings = async (req, res) => {
    const allOrders = await Payment.find({}).sort({ createdAt: -1 });
    res.status(200).json(allOrders)
}
const deleteBooking = async (req, res) => {
    const orderId = req.params.id;
    try {
        const deletedItem = await Payment.findByIdAndDelete(orderId);
        if (!deletedItem) {
            return res.status(404).json({ message: "order not found" })
        }
        res.status(200).json({ message: "order Item deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateBookingStatus = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }

        res.send(payment);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = {
    getAllBookings,
    deleteBooking,
    updateBookingStatus
}