import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Link, useLocation } from "react-router-dom";

function Navbar(props) {
  let navigate = useNavigate();
  const [show, setShow] = useState(false);

  let location = useLocation();

  useEffect(() => {
    setShow(true);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".navbar-collapse")) {
        const navbarCollapse = document.getElementById(
          "navbarSupportedContent"
        );
        if (navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <nav
        className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode}`}
      >
        <div className="container-fluid">
          <Link className="navbar-brand mx-2" to="/">
            <img
              id="logo"
              src="logo.jpeg"
              alt=""
              className={`${show ? "show" : ""} mx-4`}
            />
            <b>Medi</b>Connect{props.version}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-lg-0">
              {localStorage.getItem("token") &&
                localStorage.getItem("accountType") === "user" && (
                  <li className="nav-item">
                    <Link
                      type="button"
                      className={`nav-link ${
                        location.pathname === "/user-search" ? "active" : ""
                      }`}
                      aria-current="page"
                      to="/user-search"
                      onClick={() => {
                        if (!localStorage.getItem("jwt_token")) {
                          props.showAlert("Please login first", "warning");
                          navigate("/login");
                        }
                      }}
                    >
                      <b>Search</b>
                    </Link>
                  </li>
                )}
              {localStorage.getItem("token") &&
                localStorage.getItem("accountType") === "shop" && (
                  <li className="nav-item">
                    <Link
                      type="button"
                      className={`nav-link ${
                        location.pathname === "/shop-list" ? "active" : ""
                      }`}
                      aria-current="page"
                      to="/shop-list"
                      onClick={() => {
                        if (!localStorage.getItem("jwt_token")) {
                          props.showAlert("Please login first", "warning");
                          navigate("/login");
                        }
                      }}
                    >
                      <b>Stock</b>
                    </Link>
                  </li>
                )}
              <li className="nav-item ">
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  <b>About</b>
                </Link>
              </li>
            </ul>
            {!localStorage.getItem("token") ? (
              <div className="d-flex">
                {location.pathname !== "/welcome" && (
                  <>
                    <Link className="btn btn-outline-primary my-3" to="/signup">
                      SignUp
                    </Link>
                    <Link
                      className="btn btn-outline-primary mx-2 my-3"
                      to="/login"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <button
                className="btn btn-outline-success my-3"
                type="button"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                  props.showAlert("Logged out successfully", "success");
                }}
              >
                Logout
              </button>
            )}
            <div id="theme" className="d-flex align-items-center mx-2">
              <b>{props.theme}</b>
              <div className="form-check form-switch mx-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onClick={props.togglemode}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckDefault"
                  id="theme"
                ></label>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
