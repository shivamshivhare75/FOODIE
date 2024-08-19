import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const useCart = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const { refetch, data: cart = [] } = useQuery({
    queryKey: ["carts", user?.email],
    queryFn: async () => {
      if (!token) {
        // Handle cases where token is not available
        throw new Error("No token available");
      }

      const res = await fetch(
        `https://foodie-backend-78wt.onrender.com/carts?email=${user.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return res.json();
    },
    enabled: !!user, // Ensure fetching only if user is defined
  });

  return [cart, refetch];
};

export default useCart;
