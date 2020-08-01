import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import uuid from "uuid";
import Cropper from "./Cropper";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import PhotoIcon from "@material-ui/icons/Photo";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import CropIcon from "@material-ui/icons/Crop";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import CaptureDialog from "./CaptureDialog";
import { useAttribute } from "../context/attribute-context";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  input: {
    // display: 'none',
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  tryButton: {
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
  videoCapture: {
    width: "100%",
    textTransform: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    padding: "10px 10px",
    border: "1px solid #2bd1e1",
  },
}));

type Image = { id: string; src: string | ArrayBuffer | null };

interface ImageItemProps {
  imageDeleteHandler: (id: string) => void;
  imageCropHandler: (id: string, result: string | ArrayBuffer | null) => void;
  key: string;
  id: string;
  index: number;
  src: string | ArrayBuffer | null;
}

const ImageItem: React.FC<ImageItemProps> = (props) => {
  const classes = useStyles();
  const [fullWidth, setFullWidth] = useState<boolean>(true);
  const [maxWidth, setMaxWidth] = useState<
    false | "md" | "xs" | "sm" | "lg" | "xl" | undefined
  >("md");
  const [show, setShow] = useState<boolean>(false);

  const openModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  // eslint-disable-next-line
  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  // eslint-disable-next-line
  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  const [croppedSrc, setCroppedSrc] = useState(props.src);

  const setCropHandler = () => {
    props.imageCropHandler(props.id, croppedSrc);
    closeModal();
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={show}
        onClose={closeModal}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={closeModal}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Crop
            </Typography>
            <Button autoFocus color="inherit" onClick={setCropHandler}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Cropper
            src={props.src}
            croppedSrc={croppedSrc}
            setCroppedSrc={setCroppedSrc}
          />
        </div>
      </Dialog>
      <Grid container spacing={0}>
        <Grid
          item
          xs={6}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img height="80" width="80" src={String(props.src)} alt="ImageSrc" />
        </Grid>
        <Grid item xs={3}>
          <IconButton
            aria-label="crop"
            className={classes.margin}
            onClick={openModal}
          >
            <CropIcon color="primary" fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item xs={3}>
          <IconButton
            aria-label="delete"
            className={classes.margin}
            onClick={() => {
              props.imageDeleteHandler(props.id);
            }}
          >
            <CloseIcon color="primary" fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      <hr></hr>
    </React.Fragment>
  );
};

interface ImageListProps {
  items: Image[];
  imageDeleteHandler: (id: string) => void;
  imageCropHandler: (id: string, result: string | ArrayBuffer | null) => void;
}

const ImageList: React.FC<ImageListProps> = (props) => {
  return (
    <div style={{ marginTop: "20px" }}>
      {props.items.map((image: Image, index: number) => (
        <ImageItem
          imageDeleteHandler={props.imageDeleteHandler}
          imageCropHandler={props.imageCropHandler}
          key={image.id}
          id={image.id}
          index={index}
          src={image.src}
        />
      ))}
    </div>
  );
};

const ImageCrop: React.FC = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  // eslint-disable-next-line
  const [{ attributes }, dispatch] = useAttribute();
  const { sendRequest } = useHttpClient();
  const [imgSrc, setImgSrc] = useState<Image[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const imagePushHandler = (result: string | ArrayBuffer | null) => {
    setImgSrc([...imgSrc, { id: uuid(), src: result }]);
    console.log(imgSrc);
  };

  const imageDeleteHandler = (id: string) => {
    setImgSrc(imgSrc.filter((img) => img.id !== id));
  };

  const imageCropHandler = (
    id: string,
    result: string | ArrayBuffer | null
  ) => {
    let newImg = imgSrc;
    for (let i = 0; i < newImg.length; i++) {
      if (newImg[i].id === id) {
        newImg[i].id = uuid();
        newImg[i].src = result;
      }
    }
    setImgSrc([...newImg]);
  };

  const onSelectFile:
    | ((event: React.ChangeEvent<HTMLInputElement>) => void)
    | undefined = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      // ImageSetter(null);
      reader.addEventListener("load", () => {
        imagePushHandler(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const BASE64_MARKER = ";base64,";

  function DataToFile(dataURI) {
    const mime = dataURI.split(BASE64_MARKER)[0].split(":")[1];
    const filename = "dataURI-file-" + uuid() + "." + mime.split("/")[1];
    const bytes = atob(dataURI.split(BASE64_MARKER)[1]);
    const writer = new Uint8Array(new ArrayBuffer(bytes.length));

    for (let i = 0; i < bytes.length; i++) {
      writer[i] = bytes.charCodeAt(i);
    }

    return new File([writer.buffer], filename, { type: mime });
  }

  const imageProcessor = async () => {
    if (imgSrc.length === 0) return;

    try {
      const formData = new FormData();
      imgSrc.map((img, i) => formData.append("files", DataToFile(img.src)));
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/process/processcropped",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(responseData);
      responseData.features.map((r, i) =>
        dispatch({
          type: "addWholePerson",
          labels: r.labels,
          colors: r.colors,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <CaptureDialog
        open={open}
        handleClose={handleClose}
        imagePushHandler={imagePushHandler}
      />
      <Button
        className={classes.videoCapture}
        component="span"
        onClick={handleClickOpen}
      >
        <PlayCircleFilledIcon /> &nbsp; CAPTURE FRAME FROM VIDEO
      </Button>
      <ImageList
        items={imgSrc}
        imageDeleteHandler={imageDeleteHandler}
        imageCropHandler={imageCropHandler}
      />
      <Grid
        container
        spacing={0}
        style={{ marginTop: "30px", marginBottom: "30px" }}
      >
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          item
          xs={6}
        >
          <input
            accept="image/*"
            className={classes.input}
            style={{ display: "none" }}
            id="raised-button-file"
            onChange={onSelectFile}
            type="file"
          />
          <label htmlFor="raised-button-file">
            <Button className={classes.tryButton} component="span">
              <PhotoIcon /> &nbsp; ADD IMAGE
            </Button>
          </label>
        </Grid>
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          item
          xs={6}
        >
          {imgSrc.length > 0 && (
            <Button
              className={classes.tryButton}
              component="span"
              onClick={imageProcessor}
            >
              <NoteAddIcon /> &nbsp; GENERATE
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ImageCrop;
