import React, { useState, useEffect, useRef } from "react";
import { Grow } from "@material-ui/core";
interface Props {
  children: React.ReactNode;
}

const FadeIn: React.FC<Props> = ({ children }) => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // console.log(`entry`, entry, `is = ${entry.isIntersecting}`);
        setVisible(v => !v ? entry.isIntersecting : v);
      });
    });

    const { current } = domRef;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <Grow in={isVisible} timeout={2000}>
      <div ref={domRef}>{children}</div>
    </Grow>
  );
};

export default FadeIn;