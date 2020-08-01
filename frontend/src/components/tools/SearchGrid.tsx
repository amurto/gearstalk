import React, { useState, useContext, useEffect, useRef } from "react";

import { useParams } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { useAttribute } from "../context/attribute-context";
import { useHttpClient } from "../hooks/http-hook";
import AttributeList from "./AttributeList";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper, Grid, IconButton } from "@material-ui/core";
import SearchTabs from "./SearchTabs";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ChooseDialog from "./ChooseDialog";
import qualityIcon from "./quality.svg";
import SearchIcon from "@material-ui/icons/Search";
import LoadingSpinner from "../utils/LoadingSpinner";
import TimeStamp from "./TimeStamp";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
  },
  option: {
    width: "50%",
    display: "inline-block",
    padding: "10px",
    marginTop: "20px",
    paddingTop: "15px",
    background: "#2a3f73",
    color: "#ffffff",
    border: "1px solid #4f619a",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "15px",
    "&:hover": {
      background: "#30a3f2",
      border: "1px solid #30a3f2",
    },
  },
  playIcon: {
    fontSize: "100px",
  },
  thumbnailImg: {
    width: "100%",
    height: "auto",
  },
  tryButton: {
    margin: theme.spacing(1),
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
}));

interface Props {
  videos: { [key: string]: any }[];
  setVideos: React.Dispatch<
    React.SetStateAction<
      {
        [key: string]: any;
      }[]
    >
  >;
}

const SearchGrid: React.FC<Props> = ({ videos, setVideos }) => {
  const { db, oid } = useParams();
  const [{ attributes }, dispatch] = useAttribute();
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [videoTag, setVideoTag] = useState<string>("");
  const handleClose = () => setOpen(false);
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [results, setResults] = useState<any[]>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCctvVideos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/video/getvideobycctv/" + oid,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData);
        setVideos(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    if (oid) {
      if (db === "vid") setVideoTag(oid);
      else if (db === "cctv") fetchCctvVideos();
    }
  }, [db, oid, auth.token, sendRequest, setVideos]);

  useEffect(() => {
    const containsTag = (vid) => {
      for (let i = 0; i < videos.length; i++) {
        if (videos[i]._id.$oid === vid) return true;
      }
      return false;
    };
    const fetchVideo = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/video/getvideobyid/" + videoTag,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData);
        setVideos((v) => [...v, responseData]);
      } catch (err) {
        console.log(err);
      }
    };

    if (videoTag && !containsTag(videoTag)) {
      fetchVideo();
      handleClose();
      setVideoTag("");
    } else {
      handleClose();
      setVideoTag("");
    }
  }, [videos, videoTag, setVideos, auth.token, sendRequest]);

  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);
  const searchHandler = async () => {
    if (attributes.length === 0 || videos.length === 0) return;
    console.log(attributes);
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/query/search",
        "POST",
        JSON.stringify({
          attributes: attributes,
          video_id: videos.map((v) => v._id.$oid),
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(responseData);
      setResults(responseData);
      scrollToRef(resultRef);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <ChooseDialog
        open={open}
        setVideoTag={setVideoTag}
        handleClose={handleClose}
        prepared={true}
      />
      <Grid container spacing={4}>
        <Grid item xl={9} lg={9} md={9} xs={12} sm={12}>
          <Paper className={classes.paper} square>
            {videos.length > 0 ? (
              <Grid container>
                {videos.map((v, i) => (
                  <Grid key={i} item sm={4} xs={6}>
                    <Grid style={{ padding: "10px" }} container>
                      <Grid item xs={12}>
                        <img
                          className={classes.thumbnailImg}
                          src={`${process.env.REACT_APP_BACKEND_URL}/helpers/file/${v.thumbnail_id}`}
                          alt="thumbnail"
                        />
                      </Grid>
                      <Grid style={{ overflowWrap: "break-word" }} item xs={9}>
                        {v.name}
                      </Grid>
                      <Grid item xs={3}>
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClick={() => {
                            setVideos((vids) =>
                              vids.filter((vid) => vid._id.$oid !== v._id.$oid)
                            );
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <div
                style={{
                  height: "100%",
                  border: "2px solid #2db1e1",
                  paddingTop: "10vh",
                }}
              >
                <h2>No Video Selected</h2>
              </div>
            )}
          </Paper>
        </Grid>
        <Grid item xl={3} lg={3} md={3} xs={12} sm={12}>
          <Paper className={classes.paper} square>
            <Grid container style={{ textAlign: "center" }}>
              <Grid style={{ marginTop: "10px" }} item xs={12}>
                <img
                  style={{ width: "40%", height: "20vh" }}
                  src={qualityIcon}
                  alt="qualityIcon"
                />
              </Grid>

              <Grid item xs={12}>
                <div className={classes.option} onClick={() => setOpen(true)}>
                  CHOOSE VIDEO
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xl={6} lg={6} md={6} xs={12} sm={12}>
          <Paper className={classes.paper} square>
            <AttributeList items={attributes} />
            <Grid container>
              <Grid item md={6} xs={12}>
                <Button
                  className={classes.tryButton}
                  startIcon={<PersonAddIcon />}
                  onClick={() =>
                    dispatch({
                      type: "addPerson",
                    })
                  }
                >
                  Add Person
                </Button>
              </Grid>
              <Grid item md={6} xs={12}>
                <Button
                  className={classes.tryButton}
                  startIcon={<SearchIcon />}
                  disabled={attributes.length === 0 || videos.length === 0}
                  onClick={searchHandler}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xl={6} lg={6} md={6} xs={12} sm={12}>
          <SearchTabs />
        </Grid>
        <Grid item xs={12} ref={resultRef}>
          {isLoading ? (
            <div>
              <LoadingSpinner />
            </div>
          ) : (
            <>{results && <TimeStamp results={results} />}</>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchGrid;
