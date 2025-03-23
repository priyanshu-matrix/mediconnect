import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Uncomment these lines if you decide to use Awesome Markers
// import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
// import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';

// Fix Leaflet's default marker icon URLs for React (e.g., Create React App)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const NearbyShop = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  // Ref to store shop markers by shop id
  const markersRef = useRef({});

  // State variables
  const [shops, setShops] = useState([]);
  const [currentMedID, setCurrentMedID] = useState(0);
  const [shopEmail, setShopEmail] = useState("");
  const [frequency, setFrequency] = useState("");
  const [sideEffect, setSideEffect] = useState("");
  const [precaution, setPrecaution] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Get user location using the Geolocation API
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;

            // resolve({ lat, long }); 21.2497572,81.6012525
            resolve({ lat: 21.2497572, long: 81.6012525 });
          },
          (error) => {
            alert("Error obtaining location");
            reject(error);
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  // Fetch shops data from the API
  const getShops = async () => {
    const searchParams = new URLSearchParams(location.search);
    const medicine = searchParams.get("medicine_name");
    setMedicineName(medicine);
    const userLoc = await getLocation();
    setUserLocation(userLoc);

    const data = {
      request_type: "get_shops",
      user_location: userLoc,
      medicine_name: medicine,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
      setShops(result.shops || []);
      return result.shops;
    } catch (error) {
      console.error("Error fetching shops:", error);
      return [];
    }
  };

  // Handle purchase confirmation
  const handlePurchase = async () => {
    const data = {
      request_type: "buy_med",
      sold_quantity: quantity,
      medicine_id: currentMedID,
      email: shopEmail,
      user_mail:localStorage.getItem("email"),
    };
    console.log(data);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (result.status === true) {
        alert(`You have booked ${quantity} medicines`);
        setShowBuyPopup(false);
        setShowDetailsPopup(true);
      }
    } catch (error) {
      console.error("Error purchasing medicine:", error);
    }
  };

  // Fetch shops when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getShops();
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };

    fetchData();
  }, []);

  // Setup and update the map when userLocation or shops change
  useEffect(() => {
    if (!userLocation || !mapRef.current) return;

    // Cleanup previous map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create new map instance
    mapInstanceRef.current = L.map(mapRef.current).setView(
      [userLocation.lat, userLocation.long],
      15
    );

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
      }
    ).addTo(mapInstanceRef.current);

    // Add user location marker with a custom icon
    const redMarker = L.divIcon({
      html: '<i class="fa fa-home" style="color: red; font-size: 24px;"></i>',
      className: "custom-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });

    L.marker([userLocation.lat, userLocation.long], { icon: redMarker })
      .addTo(mapInstanceRef.current)
      .bindPopup("You are here")
      .openPopup();

    // Reset markersRef for shop markers
    markersRef.current = {};

    // Add shop markers and store their references
    if (shops && shops.length > 0) {
      shops.forEach((shop) => {
        if (
          shop.shop_location &&
          shop.shop_location.lat &&
          shop.shop_location.long
        ) {
          const marker = L.marker([
            shop.shop_location.lat,
            shop.shop_location.long,
          ])
            .addTo(mapInstanceRef.current)
            .bindPopup(
              `<b>${shop.shop_name}</b><br>Distance: ${shop.distance} km`
            );

          markersRef.current[shop.id] = marker;

          // When a marker is clicked, fly to it and open its popup
          marker.on("click", () => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo(marker.getLatLng(), 15, {
                animate: true,
                duration: 1,
              });
              marker.openPopup();
            }
          });
        }
      });
    }

    // Add custom control button to return to user's location
    const locateControl = L.control({ position: "topleft" });
    locateControl.onAdd = function (map) {
      const container = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      container.style.backgroundColor = "white";
      container.style.width = "30px";
      container.style.height = "30px";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.cursor = "pointer";
      container.style.fontSize = "18px";
      container.style.color = "black";
      container.title = "Return to your location";
      container.innerHTML = '<i class="fa fa-location-arrow"></i>';
      container.onclick = (e) => {
        e.preventDefault();
        map.flyTo([userLocation.lat, userLocation.long], 15, {
          animate: true,
          duration: 1,
        });
      };
      return container;
    };
    locateControl.addTo(mapInstanceRef.current);

    // Invalidate map size to ensure proper rendering
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, shops]);

  // Handle viewing a shop on the map: fly to its marker and open its popup
  const handleViewOnMap = (shop) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [shop.shop_location.lat, shop.shop_location.long],
        15,
        { animate: true, duration: 1 }
      );
      if (markersRef.current[shop.id]) {
        markersRef.current[shop.id].openPopup();
      }
    }
  };

  // Handle "Buy Now" click for a shop
  const handleBuyNow = (shop) => {
    setCurrentMedID(shop.id);
    setShopEmail(shop.shop_email);
    setFrequency(shop.frequency);
    setSideEffect(shop.sideeffect);
    setPrecaution(shop.precaution);
    setPrice(shop.price);
    setShowBuyPopup(true);
  };

  // Navigate to confirmation page
  const handleConfirmDetails = () => {
    navigate(
      `/confirmation?name=${medicineName}&quantity=${quantity}&price=${price}`
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <h2>Nearby Medical Shops</h2>
      <div id="med-name">Medicine Name:<b> {medicineName}</b></div>

      {/* Map container */}

      {/* Shop List */}
      <div style={{ display: "flex" }}>
        <div
          className="my-3"
          id="map"
          ref={mapRef}
          style={{ height: "400px", width: "60%", marginBottom: "20px", borderRadius: "20px" }}
        ></div>
        <div className="mx-4" style={{ width: "40%", padding: "10px" ,border: "1px solid", borderRadius: "5px"}}>
          <table className="shop-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Shop Name</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Distance</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Price</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody id="shop-body">
          {shops.map((shop, index) => (
            <tr key={index} style={{ borderBottom: "1px solid" }}>
          <td style={{ padding: "8px" }}><b>{shop.shop_name}</b></td>
          <td style={{ padding: "8px" }}>{shop.distance} km</td>
          <td style={{ padding: "8px" }}>{shop.price}</td>
          <td className="actions" style={{ padding: "8px" }}>
            <a
              onClick={() => handleViewOnMap(shop)}
              title="View on Map"
              style={{ cursor: "pointer", marginRight: "10px"}}
            >
              <i className="fa fa-eye"></i>
            </a>
            <a
              onClick={() => handleBuyNow(shop)}
              title="Buy Now"
              style={{ cursor: "pointer"}}
            >
              <i className="fa fa-shopping-cart"></i>
            </a>
          </td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      </div>

      {/* Buy Popup */}
      {showBuyPopup && (
        <div className="popup-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div className="popup-content" style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
            animation: "fadeIn 0.3s ease-out",
            position: "relative"
          }}>
            <span className="close" onClick={() => setShowBuyPopup(false)} style={{
              position: "absolute",
              top: "12px",
              right: "16px",
              fontSize: "24px",
              cursor: "pointer",
              color: "#888"
            }}>
              &times;
            </span>
            <h2 style={{ marginTop: "8px", marginBottom: "20px", color: "#333", textAlign: "center" }}>Buy Medicine</h2>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="quantity" style={{ display: "block", marginBottom: "8px", color: "#555" }}>Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  fontSize: "16px"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <button 
                onClick={() => setShowBuyPopup(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  flex: 1,
                  fontSize: "16px"
                }}>
                Cancel
              </button>
              <button 
                onClick={handlePurchase}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  cursor: "pointer",
                  flex: 1,
                  fontSize: "16px"
                }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Details Popup */}
      {showDetailsPopup && (
        <div className="popup-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div className="popup-content" style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
            animation: "fadeIn 0.3s ease-out",
            position: "relative"
          }}>
            <span className="close" onClick={() => setShowDetailsPopup(false)} style={{
              position: "absolute",
              top: "12px",
              right: "16px",
              fontSize: "24px",
              cursor: "pointer",
              color: "#888"
            }}>
              &times;
            </span>
            <h2 style={{ marginTop: "8px", marginBottom: "20px", color: "#333", textAlign: "center" }}>Purchase Details</h2>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ margin: "10px 0", fontSize: "16px", color: "#555" }}>
                <strong>Medicine:</strong> {medicineName}
              </p>
              <p style={{ margin: "10px 0", fontSize: "16px", color: "#555" }}>
                <strong>Quantity:</strong> {quantity}
              </p>
              <p style={{ margin: "10px 0", fontSize: "16px", color: "#555" }}>
                <strong>Frequency:</strong> {frequency}
              </p>
              <p style={{ margin: "10px 0", fontSize: "16px", color: "#555" }}>
                <strong>Side Effects:</strong> {sideEffect}
              </p>
              <p style={{ margin: "10px 0", fontSize: "16px", color: "#555" }}>
                <strong>Precautions:</strong> {precaution}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <button 
                onClick={() => setShowDetailsPopup(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  flex: 1,
                  fontSize: "16px"
                }}>
                Cancel
              </button>
              <button 
                onClick={handleConfirmDetails}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  cursor: "pointer",
                  flex: 1,
                  fontSize: "16px"
                }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyShop;
