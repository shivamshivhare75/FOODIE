import React, { useContext, useEffect, useState } from "react";
import useCart from "../../hooks/useCart";
import { AuthContext } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false); // If user is not present, stop loading
        return;
      }

      try {
        setLoading(true); // Set loading to true while fetching data
        await refetch();
        setCartItems(Array.isArray(cart) ? cart : []);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, [user, cart, refetch]); // Depend on the user as well

  const calculateTotalPrice = (item) => item.price * item.quantity;

  const handleIncrease = async (item) => {
    try {
      const response = await fetch(
        `https://foodie-backend-78wt.onrender.com/carts/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: item.quantity + 1 }),
        }
      );

      if (response.ok) {
        const updatedCart = cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        await refetch();
        setCartItems(updatedCart);
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      try {
        const response = await fetch(
          `https://foodie-backend-78wt.onrender.com/carts/${item._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: item.quantity - 1 }),
          }
        );

        if (response.ok) {
          const updatedCart = cartItems.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          );
          await refetch();
          setCartItems(updatedCart);
        } else {
          console.error("Failed to update quantity");
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + calculateTotalPrice(item),
    0
  );

  const orderTotal = cartSubtotal;

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#39DB4A",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://foodie-backend-78wt.onrender.com/carts/${item._id}`)
          .then((response) => {
            if (response) {
              refetch();
              Swal.fire("Deleted!", "Your item has been deleted.", "success");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  if (loading) {
    return <Loading />; // Show the Loading component while data is being fetched
  }

  // If the user is not logged in, display the "Back to Menu" button and empty cart message
  if (!user) {
    return (
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
        {/* Banner */}
        <div className="bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
          <div className="py-28 flex flex-col items-center justify-center">
            {/* Content */}
            <div className="text-center px-4 space-y-7">
              <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
                Items Added to The<span className="text-green"> Cart</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <p>Cart is empty. Please add products.</p>
          <Link to="/menu">
            <button className="btn bg-green text-white mt-3">
              Back to Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          {/* Content */}
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Items Added to The<span className="text-green"> Cart</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Cart Table */}
      {cartItems.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              {/* Head */}
              <thead className="bg-green text-white rounded-sm">
                <tr>
                  <th>#</th>
                  <th>Food</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={item.image}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{item.name}</td>
                    <td>
                      <button
                        className="btn btn-xs"
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={() => console.log(item.quantity)}
                        className="w-10 mx-2 text-center overflow-hidden appearance-none"
                      />
                      <button
                        className="btn btn-xs"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                    </td>
                    <td>${calculateTotalPrice(item).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm border-none text-red bg-transparent"
                        onClick={() => handleDelete(item)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr />
          <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8">
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-lg font-semibold">Customer Details</h3>
              <p>Name: {user?.displayName || "None"}</p>
              <p>Email: {user?.email}</p>
              <p>
                User_id: <span className="text-sm">{user?.uid}</span>
              </p>
            </div>
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-lg font-semibold">Shopping Details</h3>
              <p>Total Items: {cartItems.length}</p>
              <p>
                Total Price:{" "}
                <span id="total-price">${orderTotal.toFixed(2)}</span>
              </p>
              <Link to="/process-checkout">
                <button className="btn btn-md bg-green text-white px-8 py-1 mt-5">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p>Cart is empty. Please add products.</p>
          <Link to="/menu">
            <button className="btn bg-green text-white mt-3">
              Back to Menu
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
