import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import TimeLine from "../tools/TimeLine";
import { Container, Grid, Button, Link } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import LoadingSpinner from "../utils/LoadingSpinner";
import DeleteIcon from "@material-ui/icons/Delete";
import UtilDialog from "../utils/UtilDialog";

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
  reportId: string;
  name: string;
  Date: string;
  Time: string;
  deleteReport: (report_id: string) => Promise<void>;
}

const ReportStamp: React.FC<Props> = ({ results, reportId, name, Date, Time, deleteReport }) => {
  const classes = useStyles();
  const [value, setValue] = useState<number>(0);
  const [report, setReport] = useState<string>(null);
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const deleteReportHandler = () => {
    deleteReport(reportId);
    handleClose();
  };

  const generateReport = async () => {
    try {
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          "/report/generatereport/" +
          reportId,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        },
        false
      );
      response.blob().then((blob: Blob) => URL.createObjectURL(blob)).then((url: string) => setReport(url))
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <UtilDialog
        open={open}
        title="Delete Report?"
        handleClose={handleClose}
        operationHandler={deleteReportHandler}
      >
        Please confirm if you want to delete this report from the database. This
        is not recoverable.
      </UtilDialog>
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
            <Grid style={{ fontSize: "30px" }} item xs={12}>
              {name}
            </Grid>
            <Grid style={{ fontSize: "20px" }} item xs={12}>
              {Date}
            </Grid>
            <Grid style={{ fontSize: "20px", marginBottom: "30px" }} item xs={12}>
              {Time}
            </Grid>
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
                onClick={generateReport}
                disabled={!!report}
              >
                GENERATE REPORT
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
            <Grid
              style={{ textAlign: "center", margin: "20px 0px" }}
              item
              sm={4}
              xs={12}
            >
              <Button
                style={{
                  width: "90%",
                  backgroundColor: "#910a0a",
                  color: "#fff",
                }}
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={handleOpen}
              >
                DELETE REPORT
              </Button>
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

export default ReportStamp;
