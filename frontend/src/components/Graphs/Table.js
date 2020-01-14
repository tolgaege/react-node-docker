import React from "react";
import MUIDataTable from "mui-datatables";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";

// styles
import useStyles from "./styles";

import Widget from "../Widget";

export default function Table({
  series,
  columns,
  tooltip,
  selectFilter,
  title,
  customRowRender
}) {
  const classes = useStyles();

  return (
    <Widget
      title={title}
      upperTitle
      noBodyPadding
      bodyClass={classes.tableWidget}
      tooltipText={tooltip}
    >
      <MUIDataTable
        data={series}
        columns={columns}
        options={{
          rowsPerPage: 10,
          selectableRows: "none",
          filter: false,
          sort: true,
          search: false,
          print: false,
          download: false,
          viewColumns: false,
          customRowRender: customRowRender
        }}
      />
    </Widget>
  );
}
