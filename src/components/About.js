import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const About = (props) => {
  return (
    <div id="about">
      <h1 id="lol" className="mx-2 my-4">
        <u>MediConnect</u>
      </h1>
      <ul className="mx-1">
        <li>
          Welcome to <b>MediConnect</b>, an innovative platform designed to simplify medicine stock management.
        </li>
        <li className="my-3">
          Whether you're a pharmacy, hospital, or managing personal stock, our system makes tracking and updating inventory easy and efficient.
        </li>
        <li className="my-3">
          Our mission is to empower users to manage their medicine stock more effectively, saving time, reducing errors, and ensuring smooth operations.
        </li>
      </ul>
      <h3 className="my-4">Key Features:</h3>
      <ul>
        <li>Real-time Stock Tracking: Monitor your medicine stock instantly and make data-driven decisions.</li>
        <li className="my-3">
          User-Friendly Interface: A simple and intuitive design that ensures a seamless experience for everyone.
        </li>
        <li className="my-3">
          Efficient Medicine Management: Add, edit, and delete medicine details with ease – all at your fingertips.
        </li>
        <li className="my-3">
          Customizable for All Users: Whether for personal use or business, MediConnect adapts to your needs.
        </li>
        <li className="my-3">
          Secure & Reliable: Your data is stored safely and securely, giving you peace of mind.
        </li>
      </ul>
      <p>
        Developed by <b id="owner">Priyanshu</b>
      </p>
      <footer className="footer" >
        <div className="container">
          <div className="social-links" style={{ fontSize: "1.8rem" }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              id="github"
              style={{
                color: props.mode === "dark" ? "white" : "black",
              }}
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
            className="mx-2 my-5"
              href="https://linkedin.com"
              target="_blank"
              id="linkedin"
              rel="noopener noreferrer"
              style={{
                color: props.mode === "dark" ? "white" : "black",
              }}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
          <div
            style={{
              position: "fixed",
              right: 0,
              bottom: 0,
              padding: "10px",
              textAlign: "right",
              zIndex: 1000,
            }}
          >
            &copy; {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
