import React, { useEffect, useContext, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import LoadingSpinner from "./LoadingSpinner";
import {
  makeStyles,
  Card,
  Typography,
  CardContent,
  Tooltip,
  IconButton,
  CardMedia,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: "19px",
    fontWeight: 400,
    wordSpacing: "8px",
    paddingBottom: "10px",
  },
  virtualContainer: { 
      height: "420px", 
      overflowY: "scroll" 
    },
  root: {
    padding: "10px",
    display: "flex",
    cursor: "pointer",
    "&:hover": {
      background: "#0a045e",
      border: "1px solid #0a045e",
    },
  },
  details: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "200px",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    marginRight: "auto",
    width: "100%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    color: theme.palette.text.primary,
    height: 38,
    width: 38,
  },
  optionIcon: {
    color: theme.palette.text.primary,
  },
}));

interface ListProps {
  videos: { [key: string]: any }[];
}

const RecentVideoList: React.FC<ListProps> = ({ videos }) => {
  const classes = useStyles();
  return (
    <div>
      {videos.map((video: { [key: string]: any }, i: number) => (
        <Card key={i} square className={classes.root}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                Footage #{i}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {video.duration}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {video.prepared ? "Processed" : "Unprocessed"}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <Tooltip title={video.name}>
                <IconButton aria-label="info">
                  <InfoOutlinedIcon className={classes.optionIcon} />
                </IconButton>
              </Tooltip>
              <Link to={`/play/${video._id.$oid}`}>
                <IconButton aria-label="play">
                  <PlayCircleOutlineIcon className={classes.playIcon} />
                </IconButton>
              </Link>
              <Link to={`/enhance/${video._id.$oid}`}>
                <IconButton aria-label="options">
                  <CameraEnhanceIcon className={classes.optionIcon} />
                </IconButton>
              </Link>
            </div>
          </div>
          <CardMedia
            className={classes.cover}
            image={`${process.env.REACT_APP_BACKEND_URL}/helpers/file/${video.thumbnail_id}`}
            title={video.name}
          />
        </Card>
      ))}
    </div>
  );
};

const RecentVideo: React.FC = () => {
  const classes = useStyles();
  const [videos, setVideos] = useState<{ [key: string]: any }[]>(null);
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchRecentVideos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/video/getrecentvideo",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setVideos(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRecentVideos();
  }, [auth.token, sendRequest]);
  return (
    <div style={{ padding: "5px" }}>
      <div className={classes.heading}>RECENTLY ADDED</div>
      {isLoading ? (
        <div style={{ padding: "100px 0px" }}>
          <LoadingSpinner />
        </div>
      ) : (
        <div className={classes.virtualContainer}>
          {videos && <RecentVideoList videos={videos} />}
        </div>
      )}
    </div>
  );
};

export default RecentVideo;
