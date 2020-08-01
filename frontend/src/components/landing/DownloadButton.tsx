import React from "react";
import { Link, Button, makeStyles, Grid, Container } from "@material-ui/core";
import { FaWindows, FaApple, FaLinux } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  Button: {
    color: "#000",
    borderRadius: 0,
    width: "100%",
    fontSize: "30px",
    padding: "20px 0px",
    backgroundColor: "#5ce1e6",
    "&:hover": {
      color: "#fff",
      backgroundColor: "#1e15a1",
    },
  },
}));

const DownloadButton: React.FC = () => {
  const classes = useStyles();
  return (
    <Container style={{ paddingTop: "50px"}}>
      <div style={{ margin: "60px 0px", fontSize: "40px", fontWeight: 500, color: "#fff"}}>
        Download Desktop App
      </div>
      <Grid container spacing={4}>
        <Grid item md={4} sm={12} xs={12}>
          <Link
            href="https://github.com/DataPiratesSIH/gearstalk-electron-app/releases/download/v3.0.0/gearstalk-Setup-3.0.0.exe"
            underline="none"
            target="_blank"
          >
            <Button
              variant="contained"
              className={classes.Button}
              startIcon={<FaWindows size={40} />}
            >
              WINDOWS
            </Button>
          </Link>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Link
            href="https://github.com/DataPiratesSIH/gearstalk-electron-app/releases/download/v3.0.0/gearstalk-3.0.0.pkg"
            underline="none"
            target="_blank"
          >
            <Button
              variant="contained"
              className={classes.Button}
              startIcon={<FaApple size={40} />}
            >
              MAC OS
            </Button>
          </Link>
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Link
            href="https://github.com/DataPiratesSIH/gearstalk-electron-app/releases/download/v3.0.0/gearstalk-3.0.0.AppImage"
            underline="none"
            target="_blank"
          >
            <Button
              variant="contained"
              className={classes.Button}
              startIcon={<FaLinux size={40} />}
            >
              LINUX
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DownloadButton;
