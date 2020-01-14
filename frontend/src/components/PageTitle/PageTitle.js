import React from "react";
import Button from "@material-ui/core/Button";

// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers";

export default function PageTitle({ title, subtitle, button }) {
  var classes = useStyles();

  return (
    <div className={classes.pageTitleContainer}>
      <Typography className={classes.typo} variant="h1" size="sm">
        {title}
        {subtitle && (
          <Typography className={classes.subtitle} variant="h3" size="sm">
            {" "}
            - {subtitle}
          </Typography>
        )}
      </Typography>
      {button && (
        <Button
          classes={{ root: classes.button }}
          variant="contained"
          size="large"
          color="secondary"
        >
          {button}
        </Button>
      )}
    </div>
  );
}
