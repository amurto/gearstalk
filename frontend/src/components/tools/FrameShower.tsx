import React, { useState, useEffect, useRef, useContext } from "react";
import ReactPlayer from "react-player";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Chip, Avatar, Typography } from "@material-ui/core";
import { MetaData, Person } from "../../types";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import Dot from "../utils/Dot";
// import { md } from "../utils/utils";
import { useInterval } from "../hooks/time-hook";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
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
    width: "80vw"
  }
}));

interface Props {
  video: { [key: string]: any };
}
const FrameShower: React.FC<Props> = ({ video }) => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [metadata, setMetadata] = useState<MetaData[]>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<Person[]>(null);
  const handleIsPlaying = () => setIsPlaying(true);
  const handleIsNotPlaying = () => setIsPlaying(false);
  const classes = useStyles();
  const playerRef = useRef(null);
  const canvasRef = useRef(null);

  const renderPredictions = (persons, canvasRef) => {
    const ctx = canvasRef.current.getContext("2d");
    // ctx.translate(0.5, 0.5);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "10px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    persons.forEach((person) => {
      const x = Math.floor(ctx.canvas.width * person.box[0] + 0.5);
      const y = Math.floor(ctx.canvas.height * person.box[1] + 0.5);
      const width = ctx.canvas.width * person.box[2];
      const height = ctx.canvas.height * person.box[3];
      console.log(x, y, width, height);
      // Draw the bounding box.
      ctx.strokeStyle = "#2db1e1";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      let text: string = "";
      person.labels.forEach((label: string) => (text = text + ", " + label));
      const textWidth = ctx.measureText(text).width;
      const textHeight = parseInt(font, 10); // base 10
      // ctx.fillRect(x, y, textWidth + 1, textHeight + 1)
      ctx.fillRect(0, 0, textWidth - 1, textHeight - 1);
    });

    persons.forEach((person) => {
      const x = ctx.canvas.width * person.box[0];
      const y = ctx.canvas.height * person.box[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      let text: string = "";
      person.labels.forEach((label: string) => (text = text + ", " + label));
      ctx.fillText(text, x, y);
    });
  };

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
    if (metadata && isPlaying && playerRef.current) {
        console.log("ok")
      let ct = playerRef.current.getCurrentTime();
      let f = Math.floor(ct);
      let m = ct % f;
      if (m >= 1) ct = ct + 1;
      ct = Math.floor(ct);
      try {
        let persons = JSON.parse(metadata[ct].persons)
        console.log(ct,persons)
        setCurrentData(persons);
        renderPredictions(persons, canvasRef);
      } catch (err) {
          console.log(err);
      }
    }
  }, 500);
  return (
    <Grid container className={classes.drawer}>
      <Grid style={{ padding: "30px" }} item xs={12}>
        <div className={classes.container}>
          <canvas
            width="100%"
            height="auto"
            className={classes.canvas}
            ref={canvasRef}
          />
          <ReactPlayer
            ref={(player) => {
              playerRef.current = player;
            }}
            onStart={handleIsPlaying}
            onPlay={handleIsPlaying}
            onPause={handleIsNotPlaying}
            onEnded={handleIsNotPlaying}
            controls
            style={{
              boxShadow: "-3px 6px 34px 6px rgba(18,25,41,1)",
            }}
            width="100%"
            height="auto"
            url={`${process.env.REACT_APP_BACKEND_URL}/helpers/video/${video.file_id}`}
            light={`${process.env.REACT_APP_BACKEND_URL}/helpers/file/${video.thumbnail_id}`}
            playing
            pip
            playIcon={<PlayCircleFilledIcon className={classes.playIcon} />}
          />
        </div>
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
    </Grid>
  );
};

export default FrameShower;
