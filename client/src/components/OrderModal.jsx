import React from "react";

const OrderModal = ({ item }) => {
  const handleClose = () => {
    document.getElementById("my_modal_5").close();
  };

  return (
    <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action mt-0 flex flex-col justify-center">
          {item && (
            <>
              <h3 className="font-bold text-lg">Order Details</h3>
              <div className="mt-4">
                <p>
                  <strong>User:</strong> {item.email}
                </p>
                <p>
                  <strong>Transaction ID:</strong> {item.transactionId}
                </p>
                <div>
                  <strong>Ordered items and quantity:</strong>
                  <ul>
                    {item.itemName.map((name, index) => (
                      <li key={index}>
                        {name} x {item.quantity[index]}
                      </li>
                    ))}
                  </ul>
                </div>
                <p>
                  <strong>Total Price:</strong> ${item.price}
                </p>
                <p>
                  <strong>Status:</strong> {item.status}
                </p>
                {/* Add more item details here */}
              </div>
            </>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default OrderModal;
