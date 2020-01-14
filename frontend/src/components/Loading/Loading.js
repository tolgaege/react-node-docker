import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

// styles
import useStyles from "./styles";

export default function Loading() {
  var classes = useStyles();

  return (
    <div className={classes.loadingCircle}>
      <CircularProgress />
    </div>
  );
}
