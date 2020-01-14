import React from "react";
import _ from "lodash";
import { useTheme } from "@material-ui/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

// utils
import { TODAY, WEEK } from "../../../utils/util";

// styles
import useStyles from "./styles";

export const FILTER_TYPE = {
  REPOSITORY: "Repository",
  TEAM: "Team",
  MEMBER: "Member",
  DATE: {
    TWO_WEEKS: "2 Weeks",
    ONE_MONTH: "1 Month",
    THREE_MONTHS: "3 Months",
    SIX_MONTHS: "6 Months",
    ALL: "All"
  }
};

export const FILTER_VALUE = {
  ALL: "All"
};

export const filter = (
  data,
  primaryFilter,
  secondarySelect,
  secondaryFilter
) => {
  const datefilterData = filterByType(data, primaryFilter);
  let filteredData = data;
  let secondaryFilterValues = [FILTER_VALUE.ALL];
  switch (secondarySelect) {
    case FILTER_TYPE.REPOSITORY:
      filteredData = filterByType(
        datefilterData,
        FILTER_TYPE.REPOSITORY,
        secondaryFilter
      );
      secondaryFilterValues.push(...dropdownRepository(datefilterData));
      break;
    case FILTER_TYPE.TEAM:
      filteredData = filterByType(
        datefilterData,
        FILTER_TYPE.TEAM,
        secondaryFilter
      );
      secondaryFilterValues.push(...dropdownTeam(datefilterData));
      break;
    case FILTER_TYPE.MEMBER:
      filteredData = filterByType(
        datefilterData,
        FILTER_TYPE.MEMBER,
        secondaryFilter
      );
      secondaryFilterValues.push(...dropdownMember(datefilterData));
      break;
    default:
      break;
  }
  const primaryFilterValues = getAvailableFilterKeysForDate(filteredData);
  return [filteredData, primaryFilterValues, secondaryFilterValues];
};

export const getDropdownValues = (
  data,
  primaryFilter,
  secondarySelect,
  secondaryFilter
) => {
  const datefilterData = filterByType(data, primaryFilter);
  let filteredData = data;
  let secondaryFilterValues = [FILTER_VALUE.ALL];
  switch (secondarySelect) {
    case FILTER_TYPE.REPOSITORY:
      filteredData = filterByType(
        datefilterData,
        FILTER_TYPE.REPOSITORY,
        secondaryFilter
      );
      secondaryFilterValues.push(...dropdownRepository(datefilterData));
      break;
    case FILTER_TYPE.TEAM:
      filteredData = filterByType(
        datefilterData,
        FILTER_TYPE.TEAM,
        secondaryFilter
      );
      secondaryFilterValues.push(...dropdownTeam(datefilterData));
      break;
    case FILTER_TYPE.MEMBER:
      filteredData = filterByType(
        datefilterData,
        FILTER_TYPE.MEMBER,
        secondaryFilter
      );
      secondaryFilterValues.push(...dropdownMember(datefilterData));
      break;
    default:
      break;
  }
  return secondaryFilterValues;
};

// Checks whether which filter scopes have data in it
// and returns the one which have data
export const getAvailableFilterKeysForDate = (data, filterKeys = []) => {
  if (filterKeys) {
    filterKeys = [
      FILTER_TYPE.DATE.TWO_WEEKS,
      FILTER_TYPE.DATE.ONE_MONTH,
      FILTER_TYPE.DATE.THREE_MONTHS,
      FILTER_TYPE.DATE.SIX_MONTHS
    ];
  }

  let i = 0;
  for (const key of filterKeys) {
    const filteredData = filterByType(data, key);
    if (filteredData.length < 1) {
      i++;
      continue;
    }
    return filterKeys.slice(i, filterKeys.length);
  }

  return [];
};

export const filterByType = (data, filterKey, filterValue) => {
  switch (filterKey) {
    case FILTER_TYPE.DATE.TWO_WEEKS:
      return data.filter(pr => {
        return (
          new Date(pr.filter.date).getTime() >
          new Date(TODAY.getTime() - 2 * WEEK)
        );
      });
    case FILTER_TYPE.DATE.ONE_MONTH:
      return data.filter(pr => {
        return (
          new Date(pr.filter.date).getTime() >
          new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, TODAY.getDate())
        );
      });
    case FILTER_TYPE.DATE.THREE_MONTHS:
      return data.filter(pr => {
        return (
          new Date(pr.filter.date).getTime() >
          new Date(TODAY.getFullYear(), TODAY.getMonth() - 3, TODAY.getDate())
        );
      });
    case FILTER_TYPE.DATE.SIX_MONTHS:
      return data.filter(pr => {
        return (
          new Date(pr.filter.date).getTime() >
          new Date(TODAY.getFullYear(), TODAY.getMonth() - 6, TODAY.getDate())
        );
      });
    case FILTER_TYPE.REPOSITORY:
      if (filterValue === FILTER_VALUE.ALL) {
        return data;
      }
      return data.filter(pr => {
        return pr.filter.repository === filterValue;
      });
    case FILTER_TYPE.TEAM:
      if (filterValue === FILTER_VALUE.ALL) {
        return data;
      }
      return data.filter(pr => {
        return pr.filter.team.includes(filterValue);
      });
    case FILTER_TYPE.MEMBER:
      if (filterValue === FILTER_VALUE.ALL) {
        return data;
      }
      return data.filter(pr => {
        return pr.filter.member === filterValue;
      });
    default:
      return data;
  }
};

const countUniques = arr => {
  return arr.reduce((acc, val) => {
    acc[val] = acc[val] === undefined ? 1 : (acc[val] += 1);
    return acc;
  }, {});
};

export const dropdownRepository = data => {
  let uniques = countUniques(
    data.map(pr => {
      return pr.filter.repository;
    })
  );
  // Omit single rows since we can not plot it
  // let omit = _.omitBy(uniques, (value) => { return value === 1 })
  let repositoryList = _.keys(uniques).sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  return repositoryList;
};

export const dropdownTeam = data => {
  let teams = data.map(pr => {
    return pr.filter.team;
  });
  let flattenTeam = _.flattenDeep(teams);
  let uniques = countUniques(flattenTeam);
  // Omit single rows since we can not plot it
  // let omit = _.omitBy(uniques, (value) => { return value === 1 })
  let teamList = _.keys(uniques).sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  return teamList;
};

export const dropdownMember = data => {
  let uniques = countUniques(
    data.map(pr => {
      return pr.filter.member;
    })
  );
  // Omit single rows since we can not plot it
  // let omit = _.omitBy(uniques, (value) => { return value === 1 })
  let memberList = _.keys(uniques).sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  return memberList;
};

export const findChangedKey = filter => {
  let filterType = FILTER_TYPE.REPOSITORY;
  let filterValue = filter.repositoryFilter;
  const defaultSeries = [
    {
      filterType: FILTER_TYPE.REPOSITORY,
      filterValue: FILTER_VALUE.ALL
    }
  ];

  const possibleSeries = [
    {
      filterType: FILTER_TYPE.REPOSITORY,
      filterValue: filter.repositoryFilter
    },
    {
      filterType: FILTER_TYPE.TEAM,
      filterValue: filter.teamFilter
    },
    {
      filterType: FILTER_TYPE.MEMBER,
      filterValue: filter.memberFilter
    }
  ];

  let differenceBy = _.differenceBy(
    possibleSeries,
    defaultSeries,
    "filterValue"
  );
  if (differenceBy.length > 0) {
    filterType = differenceBy[0].filterType;
    filterValue = differenceBy[0].filterValue;
  }

  return [filterType, filterValue];
};

export default function GraphFilter({
  primaryFilterName,
  primaryFilter,
  setPrimaryFilter,
  primaryFilterValues,
  secondaryFilterName,
  secondaryFilter,
  setSecondaryFilter,
  secondaryFilterValues,
  ...props
}) {
  var classes = useStyles();
  var theme = useTheme();

  return (
    <>
      {secondaryFilterValues && (
        <Grid item>
          <Paper className={classes.paper}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">
                {secondaryFilterName}
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                value={secondaryFilter}
                onChange={e => setSecondaryFilter(e.target.value)}
                input={
                  <Input
                    disableUnderline
                    classes={{ input: classes.selectInput }}
                  />
                }
              >
                {secondaryFilterValues
                  ? secondaryFilterValues.map((value, index) => {
                      return <MenuItem value={value}>{value}</MenuItem>;
                    })
                  : null}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      )}
      {primaryFilter && (
        <Grid item>
          <Paper className={classes.paper}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">
                {primaryFilterName}
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                value={primaryFilter}
                onChange={e => setPrimaryFilter(e.target.value)}
                input={
                  <Input
                    disableUnderline
                    classes={{ input: classes.selectInput }}
                  />
                }
              >
                {primaryFilterValues
                  ? primaryFilterValues.map((value, index) => {
                      return <MenuItem value={value}>{value}</MenuItem>;
                    })
                  : null}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      )}
    </>
  );
}
