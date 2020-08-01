import React from "react";
import phone from "./images/phone.jpg";
import tablet from "./images/tablet.jpg";
import desktop from "./images/desktop.jpg";

import "./Mockup.scss";

const Mockup: React.FC = () => {
  return (
    <div className="device-collection">
      <div className="phone-container">
        <div className="device phone">
          <img src={phone} alt="phone" />
        </div>
      </div>
      <div className="tablet-container">
        <div className="device tablet">
          <img src={tablet} alt="tablet" />
        </div>
      </div>
      <div className="device desktop">
        <img src={desktop} alt="desktop" />
      </div>
    </div>
  );
};

export default Mockup;
