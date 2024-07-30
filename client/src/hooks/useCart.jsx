import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const useCart = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  // Use useQuery only if user is logged in
  const {
    refetch,
    data: cart = [],
    isFetching,
  } = useQuery({
    queryKey: ["carts", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        return []; // Return an empty array if no user is logged in
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
        throw new Error("Failed to fetch cart");
      }
      return res.json();
    },
    enabled: !!user?.email, // Only fetch if user is logged in
  });

  return [cart, refetch, isFetching];
};

export default useCart;
  