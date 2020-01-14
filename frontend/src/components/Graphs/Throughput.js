import React, { useState, useEffect } from "react";
import useTheme from "@material-ui/styles/useTheme";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import ApexCharts from "react-apexcharts";
import { Typography, Button } from "../Wrappers/Wrappers";
import Widget from "../Widget";
import useStyles from "./styles";
import { average, PULL_REQUEST_STATE, groupByWeek } from "../../utils/util";

export default function Throughput({ data = [], ...props }) {
  const theme = useTheme();
  const classes = useStyles();

  let averageOpenedPullRequests = 0;
  let averageClosedPullRequests = 0;
  let averageMergedPullRequests = 0;
  let openedPullRequests = [0];
  let closedPullRequests = [0];
  let mergedPullRequests = [0];
  let series = [];
  let prThroughput = 0;
  if (data.length > 1) {
    let dataPerWeeks = groupByWeek(data, "filter.date");

    const filterByState = (data, state) => {
      return data.filter(pr => {
        return pr.state === state;
      });
    };

    openedPullRequests = dataPerWeeks.map(week => {
      return week.length;
    });
    closedPullRequests = dataPerWeeks.map(week => {
      return filterByState(week, PULL_REQUEST_STATE.CLOSED).length;
    });
    mergedPullRequests = dataPerWeeks.map(week => {
      return filterByState(week, PULL_REQUEST_STATE.MERGED).length;
    });

    averageOpenedPullRequests = parseFloat(
      average(openedPullRequests).toFixed(2)
    );
    averageClosedPullRequests = parseFloat(
      average(closedPullRequests).toFixed(2)
    );
    averageMergedPullRequests = parseFloat(
      average(mergedPullRequests).toFixed(2)
    );

    series = [
      {
        name: "Opened",
        data: [averageOpenedPullRequests, 0, 0]
      },
      {
        name: "Merged ",
        data: [0, averageMergedPullRequests, 0]
      },
      {
        name: "Closed",
        data: [0, averageClosedPullRequests, 0]
      }
    ];

    prThroughput = (
      averageMergedPullRequests + averageClosedPullRequests
    ).toFixed(1);
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item lg={6} xs={12}>
          <Widget
            title="Throughput - Per Week"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
            tooltipText={`Average number of Pull Requests per state.`}
          >
            <div className={classes.visitsNumberContainer}>
              <Typography variant="h1" weight="medium">
                {prThroughput} Pull Requests
              </Typography>
            </div>

            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography size="l" color="text" colorBrightness="secondary">
                  Opened Pull Requests
                </Typography>
                <Typography variant="h2">
                  {averageOpenedPullRequests}
                </Typography>
              </Grid>
              <Grid item>
                <Typography size="l" color="text" colorBrightness="secondary">
                  Merged Pull Requests
                </Typography>
                <Typography variant="h2">
                  {averageMergedPullRequests}
                </Typography>
              </Grid>
              <Grid item>
                <Typography size="l" color="text" colorBrightness="secondary">
                  Closed Pull Requests
                </Typography>
                <Typography variant="h2">
                  {averageClosedPullRequests}
                </Typography>
              </Grid>
            </Grid>
          </Widget>
        </Grid>

        <Grid item lg={6} xs={12}>
          <Widget
            title="Throughput - Distribution"
            upperTitle
            className={classes.card}
            tooltipText={`Distribution of Throughput, Opened, Closed and Merged Pull Requests`}
          >
            <ApexCharts
              options={themeOptions(theme)}
              series={series}
              type="bar"
              height={300}
            />
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

function themeOptions(theme) {
  return {
    chart: {
      stacked: true,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter: function(val) {
          return val + " Pull Requests";
        }
      }
    },
    toolbar: {
      show: false
    },
    xaxis: {
      // categories: ["Open", "Done"],
      labels: {
        show: true
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    }
  };
}
