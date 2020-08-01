import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddBoxIcon from "@material-ui/icons/AddBox";
import LoadingSpinner from "../utils/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "15px",
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightRegular,
  },
  textPicker: {
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px",
    marginTop: "0px",
  },
  multilineColor: {
    color: "#ffffff",
  },
}));

interface Props {
  camera: { [key: string]: any } | null;
  setCamera: React.Dispatch<
    React.SetStateAction<{ [key: string]: any } | null>
  >;
  setLocationData: React.Dispatch<
    React.SetStateAction<
      {
        [key: string]: any;
      }[]
    >
  >;
}

const AddCamera: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const auth = useContext(AuthContext);
  const [location, setLocation] = useState<{
    latitude: string;
    longitude: string;
  }>({
    latitude: "",
    longitude: "",
  });

  const {
    isLoading,
    error,
    sendRequest,
    clearError,
    setErrorText,
  } = useHttpClient();

  const insertHandler = async () => {
    if (location.latitude && location.longitude) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/cctv/addcctv",
          "POST",
          JSON.stringify({
            lat: parseFloat(location.latitude),
            lon: parseFloat(location.longitude),
          }),
          {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + auth.token
          }
        );
        console.log(responseData);
        props.setLocationData((location) => {
          return [...location, responseData[0]];
        });
        if (!props.camera) {
          props.setCamera(responseData[0]);
        }
        setLocation({
          latitude: "",
          longitude: "",
        });
        clearError();
        setSuccess(true);
      } catch (err) {
        setSuccess(false);
        console.log(err.message);
      }
    } else {
      setSuccess(false);
      setErrorText("Provided fields are empty.");
    }
  };

  const clearSuccess = () => {
    setSuccess(false);
  };

  return (
    <div className={classes.root}>
      {success && (
        <Alert severity="success" onClose={clearSuccess}>
          <AlertTitle>Success</AlertTitle>
          <span>
            <strong>Camera</strong>
          </span>{" "}
          location has been succesfully added.
        </Alert>
      )}
      {error && (
        <Alert
          style={{ marginBottom: "10px" }}
          severity="error"
          onClose={clearError}
        >
          {error}
        </Alert>
      )}
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon style={{ color: "#ffffff" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Add Camera</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {isLoading ? (
            <Grid container className={classes.loader}>
              <LoadingSpinner />
            </Grid>
          ) : (
            <Grid container>
              <Grid className={classes.textPicker} item xs={5}>
                <TextField
                  InputProps={{ className: classes.multilineColor }}
                  value={location.latitude}
                  type="number"
                  onChange={(event) =>
                    setLocation({
                      ...location,
                      latitude: event.target.value,
                    })
                  }
                  label="Latitude"
                />
              </Grid>
              <Grid className={classes.textPicker} item xs={5}>
                <TextField
                  InputProps={{ className: classes.multilineColor }}
                  value={location.longitude}
                  type="number"
                  onChange={(event) =>
                    setLocation({
                      ...location,
                      longitude: event.target.value,
                    })
                  }
                  label="Longitude"
                />
              </Grid>
              <Grid style={{ textAlign: "center" }} item xs={1}>
                <IconButton
                  color="primary"
                  disabled={!location.latitude || !location.longitude}
                  onClick={insertHandler}
                >
                  <AddBoxIcon fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default AddCamera;
