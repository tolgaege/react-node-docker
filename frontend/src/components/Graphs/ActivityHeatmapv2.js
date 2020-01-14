import React, { useState, useEffect } from "react";
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

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

function initData() {
  // Init Empty Dataset
  let mapData = [];
  for (var i = 0; i < 24; i++) {
    const dayData = [];
    for (const day of days) {
      var x = day;
      var y = 0;

      dayData.push({
        x: x,
        y: y
      });
    }

    mapData.push({
      name: i,
      data: dayData
    });
  }
  return mapData;
}

export default function ApexLineChart() {
  var theme = useTheme();

  const [data, setData] = useState([]);
  const [hasError, setErrors] = useState(false);

  async function fetchData() {
    const res = await fetch(
      `${process.env.REACT_APP_SITE_URL}/api/analytic/activity_heatmap`
    );
    const json = await res.json();

    // Fill Data with Commit data
    let copyData = initData();
    for (var i = 0; i < copyData.length; i++) {
      let object = copyData[i];
      for (const commit of json) {
        const date = new Date(commit.commit_date);
        const hour = date.getHours();
        const day = date.getDay();
        if (object.name === hour && object.data[day].x === days[day]) {
          copyData[i].data[day].y = parseInt(commit.count);
        }
      }
    }

    setData(copyData);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Widget
      title="Activity Heatmap v2"
      upperTitle
      noBodyPadding
      tooltipText={`Activity the person does in a day. An activity means;\n
        Activitiy = Commits + Pull Request Comments + Opened Pull Request + Opened Issues + Issue Comments`}
    >
      <ApexCharts
        options={themeOptions(theme)}
        series={data}
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
