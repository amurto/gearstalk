import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import TimeLine from "./TimeLine";
import { Container, Grid, Button, Link, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import LoadingSpinner from "../utils/LoadingSpinner";
function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

interface TabPanelProps {
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && (
        <Box p={1}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};
interface Props {
  results: any[];
}

const TimeStamp: React.FC<Props> = ({ results }) => {
  const classes = useStyles();
  const [value, setValue] = useState<number>(0);
  const [report, setReport] = useState<string>(null);
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const saveReport = async () => {
    try {
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/report/addreport",
        "POST",
        JSON.stringify({
            results: results,
            userId: auth.userId,
            name: name,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        false
      );

      response.blob().then((blob: Blob) => URL.createObjectURL(blob)).then((url: string) => setReport(url))

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const personsFound = () => {
    let f: number = 0;
    results.map((r) => {
      if (r.length > 0) f++;
      return true;
    });
    return f;
  };

  const [name, setName] = useState<string>("");
  const handleName= (event) => setName(event.target.value);

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Overview" {...a11yProps(0)} />
        {results.map((r, i) => (
          <Tab key={i + 1} label={`Person ${i + 1}`} {...a11yProps(i + 1)} />
        ))}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Container>
          <Grid style={{ marginTop: "20px" }} container>
            <Grid item sm={6} xs={12}>
              <div style={{ fontSize: "17px", textAlign: "center" }}>
                Number of persons searched
              </div>
              <div style={{ fontSize: "35px", textAlign: "center" }}>
                {results.length}
              </div>
            </Grid>
            <Grid item sm={6} xs={12}>
              <div style={{ fontSize: "17px", textAlign: "center" }}>
                Number of persons found
              </div>
              <div style={{ fontSize: "35px", textAlign: "center" }}>
                {personsFound()}
              </div>
            </Grid>
            {isLoading && (
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <div style={{ display: "inline-block" }}>
                  <LoadingSpinner />
                </div>
              </Grid>
            )}
            <Grid item sm={4} xs={12}>
              <TextField fullWidth id="standard-basic" value={name} label="Type Report Name" onChange={handleName} />
            </Grid>
            <Grid
              style={{ textAlign: "center", margin: "20px 0px" }}
              item
              sm={4}
              xs={12}
            >
              <Button
                style={{ width: "90%" }}
                variant="contained"
                color="secondary"
                startIcon={<SaveIcon />}
                onClick={saveReport}
                disabled={!!report || !name}
              >
                SAVE & GENERATE REPORT
              </Button>
            </Grid>
            <Grid
              style={{ textAlign: "center", margin: "20px 0px" }}
              item
              sm={4}
              xs={12}
            >
              <Link
                href={report}
                target="_blank"
                rel="noopener"
                underline="none"
              >
                <Button
                  style={{ width: "90%" }}
                  variant="contained"
                  color="secondary"
                  startIcon={<SaveAltIcon />}
                  disabled={!report}
                >
                  VIEW REPORT
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </TabPanel>
      {results.map((r, i) => (
        <TabPanel key={i} value={value} index={i + 1}>
          {r.length > 0 ? (
            <TimeLine data={r} />
          ) : (
            <div
              style={{
                marginTop: "60px",
                textAlign: "center",
                fontSize: "17px",
              }}
            >
              No Person with such features found in the video.
            </div>
          )}
        </TabPanel>
      ))}
    </div>
  );
};

export default TimeStamp;
