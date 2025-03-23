// OrdersList.js
import React, { useState, useEffect } from "react";
import "./ShopList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Optionally import an icon for viewing order details
import { faEye } from "@fortawesome/free-solid-svg-icons";

function OrdersList(props) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent orders on component mount
  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    const data = {
      request_type: "get_orders", // Changed from "get_med" to "get_orders"
      email: localStorage.getItem("email"),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok && result.status === true) {
        // Use result.orders instead of result.medicine
        setOrders(result.orders);
      } else {
        props.showAlert(`Failed to get data: ${result.message}`, "danger");
      }
    } catch (error) {
      props.showAlert(`Error fetching data: ${error.message}`, "danger");
    }
    setLoading(false);
  }

  return (
    <div style={{ color: "black" }}>
      <div className="list-and-form">
        {/* Orders List */}
        <div className="orders-list-container">
          <h2 className="orders-list-heading text-center mb-4">
            Recent Orders
          </h2>
          {loading ? (
            <div className="loader" id="loader">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Medicine</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Status</th>
                    {/* Uncomment if you want an actions column */}
                    {/* <th scope="col">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>{order.medicine}</td>
                      <td>{order.quantity}</td>
                      <td>{order.date}</td>
                      <td>{order.time}</td>
                      <td>{order.status}</td>
                      {/* Uncomment below if you want to add an action button */}
                      {/* <td>
                        <button className="btn btn-sm btn-outline-primary">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersList;
