import React from "react";
import "./Tick.css";

const Tick: React.FC = () => {
    return (
      <div style={{ textAlign: "center", padding: "20px 0px" }}>
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
        <p style={{ fontSize: "17px", fontWeight: 500}}>PROCESSED</p>
      </div>
    );
  };
  
  export default Tick;

