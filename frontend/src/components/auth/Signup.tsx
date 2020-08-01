import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";

import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { makeStyles } from "@material-ui/core/styles";
import LoadingSpinner from "../utils/LoadingSpinner";
import Alert from "@material-ui/lab/Alert";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import GoBack from "./GoBack";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${process.env.PUBLIC_URL}/bg.png)`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Signup = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <GoBack />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <div style={{ marginBottom: "20px" }}>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
          </div>
          {isLoading && <LoadingSpinner />}
          <div style={{ marginTop: "20p", marginBottom: "20px" }}>
            {error && (
              <Alert onClose={clearError} severity="error">
                {error}
              </Alert>
            )}
          </div>

          <Formik
            initialValues={{
              fname: "",
              lname: "",
              email: "",
              password: "",
            }}
            validate={(values) => {
              const errors: {
                fname?: string;
                lname?: string;
                email?: string;
                password?: string;
              } = {};
              if (!values.fname) {
                errors.fname = "Required";
              }
              if (!values.lname) {
                errors.lname = "Required";
              }

              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }

              if (!values.password) {
                errors.password = "Required";
              } else if (values.password.length < 6) {
                errors.password = "Password should have atleast 6 characters";
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              const submitFormHandler = async (values) => {
                try {
                  const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + "/auth/signup",
                    "POST",
                    JSON.stringify({
                      first_name: values.fname,
                      last_name: values.lname,
                      email: values.email,
                      password: values.password,
                    }),
                    {
                      "Content-Type": "application/json",
                    }
                  );
                  auth.login(responseData.userId, responseData.token, null);
                } catch (err) {
                  setSubmitting(false);
                  console.log(err);
                }
              };
              submitFormHandler(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="fname"
                      variant="outlined"
                      fullWidth
                      label="First Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.fname}
                      autoFocus
                    />
                    <div style={{ margin: "10px", color: "red" }}>
                      {errors.fname && touched.fname && errors.fname}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Last Name"
                      name="lname"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lname}
                    />
                    <div style={{ margin: "10px", color: "red" }}>
                      {errors.lname && touched.lname && errors.lname}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      autoComplete="email"
                    />
                    <div style={{ margin: "10px", color: "red" }}>
                      {errors.email && touched.email && errors.email}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <div style={{ margin: "10px", color: "red" }}>
                      {errors.password && touched.password && errors.password}
                    </div>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Sign Up
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link
                      style={{ color: "#3f51b5", textDecoration: "none" }}
                      to="/signin"
                    >
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </div>
      </Grid>
    </Grid>
  );
};

export default Signup;
