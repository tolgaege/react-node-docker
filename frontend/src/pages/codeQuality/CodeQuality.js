import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import useTheme from "@material-ui/styles/useTheme";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis
} from "recharts";

// styles
import useStyles from "./styles";

// components
import mock from "./mock";
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import MockTable from "../../components/Graphs/MockTable";
import RateBox from "../../components/Graphs/RateBox";
import DefectDensity from "../../components/Graphs/DefectDensity";
import MockNotification from "../../components/MockNotification";

function minMax(min, max) {
  return Math.random() * (max - min + 1) + min;
}

export default function CodeQuality(props) {
  var classes = useStyles();
  var theme = useTheme();

  var mergeRate = minMax(80, 90).toFixed(0);
  var closeRate = minMax(5, 15).toFixed(0);

  // local
  var [mainChartState, setMainChartState] = useState("monthly");

  return (
    <>
      <PageTitle title="Code Quality" button="Latest Reports" />
      <Grid container spacing={4}>
        <Grid item xs={3} md={3} />
        <Grid item xs={3} md={3} />
        <Grid item xs={3} md={3} />
        {/* Put empty grid to make Mocknotification place correctly */}
        <Grid item xs={3} md={3}>
          <MockNotification
            className={classes.notificationItem}
            shadowless
            type="defence"
            message="Defect Density higher than 10 per KLoC might indicator higher refactor time"
            variant="contained"
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item lg={3} xs={12}>
          <RateBox
            title="Review Rate"
            tooltipText={`Reviewed Merged PRs / All Merged PRs`}
          />
        </Grid>

        <Grid item lg={3} xs={12}>
          <RateBox
            title="Merge Rate"
            tooltipText={`Merged PRs / All PRs`}
            rate={mergeRate}
          />
        </Grid>

        <Grid item lg={3} xs={12}>
          <RateBox
            title="Close Rate"
            tooltipText={`Closed PRs / All PRs`}
            rate={closeRate}
          />
        </Grid>

        <Grid item lg={3} xs={12}>
          <DefectDensity />
        </Grid>

        <Grid item xs={12}>
          <Widget
            title="Long Pull Requests"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableWidget}
            tooltipText={`List of Open Pull Requests for more than 3 weeks`}
          >
            <MockTable data={mock.longPullRequests} />
          </Widget>
        </Grid>

        <Grid item xs={12}>
          <Widget
            title="Self Merged Pull Requests"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableWidget}
            tooltipText={`List of Pull Requests merged by the Pull Request creator`}
          >
            <MockTable data={mock.selfMergedPullRequests} />
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}
