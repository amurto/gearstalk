import React, { useState, useEffect, useRef, useContext } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ImageIcon from "@material-ui/icons/Image";
import ReactPlayer from "react-player";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../utils/LoadingSpinner";

interface Props {
  timestamp: number;
  video_id: string;
}

const ImageDialog: React.FC<Props> = ({ timestamp, video_id }) => {
  const [open, setOpen] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [video, setVideo] = useState<{ [key: string]: any }>({});
  const playerRef = useRef(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/video/getvideobyid/" + video_id,
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
    if (open) {
      fetchVideo();
      console.log(timestamp);
    }
  }, [auth.token, sendRequest, open, timestamp, video_id]);


  useEffect(() => {
    if (Object.keys(video).length > 0 && playerRef && playerRef.current) {
      console.log(timestamp);
      playerRef.current.seekTo(timestamp, "seconds");
    }
  }, [video, timestamp]);

  return (
    <>
      <Button
        startIcon={<ImageIcon />}
        style={{ width: "60%" }}
        onClick={handleClickOpen}
      >
        Image
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Person Captured"}</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {Object.keys(video).length > 0 && (
                <ReactPlayer
                  controls
                  style={{ boxShadow: "-3px 6px 34px 6px rgba(18,25,41,1)" }}
                  url={`${process.env.REACT_APP_BACKEND_URL}/helpers/video/${video.file_id}`}
                  // light={`${process.env.REACT_APP_BACKEND_URL}/helpers/file/${video.thumbnail_id}`}
                  playing
                  pip
                  width="100%"
                  ref={(player) => {
                    playerRef.current = player;
                  }}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageDialog;
