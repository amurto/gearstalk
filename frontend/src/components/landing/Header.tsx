import React, { useState } from "react";
import { Link } from "react-scroll";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Logout from "../auth/Logout";
import {
  Typography,
  Fab,
  IconButton,
  Button,
  Zoom,
  useScrollTrigger,
  CssBaseline,
  Toolbar,
  AppBar,
  Drawer,
  List,
  Divider,
  ListItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  appBar: {
    background:
      "linear-gradient(90deg, rgba(36,44,78,1) 0%, rgba(49,61,100,1) 29%, rgba(63,78,128,1) 51%, rgba(47,58,98,1) 75%, rgba(36,44,78,1) 100%)",
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    width: "100vw",
    overflowY: "auto",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
    },
  },
  nav: {
    margin: "0px 5px",
    textTransform: "none",
    color: "#ffffff",
    fontSize: "17px",
    fontFamily: "Verdana, Geneva, sans-serif",
    "&:hover": {
      color: "#5ce1e6",
    },
  },
  hamburger: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  tryButton: {
    marginLeft: "5px",
    textTransform: "none",
    fontFamily: "Trebuchet MS, Helvetica, sans-serif",
    borderRadius: 7,
    fontWeight: 600,
    color: "#1E1E30",
    fontSize: "17px",
    background: "#5ce1e6",
    "&:hover": {
      background: "#ffffff",
    },
  },
  logoTypo: {
    marginLeft: "10px",
    fontFamily: "Verdana, Geneva, sans-serif",
  },
  menu: {
    backgroundColor: "#1E1E30",
  },
  menuDivider: {
    backgroundColor: "#464670",
  },
  menuItem: {
    padding: "24px",
    color: "#6C757D",
    fontSize: "16px",
    fontWeight: 600,
  },
  iconContainer: {
    textAlign: "right",
    padding: "10px 20px",
  },
}));

const menu = [
  { text: "Home", section: "section1" },
  { text: "Features", section: "section2" },
  { text: "Downloads", section: "downloads" },
  { text: "Model", section: "section3" },
  { text: "Techstack", section: "section5" },
];

interface ScrollToTopProps {
  children: React.ReactNode;
  window?: Window;
}

const ScrollTop: React.FC<ScrollToTopProps> = (props) => {
  const { children, window } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: window ? window : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick:
    | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
    | undefined = (event) => {
    const anchor = (
      (event.target as HTMLInputElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
};

interface ScrollLinkProps {
  to: String;
  children: React.ReactNode;
}

const ScrollLink: React.FC<ScrollLinkProps> = ({ to, children }) => {
  return (
    <Link
      activeClass="active"
      to={to}
      spy={true}
      smooth={true}
      offset={-70}
      duration={500}
    >
      {children}
    </Link>
  );
};

interface TopMenuProps {
  onClose: () => void;
  isLoggedIn: boolean;
}

const TopMenu: React.FC<TopMenuProps> = ({ onClose, isLoggedIn }) => {
  const classes = useStyles();
  let history = useHistory();
  return (
    <div className={classes.menu} role="presentation">
      <div className={classes.iconContainer}>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <List>
        {menu.map((m, i) => (
          <div key={i}>
            <Divider className={classes.menuDivider} />

            <ScrollLink to={m.section}>
              <ListItem className={classes.menuItem} button>
                {m.text}
              </ListItem>
            </ScrollLink>
          </div>
        ))}
      </List>
      <div style={{ padding: "24px" }}>
        {isLoggedIn ? (
          <>
            <Button
              className={classes.tryButton}
              onClick={() => history.push("/")}
            >
              Go to Console
            </Button>
            <Logout className={classes.nav} />
          </>
        ) : (
          <>
            <Button
              className={classes.tryButton}
              onClick={() => history.push("/signup")}
            >
              SignUp
            </Button>
            <Button
              className={classes.tryButton}
              onClick={() => history.push("/signin")}
            >
              SignIn
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

interface HeaderProps {
  window?: Window;
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const [open, setOpen] = useState<boolean>(false);
  const toggleDrawer = () => setOpen((open) => !open);
  return (
    <React.Fragment>
      <CssBaseline />
      <Drawer anchor={"top"} open={open} onClose={toggleDrawer}>
        <TopMenu onClose={toggleDrawer} isLoggedIn={props.isLoggedIn} />
      </Drawer>
      <AppBar
        className={classes.appBar}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Toolbar className={classes.toolBar}>
          <img
            src="/logo192.png"
            className="nav-logo"
            alt="Logo"
            width="40"
            height="30"
          />
          <Typography className={classes.logoTypo} variant="h6">
            GearStalk
          </Typography>
          <div className={classes.sectionDesktop}>
            {menu.map((m, i) => (
              <Button key={i} className={classes.nav}>
                <ScrollLink to={m.section}>{m.text}</ScrollLink>
              </Button>
            ))}
            {props.isLoggedIn ? (
              <>
                <Button
                  className={classes.tryButton}
                  onClick={() => history.push("/")}
                >
                  Go to Console
                </Button>
                <Logout className={classes.nav} />
              </>
            ) : (
              <>
                <Button
                  className={classes.tryButton}
                  onClick={() => history.push("/signup")}
                >
                  SignUp
                </Button>
                <Button
                  className={classes.tryButton}
                  onClick={() => history.push("/signin")}
                >
                  SignIn
                </Button>
              </>
            )}
          </div>
          <div className={classes.hamburger}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <ScrollTop {...props}>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
};

export default Header;
