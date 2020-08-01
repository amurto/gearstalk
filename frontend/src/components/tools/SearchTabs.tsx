import React, { useState } from "react";
import { useAttribute } from "../context/attribute-context";

import ImageCrop from "./ImageCrop";
import QueryField from "./QueryField";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};

function a11yProps(index: number) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    backgroundColor: theme.palette.background.paper,
  },
  tabAppBar: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const SearchTabs: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState<number>(0);

  // eslint-disable-next-line
  const [{ attributes }, dispatch] = useAttribute();

  const handleChange: ((event: React.ChangeEvent<{}>, value: number) => void) | undefined = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.tabAppBar} position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Photo" {...a11yProps(0)} />
          <Tab label="Type" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ImageCrop />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <QueryField />
      </TabPanel>
    </div>
  );
};

export default SearchTabs;
