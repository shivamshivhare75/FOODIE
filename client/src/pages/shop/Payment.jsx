import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useCart from "../../hooks/useCart";
import CheckoutForm from "./checkoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Payment = () => {
  const [cart] = useCart();

  // Check if cart is an array
  if (!Array.isArray(cart)) {
    console.error("Cart is not an array:", cart);
    return <div>Error: Cart data is invalid</div>;
  }

  // Calculate the checkout prices
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalPrice = parseFloat(cartTotal.toFixed(2));

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-28">
      <Elements stripe={stripePromise}>
        <CheckoutForm cart={cart} price={totalPrice} />
      </Elements>
    </div>
  );
};

export default Payment;
