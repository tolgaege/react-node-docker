import React from "react";
import useTheme from "@material-ui/styles/useTheme";
import { Typography, Button } from "../Wrappers/Wrappers";
import Grid from "@material-ui/core/Grid";
import Widget from "../Widget";
import useStyles from "./styles";
import ApexCharts from "react-apexcharts";

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

export default function DefectDensity(props) {
  var theme = useTheme();
  var classes = useStyles();

  var rate = minMax(5, 20).toFixed(0);

  return (
    <>
      <Widget
        title="Defect Density"
        upperTitle
        bodyClass={classes.fullHeightBody}
        className={classes.card}
        tooltipText={`Number of open defects per thousand lines of code (KLOC)

Why
Defect Density helps to reveal the quality of code owned by a team. It may also be used as a proxy for technical debt, helping to determine the relative cost to maintaining the code as-is.

How to use
Code bases with higher Defect Density may be in line for refactoring. The trend in Defect Density over time, will help decide whether a code base is reaching a point where the costs (and risks) to maintain are outweighed by the costs to refactor.\n
Note: Some teams may not have an associated code repository. In these instances, Defect Density is excluded from the performance summary calculation.`}
      >
        <div className={classes.reviewContainer}>
          <Typography variant="h0">{rate}</Typography>
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

// <ApexCharts
//   options={themeOptions(theme)}
//   series={[67]}
//   type="radialBar"
//   offsetY={-10}
//   height={250}
// />

// function themeOptions(theme) {
//   return {
//     plotOptions: {
//       radialBar: {
//         startAngle: -135,
//         endAngle: 135,
//         dataLabels: {
//           name: {
//             fontSize: '16px',
//             color: undefined,
//             offsetY: 120
//           },
//           value: {
//             offsetY: 76,
//             fontSize: '22px',
//             color: undefined,
//             formatter: function (val) {
//               return val;
//             }
//           }
//         }
//       }
//     },
//     fill: {
//       type: 'gradient',
//       gradient: {
//         shade: 'dark',
//         type: 'horizontal',
//         shadeIntensity: 0.5,
//         gradientFromColors: ['#FF0000'],
//         // gradientToColors: ['#CC0000'],
//         opacityFrom: 1,
//         opacityTo: 1,
//       }
//     },
//     series: [67],
//     labels: [''],
//   }
// }
