import React from "react";
import "./LoadingSpinner.css";

interface Props {
  asOverlay?: boolean;
}

const LoadingSpinner: React.FC<Props> = (props) => {
  return (
    <div
      style={{ textAlign: "center" }}
      className={`${props.asOverlay && "loading-spinner__overlay"}`}
    >
      <div className="lds-grid">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default LoadingSpinner;
