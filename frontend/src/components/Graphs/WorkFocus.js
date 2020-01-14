import React from "react";
import ApexCharts from "react-apexcharts";
import useTheme from "@material-ui/styles/useTheme";
import Widget from "../Widget";

const series = [
  {
    name: "data",
    data: [31, 52, 6, 11]
  }
];

export default function WorkFocus() {
  var theme = useTheme();

  return (
    <Widget
      title="Work Focus"
      upperTitle
      noBodyPadding
      tooltipText={`New Work: New lines of code written\n
        Legacy Refactor: Lines of code change older than 3 weeks\n
        Churn: Lines of code change younger than 3 weeks\n
        Help Others: Lines of code written by the individual but, pushed by other members\n`}
    >
      <ApexCharts
        options={themeOptions(theme)}
        series={series}
        type="bar"
        height={350}
      />
    </Widget>
  );
}

// ############################################################
function themeOptions(theme) {
  return {
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        data: [23, 12, 34, 70]
      }
    ],
    xaxis: {
      categories: ["New Work", "Legacy Refactor", "Help Others", "Churn"],
      title: {
        text: "Work Focus"
      },
      labels: {
        formatter: function(value) {
          return value + "%";
        }
      }
    }
  };
}
