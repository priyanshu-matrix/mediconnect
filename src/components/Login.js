import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const host = "http://127.0.0.1:8000";
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    
    // Data structure for authentication request
    const data = {
      request_type: 'check_auth',
      email: credentials.email,
      password: credentials.password,
    };

    try {
      // Sending authentication request
      const response = await fetch(`${host}/api/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
      
      const responseData = Array.isArray(result) ? result[0] : result;

      if (response.ok) {
        if (responseData.status === true) {
          props.showAlert("Logged in Successfully", "success");
          localStorage.setItem('email', credentials.email);
          localStorage.setItem('token', responseData.token);

          

          try {
            // Define account type checking request
            const accountTypeData = {
              request_type: 'check_account_type',
              email: credentials.email
            };
            
            const accountTypeResponse = await fetch(`${host}/api/auth`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(accountTypeData),
            });
            
            const accountTypeResult = await accountTypeResponse.json();
            console.log("Account type result:", accountTypeResult);
            
            // Extract account type from the response
            const accountType = Array.isArray(accountTypeResult) ? accountTypeResult[0].type : accountTypeResult.type;
            localStorage.setItem('accountType', accountType);


            if (accountTypeResponse.ok) {
              if (accountType === 'shop') {
                navigate("/shop-list");
              } else {
                navigate("/user-search");
              }
            } else {
              props.showAlert(`Account type check failed: ${accountTypeResult.message || accountTypeResponse.statusText}`, "danger");
            }
          } catch (accountTypeError) {
            console.error('Error checking account type:', accountTypeError);
            props.showAlert('Error checking account type.', "danger");
          }
        } else {
          props.showAlert(`Login failed: ${result.message}`, "danger");
        }
      } else {
        const message = result.message || `Login failed with status: ${response.status}`;
        props.showAlert(message, "danger");
      }
    } catch (error) {
      console.error('Error:', error);
      props.showAlert('An error occurred while submitting the form.', "danger");
    }
  };

  const handleonchange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div style={{ height: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        className="container"
        style={{
          maxWidth: "400px",
          height: "41.5vh",
          margin: "auto",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          animation: "fadeIn 1s",
        }}
      >
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
            <label
              htmlFor="email"
              className="form-label"
              style={{ color: "#343a40" }}
            >
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              aria-describedby="emailHelp"
              autoComplete="email"
              value={credentials.email}
              onChange={handleonchange}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              className="form-label"
              style={{ color: "#343a40" }}
            >
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              autoComplete="current-password"
              onChange={handleonchange}
              value={credentials.password}
            />
          </div>
          <button type="submit" className="btn btn-primary my-4" id="submitbtn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
