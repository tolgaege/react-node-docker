import React, { useState, useEffect } from "react";
import useTheme from "@material-ui/styles/useTheme";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import ApexCharts from "react-apexcharts";
import _ from "lodash";
import { Typography, Button } from "../Wrappers/Wrappers";
import Widget from "../Widget";
import useStyles from "./styles";
import {
  TODAY,
  WEEK,
  average,
  groupByWeek,
  getMean,
  getStandardDeviation,
  PULL_REQUEST_STATE
} from "../../utils/util";

const timeRange = TODAY.getTime() - 2 * WEEK;

const getBounds = (data, totalOpenPullRequests) => {
  if (data.length === 0) {
    return { upper: 0, lower: 0 };
  }

  let averageOpenedPullRequests = 0;
  let openedPullRequests = [0];

  let dataPerWeeks = groupByWeek(data, "filter.date");
  openedPullRequests = dataPerWeeks.map(week => {
    return week.length;
  });
  averageOpenedPullRequests = parseFloat(
    average(openedPullRequests).toFixed(2)
  );

  const margin = averageOpenedPullRequests / 2;
  const upper = totalOpenPullRequests + margin;
  const lower =
    totalOpenPullRequests - margin > 0 ? totalOpenPullRequests - margin : 0;

  return { upper: Math.ceil(upper), lower: Math.floor(lower) };
};

export default function Burndown({ data = [], boundData = [], ...props }) {
  const theme = useTheme();
  const classes = useStyles();

  let upperBound = 0;
  let lowerBound = 0;
  let series = [];
  let yaxisMin, yaxisMax;

  if (data.length > 0) {
    // This is really dumb way to calculated. Don't code at 4am
    let openedCount = _.countBy(data, pullRequest => {
      const createdDate = new Date(pullRequest.data.prCreatedAt);
      return createdDate.getTime();
    });

    let openPullRequests = data.filter(pr => {
      return pr.data.state !== PULL_REQUEST_STATE.OPEN;
    });
    let closedCount = _.countBy(openPullRequests, pullRequest => {
      const closedDate = new Date(pullRequest.data.prClosedAt);
      return closedDate.getTime();
    });

    let merged = _.mergeWith(openedCount, closedCount, (a, b) => {
      if (a && b) {
        return a - b;
      } else if (a) {
        return a;
      } else {
        return -b;
      }
    });

    // Format data to work with graph
    let arr = Object.entries(merged);
    arr = arr.map(val => {
      return [parseInt(val[0]), val[1]];
    });
    arr = arr.sort(function(a, b) {
      if (a[0] > b[0]) {
        return 1;
      } else if (b[0] > a[0]) {
        return -1;
      } else {
        return 0;
      }
    });

    // Sum all values so that we'd have a total view
    let newArr = [];
    newArr.push(arr[0]);
    for (var i = 1; i < arr.length; i++) {
      newArr.push([arr[i][0], arr[i][1] + newArr[i - 1][1]]);
    }

    if (newArr.length > 0) {
      // Calcuate healthy area
      const lastTwoWeeks = newArr
        .filter(obj => {
          return obj[0] > timeRange;
        })
        .map(obj => {
          return obj[1];
        });
      const bounds = getBounds(boundData, lastTwoWeeks[0]);
      upperBound = bounds.upper;
      lowerBound = bounds.lower;

      // Calcuate yaxis range and add buffer
      const max = _.max([...lastTwoWeeks, bounds.upper]);
      const min = _.min([...lastTwoWeeks, bounds.lower]);

      yaxisMax = (max * 105) / 100;
      yaxisMin = min > 5 ? (min * 95) / 100 : min;

      series = [
        {
          name: "Open Pull Requests",
          data: newArr
        }
      ];
    }
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item lg={12} xs={12}>
          <Widget
            title="Sprint Report - Burndown"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
            tooltipText={`Burndown Chart of Open Pull Requests`}
          >
            <ApexCharts
              options={themeOptions(
                theme,
                upperBound,
                lowerBound,
                yaxisMax,
                yaxisMin
              )}
              series={series}
              type="line"
              height={350}
            />
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

function themeOptions(theme, upperBound, lowerBound, yaxisMax, yaxisMin) {
  return {
    dataLabels: {
      enabled: false
    },
    stroke: {
      // curve: "smooth",
      curve: "stepline"
    },
    xaxis: {
      type: "datetime",
      min: timeRange,
      title: {
        text: "Date"
      }
    },
    yaxis: {
      title: {
        text: "Open Pull Requests"
      },
      min: yaxisMin,
      max: yaxisMax
    },
    tooltip: {
      x: {
        format: "dd/MM/yy"
      }
    },
    fill: {
      colors: [theme.palette.primary.light, theme.palette.success.light]
    },
    colors: [theme.palette.primary.main, theme.palette.success.main],
    chart: {
      toolbar: {
        show: true
      }
    },
    legend: {
      show: true
    },
    annotations: {
      yaxis: [
        {
          y: lowerBound,
          y2: upperBound,
          borderColor: "#000",
          fillColor: "#FEB019",
          opacity: 0.2,
          label: {
            borderColor: "#333",
            style: {
              fontSize: "10px",
              color: "#333",
              background: "#FEB019"
            },
            text: "Healthy Area"
          }
        }
      ]
    }
  };
}
