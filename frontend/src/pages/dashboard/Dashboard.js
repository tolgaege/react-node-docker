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
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import { Typography } from "../../components/Wrappers";
import MockThroughput from "../../components/Graphs/MockThroughput";
import WorkActivity from "../../components/Graphs/WorkActivity";
import MockActivityHeatmap from "../../components/Graphs/MockActivityHeatmap";
import Contribution from "../../components/Graphs/Contribution";
import MockTable from "../../components/Graphs/MockTable";
import WorkFocus from "../../components/Graphs/WorkFocus";

const pullRequestList = [
  {
    id: 0,
    // number: 92,
    title: "fix hot reloading",
    opened_at: "10 December 2019",
    repository: "km-transporter",
    link: "https://github.com/repos/kmtv/km-transporter/pulls/95",
    status: "open"
  },
  {
    id: 1,
    // number: 42,
    title: "fix: Add extra check for id",
    opened_at: "9 December 2019",
    repository: "km-cosmos",
    link: "https://github.com/repos/kmtv/km-cosmos/pulls/42",
    status: "merged"
  },
  {
    id: 2,
    // number: 721,
    title: "raise limit on VI requests to 20k",
    opened_at: "6 December 2019",
    repository: "km-api",
    link: "https://github.com/repos/kmtv/km-api/pulls/721",
    status: "merged"
  },
  {
    id: 3,
    // number: 92,
    title: "Feature/api clients is active",
    opened_at: "28 November 2019",
    repository: "km-transporter",
    link: "https://github.com/repos/kmtv/km-transporter/pulls/92",
    status: "merged"
  }
];

export default function Dashboard(props) {
  var classes = useStyles();
  var theme = useTheme();

  // local
  var [mainChartState, setMainChartState] = useState("monthly");

  return (
    <>
      <>
        <PageTitle title="Dashboard" button="Latest Reports" />
        <Grid container spacing={4}>
          <Grid item lg={6} xs={12}>
            <MockThroughput />
          </Grid>
          <Grid item lg={6} xs={12}>
            <WorkActivity />
          </Grid>

          <Grid item lg={12} xs={12}>
            <MockActivityHeatmap />
          </Grid>
        </Grid>
      </>

      <>
        <PageTitle title="Work Focus" />

        <Grid container spacing={4}>
          <Grid item lg={6} xs={12}>
            <MockThroughput />
          </Grid>
          <Grid item lg={6} xs={12}>
            <Contribution />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={2} md={6}>
            <WorkFocus />
          </Grid>

          <Grid item xs={2} md={6}>
            <Widget
              title="Recent Activity"
              upperTitle
              noBodyPadding
              bodyClass={classes.tableWidget}
              tooltipText={`Recent Pull Request open, merged, closed by the member`}
            >
              <MockTable data={pullRequestList} />
            </Widget>
          </Grid>
        </Grid>
      </>
    </>
  );
}
