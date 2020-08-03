import React, { useState, useEffect, useRef, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Chip, Avatar, Typography } from "@material-ui/core";
import { MetaData, Person } from "../../types";
import Dot from "../utils/Dot";
// import { md } from "../utils/utils";
import { useInterval } from "../hooks/time-hook";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import LoadingSpinner from "../utils/LoadingSpinner";
import { useDimension } from "../hooks/dimension-hook";
import useBoxRenderer from "../hooks/box-hook";

const MODEL_URL = process.env.PUBLIC_URL + "/model/";
const LABELS_URL = MODEL_URL + "labels.json";
const MODEL_JSON = MODEL_URL + "model.json";

const useStyles = makeStyles((theme) => ({
  playIcon: {
    margin: "200px 0px",
    fontSize: "100px",
    zIndex: 10,
  },
  container: {
    position: "relative",
    width: "100%",
    height: "auto",
    overflow: "hidden",
  },
  canvas: {
    position: "absolute",
    width: "100%",
    height: "500px",
    top: "0px",
    left: "0px",
  },
  personContainer: {
    height: "100%",
    padding: "10px",
  },
  person: {
    border: "1px solid #2db1e1",
    padding: "10px",
  },
  personInfo: {
    padding: "0px 8px",
    fontWeight: 500,
    fontSize: "17px",
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: "50vw",
    },
    width: "80vw",
  },
}));

interface Props {
  video: { [key: string]: any };
}
const FrameShower: React.FC<Props> = ({ video }) => {
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dimensions = useDimension();

  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      const model = await tf.loadGraphModel(MODEL_JSON);
      setModel(model);
      const response = await fetch(LABELS_URL);
      let labels = await response.json();
      setLabels(labels);
      setLoading(false);
      console.log(model);
      console.log(labels);
    };
    loadModel();
  }, []);

  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [metadata, setMetadata] = useState<MetaData[]>(null);
  const [currentData, setCurrentData] = useState<Person[]>(null);
  const classes = useStyles();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.crossOrigin = "anonymous"
      videoRef.current.onloadeddata = function() {
        setVideoLoaded(true);
    };
    console.log(videoRef.current)
    }
  }, [])
  useBoxRenderer(model, videoRef, canvasRef, videoLoaded, labels);
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            "/query/metadata/" +
            video._id.$oid,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData);
        setMetadata(responseData.metadata);
      } catch (err) {
        console.log(err);
      }
    };
    if (Object.keys(video).length > 0) {
      fetchMetadata();

    }
    // if (playerRef.current) console.log(playerRef.current);
  }, [video, auth, sendRequest]);

  useInterval(() => {
    if (metadata && videoRef.current) {
      let ct = videoRef.current.currentTime;
      let f = Math.floor(ct);
      let m = ct % f;
      if (m >= 1) ct = ct + 1;
      ct = Math.floor(ct);
      try {
        let persons = JSON.parse(metadata[ct].persons);
        setCurrentData(persons);
      } catch (err) {
        console.log(err);
      }
    }
  }, 500);



  return (
    <div className={classes.drawer}>
      {loading && (
        <div style={{ paddingLeft: "30%" }}>
          <div style={{ padding: "20px" }}>
            <LoadingSpinner />
            <p
              style={{
                color: "#fff",
                fontWeight: 500,
              }}
            >
              Loading Model. Please wait a few seconds...
            </p>
          </div>
        </div>
      )}
      <div style={{ padding: "30px" }}>
        <div>
          <div className="center-div">
            <div
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
              }}
            >
              <div className="image-container">
                <video
                  autoPlay
                  controls
                  playsInline
                  muted
                  width={dimensions.width}
                  height={dimensions.height}
                  className="image-canvas"
                  ref={videoRef}
                  src={`${process.env.REACT_APP_BACKEND_URL}/helpers/video/${video.file_id}`}
                />
                <canvas
                  width={dimensions.width}
                  height={dimensions.height}
                  className="image-canvas"
                  ref={canvasRef}
                />
              </div>
            </div>
          </div>
        </div>
        <Grid container>
          <Grid item className={classes.personContainer} xs={12}>
            <Typography
              style={{
                marginBottom: "10px",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              Metadata will appear over here
            </Typography>
            {currentData &&
              currentData.map((cd, index) => (
                <div key={index} className={classes.person}>
                  <div className={classes.personInfo}>Person {index + 1}</div>
                  <div>
                    {cd.colors.map((color, index) => (
                      <Dot key={index} color={color} />
                    ))}
                  </div>
                  <div>
                    {cd.labels.map((label, index) => (
                      <Chip
                        key={index}
                        color="primary"
                        style={{
                          margin: "5px 3px",
                          color: "#1C233E",
                          fontWeight: 600,
                        }}
                        label={label}
                        avatar={<Avatar>{label.charAt(0)}</Avatar>}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default FrameShower;
