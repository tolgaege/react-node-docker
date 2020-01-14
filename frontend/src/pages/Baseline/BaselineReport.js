import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";

// components
import PageTitle from "../../components/PageTitle";
import CycleTime from "../../components/Graphs/CycleTime";
import Throughput from "../../components/Graphs/Throughput";
import ActivityHeatmap from "../../components/Graphs/ActivityHeatmap";
import Loading from "../../components/Loading";
import GraphFilter, {
  filter,
  getDropdownValues,
  findChangedKey,
  FILTER_TYPE,
  FILTER_VALUE
} from "../../components/Graphs/GraphFilter/GraphFilter";
import Notification, {
  NOTIFICATION_TYPE
} from "../../components/Notification/Notification";

// context
import { useAnalyticsApi } from "../../context/FetcherContext";

export default function BaselineReport({ secondarySelect, ...props }) {
  const [cData, cDoFetch] = useAnalyticsApi("cycle_time", []);

  const [tData, tDoFetch] = useAnalyticsApi("throughput", []);

  const [aData, aDoFetch] = useAnalyticsApi("activity_heatmap", []);

  const [primaryFilter, setPrimaryFilter] = useState(
    FILTER_TYPE.DATE.SIX_MONTHS
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
    cData.data,
    primaryFilter,
    FILTER_TYPE.REPOSITORY,
    repositoryFilter
  );
  const teamDropdownValues = getDropdownValues(
    cData.data,
    primaryFilter,
    FILTER_TYPE.TEAM,
    teamFilter
  );
  const memberDropdownValues = getDropdownValues(
    cData.data,
    primaryFilter,
    FILTER_TYPE.MEMBER,
    memberFilter
  );

  const [filterType, filterValue] = findChangedKey({
    repositoryFilter: repositoryFilter,
    teamFilter: teamFilter,
    memberFilter: memberFilter
  });

  let cFilteredData, tFilteredData, aFilteredData;
  switch (filterType) {
    case FILTER_TYPE.REPOSITORY:
      [cFilteredData, ,] = filter(
        cData.data,
        primaryFilter,
        filterType,
        repositoryFilter
      );
      [tFilteredData, ,] = filter(
        tData.data,
        primaryFilter,
        filterType,
        repositoryFilter
      );
      [aFilteredData, ,] = filter(
        aData.data,
        primaryFilter,
        filterType,
        repositoryFilter
      );
      break;
    case FILTER_TYPE.TEAM:
      [cFilteredData, ,] = filter(
        cData.data,
        primaryFilter,
        filterType,
        teamFilter
      );
      [tFilteredData, ,] = filter(
        tData.data,
        primaryFilter,
        filterType,
        teamFilter
      );
      [aFilteredData, ,] = filter(
        aData.data,
        primaryFilter,
        filterType,
        teamFilter
      );
      break;
    case FILTER_TYPE.MEMBER:
      [cFilteredData, ,] = filter(
        cData.data,
        primaryFilter,
        filterType,
        memberFilter
      );
      [tFilteredData, ,] = filter(
        tData.data,
        primaryFilter,
        filterType,
        memberFilter
      );
      [aFilteredData, ,] = filter(
        aData.data,
        primaryFilter,
        filterType,
        memberFilter
      );
      break;
    default:
      // Default is repository
      [cFilteredData, ,] = filter(
        cData.data,
        primaryFilter,
        filterType,
        repositoryFilter
      );
      [tFilteredData, ,] = filter(
        tData.data,
        primaryFilter,
        filterType,
        repositoryFilter
      );
      [aFilteredData, ,] = filter(
        aData.data,
        primaryFilter,
        filterType,
        repositoryFilter
      );
      break;
  }

  const isError = cData.isError || tData.isError || aData.isError;
  const isLoading = cData.isLoading || tData.isLoading || aData.isLoading;

  if (isError) {
    return (
      <div>
        <PageTitle title="Baseline Report" subtitle="Past 6 Months" />
        <Notification
          type={NOTIFICATION_TYPE.ERROR}
          message={"Something went wrong! Please contact help@usehaystack.io"}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <PageTitle title="Baseline Report" subtitle="Past 6 Months" />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="Baseline Report" subtitle="Past 6 Months" />
      {cData.isLoading || tData.isLoading || aData.isLoading ? (
        <Loading />
      ) : (
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
            <CycleTime data={cFilteredData} />
          </Grid>

          <Grid item lg={12} xs={12}>
            <Throughput data={tFilteredData} />
          </Grid>

          <Grid item lg={12} xs={12}>
            <ActivityHeatmap
              secondarySelect={filterType}
              data={aFilteredData}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
}
