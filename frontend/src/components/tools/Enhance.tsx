import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import ReactPlayer from "react-player";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { captureVideoFrame } from "../utils/utils";
import { Grid, Button, Paper, Slider, Typography } from "@material-ui/core";
import WallpaperIcon from "@material-ui/icons/Wallpaper";

const useStyles = makeStyles((theme) => ({
  playIcon: {
    fontSize: "100px",
  },
  infoContainer: {
    padding: "10px",
  },
  info: {
    paddingTop: "40px",
    color: "#111",
    textAlign: "center",
    height: "100%",
    backgroundColor: "#0a045e",
    border: "1px solid #2db1e1",
  },
  filterPaper: {
    height: "100%", 
    padding: "20px 20px", 
    backgroundColor: "#0a045e",
    border: "1px solid #2db1e1"
  }
}));

const filterMap = [
  { key: "contrast", min: 0, max: 200 },
  { key: "opacity", min: 0, max: 100 },
  { key: "saturate", min: 0, max: 100 },
  { key: "brightness", min: 0, max: 200 },
  { key: "hueRotate", min: 0, max: 360 },
  { key: "sepia", min: 0, max: 100 },
  { key: "blur", min: 0, max: 100 },
  { key: "grayscale", min: 0, max: 100 },
];

const Enhance: React.FC = () => {
  const classes = useStyles();
  const { oid } = useParams();
  const auth = useContext(AuthContext);
  const [video, setVideo] = useState<{ [key: string]: any }>({});
  const [image, setImage] = useState(null);
  const { sendRequest } = useHttpClient();
  const playerRef = useRef(null);
  const imageRef = useRef(null);
  const [filter, setFilter] = useState<{ [key: string]: any }>({
    contrast: 100,
    opacity: 100,
    saturate: 100,
    brightness: 100,
    hueRotate: 0,
    sepia: 0,
    blur: 0,
    grayscale: 0,
  });
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/video/getvideobyid/" + oid,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData);
        setVideo(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchVideo();
  }, [oid, sendRequest, auth.token]);
  const getFrame = () => {
    const frame = captureVideoFrame(
      playerRef.current.getInternalPlayer(),
      "jpeg",
      0.92
    );
    if (frame) setImage(frame.dataUri);
  };

  useEffect(() => {
    if (image && imageRef.current) {
      console.log(imageRef.current.style.filter);
      imageRef.current.style.filter = `
      blur(${filter.blur}px)
      brightness(${filter.brightness}%)
      contrast(${filter.contrast}%)
      grayscale(${filter.grayscale}%)
      hue-rotate(${filter.hueRotate}deg) 
      opacity(${filter.opacity}%)
      saturate(${filter.saturate}%)
      sepia(${filter.sepia}%)
    `;
    }
  }, [image, filter]);

  const handleFilter = (event, newValue) => {
    console.log(event.target.value)
    setFilter({ ...filter, [event.target.id]: newValue });
  };

  return (
    <Grid style={{ padding: "20px" }} container>
      <Typography variant="h5" gutterBottom>Image Quality</Typography>
      <Grid style={{ backgroundColor: "#2db1e1", height: "1px", marginBottom: "20px" }} item xs={12} />
      <Grid item md={6} sm={12} xs={12}>
        <ReactPlayer
          ref={(player) => {
            playerRef.current = player;
          }}
          controls
          // style={{ boxShadow: "-3px 6px 34px 6px rgba(18,25,41,1)" }}
          url={`${process.env.REACT_APP_BACKEND_URL}/helpers/video/${video.file_id}`}
          light={`${process.env.REACT_APP_BACKEND_URL}/helpers/file/${video.thumbnail_id}`}
          playing
          pip
          width="100%"
          playIcon={<PlayCircleFilledIcon className={classes.playIcon} />}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous",
              },
            },
          }}
        />
      </Grid>
      <Grid className={classes.infoContainer} item md={6} sm={12} xs={12}>
        <Grid container className={classes.info}>
          <Grid item xs={12} style={{ padding: "20px" }}>
            <WallpaperIcon style={{ color: "2db1e1", fontSize: "100px" }} />
          </Grid>
          <Grid item xs={12} style={{ padding: "20px" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#2db1e1", fontWeight: 500 }}
              onClick={getFrame}
            >
              CAPTURE FRAME
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid style={{ height: "50px" }} item xs={12} />
      <Grid item md={6} sm={12} xs={12}>
        {image && (
          <img
            style={{ width: "100%" }}
            src={image}
            alt="frame"
            ref={imageRef}
          />
        )}
      </Grid>
      <Grid style={{ padding: "10px", paddingTop: "0px" }} item md={6} sm={12} xs={12}>
        {image && (
          <Paper className={classes.filterPaper} square>
            <Grid container spacing={2}>
              {filterMap.map((f, i) => (
                <Grid key={i} item md={6} xs={12} style={{ margin: "10px 0px" }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <div style={{ fontSize: "17px", fontWeight: 600 }}>{f.key.toUpperCase()}</div>
                    </Grid>
                    <Grid item xs={1}>
                      {f.min}
                    </Grid>
                    <Grid item xs={10}>
                      <Slider
                        id={f.key}
                        value={filter[f.key]}
                        min={f.min}
                        max={f.max}
                        aria-labelledby="continuous-slider"
                        onChange={handleFilter}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      {f.max}
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default Enhance;
