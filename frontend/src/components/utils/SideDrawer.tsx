import React from "react";
import { useHistory } from "react-router-dom";

import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AppsIcon from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import InsertChartIcon from "@material-ui/icons/InsertChart";
// import MapIcon from '@material-ui/icons/Map';
// import PersonPinIcon from '@material-ui/icons/PersonPin';
// import StreetviewIcon from '@material-ui/icons/Streetview';
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import VideocamIcon from "@material-ui/icons/Videocam";
import FindInPageIcon from '@material-ui/icons/FindInPage';

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Typography, Theme } from "@material-ui/core";
import { FaQuestion } from "react-icons/fa";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    margin: theme.spacing(1),
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("lg")]: {
      paddingTop: "64px",
    },
  },
  divider: {
    backgroundColor: "#505c94",
  },
  red: {
    color: "red",
  },
}));

interface Props {
  theme: Theme;
  container: any;
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideDrawer: React.FC<Props> = (props) => {
  let history = useHistory();
  const classes = useStyles();
  const theme = useTheme();

  const pushLink = (link) => {
    history.push(link);
    props.handleDrawerToggle();
  };

  const drawer = (
    <div
      style={{
        background:
          "linear-gradient(90deg, rgba(45,55,90,1) 4%, rgba(37,47,80,1) 18%, rgba(33,40,66,1) 38%, rgba(28,35,62,1) 82%)",
      }}
    >
      <ListItem
        classes={{ root: classes.root }}
        button
        onClick={() => {
          pushLink("/landing");
        }}
      >
        <ListItemIcon>
          <AppsIcon color="primary" fontSize="large" />
        </ListItemIcon>
        <Typography
          color="primary"
          style={{ fontSize: "25px", fontWeight: 500 }}
        >
          Console
        </Typography>
      </ListItem>
      <Divider className={classes.divider} />
      <List>
        <ListItem
          button
          onClick={() => {
            pushLink("/");
          }}
        >
          <ListItemIcon>
            <Avatar>
              <DashboardIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            pushLink("/search");
          }}
        >
          <ListItemIcon>
            <Avatar>
              <ImageSearchIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Explore Video" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            pushLink("/reports");
          }}
        >
          <ListItemIcon>
            <Avatar>
              <FindInPageIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Browse Reports" />
        </ListItem>
      </List>
      <Divider className={classes.divider} />
      <List>
        <ListSubheader component="div">DATABASE</ListSubheader>
        <ListItem
          button
          onClick={() => {
            pushLink("/library");
          }}
        >
          <ListItemIcon>
            <Avatar>
              <VideoLibraryIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Library" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            pushLink("/upload");
          }}
        >
          <ListItemIcon>
            <Avatar>
              <AddPhotoAlternateIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Add Video" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            pushLink("/cctv");
          }}
        >
          <ListItemIcon>
            <Avatar>
              <VideocamIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="CCTV" />
        </ListItem>
      </List>
      <Divider className={classes.divider} />
      <List>
        <ListSubheader component="div">TOOLS</ListSubheader>

        <ListItem
          button
          onClick={() => {
            pushLink("/videoquality");
          }}
        >
          <ListItemIcon>
            <Avatar>
              <CameraEnhanceIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Video Quality" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            pushLink("/visualization");
          }}
        >
          <ListItemIcon>
            <Avatar>
              <InsertChartIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="Visualization" />
        </ListItem>
      </List>
      {/* <Divider className={classes.divider} />
          <List>
          <ListSubheader component="div">
            REALTIME MAPPING
          </ListSubheader>  
            <ListItem button onClick={() => {pushLink('/maps')}}>
                <ListItemIcon><Avatar><MapIcon fontSize='small' /></Avatar></ListItemIcon>
                <ListItemText primary="Maps" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><Avatar><StreetviewIcon fontSize='small' /></Avatar></ListItemIcon>
                <ListItemText primary="Streetview" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><Avatar><PersonPinIcon fontSize='small' /></Avatar></ListItemIcon>
                <ListItemText primary="Pinpoint" />
              </ListItem>   
          </List> */}
      <Divider className={classes.divider} />
      <List>
        <ListItem
          button
          onClick={() => {
            pushLink("/faq");
          }}
        >
          <ListItemIcon>
            <Avatar>
              <FaQuestion fontSize="small" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary="FAQs" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden lgUp>
        <Drawer
          container={props.container}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={props.mobileOpen}
          onClose={props.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default SideDrawer;
