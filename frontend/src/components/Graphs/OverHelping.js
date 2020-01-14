import React from "react";
import ApexCharts from "react-apexcharts";
import useTheme from "@material-ui/styles/useTheme";
import Widget from "../Widget";

const series = [
  {
    name: "Review Comments",
    data: [6, 4, 15, 5, 3, 1]
  }
];

const members = [
  "Esperanza Susanne",
  "Christian Birgitte",
  "Meral Elias",
  "Sebastiana Hani",
  "Marciano Oihana",
  "Gaston Festus"
];

export default function OverHelping() {
  var theme = useTheme();

  return (
    <Widget
      title="Review Comments"
      upperTitle
      noBodyPadding
      tooltipText={`Amount of reviews of the individual to other member`}
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
      categories: members,
      title: {
        text: "Review Comments"
      }
    }
  };

  // {
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   stroke: {
  //     curve: "smooth",
  //   },
  //   xaxis: {
  //     type: "datetime",
  //     categories: [
  //       "2018-09-19T00:00:00",
  //       "2018-09-20T00:00:00",
  //       "2018-09-21T00:00:00",
  //       "2018-09-22T00:00:00",
  //       "2018-09-23T00:00:00",
  //       "2018-09-24T00:00:00",
  //       "2018-09-25T00:00:00",
  //     ],
  //     title: {
  //       text: 'Date'
  //     }
  //   },
  //   yaxis: {
  //     title: {
  //       text: 'Line of Code'
  //     },
  //   },
  //   tooltip: {
  //     x: {
  //       format: "dd/MM/yy HH:mm",
  //     },
  //   },
  //   fill: {
  //     colors: [theme.palette.primary.light, theme.palette.success.light],
  //   },
  //   colors: [theme.palette.primary.main, theme.palette.success.main],
  //   chart: {
  //     toolbar: {
  //       show: false,
  //     },
  //   },
  //   legend: {
  //     show: true,
  //   },
  // };
}
