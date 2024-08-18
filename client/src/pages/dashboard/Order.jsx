import React from "react";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";

const Order = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("access-token");

  // Use `enabled` option to avoid unnecessary requests if `user` or `token` is not available
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      if (!user?.email || !token) return [];
      const res = await fetch(
        `https://foodie-backend-78wt.onrender.com/payments?email=${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
    enabled: !!user?.email && !!token,
  });

  const formatDate = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    return createdAtDate.toLocaleDateString();
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 mb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          {/* Content */}
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Track All Your<span className="text-green"> Orders</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Data or Empty State */}
      {isLoading ? (
        <div className="text-center mt-20">
          {/* Show empty state or loader here if needed */}
          <p>Loading your orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table">
              {/* Head */}
              <thead className="bg-green text-white rounded-sm">
                <tr>
                  <th>#</th>
                  <th>Order Date</th>
                  <th>Transaction ID</th>
                  <th>Price </th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td className="font-medium">{item.transactionId}</td>
                    <td>${item.price}</td>
                    <td>{item.status}</td>
                    <td>
                      <Link
                        to="/contact"
                        className="btn btn-sm border-none text-red bg-transparent"
                      >
                        Contact
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr />
        </div>
      ) : (
        <div className="text-center mt-20">
          <p>No orders found.</p>
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

export default Order;
