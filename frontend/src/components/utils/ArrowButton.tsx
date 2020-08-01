import React from "react";
import "./ArrowButton.scss";
import { useHistory } from "react-router-dom";

const ArrowButton: React.FC = () => {
  let history = useHistory();
  return (
    <button className="arrow-button" onClick={() => history.push("/cctv")}>
      <span className="label">VIEW ALL CAMERAS</span>
      <span className="arrow"></span>
    </button>
  );
};

export default ArrowButton;
