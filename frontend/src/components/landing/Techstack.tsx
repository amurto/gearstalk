import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
// import logo from './logo.png'
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "@material-ui/core";

const useStyles = makeStyles({
  grid: {
      padding: '15px',
  },
  media: {
    height: 180,
  },
  cardHeight:{
    maxWidth: 250,
    height : 380,
    backgroundColor: "#333333",
    color: "white",
    opacity: .8,
  },
  Link: {
    color: "Lightgreen",  
  },
});



const Techstack: React.FC = () => {
  const classes = useStyles();

  return (
    <div>
      <Grid container>
        <Grid className={classes.grid} item xs={12} sm={6} md={3} lg={3} >
          <Card className={classes.cardHeight}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={require("./images/tensorflow.png")}
                title="Tensorflow JS"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  TensorFlow.JS
                </Typography>
                <Typography variant="body2" component="p">
                  TensorFlow.js is an hardware-accelerated JavaScript library
                  for training and deploying ML models.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {/* <Link to="https://www.tensorflow.org/js" > */}
              <Button size="small" color="default">
                <Link className={classes.Link} target="_blank" href="https://www.tensorflow.org/js">See More</Link>
              </Button>
              {/* </Link>  */}
            </CardActions>
          </Card>
        </Grid>
        <Grid className={classes.grid} item xs={12} sm={6} md={3} lg={3}>
          <Card className={classes.cardHeight}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={require("./images/reactjs.png")}
                title="React JS"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  ReactJS
                </Typography>
                <Typography variant="body2" component="p">
                  React is a JavaScript library for building user interfaces. It
                  is maintained by Facebook and a large Community.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {/* <Link to="https://www.tensorflow.org/js" > */}
              <Button size="small" color="default">
                <Link className={classes.Link} target="_blank" href="https://reactjs.org/">See More</Link>
              </Button>
              {/* </Link>  */}
            </CardActions>
          </Card>
        </Grid>
        <Grid className={classes.grid} item xs={12} sm={6} md={3} lg={3}>
          <Card className={classes.cardHeight}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={require("./images/flask.png")}
                title="Flask"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Flask
                </Typography>
                <Typography variant="body2" component="p">
                  D3.js is a JavaScript library for producing dynamic,
                  interactive data visualizations in web browsers.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="default">
                <Link className={classes.Link} target="_blank" href="https://d3js.org/">See More</Link>
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid className={classes.grid} item xs={12} sm={6} md={3} lg={3}>
          <Card className={classes.cardHeight}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={require("./images/materialui.png")}
                title="Material UI"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Material UI
                </Typography>
                <Typography variant="body2" component="p">
                  Material UI provides React components implementing <Link className={classes.Link} href="https://material.io/">Google's Material Design</Link>
                  specification
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {/* <Link to="https://www.tensorflow.org/js" > */}
              <Button size="small" color="default">
                <Link className={classes.Link} target="_blank" href="https://material-ui.com/">See More</Link>
              </Button>
              {/* </Link>  */}
            </CardActions>
          </Card>
        </Grid>
        <Grid className={classes.grid} item xs={12} sm={6} md={3} lg={3}>
          <Card className={classes.cardHeight}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={require("./images/mongodb.png")}
                title="MongoDB Atlas"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  MongoDB Atlas
                </Typography>
                <Typography variant="body2" component="p">
                  Material UI provides React components implementing <Link className={classes.Link} target="_blank" href="https://material.io/">Google's Material Design</Link>
                  specification
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {/* <Link to="https://www.tensorflow.org/js" > */}
              <Button size="small" color="default">
                <Link className={classes.Link} target="_blank" href="https://material-ui.com/">See More</Link>
              </Button>
              {/* </Link>  */}
            </CardActions>
          </Card>
        </Grid>
        <Grid className={classes.grid} item xs={12} sm={6} md={3} lg={3}>
          <Card className={classes.cardHeight}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={require("./images/gridfs.png")}
                title="Grid FS"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Grid FS
                </Typography>
                <Typography variant="body2" component="p">
                  Material UI provides React components implementing <Link className={classes.Link} target="_blank" href="https://material.io/">Google's Material Design</Link>
                  specification
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {/* <Link to="https://www.tensorflow.org/js" > */}
              <Button size="small" color="default">
                <Link className={classes.Link} target="_blank" href="https://material-ui.com/">See More</Link>
              </Button>
              {/* </Link>  */}
            </CardActions>
          </Card>
        </Grid>
        <Grid className={classes.grid} item xs={12} sm={6} md={3} lg={3}>
          <Card className={classes.cardHeight}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={require("./images/amcharts.png")}
                title="AMcharts"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  AMcharts
                </Typography>
                <Typography variant="body2" component="p">
                  Material UI provides React components implementing <Link className={classes.Link} target="_blank"  href="https://material.io/">Google's Material Design</Link>
                  specification
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {/* <Link to="https://www.tensorflow.org/js" > */}
              <Button size="small" style={{ color: '#ffffff'}}>
                <Link className={classes.Link} target="_blank" href="https://material-ui.com/">See More</Link>
              </Button>
              {/* </Link>  */}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};


export default Techstack;