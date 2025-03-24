// OrdersList.js
import React, { useState, useEffect } from "react";
import "./ShopList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Optionally import an icon for viewing order details
import { faEye } from "@fortawesome/free-solid-svg-icons";

function OrdersList(props) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Filter state: 'all', 'today', 'month'

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

  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ordersPerPage = 8;
  const containerRef = React.useRef(null);

  // Filter orders based on selected time period
  const filterOrders = (filterType) => {
    setFilter(filterType);
    let filteredOrders = [];
    
    if (filterType === 'all') {
      filteredOrders = [...orders];
    } else if (filterType === 'today') {
      const today = new Date().toLocaleDateString();
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date).toLocaleDateString();
        return orderDate === today;
      });
    } else if (filterType === 'month') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });
    }
    
    setDisplayedOrders(filteredOrders.slice(0, ordersPerPage));
    setHasMore(filteredOrders.length > ordersPerPage);
  };

  // Initialize displayed orders when orders are loaded
  useEffect(() => {
    if (orders.length > 0) {
      filterOrders(filter);
    }
  }, [orders]);

  // Load more orders when scrolling
  const loadMoreOrders = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      const nextOrders = orders.slice(
        displayedOrders.length,
        displayedOrders.length + ordersPerPage
      );
      
      if (nextOrders.length > 0) {
        setDisplayedOrders(prev => [...prev, ...nextOrders]);
        setHasMore(displayedOrders.length + nextOrders.length < orders.length);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    }, 500); // Small delay to prevent rapid firing
  };

  // Handle scroll event
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      
      // Check if scrolled to bottom (with a small buffer)
      if (scrollTop + clientHeight >= scrollHeight - 20 && hasMore && !loading) {
        loadMoreOrders();
      }
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [displayedOrders, hasMore, loading]);

  return (
    <div style={{ color: "black", marginTop: "50px", height: "50vh" }}>
      <div className="list-and-form">
        <div className="orders-list-container">
          <h2 className="orders-list-heading text-center mb-4">
            Recent Orders
          </h2>
          
          <div className="d-flex justify-content-center mb-3">
            <div className="btn-group" role="group">
              <button 
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => filterOrders('all')}
              >
                All Time
              </button>
              <button 
                className={`btn ${filter === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => filterOrders('month')}
              >
                This Month
              </button>
              <button 
                className={`btn ${filter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => filterOrders('today')}
              >
                Today
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="loader" id="loader">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div 
              className="table-responsive" 
              ref={containerRef} 
              style={{ maxHeight: "40vh", overflow: "auto" }}
            >
              <table className="table table-striped table-hover">
                <thead style={{ position: "sticky", top: 0, background: "white" }}>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Medicine</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>{order.medicine}</td>
                      <td>{order.quantity}</td>
                      <td>{order.date}</td>
                      <td>{order.time}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loadingMore && (
                <div className="text-center my-2">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading more...</span>
                  </div>
                </div>
              )}
              {displayedOrders.length === 0 && (
                <div className="text-center my-4">
                  <p>No orders found for the selected time period</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersList;
