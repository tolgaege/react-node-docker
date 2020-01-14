import React from "react";
import useTheme from "@material-ui/styles/useTheme";
import ApexCharts from "react-apexcharts";
import Widget from "../Widget";

let series = [];
for (var i = 0; i < 24; i++) {
  series.push({
    name: i,
    data: generateData({
      min: 0,
      max: 30
    })
  });
}

export default function MockActivityHeatmap() {
  var theme = useTheme();

  console.log(series);

  return (
    <Widget
      title="Activity Heatmap"
      upperTitle
      noBodyPadding
      tooltipText={`Activity the person does in a day. An activity means;\n
        Activitiy = Commits + Pull Request Comments + Opened Pull Request + Opened Issues + Issue Comments`}
    >
      <ApexCharts
        options={themeOptions(theme)}
        series={series}
        type="heatmap"
        height={350}
      />
    </Widget>
  );
}

// ##################################################################
function generateData(yrange) {
  var series = [];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  for (const day of days) {
    var x = day;
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    if (x === "Saturday" || x === "Sunday") {
      y = y - 15 < 0 ? 0 : y - 15;
    }

    series.push({
      x: x,
      y: y
    });
  }

  return series;
}

function themeOptions(theme) {
  return {
    chart: {
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: [theme.palette.primary.main]
  };
}
