import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import axios from "axios";
import { useHttpClient } from "../hooks/http-hook";
import DateFnsUtils from "@date-io/date-fns";
import MagicDropzone from "react-magic-dropzone";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import LoadingSpinner from "../utils/LoadingSpinner";
import {
  Grid,
  Button,
  Paper,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import CancelIcon from "@material-ui/icons/Cancel";
import upload from "./upload.svg";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import SearchIcon from "@material-ui/icons/Search";

import "./Upload.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  margin: {
    margin: theme.spacing(1),
  },
  container: {
    padding: "30px",
  },
  dropzone: {
    margin: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "2px dashed #1c233e",
    height: "100%",
    padding: "16px 11px",
    borderRadius: "5px",
  },
  dropzoneContainer: {
    textAlign: "center",
  },
  browseButton: {
    textTransform: "none",
    backgroundColor: "#1273eb",
    color: "#fff",
    padding: "10px",
    paddingLeft: "15px",
    paddingRight: "15px",
    "&:hover": {
      backgroundColor: "#0a045e",
    },
  },
  drag: {
    color: "#000",
    fontSize: "20px",
    fontWeight: 500,
  },
  or: {
    color: "#0a045e",
    fontSize: "15px",
    fontWeight: 400,
  },
  filePaper: {
    background: "#2a3f73",
    border: "1px solid #4f619a",
  },
  verticalText: {
    minHeight: "60px",
    lineHeight: "60px",
    textAlign: "center",
  },
  verticalSpan: {
    display: "inline-block",
    verticalAlign: "middle",
    lineHeight: "normal",
  },
  chooseLocation: {
    padding: "20px",
  },
  locationPaper: {
    height: "100%",
    background: "#2a3f73",
    border: "1px solid #4f619a",
  },
  locationButton: {
    paddingBottom: "10px",
    background: "#2a3f73",
    border: "1px solid #4f619a",
    textAlign: "center",
    cursor: "pointer",
    "&:hover": {
      background: "#0a045e",
      border: "1px solid #0a045e",
    },
  },
  uploadButton: {
    width: "100%",
    background: "#30a3f2",
    "&:hover": {
      background: "#0a045e",
      color: "#fff",
    },
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
  loader: {
    paddingTop: "50px",
    paddingBottom: "50px",
  },
  progressContainer: {
    height: "50px",
    position: "relative",
  },
  progressDiv: {
    margin: 0,
    position: "absolute",
    top: "50%",
    msTransform: "translateY(-50%)",
    transform: "translateY(-50%)",
  },
}));

interface LocationItemProps {
  key: number;
  oid: string;
  latitude: string;
  longitude: string;
  name: string;
  setLocation: React.Dispatch<
    React.SetStateAction<
      | {
          [key: string]: any;
        }
      | undefined
    >
  >;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const LocationItem: React.FC<LocationItemProps> = (props) => {
  const classes = useStyles();

  const changeLocation = () => {
    props.setLocation({
      oid: props.oid,
      latitude: props.latitude,
      longitude: props.longitude,
      name: props.name,
    });
    props.setTitle(props.name);
  };

  return (
    <Grid
      className={classes.locationChooser}
      onClick={changeLocation}
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
          <div style={{ fontSize: "12px" }}>Latitude</div>
          <div style={{ color: "#fff" }}>
            {parseFloat(props.latitude).toFixed(3)}
          </div>
          <div style={{ fontSize: "12px" }}>Longitude</div>
          <div style={{ color: "#fff" }}>
            {parseFloat(props.longitude).toFixed(3)}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

interface LocationDialogProps {
  open: boolean;
  setLocation: React.Dispatch<
    React.SetStateAction<
      | {
          [key: string]: any;
        }
      | undefined
    >
  >;
  handleClose: () => void;
}

const LocationDialog: React.FC<LocationDialogProps> = (props) => {
  const classes = useStyles();
  const [locationData, setLocationData] = useState<{ [key: string]: any }[]>(
    []
  );
  const auth = useContext(AuthContext);
  const [searchData, setSearchData] = useState<{ [key: string]: any }[]>([]);
  const [title, setTitle] = useState<string>("Choose a Location");
  const [searchText, setSearchText] = useState<string>("");

  // eslint-disable-next-line
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
        setSearchData(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    if (props.open) {
      fetchLocations();
    }
  }, [props.open, sendRequest, auth.token]);

  const clearLocation = () => {
    props.setLocation({});
    setTitle("Choose a Location");
  };

  const searchHandler = (event) => {
    setSearchText(event.target.value);
    let search = event.target.value;
    let items = locationData;
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

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"lg"}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle>
        <Grid container>
          <Grid item md={8} xs={12}>
            {title}
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              className={classes.margin}
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
        </Grid>
      </DialogTitle>
      <DialogContent>
        {isLoading && (
          <div className={classes.loader}>
            <LoadingSpinner />
          </div>
        )}
        <Grid container>
          {searchData &&
            searchData.map((location, index) => (
              <LocationItem
                key={index}
                oid={location._id.$oid}
                latitude={location.latitude}
                longitude={location.longitude}
                name={location.formatted_address}
                setLocation={props.setLocation}
                setTitle={setTitle}
              />
            ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={clearLocation} color="primary">
          Clear
        </Button>
        <Button onClick={props.handleClose} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Upload: React.FC = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [location, setLocation] = useState<{ [key: string]: any }>();
  const [open, setOpen] = useState<boolean>(false);
  const { error, clearError, setErrorText } = useHttpClient();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDrop = (accepted, rejected, links) => {
    if (accepted && accepted.length > 0) {
      setVideoFile(null);
      console.log(accepted[0]);
      setVideoFile(accepted[0]);
    }
  };

  const clearVideoFile = () => {
    setVideoFile(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const uploadHandler = () => {
    if (
      videoFile &&
      selectedDate &&
      location
    ) {
      setUploading(true);
      setProgress(0);
      
      const headers = {
        Authorization: 'Bearer ' + auth.token
      };

      const config = {
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
        headers: headers
      };


      let data = new FormData();
      data.append("video", videoFile);
      data.append("time", String(selectedDate));
      data.append("location", location.oid);

      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "/video/addvideo",
          data,
          config
        )
        .then((res) => {
          console.log("Video Uploaded")
          console.log(res);
          clearError();
          setLocation(undefined);
          setVideoFile(null);
          setSuccess(true);
        })
        .catch((err) => {
          setErrorText(err.message);
          setUploading(false);
        });
    } else {
      setErrorText("Fields are empty! Please recheck provided params.");
    }
  };

  const clearSuccess = () => {
    setUploading(false);
    setSuccess(false);
    setProgress(0);
  };

  return (
    <React.Fragment>
      <LocationDialog
        open={open}
        handleClose={handleClose}
        setLocation={setLocation}
      />
      <div className={classes.container}>
        <Paper square>
          <Grid container>
            <Grid
              style={{ backgroundColor: "#d6dffe" }}
              item
              md={7}
              sm={12}
              xs={12}
            >
              <div>
                <MagicDropzone
                  className={classes.dropzone}
                  accept="video/mp4, video/x-m4v, video/*"
                  multiple={false}
                  onDrop={onDrop}
                >
                  <div className={classes.dropzoneContainer}>
                    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
                      <img width="100" src={upload} alt="upload" />
                      <p className={classes.drag}>Drag and drop videos here</p>
                      <p className={classes.or}>or</p>
                      <Button className={classes.browseButton}>
                        Browse Videos
                      </Button>
                    </div>
                  </div>
                </MagicDropzone>
              </div>
            </Grid>
            <Grid item md={5} sm={12} xs={12}>
              <div style={{ padding: "20px" }}>
                <Paper className={classes.filePaper} variant="outlined" square>
                  {videoFile ? (
                    <Grid container>
                      <Grid className={classes.verticalText} item xs={10}>
                        <span className={classes.verticalSpan}>
                          {videoFile.name}
                        </span>
                      </Grid>
                      <Grid className={classes.verticalText} item xs={2}>
                        <IconButton aria-label="clear" onClick={clearVideoFile}>
                          <CancelIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container>
                      <Grid className={classes.verticalText} item xs={12}>
                        No video uploaded
                      </Grid>
                    </Grid>
                  )}
                </Paper>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Typography variant="h5" style={{ color: "#758cd1" }}>
                      Date
                    </Typography>
                    <KeyboardDateTimePicker
                      variant="inline"
                      ampm={false}
                      label="Select Date and Timestamp"
                      value={selectedDate}
                      onChange={handleDateChange}
                      onError={console.log}
                      format="yyyy/MM/dd HH:mm"
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
              <div>
                <Grid container className={classes.chooseLocation}>
                  <Grid item xs={6}>
                    <Paper square className={classes.locationPaper}>
                      {location ? (
                        <div style={{ padding: "5px" }}>
                          <div style={{ fontSize: "12px" }}>Latitude</div>
                          <div style={{ color: "#fff" }}>
                            {location.latitude}
                          </div>
                          <div style={{ fontSize: "12px" }}>Longitude</div>
                          <div style={{ color: "#fff" }}>
                            {location.longitude}
                          </div>
                        </div>
                      ) : (
                        <Typography
                          style={{
                            marginTop: "14%",
                            fontSize: "18px",
                            textAlign: "center",
                          }}
                        >
                          No Location selected
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      square
                      className={classes.locationButton}
                      onClick={handleClickOpen}
                    >
                      <div style={{ margin: "10px" }}>
                        <MyLocationIcon fontSize="large" />
                      </div>
                      Choose Location
                    </Paper>
                  </Grid>
                </Grid>
              </div>
              <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
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
                {success && (
                  <Alert severity="success" onClose={clearSuccess}>
                    <AlertTitle>Success</AlertTitle>
                    <span>
                      <strong>Camera</strong>
                    </span>{" "}
                    location has been succesfully updated.
                  </Alert>
                )}
              </div>
              {uploading && (
                <Grid style={{ padding: "20px" }} container>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Uploading Video {progress} %
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="cssProgress">
                      <div className="progress4">
                        <div
                          className="cssProgress-bar cssProgress-glow-active cssProgress-lg"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              )}
              <div
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="default"
                  className={classes.uploadButton}
                  startIcon={<CloudUploadIcon />}
                  onClick={uploadHandler}
                  disabled={uploading}
                >
                  Upload
                </Button>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </React.Fragment>
  );
};

export default Upload;
