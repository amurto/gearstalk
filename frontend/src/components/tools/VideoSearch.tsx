import React, { useState } from "react";
import { Grid, IconButton, Popover } from "@material-ui/core";
import DateRangeIcon from "@material-ui/icons/DateRange";
import CancelIcon from "@material-ui/icons/Cancel";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

interface Props {
  setVideos: React.Dispatch<
    React.SetStateAction<
      {
        [key: string]: any;
      }[]
    >
  >;
  duration: string;
  time: string;
  date: string;
  thumbnail_id: string;
  name: string;
  id: string;
  thumbnailClass: string;
  minDate: Date;
  maxDate: Date;
  startDate: any;
  endDate: any;
}

const VideoSearch: React.FC<Props> = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartDateChange = (date) => {
    console.log(date);
    props.setVideos((v) => {
      let items = v;
      for (let i = 0; i < items.length; i++) {
        if (items[i]._id.$oid === props.id) {
          if (items[i].minDate <= date && date < items[i].endDate) {
            items[i]["startDate"] = date;
            console.log(items[i].startDate);
          } else {
            console.log("invalid date");
          }
        }
      }
      return [...items];
    });
  };

  const handleEndDateChange = (date) => {
    console.log(date);
    props.setVideos((v) => {
      let items = v;
      for (let i = 0; i < items.length; i++) {
        if (items[i]._id.$oid === props.id) {
          if (items[i].startDate < date && date <= items[i].maxDate) {
            items[i]["endDate"] = date;
            console.log(items[i].endDate);
          } else {
            console.log("Invalid Date");
          }
        }
      }
      return [...items];
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Grid item sm={4} xs={6}>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div style={{ padding: "20px" }}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              ampm={false}
              format="yyyy/MM/dd hh:mm:ss"
              label="Start Time"
              value={props.startDate}
              onChange={handleStartDateChange}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div style={{ padding: "20px" }}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              ampm={false}
              format="yyyy/MM/dd hh:mm:ss"
              label="End Time"
              value={props.endDate}
              onChange={handleEndDateChange}
            />
          </MuiPickersUtilsProvider>
        </div>
      </Popover>
      <Grid style={{ padding: "10px" }} container>
        <Grid item xs={12}>
          <img
            className={props.thumbnailClass}
            src={`${process.env.REACT_APP_BACKEND_URL}/helpers/file/${props.thumbnail_id}`}
            alt="thumbnail"
          />
        </Grid>
        <Grid style={{ overflowWrap: "break-word" }} item xs={6}>
          <div style={{ paddingTop: "10px" }}>{props.name}</div>
        </Grid>
        <Grid item xs={3}>
          <IconButton
            aria-label="daterange"
            color="primary"
            onClick={handleClick}
          >
            <DateRangeIcon />
          </IconButton>
        </Grid>
        <Grid item xs={3}>
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              props.setVideos((vids) =>
                vids.filter((vid) => vid._id.$oid !== props.id)
              );
            }}
          >
            <CancelIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VideoSearch;
