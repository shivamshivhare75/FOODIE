const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config()
const app = express()
const port = process.env.URI || 6001
const jwt = require('jsonwebtoken');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// middleware
app.use(cors());
app.use(express.json())

// mongoodb connect
// jp2rKgvUSJ5ZxQeC shivamshivhare75
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@foodi-server.oislary.mongodb.net/Foodi-server?retryWrites=true&w=majority`)
    .then(() => {
        console.log("database connected");
    })
    .catch((err) => {
        console.log("Error connecting to mongodn", err);
    })

// jwt authentications
app.post("/jwt", async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1hr"
    })
    res.send({ token })
})
// verify jwt token 
// middleware


// import routes here
const menuRoutes = require("./api/routes/menuRoutes")
const cartRoutes = require("./api/routes/cartRoutes")
const userRoutes = require("./api/routes/userRoutes")
const paymentRoutes = require("./api/routes/paymentRoutes")
const bookingRoutes = require("./api/routes/bookingRoutes")
app.use("/menu", menuRoutes)

app.use("/carts", cartRoutes)

app.use("/users", userRoutes)

app.use("/payments", paymentRoutes)

app.use("/bookings", bookingRoutes)


// stripe payment routes

// Create a PaymentIntent with the order amount and currency
app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: [
            "card",
            // "link" if you want to enable link payment
        ],
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})