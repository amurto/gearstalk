import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import ChooseDialog from "./ChooseDialog";
import ReactPlayer from "react-player";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import { captureVideoFrame } from "../utils/utils";

const useStyles = makeStyles((theme) => ({
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
  playIcon: {
    fontSize: "100px",
  },
}));

interface Props {
  open: boolean;
  handleClose: () => void;
  imagePushHandler: (result: string | ArrayBuffer | null) => void;
}

const CaptureDialog: React.FC<Props> = ({ open, handleClose, imagePushHandler }) => {
  const classes = useStyles();
  const [video, setVideo] = useState<{ [key: string]: any }>({});
  const [choose, setChoose] = useState<boolean>(false);
  const [videoTag, setVideoTag] = useState<string>("");
  const handleCloseChoose = () => setChoose(false);
  const handleOpenChoose = () => setChoose(true);
  const playerRef = useRef(null);
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  useEffect(() => {
    if (videoTag) {
      const fetchVideo = async () => {
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL +
              "/video/getvideobyid/" +
              videoTag,
            "GET",
            null,
            {
              Authorization: "Bearer " + auth.token,
            }
          );
          setVideo(responseData);
        } catch (err) {
          console.log(err);
        }
      };
      fetchVideo();
      handleCloseChoose();
    }
  }, [videoTag, auth.token, sendRequest]);
  const getFrame = () => {
    const frame = captureVideoFrame(
      playerRef.current.getInternalPlayer(),
      "jpeg",
      0.92
    );
    if (frame) imagePushHandler(frame.dataUri);
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <ChooseDialog
        open={choose}
        setVideoTag={setVideoTag}
        handleClose={handleCloseChoose}
        prepared={false}
      />
      <DialogTitle id="alert-dialog-title">{"Capture Frame"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {Object.keys(video).length > 0 && (
              <ReactPlayer
                ref={(player) => {
                  playerRef.current = player;
                }}
                controls
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
            )}
          </Grid>
          <Grid item sm={6} xs={12}>
            <Button className={classes.button} onClick={handleOpenChoose}>
              Choose Video
            </Button>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Button
              className={classes.button}
              onClick={getFrame}
              disabled={Object.keys(video).length === 0}
            >
              Capture Frame
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CaptureDialog;
