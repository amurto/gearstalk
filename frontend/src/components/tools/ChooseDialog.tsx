import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import LoadingSpinner from "../utils/LoadingSpinner";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import {
  Grid,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Divider,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import SearchIcon from "@material-ui/icons/Search";
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
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
  selector: {
    background: "#2db1e1",
    color: "#0a045e",
    fontWeight: 600,
  },
}));

interface ChooseItemProps {
  key: string | number;
  index?: string | number;
  oid: string;
  name: string;
  date: string | number;
  time: string | number;
  location_id: string | number;
  file_id: string | number;
  thumbnail_id: string | number;
  duration: string | number;
  prepared: boolean;
  processing: boolean;
  video: string;
  setVideo: React.Dispatch<React.SetStateAction<string>>;
}

const ChooseItem: React.FC<ChooseItemProps> = (props) => {
  const classes = useStyles();
  return (
    <Grid
      item
      xl={4}
      lg={4}
      md={4}
      xs={12}
      sm={12}
      onClick={() => props.setVideo(props.oid)}
      style={{ cursor: "pointer" }}
      className={props.video === props.oid ? classes.selector : ""}
    >
      <img
        style={{ width: "100%" }}
        src={`${process.env.REACT_APP_BACKEND_URL}/helpers/file/${props.thumbnail_id}`}
        alt="thumbnail"
      />
      {props.name}
    </Grid>
  );
};
interface ChooseDialogProps {
  open: boolean;
  setVideoTag: React.Dispatch<React.SetStateAction<string>>;
  handleClose: () => void;
  prepared: boolean;
}

const ChooseDialog: React.FC<ChooseDialogProps> = ({
  open,
  setVideoTag,
  handleClose,
  prepared,
}) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const classes = useStyles();
  const [videoData, setVideoData] = useState<{ [key: string]: any }[]>([]);
  const auth = useContext(AuthContext);
  const [searchData, setSearchData] = useState<{ [key: string]: any }[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/video/getvideo",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        if (prepared)
          responseData = responseData.filter(
            (video) => video.prepared === true
          );
        console.log(responseData);
        setVideoData(responseData);
        setSearchData(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    if (open) {
      fetchVideos();
    }
  }, [open, sendRequest, prepared, auth.token]);
  const clearVideo = () => {
    setVideo(null);
  };

  const searchHandler = (event) => {
    setSearchText(event.target.value);
    let search = event.target.value;
    let items = videoData;
    if (search) {
      let filterItems: { [key: string]: any }[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].name.toLowerCase().includes(search.toLowerCase())) {
          filterItems.push(items[i]);
        }
      }
      setSearchData(filterItems);
    } else {
      setSearchData(items);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date && String(date)!=="Invalid Date") {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    const formattedDate = [year, month, day].join('-');
    setSearchData(videoData.filter((s) => s.date === formattedDate))
    } else if (date === null) 
      setSearchData(videoData);
  }

  const videoSetter = () => {
    video && setVideoTag(video);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"lg"}
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle>
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
        <Grid container>
          <Divider style={{ color: "#ffffff" }} />
          <Grid item md={3} xs={12}>
            <div>
              <Typography
                style={{ fontSize: "20px", color: "#ffffff" }}
                variant="subtitle2"
                gutterBottom
              >
                Choose a Video
              </Typography>
            </div>
          </Grid>
          <Grid item md={3} xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableFuture
                clearable
                format="yyyy/MM/dd"
                label="Date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item md={6} xs={12}>
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
          {searchData && (
            <Grid container spacing={4}>
              {searchData.map((vid, index) => (
                <ChooseItem
                  key={index}
                  index={index}
                  oid={vid._id.$oid}
                  name={vid.name}
                  date={vid.date}
                  time={vid.date}
                  location_id={vid.location_id}
                  file_id={vid.file_id}
                  thumbnail_id={vid.thumbnail_id}
                  duration={vid.duration}
                  processing={vid.processing}
                  prepared={vid.prepared}
                  video={video}
                  setVideo={setVideo}
                />
              ))}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={videoSetter}
          autoFocus
          color="primary"
          disabled={!video}
        >
          Ok
        </Button>
        <Button autoFocus color="primary" onClick={clearVideo}>
          Clear
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChooseDialog;
