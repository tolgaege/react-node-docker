import React from "react";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";

// logo
import logo from "../../images/haystack.svg";

function LandingPage(props) {
  var classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Haystack</Typography>
      </div>
    </div>
  );
}

export default withRouter(LandingPage);
