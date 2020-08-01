import React, { useState, useContext } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { useAttribute } from "../context/attribute-context";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
    },
  },
  button: {
    marginTop: "5px",
    marginLeft: "5px",
    width: "100%",
    textTransform: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    padding: "4px 10px",
    border: "1px solid #2bd1e1",
  },
}));

const QueryField: React.FC = () => {
  const classes = useStyles();
  const { sendRequest } = useHttpClient();
  const [value, setValue] = useState<string>("");
  // eslint-disable-next-line
  const [{ attributes }, dispatch] = useAttribute();
  const auth = useContext(AuthContext);
  const handleChange: (event: any) => void = (event) => {
    setValue(event.target.value);
  };

  const sendQuery = async () => {
    console.log(value);
    if (value) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/query/text_search",
          "POST",
          JSON.stringify({
            text: value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData);
        dispatch({
          type: "addWholePerson",
          labels: responseData.labels,
          colors: responseData.colors,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <React.Fragment>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            id="outlined-multiline-static"
            label="Type your query"
            multiline
            rows="4"
            fullWidth
            variant="outlined"
            value={value}
            onChange={handleChange}
          />
        </div>
      </form>
      <Grid container spacing={1}>
        <Grid item sm={11} xs={10}>
          <Button
            className={classes.button}
            endIcon={<Icon>send</Icon>}
            onClick={sendQuery}
          >
            SEND
          </Button>
        </Grid>
        <Grid item sm={1} xs={2}>
          <IconButton aria-label="voice">
            <KeyboardVoiceIcon color="primary" />
          </IconButton>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default QueryField;
