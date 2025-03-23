import "./App.css";
import Navbar from "./components/Navbar";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Alert from "./components/Alert";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./components/About";
import UserSearch from "./components/UserSearch";
import NearbyShop from "./components/NearbyShop";
import ShopList from "./components/ShopList";

export default function App() {
  
  const [mode, setmode] = useState("light");
  const [alert, setalert] = useState(null);
  const showAlert = (message, type) => {
  setalert({
    msg: message,
    type: type,
  });
  setTimeout(() => {
    setalert(null);
  }, 1800); 
  };

  const togglemode = () => {
  if (mode === "light") {
    setmode("dark");

    document.body.style.background = "linear-gradient(300deg, #00bbf0, #00204a, #fdb44b)";
    document.body.style.backgroundSize = "180% 180%";
    document.body.style.animation = "gradient-animation 18s ease infinite";

    // Add keyframes if they don't exist yet
    if (!document.getElementById('gradient-animation-style')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'gradient-animation-style';
      styleElement.innerHTML = `
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(styleElement);
    }
    document.body.style.color = "white";
  } else {
    setmode("light");

    document.body.style.background = "linear-gradient(300deg, #66bfbf, #eaf6f6, #f76b8a)";
    document.body.style.backgroundSize = "180% 180%";
    document.body.style.animation = "gradient-animation 18s ease infinite";

    // Add keyframes if they don't exist yet
    if (!document.getElementById('gradient-animation-style')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'gradient-animation-style';
      styleElement.innerHTML = `
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(styleElement);
    }
    document.body.style.color = "black";
  }
  };

  useEffect(() => {
  // Set initial mode to light when the component mounts
  setmode("light");
  document.body.style.background = "linear-gradient(300deg, #66bfbf, #eaf6f6, #f76b8a)";
    document.body.style.backgroundSize = "180% 180%";
    document.body.style.animation = "gradient-animation 18s ease infinite";

    // Add keyframes if they don't exist yet
    if (!document.getElementById('gradient-animation-style')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'gradient-animation-style';
      styleElement.innerHTML = `
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(styleElement);
    }
  document.body.style.color = "black";
  }, []);

  return (
    <Router>
    <Navbar
      mode={mode}
      togglemode={togglemode}
      theme={mode === "light" ? "Light" : "Dark"}
      showAlert={showAlert}
    />
    <Alert alert={alert} />
    <div className="container my-5">
      <Routes>
      <Route exact path="/about" element={<About />} />
      <Route exact path="/login" element={<Login showAlert={showAlert} />} />
      <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
      <Route exact path="/user-search" element={<UserSearch />} />
      <Route exact path="/" element={<Landing />} />
      <Route exact path="/nearbyshops" element={<NearbyShop />} />
      <Route exact path="/shop-list" element={<ShopList />} />
      </Routes>
    </div>
    </Router>
  );
}
