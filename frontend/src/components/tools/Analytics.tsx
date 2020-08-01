import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, IconButton, Drawer, Button, Link } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import AirplayIcon from "@material-ui/icons/Airplay";
import { toggledata } from "../utils/utils";
import Line from "../charts/Line";
import Pie from "../charts/Pie";
import Bar from "../charts/Bar";
import Toggle from "../charts/Toggle";
import Tick from "../utils/Tick";
import FrameShower from "./FrameShower";
import LoadingSpinner from "../utils/LoadingSpinner";
import CreateIcon from '@material-ui/icons/Create';
import SaveAltIcon from "@material-ui/icons/SaveAlt";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "20px",
  },
  topContainer: {
    [theme.breakpoints.up("lg")]: {
      padding: "30px",
    },
  },
  chartContainer: {
    padding: "50px",
  },
  chartDiv: {
    height: "100%",
    background: "#1c233e",
    borderRadius: "20px",
  },
}));
const Analytics: React.FC = () => {
  const classes = useStyles();
  const { oid } = useParams();
  const auth = useContext(AuthContext);
  const [video, setVideo] = useState<{ [key: string]: any }>({});
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [lineData, setLineData] = useState<any[]>([]); // linedata
  const [barData, setBarData] = useState<any[]>([]); // bardata
  const [pieData, setPieData] = useState<any[]>([]);
  const [report, setReport] = useState<string>("");

  // eslint-disable-next-line
  const [toggleData, setToggleData] = useState<any[]>(toggledata);

  const [open, setOpen] = useState<boolean>(false);

  const sidebarHandler = () => setOpen(true);
  const sidebarClose = () => setOpen(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/video/getvideobyid/" + oid,
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
    // console.log(oid);
    fetchVideo();
  }, [oid, sendRequest, auth.token]);

  // Fetch Chart Data
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        console.log(video);
        // eslint-disable-next-line
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/video/visual/" + video._id.$oid, //
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLineData(response.linechart);
        setPieData(response.big_data);
        setBarData(response.labels_array);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    if (Object.keys(video).length > 0) fetchChartData();
  }, [sendRequest, auth.token, video]);

  const generateReport = async () => {
    try {
      console.log(video);
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/report/generatevideoreport/" + video._id.$oid, //
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
  }

  return (
    <React.Fragment>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
  <Alert onClose={clearError} severity="error">
    An error has occurred. Please try again later!
  </Alert>
</Snackbar>
      <Drawer anchor="right" open={open} onClose={sidebarClose}>
        <FrameShower video={video} />
      </Drawer>
      <Grid className={classes.topContainer} container spacing={1}>
      <Grid
              style={{ textAlign: "center", margin: "20px 0px" }}
              item
              sm={6}
              xs={12}
            >
              <Button
                style={{ width: "90%" }}
                variant="contained"
                color="secondary"
                startIcon={<CreateIcon />}
                disabled={!!report}
                onClick={generateReport}
              >
                GENERATE REPORT
              </Button>
            </Grid>
            <Grid
              style={{ textAlign: "center", margin: "20px 0px" }}
              item
              sm={6}
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
        <Grid className={classes.chartContainer} item sm={4} xs={12}>
          <div className={classes.chartDiv}>
            <Tick />
          </div>
        </Grid>
        <Grid className={classes.chartContainer} item sm={4} xs={12}>
          <div className={classes.chartDiv}>
            <div style={{ textAlign: "center", paddingTop: "14%" }}>
              <AccessAlarmIcon color="primary" style={{ fontSize: "70px" }} />
              <p style={{ fontSize: "20px", fontWeight: 500 }}>
                {Object.keys(video).length > 0 && video.duration}
              </p>
            </div>
          </div>
        </Grid>
        <Grid className={classes.chartContainer} item sm={4} xs={12}>
          <div className={classes.chartDiv}>
            <div className={classes.chartDiv}>
              <div style={{ textAlign: "center", paddingTop: "11%" }}>
                <IconButton color="primary" onClick={sidebarHandler}>
                  <AirplayIcon color="primary" style={{ fontSize: "70px" }} />
                </IconButton>

                <p style={{ fontSize: "17px", fontWeight: 500 }}>PLAY FRAMES</p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid className={classes.chartContainer} item xs={12}>
          <div className={classes.chartDiv}>
            {isLoading ? (
              <div style={{ padding: "60px 0px" }}>
                <LoadingSpinner />
              </div>
            ) : (
              <> {lineData.length > 0 && <Line data={lineData} />}</>
            )}
          </div>
        </Grid>
        <Grid className={classes.chartContainer} item sm={6} xs={12}>
          <div className={classes.chartDiv}>
            {isLoading ? (
              <div style={{ padding: "60px 0px" }}>
                <LoadingSpinner />
              </div>
            ) : (
              <> {barData.length > 0 && <Bar data={barData} />}</>
            )}
          </div>
        </Grid>
        <Grid className={classes.chartContainer} item sm={6} xs={12}>
          <div className={classes.chartDiv}>
            {isLoading ? (
              <div style={{ padding: "60px 0px" }}>
                <LoadingSpinner />
              </div>
            ) : (
              <> {pieData.length > 0 && <Pie data={pieData} />} </>
            )}
          </div>
        </Grid>
        <Grid className={classes.chartContainer} item sm={6} xs={12}>
          <div className={classes.chartDiv}>
            {isLoading ? (
              <div style={{ padding: "60px 0px" }}>
                <LoadingSpinner />
              </div>
            ) : (
              <> {toggleData.length > 0 && <Toggle data={toggleData} />} </>
            )}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Analytics;
