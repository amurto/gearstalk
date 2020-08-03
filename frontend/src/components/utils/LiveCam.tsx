import React, { useState, useEffect, useContext } from "react";
import {
  makeStyles,
  Grid,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import SearchIcon from "@material-ui/icons/Search";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "./LoadingSpinner";
const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#1c233e",
    borderRadius: 25,
    padding: "20px",
  },
  margin: {
    margin: theme.spacing(1),
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
  button: {
    width: "100%",
    margin: theme.spacing(1),
    textTransform: "none",
    fontFamily: "Trebuchet MS, Helvetica, sans-serif",
    borderRadius: 7,
    fontWeight: 600,
    color: "#1E1E30",
    fontSize: "15px",
    background: "#5ce1e6",
    "&:hover": {
      background: "#ffffff",
    },
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
          <div style={{ fontSize: "12px", wordWrap: "break-word" }}>
            {props.name}
          </div>
          <div style={{ marginTop: "5px" }}>
            <span style={{ fontSize: "12px" }}>Lat : </span>
            <span style={{ color: "#fff" }}>
              {parseFloat(props.latitude).toFixed(3)}
            </span>
          </div>
          <div>
            <span style={{ fontSize: "12px" }}>Lon : </span>
            <span style={{ color: "#fff" }}>
              {parseFloat(props.longitude).toFixed(3)}
            </span>
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
            Authorization: "Bearer " + auth.token,
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

const LiveCam: React.FC = () => {
  const [live, setLive] = useState<boolean>(false);
  const classes = useStyles();
  const [location, setLocation] = useState<{ [key: string]: any }>({});
  const [ip, setIp] = useState<string>("");
  const handleIpChange = (e) => setIp(e.target.value);
  const [open, setOpen] = useState<boolean>(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const liveHandler = () => {
    if (ip) {
      setLive(true);
    }
  };

  return (
    <Grid
      style={{
        padding: "10px",
      }}
      item
      md={6}
      sm={12}
      xs={12}
    >
      <LocationDialog
        open={open}
        handleClose={handleClose}
        setLocation={setLocation}
      />
      <div className={classes.paper}>
        {live ? (
          <div>
            <div style={{ padding: "10px" }}>
              <img src={ip} width="100%" alt="livestream footage" />
            </div>
            <div style={{ padding: "10px" }}>
              <Button className={classes.button} onClick={() => setLive(false)}>
                Stop Feed
              </Button>
            </div>
          </div>
        ) : (
          <Grid container className={classes.chooseLocation}>
            <Grid
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingBottom: "20px",
              }}
              item
              xs={8}
            >
              <TextField
                fullWidth
                label="CCTV IP Address"
                value={ip}
                onChange={handleIpChange}
              />
            </Grid>
            <Grid
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingBottom: "20px",
                textAlign: "center",
              }}
              item
              xs={4}
            >
              <Button
                className={classes.button}
                onClick={liveHandler}
                disabled={!ip || Object.keys(location).length === 0}
              >
                Add Camera
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Paper square className={classes.locationPaper}>
                {Object.keys(location).length > 0 ? (
                  <div style={{ padding: "5px" }}>
                    <div style={{ fontSize: "12px" }}>Latitude</div>
                    <div style={{ color: "#fff" }}>{location.latitude}</div>
                    <div style={{ fontSize: "12px" }}>Longitude</div>
                    <div style={{ color: "#fff" }}>{location.longitude}</div>
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
        )}
      </div>
    </Grid>
  );
};

export default LiveCam;
