import React, { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import ReactPlayer from "react-player";
import { FlyToInterpolator } from "react-map-gl";
import CamMap from "./CamMap";
import LocDialog from "./LocDialog";
import TimeDialog from "./TimeDialog";
import UtilDialog from "../utils/UtilDialog";
import { useHttpClient } from "../hooks/http-hook";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import LoadingSpinner from "../utils/LoadingSpinner";
import {
  Grid,
  Paper,
  Divider,
  Typography,
  Tooltip,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import EditIcon from "@material-ui/icons/Edit";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import VideocamIcon from "@material-ui/icons/Videocam";
import ClearIcon from "@material-ui/icons/Clear";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import AccessAlarmsIcon from "@material-ui/icons/AccessAlarms";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ImageIcon from "@material-ui/icons/Image";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DashboardIcon from '@material-ui/icons/Dashboard';
  
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "20px",
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  playIcon: {
    fontSize: "100px",
  },
  option: {
    padding: "10px",
    paddingTop: "15px",
    background: "#2a3f73",
    color: "#ffffff",
    border: "1px solid #4f619a",
    textAlign: "center",
    cursor: "pointer",
    "&:hover": {
      background: "#30a3f2",
      border: "1px solid #30a3f2",
    },
  },
  optionTitle: {
    paddingTop: "10px",
    fontSize: "15px",
    fontWeight: 400,
    pointerEvents: "none",
  },
  details: {
    padding: "10px",
    background: "#2a3f73",
    color: "#ffffff",
    border: "1px solid #4f619a",
  },
  locationAttributes: {
    textAlign: "left",
    marginTop: "8px",
    marginBottom: "8px",
  },
  iconMargin: {
    "& > *": {
      marginLeft: theme.spacing(2),
    },
  },
  locationParams: {
    fontSize: "13px",
    color: "#ffffff",
    fontWeight: 500,
  },
  camDetails: {
    padding: "10px 20px",
    textAlign: "center",
  },
  divider: {
    background: "#323e63",
  },
  camHeading: {
    padding: "15px 15px 5px",
  },
  mapContainer: {
    boxShadow: "-3px 6px 34px 6px rgba(18,25,41,1)",
    border: "1px solid #4f619a",
    position: "relative",
  },
  noLocation: {
    textAlign: "center",
    padding: "50px 10px",
    fontWeight: 500,
    fontSize: "18px",
  },
  content: {
    padding: "5%",
  },
  videoHeader: {
    background: "#435080",
  },
  infoButton: {
    padding: 5,
    color: "#758cd1",
  },
  videocamButton: {
    padding: 5,
    color: "#ffffff",
  },
  filename: {
    padding: "5px 10px",
    color: "#ffffff",
    fontWeight: 400,
  },
  timestamp: {
    margin: "20px 0px",
    padding: "10px 10px 5px",
    border: "2px solid #4f5c88",
  },
  mainContent: {
    margin: "20px 0px",
  },
  mainOption: {
    padding: "10px",
    paddingTop: "15px",
    background: "#0a045e",
    color: "#ffffff",
    border: "1px solid #4f619a",
    textAlign: "center",
    cursor: "pointer",
    "&:hover": {
      background: "#ffffff",
      border: "1px solid #30a3f2",
      color: "#0a045e",
    },
  },
}));

interface CamDisplayProps {
  location: [];
  camera: { [key: string]: any };
  setCamera: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;
}

const CamDisplay: React.FC<CamDisplayProps> = ({
  location,
  camera,
  setCamera,
}) => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchCamera = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/cctv/getcctvbyid/" + location,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData);
        setCamera(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    if (location !== null) {
      fetchCamera();
    }
  }, [location, setCamera, sendRequest, auth.token]);

  return (
    <div>
      {isLoading && (
        <div style={{ padding: "40px 0px" }}>
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div style={{ marginTop: "20p", marginBottom: "20px" }}>
          <Alert
            variant="outlined"
            style={{ color: "#f44336", marginBottom: "10px" }}
            severity="error"
            onClose={clearError}
          >
            {error}
          </Alert>
        </div>
      )}
      {!isLoading && (
        <div>
          {Object.keys(camera).length > 0 ? (
            <div>
              <div className={classes.camHeading}>
                <Typography variant="subtitle1" gutterBottom>
                  Camera Id{" "}
                  <span style={{ color: "#ffffff" }}>#{camera._id.$oid}</span>
                </Typography>
              </div>
              <Divider className={classes.divider} />
              <Grid className={classes.camDetails} container>
                <Grid className={classes.locationAttributes} item xs={6}>
                  <div>Latitude</div>
                  <div className={classes.locationParams}>
                    {camera.latitude}
                  </div>
                </Grid>
                <Grid className={classes.locationAttributes} item xs={6}>
                  <div>Longitude</div>
                  <div className={classes.locationParams}>
                    {camera.longitude}
                  </div>
                </Grid>
                <Grid className={classes.locationAttributes} item xs={6}>
                  <div>Country</div>
                  <div className={classes.locationParams}>{camera.country}</div>
                </Grid>
                <Grid className={classes.locationAttributes} item xs={6}>
                  <div>State</div>
                  <div className={classes.locationParams}>{camera.state}</div>
                </Grid>
                <Grid className={classes.locationAttributes} item xs={6}>
                  <div>City</div>
                  <div className={classes.locationParams}>{camera.city}</div>
                </Grid>
                <Grid className={classes.locationAttributes} item xs={6}>
                  <div>Sublocality</div>
                  <div className={classes.locationParams}>
                    {camera.sublocality}
                  </div>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <div className={classes.details}>
                <Grid container>
                  <Grid style={{ paddingTop: "10px" }} item xs={1}>
                    <LocationOnIcon />
                  </Grid>
                  <Grid item xs={11}>
                    <div
                      style={{
                        color: "#758cd1",
                        padding: "5px 0px",
                        fontSize: "18px",
                        fontWeight: 500,
                      }}
                    >
                      Address
                    </div>
                    {camera.formatted_address}
                  </Grid>
                </Grid>
              </div>
            </div>
          ) : (
            <div className={classes.noLocation}>
              No Location data found. Add a Location to this video.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Play: React.FC = () => {
  const classes = useStyles();
  let history = useHistory();
  const { oid } = useParams();
  const auth = useContext(AuthContext);

  const {
    isLoading,
    error,
    sendRequest,
    clearError,
    setErrorText,
  } = useHttpClient();

  const [video, setVideo] = useState<{ [key: string]: any }>({});
  const [camera, setCamera] = useState<{ [key: string]: any }>({});
  const [willProcess, setWillProcess] = useState<boolean>(false);

  const processVideo = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/process/processvideo/" + oid,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(responseData);
      setVideo(v => {
        return {
          ...v,
          processing: true
        }
      })
      setWillProcess(true);
    } catch (err) {
      console.log(err);
    }
  };

  const optionHandler:
    | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
    | undefined = (event) => {
    if (!video) {
      setErrorText(
        "No camera found in the database. Start with inserting one."
      );
    } else {
      let option = event.target.id;
      switch (option) {
        case "back":
          history.push("/library");
          break;
        case "dashboard":
          history.push('/');
          break;
        case "analytics":
          history.push(`/analytics/${video._id.$oid}`);
          break;
        case "process":
          processVideo();
          break;
        case "search":
          history.push(`/search/vid/${video._id.$oid}`);
          break;
        case "enhance":
          history.push(`/enhance/${video._id.$oid}`);
          break;
        case "bookmark":
          break;
        case "time":
          handleTimeOpen();
          break;
        case "locate":
          if (camera) {
            handleFlyTo({
              latitude: camera.latitude,
              longitude: camera.longitude,
            });
          }
          break;
        case "edit":
          handleLocationOpen();
          break;
        case "delete":
          handleDeleteOpen();
          break;
        default:
          break;
      }
    }
  };

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
    console.log(oid);
    fetchVideo();
  }, [oid, sendRequest, auth.token]);

  const handleChangeViewState = ({ viewState }) => setViewState(viewState);

  const [viewState, setViewState] = useState({
    latitude: 19.076,
    longitude: 72.8777,
    zoom: 11,
    pitch: 40.5,
    bearing: 0.7,
  });

  const handleFlyTo = useCallback((destination) => {
    setViewState((v) => {
      return {
        ...v,
        ...destination,
        zoom: 11,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
      };
    });
  }, []);

  useEffect(() => {
    if (Object.keys(camera).length > 0) {
      handleFlyTo({
        latitude: camera.latitude,
        longitude: camera.longitude,
      });
    }
  }, [camera, handleFlyTo]);

  const [locationOpen, setLocationOpen] = useState(false);

  const handleLocationOpen = () => {
    setLocationOpen(true);
  };

  const handleLocationClose = () => {
    setLocationOpen(false);
  };

  const [timeOpen, setTimeOpen] = useState(false);

  const handleTimeOpen = () => {
    setTimeOpen(true);
  };

  const handleTimeClose = () => {
    setTimeOpen(false);
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const deleteVideoHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          "/video/deletevideo/" +
          video._id.$oid,
        "DELETE"
      );
    } catch (err) {
      console.log(err);
    }
    handleDeleteClose();
    history.push("/library");
  };

  const willProcessClose = () => setWillProcess(false);

  return (
    <React.Fragment>
      <LocDialog
        open={locationOpen}
        camera={camera}
        video_id={oid}
        setVideo={setVideo}
        handleClose={handleLocationClose}
      />
      <TimeDialog
        open={timeOpen}
        video={video}
        setVideo={setVideo}
        handleClose={handleTimeClose}
      />
      <UtilDialog
        open={deleteOpen}
        title="Delete Camera?"
        operationHandler={deleteVideoHandler}
        handleClose={handleDeleteClose}
      >
        This will delete this video from the database. Please confirm if you
        want to delete the video.
      </UtilDialog>
      <Snackbar
        open={willProcess}
        autoHideDuration={6000}
        onClose={willProcessClose}
      >
        <Alert onClose={willProcessClose} severity="success">
          The video is under processing. It will be processed in a while!
        </Alert>
      </Snackbar>
      <Grid container className={classes.root}>
        <Grid item md={8} xs={12}>
          <div className={classes.content}>
            {error && (
              <div style={{ marginTop: "20p", marginBottom: "20px" }}>
                <Alert onClose={clearError} severity="error">
                  {error}
                </Alert>
              </div>
            )}
            {isLoading && (
              <div style={{ marginTop: "25vh" }}>
                <LoadingSpinner />
              </div>
            )}
            {Object.keys(video).length > 0 && (
              <React.Fragment>
                <Grid style={{ marginBottom: "10px" }} container>
                  <Grid className={classes.videoHeader} item md={10} sm={12}>
                    <Typography
                      className={classes.filename}
                      variant="subtitle2"
                      gutterBottom
                    >
                      {video.name}
                    </Typography>
                  </Grid>
                  <Grid style={{ textAlign: "center" }} item md={2} xs={12}>
                    <div className={classes.iconMargin}>
                      <Tooltip title={`Id #${video._id.$oid}`}>
                        <IconButton
                          color="primary"
                          className={classes.infoButton}
                          aria-label="Info"
                        >
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Upload Video">
                        <IconButton
                          color="primary"
                          className={classes.videocamButton}
                          aria-label="Upload Video"
                          onClick={() => {
                            history.push("/upload");
                          }}
                        >
                          <VideocamIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Grid>
                </Grid>
                <ReactPlayer
                  controls
                  style={{ boxShadow: "-3px 6px 34px 6px rgba(18,25,41,1)" }}
                  url={`${process.env.REACT_APP_BACKEND_URL}/helpers/video/${video.file_id}`}
                  light={`${process.env.REACT_APP_BACKEND_URL}/helpers/file/${video.thumbnail_id}`}
                  playing
                  pip
                  width="100%"
                  playIcon={
                    <PlayCircleFilledIcon className={classes.playIcon} />
                  }
                />
                <Grid className={classes.timestamp} container>
                  <Grid
                    item
                    xs={11}
                    style={{ fontSize: "15px", color: "#ffffff" }}
                  >
                    {new Date(
                      video.date + "T" + video.time + "+05:30"
                    ).toString()}
                  </Grid>
                  <Grid item xs={1}>
                    <Tooltip title={`${video.date} ${video.time}`}>
                      <AccessAlarmsIcon style={{ color: "#ffffff" }} />
                    </Tooltip>
                  </Grid>
                </Grid>
                <Grid className={classes.mainContent} container>
                  <Grid
                    id="back"
                    className={classes.mainOption}
                    item
                    md={2}
                    sm={2}
                    xs={6}
                    onClick={optionHandler}
                  >
                    <KeyboardBackspaceIcon fontSize="large" />
                    <Typography className={classes.optionTitle}>
                      Back to Library
                    </Typography>
                  </Grid>
                  <Grid
                    id="dashboard"
                    className={classes.mainOption}
                    item
                    md={2}
                    sm={2}
                    xs={6}
                    onClick={optionHandler}
                  >
                    <DashboardIcon fontSize="large" />
                    <Typography className={classes.optionTitle}>
                      Dashboard
                    </Typography>
                  </Grid>
                  {video.prepared ? (
                    <Grid
                      id="analytics"
                      className={classes.mainOption}
                      item
                      md={2}
                      sm={2}
                      xs={6}
                      onClick={optionHandler}
                    >
                      <DynamicFeedIcon fontSize="large" />
                      <Typography className={classes.optionTitle}>
                        Video Analytics
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid
                      id="analytics"
                      className={classes.mainOption}
                      item
                      md={2}
                      sm={2}
                      xs={6}
                    >
                      <CancelPresentationIcon fontSize="large" />
                      <Typography className={classes.optionTitle}>
                        Unprocessed
                      </Typography>
                    </Grid>
                  )}

                  {video.prepared ? (
                    <Grid
                      id="search"
                      className={classes.mainOption}
                      item
                      md={2}
                      sm={2}
                      xs={6}
                      onClick={optionHandler}
                    >
                      <ImageSearchIcon fontSize="large" />
                      <Typography className={classes.optionTitle}>
                        Search
                      </Typography>
                    </Grid>
                  ) : (
                    <>
                      {video.processing ? (
                        <Grid
                          id="process"
                          className={classes.mainOption}
                          item
                          md={2}
                          sm={2}
                          xs={6}
                        >
                          <AccessTimeIcon fontSize="large" />
                          <Typography className={classes.optionTitle}>
                            Under Processing
                          </Typography>
                        </Grid>
                      ) : (
                        <Grid
                          id="process"
                          className={classes.mainOption}
                          item
                          md={2}
                          sm={2}
                          xs={6}
                          onClick={optionHandler}
                        >
                          <ImageIcon fontSize="large" />
                          <Typography className={classes.optionTitle}>
                            Process Video
                          </Typography>
                        </Grid>
                      )}
                    </>
                  )}
                  <Grid
                    id="enhance"
                    className={classes.mainOption}
                    item
                    md={2}
                    sm={2}
                    xs={6}
                    onClick={optionHandler}
                  >
                    <CameraEnhanceIcon fontSize="large" />
                    <Typography className={classes.optionTitle}>
                      Enhance Video
                    </Typography>
                  </Grid>
                  <Grid
                    id="bookmark"
                    className={classes.mainOption}
                    item
                    md={2}
                    sm={2}
                    xs={6}
                    onClick={optionHandler}
                  >
                    <BookmarksIcon fontSize="large" />
                    <Typography className={classes.optionTitle}>
                      Bookmark Video
                    </Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
          </div>
        </Grid>
        <Grid item md={4} xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Paper square>
                {Object.keys(video).length > 0 && (
                  <CamDisplay
                    location={video.location_id}
                    camera={camera}
                    setCamera={setCamera}
                  />
                )}
              </Paper>
            </Grid>
            <Grid
              id="time"
              className={classes.option}
              item
              xs={3}
              onClick={optionHandler}
            >
              <EditIcon />
              <Typography className={classes.optionTitle}>
                Edit Timestamp
              </Typography>
            </Grid>
            <Grid
              id="locate"
              className={classes.option}
              item
              xs={3}
              onClick={optionHandler}
            >
              <MyLocationIcon />
              <Typography className={classes.optionTitle}>
                Locate Camera
              </Typography>
            </Grid>
            <Grid
              id="edit"
              className={classes.option}
              item
              xs={3}
              onClick={optionHandler}
            >
              <EditLocationIcon />
              <Typography className={classes.optionTitle}>
                Edit Location
              </Typography>
            </Grid>
            <Grid
              id="delete"
              className={classes.option}
              item
              xs={3}
              onClick={optionHandler}
            >
              <ClearIcon />
              <Typography className={classes.optionTitle}>
                Delete Video
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.mapContainer}>
                <CamMap
                  width="100%"
                  height="30vh"
                  viewState={viewState}
                  onViewStateChange={handleChangeViewState}
                  libraries={Object.keys(camera).length > 0 ? [camera] : []}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Play;
