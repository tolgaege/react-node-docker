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

export default function RateBox(props) {
  var theme = useTheme();
  var classes = useStyles();

  var rate = minMax(80, 100).toFixed(0);

  return (
    <>
      <Widget
        title={props.title}
        upperTitle
        bodyClass={classes.fullHeightBody}
        className={classes.card}
        tooltipText={props.tooltipText}
      >
        <div className={classes.reviewContainer}>
          <Typography variant="h0">{props.rate || rate}%</Typography>
        </div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography color="text" colorBrightness="secondary">
              Last 1 month
            </Typography>
          </Grid>
        </Grid>
      </Widget>
    </>
  );
}
