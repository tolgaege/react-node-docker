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

function generateData(dataPointCount, min, max) {
  var series = [];

  for (var i = 0; i < dataPointCount; i++) {
    var value = minMax(min, max);

    series.push({
      value: value
    });
  }

  return series;
}

function minMax(min, max) {
  return Math.random() * (max - min + 1) + min;
}

export default function MockThroughput() {
  var theme = useTheme();
  var classes = useStyles();

  var devTime = minMax(2, 5).toFixed(2);
  var reworkTime = minMax(2, 5).toFixed(2);
  var reviewTime = minMax(
    parseFloat(reworkTime),
    parseFloat(reworkTime) + 5
  ).toFixed(2);
  var totalTime = (parseFloat(devTime) + parseFloat(reviewTime)).toFixed(2);

  return (
    <>
      <Widget
        title="Pull Request Cycle Time"
        upperTitle
        bodyClass={classes.fullHeightBody}
        className={classes.card}
        tooltipText={`Pull Request Cycle Time: Average time from first commit to merging a Pull Request.\n
          Development: Average time from first commit to Pull Request Open.\n
          Rework: Average time from first commit after Pull Request Open to last commit.\n
          Review: Average time from Pull Request Open to Pull Request Close.`}
      >
        <div className={classes.visitsNumberContainer}>
          <Typography variant="h1" weight="medium">
            {totalTime} days
          </Typography>
          <LineChart
            width={150}
            height={60}
            data={generateData(5, 9, 15)}
            margin={{ left: theme.spacing(4) }}
          >
            <Line
              type="natural"
              dataKey="value"
              stroke={theme.palette.success.main}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography color="text" colorBrightness="secondary">
              Development
            </Typography>
            <Typography size="xl">{devTime} days</Typography>
          </Grid>
          <Grid item>
            <Typography color="text" colorBrightness="secondary">
              Rework
            </Typography>
            <Typography size="xl">{reworkTime} days</Typography>
          </Grid>
          <Grid item>
            <Typography color="text" colorBrightness="secondary">
              Review
            </Typography>
            <Typography size="xl">{reviewTime} days</Typography>
          </Grid>
        </Grid>
      </Widget>
    </>
  );
}
