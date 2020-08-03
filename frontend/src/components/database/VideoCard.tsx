import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { Link } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import UtilDialog from "../utils/UtilDialog";
import {
  Card,
  CardContent,
  CardMedia,
  Menu,
  MenuItem,
  Grid,
  IconButton,
  Typography,
  Tooltip,
} from "@material-ui/core";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    background: "#2a3f73",
    border: "1px solid #4f619a",
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

interface Props {
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
  processing: boolean
  videoDeletor: (oid: string) => void;
}

const VideoCard: React.FC<Props> = (props) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  // eslint-disable-next-line
  const { sendRequest } = useHttpClient();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const deleteVideoHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/video/deletevideo/" + props.oid,
        "DELETE",
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
    } catch (err) {
      console.log(err);
    }
    handleDeleteClose();
    handleClose();
    props.videoDeletor(props.oid);
  };

  return (
    <Grid item xl={4} lg={4} md={4} xs={12} sm={12}>
      <UtilDialog
        open={deleteOpen}
        title="Delete Video?"
        operationHandler={deleteVideoHandler}
        handleClose={handleDeleteClose}
      >
        This will delete this video and its details from the database. Please
        confirm if you want to delete the video.
      </UtilDialog>
      <Card square className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {props.name.length > 10 ? `${props.name.substr(0,10)}...` : props.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {props.duration}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {props.prepared ? "Processed" : "Unprocessed"}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <Tooltip title={props.name}>
              <IconButton aria-label="info">
                <InfoOutlinedIcon className={classes.optionIcon} />
              </IconButton>
            </Tooltip>
            <Link to={`/play/${props.oid}`}>
              <IconButton aria-label="play">
                <PlayCircleOutlineIcon className={classes.playIcon} />
              </IconButton>
            </Link>
            <IconButton onClick={handleClick} aria-label="options">
              <SettingsIcon className={classes.optionIcon} />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
              {/* <MenuItem onClick={handleClose}>Camera</MenuItem>
              {!props.prepared && (
                <MenuItem onClick={handleClose}>Process</MenuItem>
              )}
              {props.prepared && (
                <MenuItem onClick={handleClose}>Search</MenuItem>
              )} */}
              <MenuItem onClick={handleClose}>Close</MenuItem>
            </Menu>
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={`${process.env.REACT_APP_BACKEND_URL}/helpers/file/${props.thumbnail_id}`}
          title={props.name}
        />
      </Card>
    </Grid>
  );
};

export default VideoCard;
