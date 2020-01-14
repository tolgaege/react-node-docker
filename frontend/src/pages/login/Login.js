import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import Fade from "@material-ui/core/Fade";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import GitHubLogin from "react-github-login";
import { ToastContainer, toast } from "react-toastify";
import MockNotification from "../../components/MockNotification";

// styles
import useStyles from "./styles";

// logo
import logo from "../../images/haystack.svg";
import google from "../../images/google.svg";

// context
import { useUserDispatch, loginUser } from "../../context/UserContext";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [nameValue, setNameValue] = useState("");
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");
  var [isLoggedIn, setIsLoggedIn] = useState(false);

  // For Github OAuth
  // const [user, setUser] = useState(null);
  // const [token, setToken] = useState('');

  const onSuccess = response => {
    setIsLoggedIn(true);
    // console.log(response)
    // const tokenBlob = new Blob([JSON.stringify({code: response.code}, null, 2)], {type : 'application/json'});
    // const options = {
    //   method: 'POST',
    //   body: tokenBlob,
    //   mode: 'cors',
    //   cache: 'default'
    // };
    // fetch(`${process.env.REACT_APP_SITE_URL}/auth/github`, options).then(r => {
    //   const token = r.headers.get('x-auth-token');
    //   r.json().then(user => {
    //     if (token) {
    //       // setUser(user)
    //       // setToken(token)
    //       // loginUser(userDispatch, user, token, props.history)
    //       // alert("OAuth was success. We will email you once the data is generated.")
    //       setIsLoggedIn(true)

    //       let componentProps = {
    //         type: "shipped",
    //         message: "We will contact you once the data is analyzed",
    //         variant: "contained",
    //         color: "success",
    //       };

    //       sendNotification(componentProps, {
    //         type: 'success',
    //         position: toast.POSITION.BOTTOM_CENTER,
    //         progressClassName: classes.progress,
    //         // onClose: notificationType === "error" && (() => setErrorToastId(null)),
    //         className: classes.notification,
    //       });
    //     }
    //   });
    // })
  };

  const onFailure = response => console.error(response);
  function sendNotification(componentProps, options) {
    return toast(
      <MockNotification
        {...componentProps}
        className={classes.notificationComponent}
      />,
      options
    );
  }

  let githubButtonClassName = `${classes.googleButton} MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textSizeLarge MuiButton-sizeLarge`;
  if (isLoggedIn) githubButtonClassName += " Mui-disabled";

  return (
    <Grid container className={classes.container}>
      <ToastContainer />
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Haystack</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
            {/*<Tab label="New User" classes={{ root: classes.tab }} />*/}
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              {/*
              <GitHubLogin
                clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
                onSuccess={onSuccess}
                onFailure={onFailure}
                className={`${githubButtonClassName}`}
                redirectUri={`${process.env.REACT_APP_CLIENT_URL}/auth/github/callback/`}
                buttonText={<div><i className="fa fa-2x fa-github"></i><span>&nbsp;Sign in with GitHub</span></div>}
                scope="user read:org repo"
              />

              {
                // We hide this button so react can compile the classnames and we can use it
                // for the button above
              }
              <Button
                size="large"
                className={classes.googleButton}
                style={{visibility:'hidden'}}
                >
                <i className="fa fa-2x fa-github"></i>
                &nbsp;Sign in with GitHub
              </Button>
            */}
              <Button
                size="large"
                className={classes.googleButton}
                onClick={onSuccess}
              >
                <i className="fa fa-2x fa-github"></i>
                &nbsp;Sign in with GitHub
              </Button>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <Typography className={classes.formDividerWord}>or</Typography>
                <div className={classes.formDivider} />
              </div>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError
                      )
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Login
                  </Button>
                )}
                <Button
                  color="primary"
                  size="large"
                  className={classes.forgetButton}
                >
                  Forget Password
                </Button>
              </div>
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Welcome!
              </Typography>
              <Typography variant="h2" className={classes.subGreeting}>
                Create your account
              </Typography>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                margin="normal"
                placeholder="Full Name"
                type="email"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError
                      )
                    }
                    disabled={
                      loginValue.length === 0 ||
                      passwordValue.length === 0 ||
                      nameValue.length === 0
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Create your account
                  </Button>
                )}
              </div>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <Typography className={classes.formDividerWord}>or</Typography>
                <div className={classes.formDivider} />
              </div>
              <Button
                size="large"
                className={classnames(
                  classes.googleButton,
                  classes.googleButtonCreating
                )}
              >
                <img src={google} alt="google" className={classes.googleIcon} />
                &nbsp;Sign in with Google
              </Button>
            </React.Fragment>
          )}
        </div>
        <Typography color="primary" className={classes.copyright}>
          © 2019 Haystack Pte Ltd, All rights reserved.
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
