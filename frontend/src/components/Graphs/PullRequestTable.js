import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import useTheme from "@material-ui/styles/useTheme";

// styles
import useStyles from "./styles";

// components
import Table from "./Table";
import PullRequestTableRow from "./PullRequestTableRow";

import {
  getPullRequestState,
  PULL_REQUEST_STATE,
  TODAY,
  WEEK
} from "../../utils/util";

export default function PullRequestTable({
  openData = [],
  longData = [],
  closeData = [],
  ...props
}) {
  const theme = useTheme();
  const classes = useStyles();

  const [activeTabId, setActiveTabId] = useState(0);

  // Get Open Pull Requests
  const filterdParsedTable = parseTableData(openData);
  const openPullRequestSeries = filterdParsedTable.data.filter(pr => {
    return pr[5] === PULL_REQUEST_STATE.OPEN;
  });

  // Get Close Pull Requests
  const closefilterdParsedTable = parseTableData(closeData);
  const closePullRequestSeries = closefilterdParsedTable.data.filter(pr => {
    return pr[5] === PULL_REQUEST_STATE.CLOSED;
  });

  // Get Long Open Pull Requests
  const allParsedData = parseTableData(longData);
  const longPullRequestSeries = allParsedData.data.filter(pr => {
    return (
      pr[4] === PULL_REQUEST_STATE.OPEN &&
      new Date(pr[1]).getTime() < new Date(TODAY.getTime() - 3 * WEEK)
    );
  });

  const customRowRender = data => {
    const [title, createdAt, author, repository, link, status] = data;

    return (
      <PullRequestTableRow
        key={createdAt}
        title={title}
        createdAt={createdAt}
        author={author}
        repository={repository}
        link={link}
        status={status}
      />
    );
  };

  return (
    <>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={activeTabId}
        onChange={(e, id) => setActiveTabId(id)}
        className={classes.iconsBar}
      >
        <Tab label="Open Pull Requests" classes={{ root: classes.tab }} />
        <Tab label="Long Pull Requests" classes={{ root: classes.tab }} />
        <Tab label="Close Pull Requests" classes={{ root: classes.tab }} />
      </Tabs>
      {activeTabId === 0 && (
        <Table
          title="Open Pull Requests"
          series={openPullRequestSeries}
          columns={filterdParsedTable.columns}
          tooltip={`List of Open Pull Requests`}
          customRowRender={customRowRender}
        />
      )}

      {activeTabId === 1 && (
        <Table
          title="Long Pull Requests"
          series={longPullRequestSeries}
          columns={allParsedData.columns}
          tooltip={`List of Open Pull Requests for more than 3 weeks`}
          customRowRender={customRowRender}
        />
      )}

      {activeTabId === 2 && (
        <Table
          title="Close Pull Requests"
          series={closePullRequestSeries}
          columns={closefilterdParsedTable.columns}
          tooltip={`List of Close Pull Requests`}
          customRowRender={customRowRender}
        />
      )}
    </>
  );
}

const parseTableData = data => {
  const columns = [
    "Title",
    "Created At",
    "Author",
    "Repository",
    "Link",
    "Status"
  ];

  data = data.map(pr => {
    return [
      pr.data.title,
      pr.data.prCreatedAt,
      pr.filter.member,
      pr.filter.repository,
      pr.data.url.replace("api", "www"),
      getPullRequestState(pr.data.state, pr.data.prMergedAt)
    ];
  });

  return {
    columns: columns,
    data: data
  };
};
