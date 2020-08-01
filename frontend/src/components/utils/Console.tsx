import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import ConsoleMap from "./ConsoleMap";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import RecentVideo from "./RecentVideo";
import Donut from "./Donut";
import ArrowButton from "./ArrowButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    [theme.breakpoints.up("md")]: {
      padding: "20px",
    },
  },
  paperContainer: {
    padding: "10px",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
    borderRadius: "25px",
  },
  statsHeading: {
    fontSize: "17px",
    fontWeight: 500,
    textAlign: "center",
  },
  stats: {
    padding: "10px 0px",
    fontSize: "40px",
  },
}));

const Console: React.FC = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const classes = useStyles();

  const [stats, setStats] = useState<{ [key: string]: number }>({
    count: 0,
    prepared: 0,
    unprepared: 0,
  });

  useEffect(() => {
    const fetchVideoStats = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/video/getvideostats",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setStats({
          count: responseData.count,
          prepared: responseData.prepared,
          unprepared: responseData.unprepared,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchVideoStats();
  }, [auth.token, sendRequest]);
  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid className={classes.paperContainer} item md={8} sm={12} xs={12}>
          <Grid container spacing={0}>
            <Grid
              className={classes.paperContainer}
              item
              md={4}
              xs={12}
              sm={12}
            >
              <div className={classes.paper}>
                <div style={{ marginTop: "10px" }}>
                  <div className={classes.statsHeading}>VIDEOS</div>
                  <div className={classes.stats}>{stats.count}</div>
                </div>
              </div>
            </Grid>
            <Grid
              className={classes.paperContainer}
              item
              md={4}
              xs={12}
              sm={12}
            >
              <div className={classes.paper}>
                <div style={{ marginTop: "10px" }}>
                  <div className={classes.statsHeading}>PROCESSED</div>
                  <div className={classes.stats}>{stats.prepared}</div>
                </div>
              </div>
            </Grid>
            <Grid
              className={classes.paperContainer}
              item
              md={4}
              xs={12}
              sm={12}
            >
              <div className={classes.paper}>
                <div style={{ marginTop: "10px" }}>
                  <div className={classes.statsHeading}>UNPROCESSED</div>
                  <div className={classes.stats}>{stats.unprepared}</div>
                </div>
              </div>
            </Grid>
            <Grid
              className={classes.paperContainer}
              item
              md={6}
              xs={12}
              sm={12}
            >
              <div className={classes.paper}>
                <RecentVideo />
              </div>
            </Grid>
            <Grid
              className={classes.paperContainer}
              item
              md={6}
              xs={12}
              sm={12}
            >
              <div className={classes.paper}>
                <div
                  style={{
                    wordSpacing: "8px",
                    fontSize: "19px",
                    fontWeight: 400,
                    padding: "15px",
                  }}
                >
                  DOMINANT COLORS
                </div>
                <Donut />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.paperContainer} item md={4} sm={12} xs={12}>
          <div className={classes.paper}>
            <div
              style={{
                padding: "20px 20px 0px 20px",
                textAlign: "right",
                fontSize: "30px",
                fontWeight: 600,
              }}
            >
              INDIA
            </div>
            <div
              style={{
                wordSpacing: "10px",
                padding: "0px 20px 0px 20px",
                textAlign: "right",
                fontSize: "17px",
              }}
            >
              CCTV LOCATIONS
            </div>
            <ConsoleMap />
            <div style={{ padding: "50px 0px" }}>
              <ArrowButton />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Console;
