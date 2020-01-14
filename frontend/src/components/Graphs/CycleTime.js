import React, { useState, useEffect } from "react";
import useTheme from "@material-ui/styles/useTheme";
import Grid from "@material-ui/core/Grid";
import ApexCharts from "react-apexcharts";
import { Typography, Button } from "../Wrappers/Wrappers";
import Widget from "../Widget";
import useStyles from "./styles";
import { average } from "../../utils/util";

export default function CycleTime({ data = [], ...props }) {
  const theme = useTheme();
  const classes = useStyles();

  const averageDevelopmentTime = average(data, "developmentTime");
  const averageReworkTime = average(data, "reworkTime");
  const averageReviewTime = average(data, "reviewTime");
  const averageCycleTime = averageDevelopmentTime + averageReviewTime;

  const devTime = parseFloat(
    (
      new Date(averageDevelopmentTime).getTime() /
      (1000 * 60 * 60 * 24)
    ).toFixed(2)
  );
  const reworkTime = parseFloat(
    (new Date(averageReworkTime).getTime() / (1000 * 60 * 60 * 24)).toFixed(2)
  );
  const reviewTime = parseFloat(
    (new Date(averageReviewTime).getTime() / (1000 * 60 * 60 * 24)).toFixed(2)
  );
  const totalTime = parseFloat(
    (new Date(averageCycleTime).getTime() / (1000 * 60 * 60 * 24)).toFixed(2)
  );
  const series = [
    {
      name: "Development Time",
      data: [devTime]
    },
    {
      name: "Rework Time",
      data: [reworkTime]
    },
    {
      name: "Review Time",
      data: [parseFloat((reviewTime - reworkTime).toFixed(2))]
    }
  ];

  return (
    <>
      <Grid container spacing={4}>
        <Grid item lg={6} xs={12}>
          <Widget
            title="Cycle Time - Per Pull Request"
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
            </div>

            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography size="l" color="text" colorBrightness="secondary">
                  Development
                </Typography>
                <Typography variant="h2">{devTime} days</Typography>
              </Grid>
              <Grid item>
                <Typography size="l" color="text" colorBrightness="secondary">
                  Rework
                </Typography>
                <Typography variant="h2">{reworkTime} days</Typography>
              </Grid>
              <Grid item>
                <Typography size="l" color="text" colorBrightness="secondary">
                  Review
                </Typography>
                <Typography variant="h2">{reviewTime} days</Typography>
              </Grid>
            </Grid>
          </Widget>
        </Grid>

        <Grid item lg={6} xs={12}>
          <Widget
            title="Cycle Time - Distribution"
            upperTitle
            className={classes.card}
            tooltipText={`Distribution of Development, Rework and Review Times`}
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
      stackType: "100%",
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
          return val + " days";
        }
      }
    },
    xaxis: {
      categories: ["Distribution"],
      labels: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    }
  };
}
