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
import { timezones } from "../../utils/timezone";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function initData() {
  const enable12h = true;
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

    let name = i;
    if (enable12h) {
      name = i + " am";
      if (i === 0) {
        name = "12 am";
      }
      if (i > 11) {
        name = (i % 12) + " pm";
      }
      if (i === 12) {
        name = "12 pm";
      }
    }

    mapData.push({
      name: name,
      data: dayData
    });
  }
  return mapData;
}

export default function ActivityHeatmap({ data = [], ...props }) {
  const theme = useTheme();
  const classes = useStyles();

  const [timezoneFilter, setTimezoneFilter] = useState("America/Los_Angeles");

  let series = initData();
  if (data.length > 0) {
    for (const pullRequest of data) {
      for (const commit of pullRequest.commits) {
        const date = new Date(commit);
        const aestTime = date.toLocaleString("en-US", {
          timeZone: timezoneFilter
        });
        const timezoneDate = new Date(aestTime);
        const hour = timezoneDate.getHours();

        // Javascript getDay() returns 0 -> Sunday, 1 -> Monday and so on..
        // We shift it to make 0 -> Monday, 2 -> Tuesday and so on..
        const day = (timezoneDate.getDay() || 7) - 1;

        series[hour].data[day].y += 1;
      }
    }
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item lg={12} xs={12}>
          <Widget
            title="Activity Heatmap"
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
            tooltipText={`Activity the person does in a day. An activity means;\n
              Activitiy = Commits + Pull Request Comments + Opened Pull Request + Opened Issues + Issue Comments`}
            filterMenu={
              <>
                <Select
                  value={timezoneFilter}
                  onChange={e => setTimezoneFilter(e.target.value)}
                  input={
                    <Input
                      disableUnderline
                      classes={{ input: classes.selectInput }}
                    />
                  }
                >
                  {timezones
                    ? timezones.map((value, index) => {
                        return <MenuItem value={value}>{value}</MenuItem>;
                      })
                    : null}
                </Select>
              </>
            }
          >
            <ApexCharts
              options={themeOptions(theme)}
              series={series}
              type="heatmap"
              height={350}
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
