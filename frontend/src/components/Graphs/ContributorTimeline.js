import React, { useState, useEffect } from "react";
import useTheme from "@material-ui/styles/useTheme";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import ApexCharts from "react-apexcharts";
import moment from "moment";
import _ from "lodash";
import { Typography, Button } from "../Wrappers/Wrappers";
import Widget from "../Widget";
import useStyles from "./styles";
import {
  getPullRequestState,
  PULL_REQUEST_STATE,
  EPOCH,
  TODAY,
  WEEK,
  openInNewTab
} from "../../utils/util";

export default function ContributorTimeline({ data = [], ...props }) {
  const theme = useTheme();
  const classes = useStyles();

  // const datefilterData = filter(data, dateFilter)
  // let filteredData = datefilterData;
  // let secondarySelectList = [FILTER_VALUE.ALL];
  // switch(secondarySelect) {
  //   case FILTER_TYPE.REPOSITORY:
  //     filteredData = filter(datefilterData, FILTER_TYPE.REPOSITORY, secondarySelectFilter)
  //     secondarySelectList.push(...dropdownRepository(datefilterData));
  //     break;
  //   case FILTER_TYPE.TEAM:
  //     filteredData = filter(datefilterData, FILTER_TYPE.TEAM, secondarySelectFilter)
  //     secondarySelectList.push(...dropdownTeam(datefilterData));
  //     break;
  //   case FILTER_TYPE.MEMBER:
  //     filteredData = filter(datefilterData, FILTER_TYPE.MEMBER, secondarySelectFilter)
  //     secondarySelectList.push(...dropdownMember(datefilterData));
  //     break;
  //   default:
  //     return data;
  // }

  // const availableFilterKeys = getAvailableFilterKeys(filteredData)

  const closedAt = date => {
    return new Date(date).getTime() > EPOCH.getTime() ? new Date(date) : TODAY;
  };

  data.sort((a, b) => {
    const aDate = a.data.prCreatedAt;
    const bDate = b.data.prCreatedAt;
    if (aDate[0] > bDate[0]) {
      return 1;
    } else if (bDate[0] > aDate[0]) {
      return -1;
    } else {
      return 0;
    }
  });

  const getColor = pr => {
    const state = getPullRequestState(pr.data.state, pr.data.prMergedAt);
    if (state === PULL_REQUEST_STATE.OPEN) return theme.palette.primary.main;
    if (state === PULL_REQUEST_STATE.MERGED) return theme.palette.info.main;
    if (state === PULL_REQUEST_STATE.CLOSED)
      return theme.palette.secondary.main;
  };

  const mapData = pr => {
    return {
      x: pr.filter.member,
      y: [
        new Date(pr.data.prCreatedAt).getTime(),
        closedAt(pr.data.prClosedAt).getTime()
      ],
      fillColor: getColor(pr)
    };
  };

  const filterStateData = (pr, state) => {
    return getPullRequestState(pr.data.state, pr.data.prMergedAt) === state;
  };

  const filterOpenPullRequests = pr =>
    filterStateData(pr, PULL_REQUEST_STATE.OPEN);
  const filterMergedPullRequests = pr =>
    filterStateData(pr, PULL_REQUEST_STATE.MERGED);
  const filterClosedPullRequests = pr =>
    filterStateData(pr, PULL_REQUEST_STATE.CLOSED);

  const filterDataByMember = (pr, member) => {
    return pr.filter.member === member;
  };

  const openPullRequests = data.filter(filterOpenPullRequests).map(mapData);
  const mergedPullRequests = data.filter(filterMergedPullRequests).map(mapData);
  const closedPullRequests = data.filter(filterClosedPullRequests).map(mapData);

  let series = [
    {
      name: PULL_REQUEST_STATE.OPEN,
      data: openPullRequests
    },
    {
      name: PULL_REQUEST_STATE.MERGED,
      data: mergedPullRequests
    },
    {
      name: PULL_REQUEST_STATE.CLOSED,
      data: closedPullRequests
    }
  ];

  // const series = [
  //   {
  //     name: 'Bob',
  //     data: [
  //       {
  //         x: 'Design',
  //         y: [
  //           new Date('2019-03-05').getTime(),
  //           new Date('2019-03-08').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Code',
  //         y: [
  //           new Date('2019-03-02').getTime(),
  //           new Date('2019-03-04').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Test',
  //         y: [
  //           new Date('2019-03-03').getTime(),
  //           new Date('2019-03-06').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Test',
  //         y: [
  //           new Date('2019-03-08').getTime(),
  //           new Date('2019-03-11').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Validation',
  //         y: [
  //           new Date('2019-03-11').getTime(),
  //           new Date('2019-03-16').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Design',
  //         y: [
  //           new Date('2019-03-01').getTime(),
  //           new Date('2019-03-03').getTime()
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Joe',
  //     data: [
  //       {
  //         x: 'Design',
  //         y: [
  //           new Date('2019-03-02').getTime(),
  //           new Date('2019-03-05').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Test',
  //         y: [
  //           new Date('2019-03-06').getTime(),
  //           new Date('2019-03-09').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Code',
  //         y: [
  //           new Date('2019-03-03').getTime(),
  //           new Date('2019-03-07').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Test',
  //         y: [
  //           new Date('2019-03-10').getTime(),
  //           new Date('2019-03-19').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Deployment',
  //         y: [
  //           new Date('2019-03-20').getTime(),
  //           new Date('2019-03-22').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Design',
  //         y: [
  //           new Date('2019-03-16').getTime(),
  //           new Date('2019-03-21').getTime()
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Dan',
  //     data: [
  //       {
  //         x: 'Code',
  //         y: [
  //           new Date('2019-03-10').getTime(),
  //           new Date('2019-03-17').getTime()
  //         ]
  //       },
  //       {
  //         x: 'Validation',
  //         y: [
  //           new Date('2019-03-03').getTime(),
  //           new Date('2019-03-07').getTime()
  //         ]
  //       }
  //     ]
  //   }
  // ]

  return (
    <>
      <Grid container spacing={4}>
        <Grid item lg={12} xs={12}>
          <Widget
            title="Sprint - Contributor Timeline"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
            tooltipText={`Timeline of contributors`}
          >
            <Grid item spacing={2}>
              <ApexCharts
                options={themeOptions(theme)}
                series={series}
                type="rangeBar"
                height={400}
              />
            </Grid>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

function themeOptions(theme) {
  return {
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%",
        distributed: true
      }
    },
    xaxis: {
      type: "datetime",
      // min: new Date(2019, 1, 1).getTime()
      min: TODAY.getTime() - 2 * WEEK
    },
    yaxis: {
      labels: {
        show: true
      }
    },
    // fill: {
    //   type: 'gradient',
    //   gradient: {
    //     shade: 'light',
    //     type: 'vertical',
    //     shadeIntensity: 0.25,
    //     gradientToColors: undefined,
    //     inverseColors: true,
    //     opacityFrom: 1,
    //     opacityTo: 1,
    //     stops: [50, 0, 100, 100]
    //   }
    // },
    // Colors the legend dots
    // legend: {
    //   markers: {
    //     fillColors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.secondary.main]
    //   }
    // },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        var label = opts.w.globals.labels[opts.dataPointIndex];
        var a = moment(val[0]);
        var b = moment(val[1]);
        var diff = b.diff(a, "days");
        return diff + (diff > 1 ? " days" : " day");
      },
      style: {
        colors: ["#f3f4f5", "#fff"]
      }
    },
    grid: {
      row: {
        colors: ["#f3f4f5", "#fff"],
        opacity: 1
      }
    }
  };
}
