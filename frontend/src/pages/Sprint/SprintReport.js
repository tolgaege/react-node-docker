import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";

// components
import PageTitle from "../../components/PageTitle";
import Burndown from "../../components/Graphs/Burndown";
import ContributorTimeline from "../../components/Graphs/ContributorTimeline";
import PullRequestTable from "../../components/Graphs/PullRequestTable";
import Loading from "../../components/Loading";
import Widget from "../../components/Widget";
import Notification, {
  NOTIFICATION_TYPE
} from "../../components/Notification/Notification";
import GraphFilter, {
  filter,
  getDropdownValues,
  findChangedKey,
  FILTER_TYPE,
  FILTER_VALUE
} from "../../components/Graphs/GraphFilter/GraphFilter";

// context
import { useAnalyticsApi } from "../../context/FetcherContext";

export default function SprintReport() {
  const [{ data, isLoading, isError }, doFetch] = useAnalyticsApi(
    "sprint_report",
    []
  );

  const [tData, tDoFetch] = useAnalyticsApi("throughput", []);

  const [primaryFilter, setPrimaryFilter] = useState(
    FILTER_TYPE.DATE.TWO_WEEKS
  );
  const [repositoryFilter, setRepositoryFilter] = useState(FILTER_VALUE.ALL);
  const [teamFilter, setTeamFilter] = useState(FILTER_VALUE.ALL);
  const [memberFilter, setMemberFilter] = useState(FILTER_VALUE.ALL);

  // Make sure when changing one filter, other filters reset
  useEffect(() => {
    if (repositoryFilter !== FILTER_VALUE.ALL) {
      setTeamFilter(FILTER_VALUE.ALL);
      setMemberFilter(FILTER_VALUE.ALL);
    }
  }, [repositoryFilter]);

  useEffect(() => {
    if (teamFilter !== FILTER_VALUE.ALL) {
      setRepositoryFilter(FILTER_VALUE.ALL);
      setMemberFilter(FILTER_VALUE.ALL);
    }
  }, [teamFilter]);

  useEffect(() => {
    if (memberFilter !== FILTER_VALUE.ALL) {
      setTeamFilter(FILTER_VALUE.ALL);
      setRepositoryFilter(FILTER_VALUE.ALL);
    }
  }, [memberFilter]);

  const repositoryDropdownValues = getDropdownValues(
    data,
    primaryFilter,
    FILTER_TYPE.REPOSITORY,
    repositoryFilter
  );
  const teamDropdownValues = getDropdownValues(
    data,
    primaryFilter,
    FILTER_TYPE.TEAM,
    teamFilter
  );
  const memberDropdownValues = getDropdownValues(
    data,
    primaryFilter,
    FILTER_TYPE.MEMBER,
    memberFilter
  );

  const [filterType, filterValue] = findChangedKey({
    repositoryFilter: repositoryFilter,
    teamFilter: teamFilter,
    memberFilter: memberFilter
  });

  let filteredData, tFilteredData, primaryFilterValues, filterValues;
  switch (filterType) {
    case FILTER_TYPE.REPOSITORY:
      [filteredData, ,] = filter(
        data,
        primaryFilter,
        filterType,
        repositoryFilter
      );
      [tFilteredData, ,] = filter(
        tData.data,
        FILTER_TYPE.DATE.SIX_MONTHS,
        filterType,
        repositoryFilter
      );
      break;
    case FILTER_TYPE.TEAM:
      [filteredData, ,] = filter(data, primaryFilter, filterType, teamFilter);
      [tFilteredData, ,] = filter(
        tData.data,
        FILTER_TYPE.DATE.SIX_MONTHS,
        filterType,
        teamFilter
      );
      break;
    case FILTER_TYPE.MEMBER:
      [filteredData, ,] = filter(data, primaryFilter, filterType, memberFilter);
      [tFilteredData, ,] = filter(
        tData.data,
        FILTER_TYPE.DATE.SIX_MONTHS,
        filterType,
        memberFilter
      );
      break;
    default:
      // Default is repository
      [filteredData, ,] = filter(
        data,
        primaryFilter,
        filterType,
        repositoryFilter
      );
      [tFilteredData, ,] = filter(
        tData.data,
        FILTER_TYPE.DATE.SIX_MONTHS,
        filterType,
        repositoryFilter
      );
      break;
  }

  const filteredAllDates = filter(
    data,
    FILTER_TYPE.DATE.ALL,
    filterType,
    filterValue
  );

  if (isError) {
    return (
      <>
        <PageTitle title="Sprint Report" subtitle="Past 2 Weeks" />
        <Notification
          type={NOTIFICATION_TYPE.ERROR}
          message={"Something went wrong! Please contact help@usehaystack.io"}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <PageTitle title="Sprint Report" subtitle="Past 2 Weeks" />
        <Loading />
      </>
    );
  }

  return (
    <>
      <PageTitle title="Sprint Report" subtitle="Past 2 Weeks" />
      <Grid container spacing={4}>
        <GraphFilter
          primaryFilterName={null}
          primaryFilter={null}
          setPrimaryFilter={null}
          primaryFilterValues={null}
          secondaryFilterName={FILTER_TYPE.REPOSITORY}
          secondaryFilter={repositoryFilter}
          setSecondaryFilter={setRepositoryFilter}
          secondaryFilterValues={repositoryDropdownValues}
        />
        <GraphFilter
          primaryFilterName={null}
          primaryFilter={null}
          setPrimaryFilter={null}
          primaryFilterValues={null}
          secondaryFilterName={FILTER_TYPE.TEAM}
          secondaryFilter={teamFilter}
          setSecondaryFilter={setTeamFilter}
          secondaryFilterValues={teamDropdownValues}
        />
        <GraphFilter
          primaryFilterName={null}
          primaryFilter={null}
          setPrimaryFilter={null}
          primaryFilterValues={null}
          secondaryFilterName={FILTER_TYPE.MEMBER}
          secondaryFilter={memberFilter}
          setSecondaryFilter={setMemberFilter}
          secondaryFilterValues={memberDropdownValues}
        />

        <Grid item lg={12} xs={12}>
          <Burndown data={filteredAllDates[0]} boundData={tFilteredData} />
        </Grid>

        <Grid item lg={12} xs={12}>
          <ContributorTimeline data={filteredData} />
        </Grid>

        <Grid item xs={12}>
          <PullRequestTable
            openData={filteredData}
            longData={filteredAllDates[0]}
            closeData={filteredAllDates[0]}
          />
        </Grid>
      </Grid>
    </>
  );
}
