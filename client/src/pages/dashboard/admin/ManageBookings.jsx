import React, { useState } from "react";
import { FaRegCheckCircle, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useOrders from "../../../hooks/useOrder";
import OrderModal from "../../../components/OrderModal";

const ManageBookings = () => {
  const axiosSecure = useAxiosSecure();
  const [allOrders, loading, refetch] = useOrders();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleConfirmOrder = async (item) => {
    try {
      await axiosSecure.put(`/bookings/${item._id}`, { status: "confirmed" });
      refetch();
      Swal.fire("Confirmed!", "The order has been confirmed.", "success");
    } catch (error) {
      console.error("Error confirming order:", error);
      Swal.fire("Error!", "There was an error confirming the order.", "error");
    }
  };

  const handleDeleteItem = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete order with transaction ID ${item.transactionId}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/bookings/${item._id}`);
        refetch();
        Swal.fire("Deleted!", "The order has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire("Error!", "There was an error deleting the order.", "error");
      }
    }
  };

  const handleShow = (item) => {
    setSelectedItem(item);
    document.getElementById("my_modal_5").showModal();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-full md:w-full px-4 mx-auto">
        <h2 className="text-2xl font-semibold my-4">
          Manage All <span className="text-green">Bookings!</span>
        </h2>
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Transaction ID</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Confirm Order</th>
                  <th>Delete</th>
                  <th>All details</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((item, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{item.email}</td>
                    <td>{item.transactionId}</td>
                    <td>${item.price}</td>
                    <td>{item.status}</td>
                    <td className="text-center">
                      {item.status !== "confirmed" ? (
                        <button
                          className="btn btn-ghost btn-xs bg-green text-white"
                          onClick={() => handleConfirmOrder(item)}
                        >
                          <FaRegCheckCircle />
                        </button>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          Done
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-xs text-red"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                    <td onClick={() => handleShow(item)}>show</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <OrderModal item={selectedItem} />
      </div>
    </div>
  );
};

export default ManageBookings;
