import React from "react";
import ApexCharts from "react-apexcharts";
import useTheme from "@material-ui/styles/useTheme";
import Widget from "../Widget";

const series = [
  {
    name: "Jason Calderone",
    data: [0, 0, 0, 0, 129, 99]
  },
  {
    name: "Team Average",
    data: [32, 45, 32, 34, 52, 41]
  }
];

export default function PullRequestSize() {
  var theme = useTheme();

  return (
    <Widget
      title="Pull Request Size"
      upperTitle
      noBodyPadding
      tooltipText={`Pull Request size of the individual comapred to average of the team `}
    >
      <ApexCharts
        options={themeOptions(theme)}
        series={series}
        type="area"
        height={350}
      />
    </Widget>
  );
}

// ############################################################
function themeOptions(theme) {
  return {
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2019-11-03T00:00:00",
        "2019-11-11T00:00:00",
        "2019-11-18T00:00:00",
        "2019-11-25T00:00:00",
        "2019-11-29T00:00:00",
        "2019-12-02T00:00:00"
      ],
      title: {
        text: "Date"
      }
    },
    yaxis: {
      title: {
        text: "Line of Code"
      }
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm"
      }
    },
    fill: {
      colors: [theme.palette.primary.light, theme.palette.success.light]
    },
    colors: [theme.palette.primary.main, theme.palette.success.main],
    chart: {
      toolbar: {
        show: false
      }
    },
    legend: {
      show: true
    }
  };
}
