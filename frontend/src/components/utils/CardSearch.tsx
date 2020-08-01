import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import User from './ProfileUser.png';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 200,
    background: "#2a3f73",
  },
}));

export default function ImgMediaCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Search Results"
          height="80"
          image={require("./ProfileUser.png")}
          title="Search Results"
        />
        <CardContent>
            <Typography
                style={{ fontSize: "20px", color: "#ffffff" }}
                variant="subtitle2"
                gutterBottom
              >
            Person1
          </Typography>
          <Typography
                style={{ fontSize: "12px", color: "#ffffff" }}
                variant="subtitle2"
                gutterBottom
              >
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          ADD
        </Button>
      </CardActions>
    </Card>
  );
}