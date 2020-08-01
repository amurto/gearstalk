import React from "react";
import { FaGithub, FaCopyright } from 'react-icons/fa'


const Footer: React.FC = () => {
  return (
    <div style={{ background: "#1f1f1f", height: "210px" }}>
        <div style={{ color:'white', padding: '30px', textAlign:'center'}}>
            <FaGithub  size="40px" href="#"/>
            <br /><br />
            View the code Here.
            <br /><br />
            <FaCopyright />
            &nbsp;&nbsp;
            2020 DATA PIRATES.  ALL RIGHTS RESERVED. PRIVACY POLICY
        </div>
    </div>
  );
}

export default Footer;