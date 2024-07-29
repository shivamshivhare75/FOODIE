import React from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useAdmin = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: isAdmin,
    isLoading: isAdminLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminStatus", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        return false; // Return a default value if user email is not available
      }
      const res = await axiosSecure.get(`users/admin/${user.email}`);
      return res.data?.admin;
    },
    enabled: !!user?.email, // Query will not execute until the user email is available
  });

  return [isAdmin, isAdminLoading, refetch];
};

export default useAdmin;
