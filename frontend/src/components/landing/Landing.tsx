import React, { useContext } from "react";
import FadeIn from "../utils/FadeIn";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { Button, Grid } from "@material-ui/core";
import Header from "./Header";
import { PieChart, WorldMap } from "./Charts";
import TechStack from "./Techstack";
import Footer from "./Footer";
import Mockup from "./Mockup";
import "./Landing.css";
import DownloadButton from "./DownloadButton";

interface FeatureProps {
  children: React.ReactNode;
}

const Feature: React.FC<FeatureProps> = ({ children }) => {
  return (
    <Grid className="box" item lg={3} md={4} sm={6} xs={12}>
      <FadeIn>{children}</FadeIn>
    </Grid>
  );
};

const Landing: React.FC = () => {
  let history = useHistory();
  const auth = useContext(AuthContext);

  return (
    <div className="landing">
      <Header isLoggedIn={auth.isLoggedIn} />
      <div className="section-content rowC section1">
     
        <Grid container>
          <Grid
            style={{ paddingLeft: "0px", textAlign: "left", color: "white" }}
            item
            md={6}
            xs={12}
          >
            
            <br />
            <FadeIn>
            <img
                src={require("./images/mplogo.png")}
                alt="Start_image"
                style={{ width:75,position:'relative'}}
              />
            <img
                src={require("./images/sihlogo.png")}
                style={{ width: 150,position: 'relative' }}
                alt="Start_image"
              />
             <br></br>
            <button
                style={{
                  background:
                    "linear-gradient(90deg, rgba(29, 36, 63, 1) 5%, rgba(35, 46, 79, 1) 96%)",
                  borderRadius: "50px",
                  padding: "15px",
                  color: "white",
                  fontSize: "15px",
                }}
              >
                Problem Statement Id: MS332
              </button>
              <br />
              <h1 style={{ padding: "10px", fontSize: "50px" }}>
                Textile Detection
              </h1>
              <h3 style={{ padding: "10px" }}>
                The system focuses on capturing and saving various attributes of
                fabrics worn by targeted persons captured from various CCTV
                cameras through distributed intelligence along with time and
                location stamps over the period in a database. The database is
                compiled to be used in identification of suspects from video
                clips of crime related CCTV footages captured in a series of
                CCTV cameras located on routes and close to scene of crime.
              </h3>
              <br />
              {auth.isLoggedIn ? (
                <Button
                  variant="contained"
                  style={{
                    color: "#060124",
                    backgroundColor: "#2db1e1",
                    fontWeight: 500,
                  }}
                  onClick={() => history.push("/")}
                >
                  Go to Console
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    style={{
                      color: "#060124",
                      backgroundColor: "#2db1e1",
                      fontWeight: 500,
                    }}
                    onClick={() => history.push("/signup")}
                  >
                    Sign Up
                  </Button>
                  &nbsp;
                  <Button
                    variant="contained"
                    style={{
                      color: "#060124",
                      backgroundColor: "#2db1e1",
                      fontWeight: 500,
                    }}
                    onClick={() => history.push("/signin")}
                  >
                    Log In
                  </Button>
                </>
              )}
              &nbsp;&nbsp;&nbsp;
              <Button variant="outlined" color="primary">
                Github
              </Button>
            </FadeIn>
          </Grid>
          <Grid
            className="inner-content"
            style={{ paddingLeft: "0px" }}
            item
            md={6}
            xs={12}
          >
            <FadeIn>
              {/*<img
                src={require("./images/start.png")}
                className="start-img"
                alt="Start_image"
              /> */}
              <Mockup />
            </FadeIn>
          </Grid>
        </Grid>
      </div>
      

      <div className="section-content section2" style={{ background: "#111" }}>
        <div className="inner-content">
          <h1 className="Headers">Features Implemented</h1>
          <Grid container>
            <Feature>
              {/* <GiMiner size="90px" color="blue" /> */}
              <img
                src={require("./images/videolibrary.png")}
                alt="Test"
                style={{ width: 150,position: 'relative' }}
              />
              <h2>VIDEO LIBRARY</h2>
              <h5 style={{ position: 'relative'  }}>
                A library where all the cctv videos are stored.
              </h5>
            </Feature>
            <Feature>
              {/* <GiMiningHelmet size="90px" color="blue" /> */}
              <img
                src={require("./images/addvideo.png")}
                alt="Test"
                style={{ width: 150 ,position: 'relative' }}
              />
              <h2>ADD VIDEO</h2>
              <h5 style={{ position: 'relative'  }}>
                {" "}
                It allows the user to upload and
                store a video to the database along wit its location and timestamp.
              </h5>
            </Feature>
            <Feature>
              <img
                src={require("./images/scable.jpg")}
                alt="Test"
                style={{ width: 180, height: 150,position: 'relative'  }}
              />
              <h2>SCALABLE ARCHITECTURE</h2>
              <h5 style={{ position: 'relative' }}>
                The program can handle more than just one functionality.
              </h5>
            </Feature>
            <Feature>
              {/* <GiMiningHelmet size="90px" color="blue" /> */}
              <img
                src={require("./images/search1.jpg")}
                alt="Test"
                style={{ width: 150 ,position: 'relative' }}
              />
              <h2>SEARCH</h2>
              <h5 style={{ position: 'relative' }}>
                A video is chosen from the database to be processed frame by
                frame in which people and their clothing are identified.
              </h5>
            </Feature>
            <Feature>
              <img
                src={require("./images/speech.jpg")}
                alt="Test"
                style={{ width: 180, height: 150 ,position: 'relative' }}
              />
              <h2>SPEECH RECOGNITION</h2>
              <h5 style={{ position: 'relative' }}>
                This feature speeds up the process by traslating speech to text.
              </h5>
            </Feature>
            <Feature >
              {/* <GiMiner size="90px" color="blue" /> */}
              <img
                src={require("./images/visualization.png")}
                alt="Test"
                style={{ width: 150 ,position: 'relative' }}
              />
              <h2>ANALYTICS</h2>
              <h5 style={{ position: 'relative'  }}>
                It is visual representation of different aspects of the video by
                plotting the information recieved after classification on a
                graph to get an accurate sense of understanding.
              </h5>
            </Feature>
          </Grid>
        </div>
      </div>

      <div style={{ backgroundColor: "#111111" }} className="downloads">
        <DownloadButton />
            </div>
      
      <div className="section-content section3">
        <h1 className="Headers">About the Model</h1>
        <br />
        <Grid container>
          <Grid
            item
            md={6}
            sm={12}
            xs={12}
            style={{ paddingLeft: "20px", textAlign: "left" }}
          >
            <FadeIn>
              <h1 style={{ color: "lightgreen" }}>
                MultiLabel Image classifier
              </h1>
              <h4>(Mobilenet Architechture)</h4>
              <h3>
                This is a type of classification in which an object can be
                categorized into more than one class. Here the clothing
                attributes are classsified on the basis of both type and color.
                The various types that can be identified include blazers,
                burkhas, sarees, shirts, trousers,etc.
              </h3>
            </FadeIn>
          </Grid>
          <Grid item md={6} sm={12} style={{ paddingLeft: "10px" }}>
            <FadeIn>
              <PieChart />
            </FadeIn>
          </Grid>
        </Grid>
      </div>

      <div className="section-content section4" style={{ background: "#111" }}>
        <h1 className="Headers">Preparation of the Database</h1>
        <Grid container>
          <Grid item md={6} sm={12}>
            <FadeIn>
              <WorldMap />
            </FadeIn>
          </Grid>
          <Grid
            style={{ textAlign: "left", color: "#2563ff" }}
            item
            md={6}
            sm={12}
          >
            <FadeIn>
              <h1 style={{ padding: "0px 15px" }}>
                CCTV Cameras at<br></br>various Locations.
              </h1>
              <h3 style={{ padding: "0px 15px", color: "white" }}>
                The videos can be pulled from various CCTV cameras installed all
                across the globe. The cameras available at various locatons can
                be accessed by simply navigating in the map integrated using
                Mapbox API.The CCTV systems which are available to view in a
                particular area are highlighted during navigation on the map.
              </h3>
            </FadeIn>
          </Grid>
        </Grid>
      </div>

      <div
        className="section-content section5"
        style={{ padding: "0px", background: "#111" }}
      >
        <div className="inner-content">
          <h1 className="Headers">Technologies Used</h1>
          <TechStack />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
