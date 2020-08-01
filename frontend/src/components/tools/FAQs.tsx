import React from "react";
import {
  Container,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";

const data = [
  {
    title: "How many attributes can be identfied?",
    content:
      "Based on the video uploaded, attributes like shirts, pants, caps, sarees, blazers, burkhas, shorts, etc can be identified accurately.",
  },
  {
    title: "What are the specifications for the size of the video?",
    content:
      "There are no limitations regarding the size of the video, but in case faster processing is required it should be of atleast 30 sec duration.",
  },
  {
    title: "How do I upload the video?",
    content: (
      <div>
        To add a new video, the user can click on{" "}
        <Link style={{ color: "#2db1e1" }} to="/upload">
          Add Video
        </Link>{" "}
        option. The timestamp is recorded and specific location can also be
        selected.
      </div>
    ),
  },
  {
    title: "What are the technologies used in the making of this project?",
    content:
      "The diffent technologies used are Tensorflow, node, firebase, react, flask, mongo dB, grid fs",
  },
  {
    title: "How do I find out a particular location for camera feed? ",
    content: (
      <div>
        In the{" "}
        <Link style={{ color: "#2db1e1" }} to="/cctv">
          Maps
        </Link>{" "}
        option, to search for a particular video feed or camera , one can
        navigate to any location using the map integrated using Mapbox API.
      </div>
    ),
  },
  {
    title: "How do I find an already uploaded video?",
    content: (
      <div>
        All the previously uploaded videos are stored in the database and can be
        accessed by clicking the{" "}
        <Link style={{ color: "#2db1e1" }} to="/library">
          Library
        </Link>{" "}
        option in the side drawer.
      </div>
    ),
  },
  {
    title: "What is the purpose of the Search option?",
    content: (
      <div>
        <Link style={{ color: "#2db1e1" }} to="/search">
          Search
        </Link>{" "}
        operation can be performed on the basis of various clothing attributes
        such as blazers, kurtas, long pants, Jersey, and so on. There is an
        option to search for more than one person in the video using the add
        person option. Multiple people can be added added or can be removed from
        the search. Another feature is that a search option can be performed
        through the description of a person. The user can just type the
        suspicious individuals description and based on this query the search
        can be performed.
      </div>
    ),
  },
  {
    title: "How are the attributes identified once the video is uploaded?",
    content:
      "Once a video is chosen processing is done on it. The video is broken into multiple frames and processing is done frame by frame. All the people in the frame along with their clothing attributes are identified and bases on the query the frame containing the appropriate person is returned.",
  },
];

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(17),
    fontWeight: theme.typography.fontWeightRegular,
  },
  content: {
    fontSize: theme.typography.pxToRem(17),
    fontWeight: theme.typography.fontWeightRegular,
    color: "#fff",
  },
}));

const FAQs: React.FC = () => {
  const classes = useStyles();
  return (
    <Container style={{ maxWidth: "100vw" }}>
      <div
        style={{
          textAlign: "center",
          fontSize: "32px",
          fontWeight: 500,
          padding: "30px 0px",
        }}
      >
        Frequently Asked Questions
      </div>
      <div style={{ width: "100%" }}>
        {data.map((d, i) => (
          <ExpansionPanel style={{ width: "100%" }} key={i}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
            >
              <Typography className={classes.heading}>{d.title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className={classes.content}>{d.content}</div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    </Container>
  );
};

export default FAQs;
