import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure"; // Adjust the path if necessary

const useOrders = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: orders = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings");
      return res.data;
    },
  });

  return [orders, loading, refetch];
};

export default useOrders;
