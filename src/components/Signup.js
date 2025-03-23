import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const host = "http://127.0.0.1:8000";
  const [credentials, setCredentials] = useState({
    request_type: 'new_auth',
    email: "",
    password: "",
    cpassword: "",
    type: "user", // Default to user
    location: {},
    name: "",
    phone: "",
  });
  let navigate = useNavigate();

  function getLocation() {
    return new Promise((resolve, reject) => {
      resolve({ lat: 21.2497572, long: 81.6012525 });

        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(
        //         (position) => {
        //             const lat = position.coords.latitude;
        //             const long = position.coords.longitude;
        //             // resolve({ lat, long });
        //             resolve({ lat: 21.2497572, long: 81.6012525 });
        //         },
        //         (error) => {
        //             alert("Error obtaining location");
        //             reject(error);
        //         }
        //     );
        // } else {
        //     alert("Geolocation is not supported by this browser.");
        //     reject(new Error("Geolocation is not supported by this browser."));
        // }
    });
}

  const handlesubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (credentials.password !== credentials.cpassword) {
      props.showAlert("Passwords do not match", "danger");
      return;
    }
    
    // Get location
    try {
      const location = await getLocation();
      // Create updated credentials to use directly instead of setting state and using it immediately
      const updatedCredentials = {...credentials, location};
      
      try {
        const response = await fetch(`${host}/api/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCredentials),
        });
      
        const json = await response.json();
        console.log(json);
        
        // Handle both array response and direct object response
        const responseData = Array.isArray(json) ? json[0] : json;
        
        if (responseData.status === true) {
          localStorage.setItem('token', responseData.token);
          // console.log(responseData.token);
          navigate("/");
          props.showAlert("Account Created Successfully", "success");
          console.log("Account Created Successfully");
        } else {
          props.showAlert(json.message || "User already exists or Error", "danger");
        }
      } catch (error) {
        console.error('Error:', error);
        props.showAlert("An error occurred while submitting the form", "danger");
      }
    } catch (error) {
      console.error("Location error:", error);
      props.showAlert("Could not get location. Sign-up may not work correctly.", "warning");
    }
  };

  const handleonchange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setCredentials({ 
      ...credentials, 
      type: e.target.checked ? "shop" : "user" 
    });
  };

  return (
    <div className="container" style={{ maxWidth: "400px", margin: "auto", backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', animation: 'fadeIn 1s' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .form-control:focus {
            border-color: #28a745;
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
          }
          .btn-primary {
            background-color: #28a745;
            border-color: #28a745;
          }
          .btn-primary:hover {
            background-color: #218838;
            border-color: #1e7e34;
          }
        `}
      </style>
      <form onSubmit={handlesubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label" style={{ color: '#343a40' }}>
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={handleonchange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label" style={{ color: '#343a40' }}>
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            onChange={handleonchange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label" style={{ color: '#343a40' }}>
            Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            onChange={handleonchange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label" style={{ color: '#343a40' }}>
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={handleonchange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label" style={{ color: '#343a40' }}>
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={handleonchange}
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="user-type"
            onChange={handleTypeChange}
          />
          <label className="form-check-label" htmlFor="user-type" style={{ color: '#343a40' }}>
            Register as a Shop Owner
          </label>
        </div>
        <button type="submit" className="btn btn-primary" id="submitbtn">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
