import React from "react";
import Typography from "@material-ui/core/Typography";
import { TableCell, Link } from "@material-ui/core";
import PropTypes from "prop-types";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import useTheme from "@material-ui/styles/useTheme";

import PULL_REQUEST_STATE from "../../utils/util";

// const ColorButton = withStyles(theme => ({
//   root: {
//     color: theme.palette.success.main,
//   },
// }))(Button);

export default function PullRequestTableRow({
  key,
  title,
  createdAt,
  author,
  repository,
  link,
  status
}) {
  var theme = useTheme();

  const color = {
    open: theme.palette.success.main,
    closed: theme.palette.info.main,
    merged: theme.palette.secondary.main
  };

  return (
    <TableRow>
      <TableCell align="left"> {title} </TableCell>
      <TableCell align="left"> {createdAt.split("T")[0]} </TableCell>
      <TableCell align="left"> {author} </TableCell>
      <TableCell align="left"> {repository} </TableCell>
      <TableCell align="left">
        {" "}
        <a href={link} target="_blank" rel="noopener noreferrer">
          {" "}
          {link}{" "}
        </a>{" "}
      </TableCell>
      <TableCell align="left">
        <Button
          color={"primary"}
          size="small"
          className="px-2"
          variant="contained"
        >
          {status}
        </Button>
      </TableCell>
    </TableRow>
  );
}
