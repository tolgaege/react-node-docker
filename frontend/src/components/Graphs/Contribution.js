import React from "react";
import useTheme from "@material-ui/styles/useTheme";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis
} from "recharts";
import { Typography, Button } from "../Wrappers/Wrappers";
import Grid from "@material-ui/core/Grid";
import Widget from "../Widget";
import useStyles from "./styles";

function minMax(min, max) {
  return Math.random() * (max - min + 1) + min;
}

export default function Contribution() {
  var theme = useTheme();
  var classes = useStyles();

  var devTime = minMax(2, 5).toFixed(0);
  var reworkTime = minMax(2, 5).toFixed(0);
  var reviewTime = minMax(2, 5).toFixed(0);
  var totalTime = (
    parseFloat(devTime) +
    parseFloat(reworkTime) +
    parseFloat(reviewTime)
  ).toFixed(0);

  return (
    <>
      <Widget
        title="Contributions"
        upperTitle
        bodyClass={classes.fullHeightBody}
        className={classes.card}
        tooltipText={`Pull Request Reviewed: Total number of Pull Request the individual interacted with\n
          Pull Request Comments: Total number of comments the individual made to other Pull Request`}
      >
        <Grid item>
          <Typography color="text" colorBrightness="secondary">
            Pull Request Reviewed
          </Typography>
          <Typography size="xl">{devTime}</Typography>
        </Grid>
        <Grid item>
          <Typography color="text" colorBrightness="secondary">
            Pull Request Commentts
          </Typography>
          <Typography size="xl">{reworkTime}</Typography>
        </Grid>
      </Widget>
    </>
  );
}
