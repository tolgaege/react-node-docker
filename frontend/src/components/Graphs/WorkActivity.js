import React from "react";
import useTheme from "@material-ui/styles/useTheme";
import Grid from "@material-ui/core/Grid";
import Widget from "../Widget";
import useStyles from "./styles";
import ApexCharts from "react-apexcharts";

function minMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function ApexLineChart() {
  var theme = useTheme();
  var classes = useStyles();

  const series = [minMax(200, 600), minMax(200, 600), minMax(200, 600), 97];

  return (
    <Widget
      title="Work Activity"
      upperTitle
      className={classes.card}
      tooltipText={`Total lines of code change by repository`}
    >
      <Grid container spacing={2}>
        <ApexCharts
          options={themeOptions(theme)}
          series={series}
          type="donut"
          height={300}
        />
      </Grid>
    </Widget>
  );
}

// ############################################################
function themeOptions(theme) {
  return {
    dataLabels: {
      enabled: false,
      dropShadow: {
        blur: 3,
        opacity: 0.8
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            show: false
          }
        }
      }
    ],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true
            }
          }
        }
      }
    },
    legend: {
      position: "right",
      offsetY: 0,
      height: 230
    },
    labels: ["km-api", "km-ansible", "rack-timeout", "Other"]
  };
}
