import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/styles/useTheme";
import useStyles from "./styles";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// components
import Widget from "../../components/Widget/Widget";
import PullRequestSize from "../../components/Graphs/PullRequestSize";
import OverHelping from "../../components/Graphs/OverHelping";
import MockActivityHeatmap from "../../components/Graphs/MockActivityHeatmap";
import WorkFocus from "../../components/Graphs/WorkFocus";
import KnowledgeGraph from "../../components/Graphs/KnowledgeGraph";
import MockThroughput from "../../components/Graphs/MockThroughput";
import Contribution from "../../components/Graphs/Contribution";
import WorkActivity from "../../components/Graphs/WorkActivity";
import MockTable from "../../components/Graphs/MockTable";
import PageTitle from "../../components/PageTitle/PageTitle";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import MockNotification from "../../components/MockNotification";

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

export default function Member(props) {
  var theme = useTheme();
  var classes = useStyles();

  // local
  var [activeIndex, setActiveIndexId] = useState(0);

  const name = "Jason Calderone";

  return (
    <>
      <>
        <PageTitle title={`${name}'s Analytics`} button="Latest Reports" />
        <Grid container spacing={4}>
          <Grid item xs={2} md={6}>
            <MockNotification
              className={classes.notificationItem}
              shadowless
              type="defence"
              message={`${name} might be Hoarding Code`}
              variant="contained"
              color="warning"
            />
          </Grid>

          <Grid item xs={2} md={6}>
            <MockNotification
              className={classes.notificationItem}
              shadowless
              type="defence"
              message={`${name} might be Overhelping`}
              variant="contained"
              color="warning"
            />
          </Grid>

          {/* Hoarding Code */}
          <Grid item xs={12} md={6}>
            <PullRequestSize />
          </Grid>
          {/* Over Helping */}
          <Grid item xs={12} md={6}>
            <OverHelping />
          </Grid>
        </Grid>
      </>

      <>
        <PageTitle title="When are people most productive?" />
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
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

        <Grid item xs={12} md={6}>
          <MockNotification
            className={classes.notificationItem}
            shadowless
            type="defence"
            message={`${name} might be a Clean As You Go engineer`}
            variant="contained"
            color="success"
          />
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
