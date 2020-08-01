import React from "react";

interface Props {
  color: string;
}

const Dot: React.FC<Props> = ({ color }) => {
  return (
    <span
      style={{
        margin: "5px",
        height: "20px",
        width: "20px",
        backgroundColor: `${color}`,
        borderRadius: "50%",
        display: "inline-block",
      }}
    />
  );
};

export default Dot;
