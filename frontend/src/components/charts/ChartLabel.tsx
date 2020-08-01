import React from "react";

const ChartLabel: React.FC = ({ children }) => {
  return (
    <div
      style={{ textAlign: "center", padding: "20px 50px", fontSize: "17px", color: "#ffffff" }}
    >
      {children}
    </div>
  );
};

export default ChartLabel;
