// import React, { useState, useEffect } from "react";
// import Grid from "@material-ui/core/Grid";
// import LinearProgress from "@material-ui/core/LinearProgress";
// import Select from "@material-ui/core/Select";
// import OutlinedInput from "@material-ui/core/OutlinedInput";
// import MenuItem from "@material-ui/core/MenuItem";
// import Tab from "@material-ui/core/Tab";
// import Tabs from "@material-ui/core/Tabs";
// import useTheme from "@material-ui/styles/useTheme";

// // styles
// import useStyles from "./styles";

// // components
// import Widget from "../../components/Widget";
// import PageTitle from "../../components/PageTitle";
// import { Typography } from "../../components/Wrappers";
// import Throughput from "../../components/Graphs/Throughput";
// import WorkActivity from "../../components/Graphs/WorkActivity";
// import ActivityHeatmap from "../../components/Graphs/ActivityHeatmap";
// import Contribution from "../../components/Graphs/Contribution";
// import Table from "../../components/Graphs/Table";
// import WorkFocus from "../../components/Graphs/WorkFocus";
// import CycleTime from "../../components/Graphs/CycleTime";
// import Burndown from "../../components/Graphs/Burndown";
// import ContributorTimeline from "../../components/Graphs/ContributorTimeline";
// import { getPullRequestState, PULL_REQUEST_STATE, TODAY, WEEK } from "../../utils/util";
// import { filter, FILTER_TYPE, FILTER_VALUE } from "./GraphFilter/GraphFilter";

// import { useAnalyticsApi } from "../../context/FetcherContext";

// export default function Redash(props) {
//   var classes = useStyles();
//   var theme = useTheme();
//   var [activeTabId, setActiveTabId] = useState(0);

//   const [{ data, isLoading, isError }, doFetch] = useAnalyticsApi(
//     "sprint_report",
//     [],
//   );

//   const [primarySelectFilter, setPrimarySelectFilter] = useState(FILTER_TYPE.DATE.TWO_WEEKS);
//   const [secondarySelectFilter, setSecondarySelectFilter] = useState(FILTER_VALUE.ALL);

//   const datefilterData = filter(data, primarySelectFilter)
//   let filteredData = data;
//   let secondarySelectList = [FILTER_VALUE.ALL];
//   let key = FILTER_TYPE.MEMBER;
//   switch(key) {
//     case FILTER_TYPE.REPOSITORY:
//       filteredData = filter(datefilterData, FILTER_TYPE.REPOSITORY, secondarySelectFilter)
//       secondarySelectList.push(...dropdownRepository(datefilterData));
//       break;
//     case FILTER_TYPE.TEAM:
//       filteredData = filter(datefilterData, FILTER_TYPE.TEAM, secondarySelectFilter)
//       secondarySelectList.push(...dropdownTeam(datefilterData));
//       break;
//     case FILTER_TYPE.MEMBER:
//       filteredData = filter(datefilterData, FILTER_TYPE.MEMBER, secondarySelectFilter)
//       secondarySelectList.push(...dropdownMember(datefilterData));
//       break;
//     default:
//       return data;
//   }

//   const primarySelectList = getAvailableFilterKeys(filteredData)

//   const columns = ['Title', 'Created At', 'Repository', 'Link', 'Status']

//   filteredData = filteredData.map((pr) => {
//     return [
//       pr.data.title,
//       pr.data.prCreatedAt,
//       pr.filter.repository,
//       pr.data.url.replace('api', 'www'),
//       getPullRequestState(pr.data.state, pr.data.prMergedAt),
//     ]
//   })

//   const openPulLRequestSeries = filteredData.filter((pr) => {
//     return pr[4] === PULL_REQUEST_STATE.OPEN
//   });
//   const longPullRequestSeries = filteredData.filter((pr) => {
//     return pr[4] === PULL_REQUEST_STATE.OPEN && (new Date(pr[1]).getTime() < new Date(TODAY.getTime() - 3 * WEEK))
//   });

//   return (
//     <>
//       <>
//         <PageTitle title="Redash" button="Latest Reports" />
//         <Grid container spacing={4}>
//           <Grid item lg={12} xs={12}>
//             <CycleTime secondarySelect={FILTER_TYPE.MEMBER}/>
//           </Grid>

//           <Grid item lg={12} xs={12}>
//             <Throughput secondarySelect={FILTER_TYPE.MEMBER}/>
//           </Grid>

//           <Grid item lg={12} xs={12}>
//             <ActivityHeatmap secondarySelect={FILTER_TYPE.MEMBER}/>
//           </Grid>

//           <Grid item lg={12} xs={12}>
//             <Burndown secondarySelect={FILTER_TYPE.TEAM}/>
//           </Grid>

//           <Grid item lg={12} xs={12}>
//             <ContributorTimeline secondarySelect={FILTER_TYPE.TEAM}/>
//           </Grid>

//           <Grid item xs={12}>
//             <Tabs
//               indicatorColor="primary"
//               textColor="primary"
//               value={activeTabId}
//               onChange={(e, id) => setActiveTabId(id)}
//               className={classes.iconsBar}
//             >
//               <Tab label="Open Pull Requests" classes={{ root: classes.tab }} />
//               <Tab label="Long Pull Requests" classes={{ root: classes.tab }} />
//             </Tabs>
//               {activeTabId === 0 && (
//                 <Table
//                   title="Open Pull Requests"
//                   series={openPulLRequestSeries}
//                   columns={columns}
//                   tooltip={`List of Open Pull Requests`}
//                   selectFilter={{
//                     primarySelectFilter: primarySelectFilter,
//                     setPrimarySelectFilter: setPrimarySelectFilter,
//                     primarySelectList: primarySelectList,
//                     secondarySelectFilter: secondarySelectFilter,
//                     setSecondarySelectFilter: setSecondarySelectFilter,
//                     secondarySelectList: secondarySelectList,
//                   }}
//                 />
//               )}

//               {activeTabId === 1 && (
//                 <Table
//                   title="Long Pull Requests"
//                   series={longPullRequestSeries}
//                   columns={columns}
//                   tooltip={`List of Open Pull Requests for more than 3 weeks`}
//                   selectFilter={{
//                     primarySelectFilter: primarySelectFilter,
//                     setPrimarySelectFilter: setPrimarySelectFilter,
//                     primarySelectList: primarySelectList,
//                     secondarySelectFilter: secondarySelectFilter,
//                     setSecondarySelectFilter: setSecondarySelectFilter,
//                     secondarySelectList: secondarySelectList,
//                   }}
//                 />
//               )}

//           </Grid>
//         </Grid>
//       </>

//     </>
//   );
// }
