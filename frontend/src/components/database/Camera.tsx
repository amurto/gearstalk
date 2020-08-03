import React, { useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../context/auth-context";
import { FlyToInterpolator } from "react-map-gl";
import CamMap from "./CamMap";
import AddCamera from "./AddCamera";
import LoadingSpinner from "../utils/LoadingSpinner";
import UtilDialog from "../utils/UtilDialog";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import {
  Grid,
  Popover,
  Button,
  Typography,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  Fade,
  Paper,
  Popper,
  Tooltip,
} from "@material-ui/core";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import RoomIcon from "@material-ui/icons/Room";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";

declare global {
  interface EventTarget {
    id: any;
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  margin: {
    margin: theme.spacing(1),
  },
  container: {
    padding: "10px",
  },
  typography: {
    padding: theme.spacing(2),
  },
  locationChooser: {
    padding: "10px",
    background: "#2a3f73",
    border: "1px solid #4f619a",
    cursor: "pointer",
    "&:hover": {
      background: "#0a045e",
      border: "1px solid #0a045e",
    },
  },
  verticalContainer: {
    height: "75px",
    position: "relative",
  },
  verticalDiv: {
    textAlign: "center",
    margin: 0,
    position: "absolute",
    top: "50%",
    msTransform: "translateY(-50%)",
    transform: "translateY(-50%)",
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
  locationDetails: {
    padding: "10px",
    background: theme.palette.primary.dark,
    border: "1px solid #4f619a",
  },
  locationAttributes: {
    textAlign: "left",
    marginTop: "15px",
    marginBottom: "15px",
  },
  locationParams: {
    fontSize: "15px",
    color: "#ffffff",
    fontWeight: 500,
  },
  multilineColor: {
    color: "#ffffff",
  },
  mapContainer: {
    boxShadow: "-3px 6px 34px 6px rgba(18,25,41,1)",
    border: "1px solid #4f619a",
    position: "relative",
    marginLeft: "10px",
  },
}));

interface LocationItemProps {
  oid: string;
  name: string;
  latitude: string;
  longitude: string;
  changeCameraHandler: (camera: any) => void;
}

const LocationItem: React.FC<LocationItemProps> = (props) => {
  const classes = useStyles();

  return (
    <Grid
      onClick={() => {
        props.changeCameraHandler(props.oid);
      }}
      className={classes.locationChooser}
      item
      lg={2}
      md={2}
      sm={4}
      xs={6}
    >
      <Grid container>
        <Grid item xs={6}>
          <div className={classes.verticalContainer}>
            <div className={classes.verticalDiv}>
              <LocationOnIcon fontSize="large" />
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
        <div style={{ fontSize: "12px", wordWrap: "break-word" }}>
            {props.name}
          </div>
          <div style={{ marginTop: "5px" }}>
            <span style={{ fontSize: "12px" }}>Lat{" "}:{" "}</span>
            <span style={{ color: "#fff" }}>
              {parseFloat(props.latitude).toFixed(3)}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "12px" }}>Lon{" "}:{" "}</span>
            <span style={{ color: "#fff" }}>
              {parseFloat(props.longitude).toFixed(3)}
            </span>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

interface LocationPopoverProps {
  id: string | undefined;
  open: boolean;
  locationData: { [key: string]: any }[];
  setLocationData: React.Dispatch<
    React.SetStateAction<
      {
        [key: string]: any;
      }[]
    >
  >;
  anchorEl;
  handleClose: () => void;
  setCamera: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    } | null>
  >;
  changeCameraHandler: (camera: any) => void;
}

const LocationPopover: React.FC<LocationPopoverProps> = (props) => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const [searchText, setSearchText] = useState<string>("");
  const [searchData, setSearchData] = useState<{ [key: string]: any }[]>();

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    if (props.open && props.locationData) {
      setSearchData(props.locationData);
    }
  }, [props.open, props.locationData]);

  const [anchorMenu, setAnchorMenu] = React.useState(null);

  const handleClickMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  const searchHandler = (event) => {
    setSearchText(event.target.value);
    let search = event.target.value;
    let items = props.locationData;
    if (search) {
      let filterItems: { [key: string]: any }[] = [];
      for (let i = 0; i < items.length; i++) {
        if (
          items[i].formatted_address
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          items[i].latitude.toString().includes(search) ||
          items[i].longitude.toString().includes(search)
        ) {
          filterItems.push(items[i]);
        }
      }
      setSearchData(filterItems);
    } else {
      setSearchData(items);
    }
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const deleteAllCameraHandler = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/cctv/deleteallcctv",
        "DELETE",
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      console.log(responseData);
      props.setLocationData([]);
      props.setCamera(null);
    } catch (err) {
      console.log(err.message);
    }
    handleDeleteClose();
    handleCloseMenu();
  };

  return (
    <Popover
      id={props.id}
      open={props.open}
      anchorEl={props.anchorEl}
      onClose={props.handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <UtilDialog
        open={deleteOpen}
        title="Delete Camera?"
        operationHandler={deleteAllCameraHandler}
        handleClose={handleDeleteClose}
      >
        This will delete all camera and their details from the database. Please
        confirm if you want to delete all the CCTV cameras.
      </UtilDialog>
      <Grid container>
        <Grid item md={10} sm={8}>
          <TextField
            fullWidth
            className={classes.margin}
            style={{ width: "90%" }}
            id="input-with-icon-textfield"
            label="Search"
            value={searchText}
            onChange={searchHandler}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid style={{ textAlign: "right" }} item md={1} sm={2}>
          <IconButton
            aria-label="options"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClickMenu}
          >
            <SettingsIcon style={{ color: "#fff" }} />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorMenu}
            keepMounted
            open={Boolean(anchorMenu)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleDeleteOpen}>Delete All</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Close</MenuItem>
          </Menu>
        </Grid>
        <Grid style={{ textAlign: "right" }} item md={1} sm={2}>
          <IconButton aria-label="close" onClick={props.handleClose}>
            <CloseIcon style={{ color: "#fff" }} />
          </IconButton>
        </Grid>
      </Grid>
      <Grid
        style={{ overflowY: "auto", height: "80vh", minWidth: "60vw" }}
        container
      >
        {searchData &&
          searchData.map((location, index) => (
            <LocationItem
              key={index}
              oid={location._id.$oid}
              latitude={location.latitude}
              longitude={location.longitude}
              name={location.formatted_address}
              changeCameraHandler={props.changeCameraHandler}
            />
          ))}
      </Grid>
    </Popover>
  );
};

interface EditPopperProps {
  open: boolean;
  camera: {
    [key: string]: any;
  } | null;
  anchorEl: null;
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationData: React.Dispatch<
    React.SetStateAction<
      {
        [key: string]: any;
      }[]
    >
  >;
  setCamera: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    } | null>
  >;
}

const EditPopper: React.FC<EditPopperProps> = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [success, setSuccess] = useState(false);
  const [newCamera, setNewCamera] = useState<{ [key: string]: string }>({
    oid: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (props.open && props.camera) {
      setNewCamera({
        oid: props.camera._id.$oid,
        latitude: props.camera.latitude.toString(),
        longitude: props.camera.longitude.toString(),
      });
    } else {
      setNewCamera({
        oid: "",
        latitude: "",
        longitude: "",
      });
    }
  }, [props.open, props.camera]);

  useEffect(() => {
    if (props.open) {
      setSuccess(false);
    }
  }, [props.open]);

  const { error, sendRequest, clearError } = useHttpClient();

  const updateHandler = async () => {
    if (newCamera.oid && newCamera.latitude && newCamera.longitude) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/cctv/updatecctv",
          "PATCH",
          JSON.stringify({
            oid: newCamera.oid,
            lat: parseFloat(newCamera.latitude),
            lon: parseFloat(newCamera.longitude),
          }),
          {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + auth.token
          }
        );
        console.log(responseData);
        props.setLocationData((location) => {
          let items = location;
          for (let i = 0; i < items.length; i++) {
            if (props.camera && items[i]._id.$oid === props.camera._id.$oid) {
              items[i] = {
                ...items[i],
                ...responseData,
              };
              break;
            }
          }
          return items;
        });
        props.setCamera({
          ...props.camera,
          ...responseData,
        });
        setSuccess(true);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const clearSuccess = () => {
    props.setEditOpen((prev) => !prev);
  };

  return (
    <Popper
      open={props.open}
      anchorEl={props.anchorEl}
      placement="bottom"
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            {success ? (
              <Alert severity="success" onClose={clearSuccess}>
                <AlertTitle>Success</AlertTitle>
                <span>
                  <strong>Camera</strong>
                </span>{" "}
                location has been succesfully updated.
              </Alert>
            ) : (
              <div>
                {error && (
                  <Alert
                    variant="outlined"
                    style={{ color: "#f44336", marginBottom: "10px" }}
                    severity="error"
                    onClose={clearError}
                  >
                    {error}
                  </Alert>
                )}
                <div style={{ padding: "10px" }}>
                  <TextField
                    InputProps={{ className: classes.multilineColor }}
                    value={newCamera.latitude}
                    type="number"
                    onChange={(event) =>
                      setNewCamera({
                        ...newCamera,
                        latitude: event.target.value,
                      })
                    }
                    label="Latitude"
                  />
                </div>
                <div style={{ padding: "10px" }}>
                  <TextField
                    InputProps={{ className: classes.multilineColor }}
                    value={newCamera.longitude}
                    type="number"
                    onChange={(event) =>
                      setNewCamera({
                        ...newCamera,
                        longitude: event.target.value,
                      })
                    }
                    label="Longitude"
                  />
                </div>
                <Grid style={{ textAlign: "center" }} container>
                  <Grid item xs={6}>
                    <Button
                      disabled={!newCamera.latitude || !newCamera.longitude}
                      onClick={updateHandler}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      onClick={() => {
                        props.setEditOpen((prev) => !prev);
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </div>
            )}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

const Camera: React.FC = () => {
  const auth = useContext(AuthContext);
  const [locationData, setLocationData] = useState<{ [key: string]: any }[]>(
    []
  );
  const [camera, setCamera] = useState<{ [key: string]: any } | null>(null);

  let history = useHistory();

  const {
    isLoading,
    error,
    sendRequest,
    clearError,
    setErrorText,
  } = useHttpClient();

  const [viewState, setViewState] = useState({
    latitude: 19.076,
    longitude: 72.8777,
    zoom: 11,
    pitch: 40.5,
    bearing: 0.7,
  });

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const classes = useStyles();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/cctv/getcctv",
          "GET",
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        setLocationData(responseData);
        if (responseData.length > 0) {
          setCamera(responseData[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchLocations();
  }, [sendRequest, auth.token]);

  const [editEl, setEditEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (event) => {
    setEditEl(event.currentTarget);
    setEditOpen((prev) => !prev);
  };

  const handleChangeViewState = ({ viewState }) => setViewState(viewState);

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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const optionHandler:
    | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
    | undefined = (event) => {
    if (locationData.length === 0 && !camera) {
      setErrorText(
        "No camera found in the database. Start with inserting one."
      );
    } else if (camera) {
      let option = event.target.id;
      switch (option) {
        case "locate":
          handleFlyTo({
            latitude: camera.latitude,
            longitude: camera.longitude,
          });
          break;
        case "edit":
          handleEdit(event);
          break;
        case "change":
          handleClick(event);
          break;
        case "delete":
          handleDeleteOpen();
          break;
        case "video":
          history.push(`/search/cctv/${camera._id.$oid}`);
          break;
        default:
          setErrorText(
            "Some random error occurred. Please have a bit of patience."
          );
      }
    }
  };

  const changeCameraHandler = (camera) => {
    let items = locationData;
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id.$oid === camera) {
        setCamera(items[i]);
        break;
      }
    }
    handleClose();
  };

  const deleteCameraHandler = async () => {
    if (camera) {
      console.log(camera._id.$oid);
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            "/cctv/deletecctv/" +
            camera._id.$oid,
          "DELETE",
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        let items = locationData;
        items = items.filter((item) => item._id.$oid !== camera._id.$oid);
        setLocationData(items);
        if (items.length > 0) {
          setCamera(items[0]);
        } else {
          setCamera(null);
        }
        console.log(responseData);
      } catch (err) {
        setErrorText(err.message);
      }
      handleDeleteClose();
    }
  };

  useEffect(() => {
    if (camera) {
      handleFlyTo({
        latitude: camera.latitude,
        longitude: camera.longitude,
      });
    }
  }, [camera, handleFlyTo]);

  return (
    <React.Fragment>
      <UtilDialog
        open={deleteOpen}
        title="Delete Camera?"
        operationHandler={deleteCameraHandler}
        handleClose={handleDeleteClose}
      >
        This will delete selected camera and its details from the database.
        Please confirm if you want to delete the selected CCTV camera.
      </UtilDialog>
      <Grid className={classes.container} container>
        <Grid item md={6} xs={12}>
          <AddCamera
            setLocationData={setLocationData}
            camera={camera}
            setCamera={setCamera}
          />
          <Grid container>
            <Grid
              id="locate"
              className={classes.option}
              item
              xs={3}
              onClick={optionHandler}
            >
              <RoomIcon />
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
              <EditIcon />
              <Typography className={classes.optionTitle}>
                Edit Details
              </Typography>
            </Grid>
            <EditPopper
              open={editOpen}
              anchorEl={editEl}
              camera={camera}
              setEditOpen={setEditOpen}
              setLocationData={setLocationData}
              setCamera={setCamera}
            />
            <Grid
              aria-describedby={id}
              id="change"
              className={classes.option}
              item
              xs={3}
              onClick={optionHandler}
            >
              <CameraAltIcon />
              <Typography className={classes.optionTitle}>
                Change Camera
              </Typography>
            </Grid>
            <LocationPopover
              id={id}
              open={open}
              anchorEl={anchorEl}
              handleClose={handleClose}
              locationData={locationData}
              setLocationData={setLocationData}
              setCamera={setCamera}
              changeCameraHandler={changeCameraHandler}
            />
            <Grid
              id="delete"
              className={classes.option}
              item
              xs={3}
              onClick={optionHandler}
            >
              <DeleteIcon />
              <Typography className={classes.optionTitle}>Delete</Typography>
            </Grid>
          </Grid>
          <Grid className={classes.locationDetails} container>
            {error && (
              <Alert
                variant="outlined"
                style={{ color: "#f44336", marginBottom: "10px" }}
                severity="error"
                onClose={clearError}
              >
                {error}
              </Alert>
            )}
            {isLoading ? (
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ padding: "30px" }}>
                  <LoadingSpinner />
                </div>
              </Grid>
            ) : (
              <div style={{ width: "100%" }}>
                {locationData.length > 0 ? (
                  <div style={{ padding: "10px", textAlign: "center" }}>
                    {camera && (
                      <Grid container>
                        <Grid style={{ padding: "10px" }} item xs={10}>
                          <Typography variant="h6" gutterBottom>
                            Camera Id #{camera._id.$oid}
                          </Typography>
                        </Grid>
                        <Grid style={{ padding: "10px" }} item xs={2}>
                          <Tooltip title={camera.formatted_address}>
                            <InfoOutlinedIcon fontSize="large" />
                          </Tooltip>
                        </Grid>
                        <Grid
                          className={classes.locationAttributes}
                          item
                          xs={6}
                        >
                          <div>Latitude</div>
                          <div className={classes.locationParams}>
                            {camera.latitude}
                          </div>
                        </Grid>
                        <Grid
                          className={classes.locationAttributes}
                          item
                          xs={6}
                        >
                          <div>Longitude</div>
                          <div className={classes.locationParams}>
                            {camera.longitude}
                          </div>
                        </Grid>
                        <Grid
                          className={classes.locationAttributes}
                          item
                          xs={6}
                        >
                          <div>Country</div>
                          <div className={classes.locationParams}>
                            {camera.country}
                          </div>
                        </Grid>
                        <Grid
                          className={classes.locationAttributes}
                          item
                          xs={6}
                        >
                          <div>State</div>
                          <div className={classes.locationParams}>
                            {camera.state}
                          </div>
                        </Grid>
                        <Grid
                          className={classes.locationAttributes}
                          item
                          xs={6}
                        >
                          <div>City</div>
                          <div className={classes.locationParams}>
                            {camera.city}
                          </div>
                        </Grid>
                        <Grid
                          className={classes.locationAttributes}
                          item
                          xs={6}
                        >
                          <div>Sublocality</div>
                          <div className={classes.locationParams}>
                            {camera.sublocality}
                          </div>
                        </Grid>
                      </Grid>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: "30px", textAlign: "center" }}>
                    No Camera in the database. Please add a camera to load
                    details.
                  </div>
                )}
              </div>
            )}
          </Grid>
          <Grid style={{ paddingBottom: "20px" }} container>
            <Grid id="video" className={classes.option} item xs={12} onClick={optionHandler}>
              <VideoLibraryIcon />
              <Typography className={classes.optionTitle}>
                Search All Videos
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <div className={classes.mapContainer}>
            <CamMap
              width="100%"
              height="80vh"
              viewState={viewState}
              onViewStateChange={handleChangeViewState}
              libraries={locationData}
            />
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Camera;
