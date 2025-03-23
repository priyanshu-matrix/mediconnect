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
          Welcome to <b>MediConnect</b>, your simple energy consumption calculator.
        </li>
        <li className="my-3">
          With <b>EcoMeter</b>, you can easily calculate the energy consumption
          of your appliances.
        </li>
        <li className="my-3">
          Our goal is to help you understand and reduce your energy footprint.
        </li>
      </ul>
      <h3 className="my-4">How to Use:</h3>
      <ul>
        <li>Enter the appliance and its power rating (watts or kilowatts).</li>
        <li className="my-3">
          Specify the duration of usage to calculate energy consumption in kWh.
        </li>
        <li className="my-3">
          Receive energy-saving tips tailored to your appliance.
        </li>
        <li className="my-3">
          Discover recommendations for energy-efficient alternatives.
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
