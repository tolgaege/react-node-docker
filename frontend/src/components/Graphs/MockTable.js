import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@material-ui/core";

// components
import { Button } from "../Wrappers";

const states = {
  open: "success",
  closed: "warning",
  merged: "info"
};

export default function TableComponent({ data }) {
  var keys = Object.keys(data[0]).map(i => i.toUpperCase());
  keys.shift(); // delete "id" key

  return (
    <Table className="mb-0">
      <TableHead>
        <TableRow>
          {keys.map(key => (
            <TableCell key={key}>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ id, title, opened_at, repository, link, status }) => (
          <TableRow key={id}>
            <TableCell>{title}</TableCell>
            <TableCell>{opened_at}</TableCell>
            <TableCell>{repository}</TableCell>
            <TableCell>{link}</TableCell>
            <TableCell>
              <Button
                color={states[status.toLowerCase()]}
                size="small"
                className="px-2"
                variant="contained"
              >
                {status}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
