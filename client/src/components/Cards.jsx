import React, { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from "sweetalert2";
import useCart from "../hooks/useCart";
import axios from "axios";

const Cards = ({ item }) => {
  const { name, image, price, recipe, _id, inStock } = item; // Destructure inStock from item

  const { user } = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handleAddToCart = (item) => {
    if (user && user.email) {
      const cartItem = {
        menuItemId: _id,
        name,
        quantity: 1,
        image,
        price,
        email: user.email,
      };

      axios
        .post("https://foodie-backend-78wt.onrender.com/carts", cartItem)
        .then((response) => {
          if (response) {
            refetch();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Food added to the cart.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          const errorMessage = error.response.data.message;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: `${errorMessage}`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        title: "Please login to order the food",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  return (
    <div
      to={`/menu/${item._id}`}
      className="card shadow-xl relative mr-5 md:my-5 max-w-xs flex flex-col mb-3"
    >
      <div
        className={`rating gap-1 absolute right-0 top-0 p-4 heartStar bg-green z-10 ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        <FaHeart className="w-5 h-5 cursor-pointer" />
      </div>
      <Link>
        <figure className="h-52 w-full overflow-hidden">
          <img
            src={image}
            alt="Shoes"
            className="w-full h-full object-fill transition-all duration-300 hover:scale-105"
          />
        </figure>
      </Link>
      <div className="card-body flex flex-col justify-between flex-1 p-4">
        <Link to={`/menu/${item._id}`}>
          <h2 className="card-title text-lg font-bold">{name}!</h2>
        </Link>
        <p>Description of the item</p>
        <div className="card-actions flex justify-between items-center mt-2">
          <h5 className="font-semibold text-lg">
            <span className="text-sm text-red-500">$ </span> {price}
          </h5>
          <button
            onClick={() => handleAddToCart(item)}
            className={`btn ${
              inStock
                ? "bg-green text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!inStock}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
